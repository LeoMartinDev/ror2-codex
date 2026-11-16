/**
 * Shared UI controls. Every interactive control uses the same recipe so the app reads as one system:
 * 36px tall, 2px square border, Chakra Petch 14px medium, yellow "active" state.
 */
import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

/** Text style shared by every control. */
export const CONTROL_TEXT = 'font-sans text-sm font-medium leading-none'
const SURFACE = 'border-2 border-line-2 bg-card text-ink-soft shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_2px_0_rgba(0,0,0,0.5)] transition-colors'
const HOVER = 'hover:border-[#3a404c] hover:bg-[#1a1d23] hover:text-ink'
const ACTIVE = 'border-accent bg-[#2a2410] text-accent shadow-[inset_0_1px_0_rgba(242,201,76,0.15),0_0_14px_-4px_rgba(242,201,76,0.5)]'

/** Small pixel section label ("RARETÉ", "COULEUR"…). */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx('px-label text-ink-mute', className)}>{children}</span>
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
  /** "ghost": no frame, for secondary actions like "Clear all". */
  variant?: 'default' | 'ghost'
}

/** Classes of a Button, for links that must look like one. */
export function buttonClass({ active, variant = 'default' }: { active?: boolean; variant?: ButtonProps['variant'] } = {}) {
  return cx(
    'px-focus inline-flex h-9 shrink-0 items-center gap-2 px-3 disabled:cursor-not-allowed disabled:opacity-40',
    CONTROL_TEXT,
    variant === 'ghost' ? 'text-accent hover:underline' : cx(active ? ACTIVE : SURFACE, !active && HOVER, 'border-2'),
  )
}

export function Button({ active, variant = 'default', className, children, ...rest }: ButtonProps) {
  return (
    <button type="button" {...rest} className={cx(buttonClass({ active, variant }), className)}>
      {children}
    </button>
  )
}

/** Pixel "share" glyph (arrow leaving a box), or a check mark once the link has been copied. */
export function LinkIcon({ done }: { done?: boolean }) {
  return done ? (
    <svg width="14" height="14" viewBox="0 0 7 7" aria-hidden shapeRendering="crispEdges" fill="currentColor">
      <rect x="0" y="3" width="1" height="1" /><rect x="1" y="4" width="1" height="1" /><rect x="2" y="5" width="1" height="1" />
      <rect x="3" y="4" width="1" height="1" /><rect x="4" y="3" width="1" height="1" /><rect x="5" y="2" width="1" height="1" />
      <rect x="6" y="1" width="1" height="1" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 7 7" aria-hidden shapeRendering="crispEdges" fill="currentColor">
      <rect x="3" y="0" width="4" height="1" /><rect x="6" y="1" width="1" height="2" />
      <rect x="5" y="1" width="1" height="1" /><rect x="4" y="2" width="1" height="1" /><rect x="3" y="3" width="1" height="1" /><rect x="2" y="4" width="1" height="1" />
      <rect x="0" y="1" width="3" height="1" /><rect x="0" y="2" width="1" height="4" /><rect x="0" y="6" width="7" height="1" /><rect x="6" y="4" width="1" height="2" />
    </svg>
  )
}

/** Count bubble used inside controls ("Effet 2"). */
export function Count({ children }: { children: ReactNode }) {
  return <span className="min-w-4 bg-accent px-1 py-0.5 text-center text-[11px] font-bold leading-none text-bg">{children}</span>
}

export function Caret() {
  return (
    <svg width="8" height="5" viewBox="0 0 4 3" aria-hidden shapeRendering="crispEdges" fill="currentColor">
      <rect x="0" y="0" width="4" height="1" />
      <rect x="1" y="1" width="2" height="1" />
      <rect x="1.5" y="2" width="1" height="1" />
    </svg>
  )
}

export type SegmentOption<T> = { value: T; label: ReactNode; title?: string }

/** Joined buttons, one active: kind filter, language, any/all. */
export function Segmented<T>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: SegmentOption<T>[]
  value: T
  onChange: (v: T) => void
  label: string
  className?: string
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cx('flex h-9 shrink-0 border-2 border-line-2 bg-card shadow-[0_2px_0_rgba(0,0,0,0.5)]', className)}
    >
      {options.map((o, i) => {
        const active = o.value === value
        return (
          <button
            key={String(o.value ?? 'all')}
            type="button"
            aria-pressed={active}
            title={o.title}
            onClick={() => onChange(o.value)}
            className={cx(
              'px-focus h-full flex-1 px-3',
              CONTROL_TEXT,
              i > 0 && 'border-l-2 border-line-2',
              'transition-colors',
              active
                ? 'bg-[#2a2410] text-accent shadow-[inset_0_-2px_0_var(--color-accent)]'
                : cx('text-ink-soft', 'hover:bg-[#1a1d23] hover:text-ink'),
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/** Button that opens a floating panel; closes on outside click or Escape. */
export function Dropdown({ label, count = 0, children }: { label: string; count?: number; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])
  return (
    <div ref={ref} className="relative shrink-0">
      <Button active={count > 0 || open} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {label}
        {count > 0 && <Count>{count}</Count>}
        <Caret />
      </Button>
      {open && (
        <div className="fade-up scrollbar-thin absolute left-0 top-[calc(100%+6px)] z-40 max-h-[60vh] w-72 overflow-y-auto border-2 border-line-2 border-t-accent bg-[#101318] p-1.5 shadow-[4px_4px_0_#000,0_16px_40px_-12px_rgba(0,0,0,0.9)]">
          {children}
        </div>
      )}
    </div>
  )
}

/** Native select (keyboard and mobile friendly) dressed like the other controls. */
export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className={cx('relative inline-flex shrink-0', className)}>
      <select
        {...rest}
        className={cx('px-focus h-9 cursor-pointer appearance-none pl-3 pr-8 outline-none', CONTROL_TEXT, SURFACE, HOVER)}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft">
        <Caret />
      </span>
    </span>
  )
}

/** Checkbox row for dropdown lists. */
export function CheckRow({
  checked,
  count,
  onChange,
  children,
}: {
  checked: boolean
  count?: number
  onChange: () => void
  children: ReactNode
}) {
  return (
    <label
      className={cx(
        'flex cursor-pointer items-center gap-2.5 px-2 py-2',
        CONTROL_TEXT,
        'hover:bg-[#1a1d23]',
        checked ? 'text-accent' : 'text-ink-soft',
        !checked && count === 0 && 'opacity-40',
      )}
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="px-check" />
      <span className="flex-1 leading-snug">{children}</span>
      {count !== undefined && <span className="tabular-nums text-ink-mute">{count}</span>}
    </label>
  )
}

/** Active filter shown in the bar, removable. */
export function FilterChip({ children, onRemove, removeLabel }: { children: ReactNode; onRemove: () => void; removeLabel: string }) {
  return (
    <Button active onClick={onRemove} aria-label={removeLabel}>
      {children}
      <svg width="8" height="8" viewBox="0 0 4 4" aria-hidden shapeRendering="crispEdges" fill="currentColor">
        <rect x="0" y="0" width="1" height="1" />
        <rect x="3" y="0" width="1" height="1" />
        <rect x="1" y="1" width="2" height="2" />
        <rect x="0" y="3" width="1" height="1" />
        <rect x="3" y="3" width="1" height="1" />
      </svg>
    </Button>
  )
}

/** Colour square used by the rarity and colour filters. */
export function Swatch({
  color,
  label,
  active,
  dimmed,
  count,
  onClick,
}: {
  color: string
  label: string
  active: boolean
  dimmed: boolean
  count: number
  onClick: () => void
}) {
  const disabled = !active && count === 0
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      aria-label={`${label} (${count})`}
      title={`${label} · ${count}`}
      className="px-focus relative size-[22px] shrink-0 transition-[transform,opacity] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-15 disabled:hover:translate-y-0"
      style={{
        background: color,
        boxShadow: active
          ? `inset 0 2px 0 rgb(255 255 255 / .35), inset 0 -2px 0 rgb(0 0 0 / .3), 0 0 0 2px #0a0b0e, 0 0 0 4px #fff, 0 0 12px ${color}`
          : 'inset 0 2px 0 rgb(255 255 255 / .3), inset 0 -2px 0 rgb(0 0 0 / .35), 0 0 0 2px #000',
        opacity: disabled ? undefined : dimmed && !active ? 0.35 : 1,
      }}
    />
  )
}
