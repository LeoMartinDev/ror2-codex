import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { Segmented } from '#/components/ui'
import type { Lang, Loc } from './types'

const STORAGE_KEY = 'ror2-codex-lang'

type LangContext = {
  lang: Lang
  setLang: (l: Lang) => void
  /** Pick the string for the current language. */
  tr: (fr: string, en: string) => string
  /** Pick a localised data value. */
  loc: (v: Loc | undefined) => string
}

const Ctx = createContext<LangContext | null>(null)

function readStored(): Lang | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    return v === 'fr' || v === 'en' ? v : null
  } catch {
    return null
  }
}

/** French when the browser prefers French, English otherwise. */
function detect(): Lang {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
  return langs.some((l) => l?.toLowerCase().startsWith('fr')) ? 'fr' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  // The prerendered page is French; the browser language is applied right after hydration.
  const [lang, setLangState] = useState<Lang>('fr')

  useEffect(() => {
    setLangState(readStored() ?? detect())
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      window.localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* private mode: the choice just won't persist */
    }
  }, [])

  const tr = useCallback((fr: string, en: string) => (lang === 'fr' ? fr : en), [lang])
  const loc = useCallback((v: Loc | undefined) => (v ? v[lang] || v.fr : ''), [lang])

  return <Ctx.Provider value={{ lang, setLang, tr, loc }}>{children}</Ctx.Provider>
}

export function useLang(): LangContext {
  const c = useContext(Ctx)
  if (!c) throw new Error('useLang must be used inside <LangProvider>')
  return c
}

export function LangSwitch() {
  const { lang, setLang, tr } = useLang()
  return (
    <Segmented
      label={tr('Langue', 'Language')}
      value={lang}
      onChange={setLang}
      options={[
        { value: 'fr', label: 'FR', title: 'Français' },
        { value: 'en', label: 'EN', title: 'English' },
      ]}
    />
  )
}
