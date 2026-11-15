export type Lang = 'fr' | 'en'
export type Loc = { fr: string; en: string }

export type RarityId =
  | 'white'
  | 'green'
  | 'red'
  | 'boss'
  | 'lunar'
  | 'void-white'
  | 'void-green'
  | 'void-red'
  | 'void-boss'
  | 'hallowed'
  | 'hex'
  | 'page'
  | 'meal'
  | 'equipment'
  | 'lunar-equipment'
  | 'elite'
  | 'untiered'

export type DlcId = 'base' | 'sotv' | 'sots' | 'ac' | 'hc'

/**
 * How a stat evolves with the number of copies (n >= 1).
 * - linear:      base + add·(n−1)
 * - hyperbolic:  100·(1 − 1/(1 + (base + add·(n−1))/100))   (RoR2 "amplification → reduction")
 * - compound:    sign·100·(1 − (1−|base|)(1−|add|)^(n−1))  (multiplicative reductions, e.g. cooldowns)
 * - multiplier:  100·((1+base)(1+add)^(n−1) − 1)            (multiplicative growth, e.g. ×2 per stack)
 * - geometric:   base·(1+add)^(n−1)                         (flat value scaled by a % each stack)
 * - reciprocal:  base / (1 + add·(n−1))
 * - none:        constant
 * - table:       precomputed values (values[n−1]), for formulas that fit no model above
 * - special:     no closed formula, see note
 */
export type StackModel =
  | 'linear'
  | 'hyperbolic'
  | 'compound'
  | 'multiplier'
  | 'geometric'
  | 'reciprocal'
  | 'none'
  | 'table'
  | 'special'

export type Stacking = {
  stat: Loc
  model: StackModel
  /** Value as written in-game for 1 copy (numbers in the stat unit, % as 0-100). */
  base: number
  /** Per-stack parameter (meaning depends on model; for compound/multiplier/geometric it's a fraction). */
  add: number
  unit: string
  cap?: number
  /** Raw strings from the wiki, shown when the model is special. */
  raw: { value: string; add: string }
  /** True when the add applies per stack across the whole team. */
  team?: boolean
  /** For model 'table': values for n = 1..values.length (last value repeats). */
  values?: number[]
  /** Human formula shown for table models. */
  formula?: string
  /** True when a higher value hurts the player (hexes, lunar downsides). */
  bad?: boolean
  note?: Loc
}

/** What sets an item off. Texts live in src/lib/triggers.ts, per-item choice in data/triggers.json. */
export type TriggerKind =
  | 'hit'
  | 'big-hit'
  | 'crit'
  | 'kill'
  | 'kill-elite'
  | 'hurt'
  | 'low-health'
  | 'heal'
  | 'sprint'
  | 'jump'
  | 'landing'
  | 'still'
  | 'interact'
  | 'pickup'
  | 'stage-start'
  | 'teleporter'
  | 'level-up'
  | 'equipment'
  | 'primary'
  | 'secondary'
  | 'skill'
  | 'timer'
  | 'allies'
  | 'combat'
  | 'out-of-combat'
  | 'death'
  | 'ritual'
  | 'passive'

export type Trigger = { kind: TriggerKind; /** Replaces the default sentence of the kind. */ text?: Loc }

export type LinkKind ='boost' | 'combo' | 'none'
export type ItemLink = { kind: LinkKind; id: string; why: Loc }

export type Item = {
  id: string
  token: string
  wikiName: string
  name: Loc
  pickup: Loc
  desc: Loc
  kind: 'item' | 'equipment'
  rarity: RarityId
  dlc: DlcId
  color: string
  colorBucket: string
  tags: string[]
  stacking: Stacking[]
  procCoefficient?: number
  cooldown?: number
  corrupts?: string
  corruptedBy?: string
  unlock?: string
  icon: string | null
  /** Whether 57 Leaf Clover (luck) rerolls this item's chance. null = no chance roll. */
  luck: 'affected' | 'unaffected' | null
  /** Deals TOTAL damage (inherits crits of the triggering hit). */
  totalDamage: boolean
  /** Hand-written hard limit, e.g. "3 copies". */
  limit?: Loc
  /** What sets the item off (hand-written, data/triggers.json). */
  trigger?: Trigger
  /** Plain-language explanation when the game text hides how the item works. */
  explain?: Loc
  /** Hand-written synergies (combos, exceptions). Automatic ones are computed in the UI. */
  links: ItemLink[]
}
