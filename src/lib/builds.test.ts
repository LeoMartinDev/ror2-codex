import { describe, expect, test } from 'bun:test'
import { OFFICIAL_BUILDS } from '../data/builds'
import { decodeBuild, encodeBuild, flatten, txt, type Build } from './builds'
import { parseBuildInput, parseBuildParam, queryParam } from './buildInput'
import { BY_ID, BY_WIKI_NAME } from './items'
import { buildSynergies } from './related'
import { isSurvivorId } from './survivors'
import type { Item } from './types'

const it = (id: string) => BY_ID.get(id) as Item

describe('official builds', () => {
  test('slugs are unique and do not hide the view / edit pages', () => {
    const slugs = OFFICIAL_BUILDS.map((b) => b.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const s of slugs) {
      expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      expect(['view', 'edit']).not.toContain(s)
    }
  })

  for (const b of OFFICIAL_BUILDS)
    test(b.slug, () => {
      expect(b.survivor === null || isSurvivorId(b.survivor)).toBe(true)
      const ids = b.items.map((i) => i.id)
      expect(ids.filter((id) => !BY_ID.has(id))).toEqual([])
      expect(new Set(ids).size).toBe(ids.length)
      expect(b.items.some((i) => i.core)).toBe(true)
      // Synergy notes only point at items of the build.
      for (const n of b.synergies) expect(n.items.filter((id) => !ids.includes(id))).toEqual([])
      // Written in both languages.
      for (const v of [b.name, b.tagline, b.summary, ...b.howTo, ...b.synergies.map((n) => n.text), ...b.items.map((i) => i.role)])
        if (v !== undefined) {
          expect(txt(v, 'fr').trim()).not.toBe('')
          expect(txt(v, 'en').trim()).not.toBe('')
        }
    })
})

describe('share links', () => {
  test('a build survives the round trip', async () => {
    for (const b of OFFICIAL_BUILDS) {
      const flat = flatten(b, 'fr')
      const back = await decodeBuild(await encodeBuild(flat))
      expect(back).toEqual(JSON.parse(JSON.stringify(flat)))
    }
  })

  test('links stay short enough to paste in a chat', async () => {
    for (const b of OFFICIAL_BUILDS) expect((await encodeBuild(flatten(b, 'fr'))).length).toBeLessThan(2000)
  })

  test('unknown items and survivors are dropped, not fatal', async () => {
    const build: Build = {
      name: 'Test',
      survivor: 'nobody' as never,
      items: [{ id: 'syringe' }, { id: 'not-an-item' }, { id: 'syringe' }],
      howTo: [],
      synergies: [{ items: ['syringe', 'not-an-item'], text: 'x' }],
    }
    const back = await decodeBuild(await encodeBuild(build))
    expect(back?.survivor).toBeNull()
    expect(back?.items).toEqual([{ id: 'syringe' }])
    expect(back?.synergies[0].items).toEqual(['syringe'])
  })

  test('damaged codes give null', async () => {
    const code = await encodeBuild({ name: 'Test', survivor: null, items: [], howTo: [], synergies: [] })
    expect(await decodeBuild(code.slice(0, -6))).toBeNull()
    expect(await decodeBuild('')).toBeNull()
    expect(await decodeBuild('x123')).toBeNull()
    expect(await decodeBuild('j' + btoa('{"v":2}'))).toBeNull()
  })
})

describe('build synergies', () => {
  test('the clover helps the chance-based items of the build', () => {
    const { combos } = buildSynergies([it('clover'), it('chainlightningvoid'), it('syringe')], BY_WIKI_NAME, 'en')
    const clover = combos.find((c) => c.from.some((x) => x.id === 'clover'))
    expect(clover?.items.map((x) => x.id)).toContain('chainlightningvoid')
  })

  test('a void item and the item it corrupts are flagged', () => {
    const { warnings } = buildSynergies([it('chainlightningvoid'), it('chainlightning')], BY_WIKI_NAME, 'fr')
    expect(warnings.map((w) => [w.kind, w.a.id, w.b.id])).toEqual([['corrupt', 'chainlightningvoid', 'chainlightning']])
  })

  test('a single item has no combo with itself', () => {
    expect(buildSynergies([it('critglasses')], BY_WIKI_NAME, 'fr').combos).toEqual([])
  })
})

test('a combo never has an empty side', () => {
  // Gasoline, Will-o'-the-wisp and Ceremonial Dagger are both on-kill and area damage.
  const { combos } = buildSynergies([it('igniteonkill'), it('explodeondeath'), it('dagger'), it('talisman')], BY_WIKI_NAME, 'fr')
  for (const c of combos) expect(c.items.length).toBeGreaterThan(0)
})

describe('builds written by agents (readable JSON)', () => {
  test('names in French or English, ids and slugs all resolve', () => {
    const { build, errors } = parseBuildInput({
      name: 'Mix',
      survivor: 'Chasseuse',
      items: ['Ukulele', 'Trèfle à 57 feuilles', 'syringe', { item: 'lens-makers-glasses', core: true, role: '×10' }],
    })
    expect(errors).toEqual([])
    expect(build?.survivor).toBe('huntress')
    expect(build?.items).toEqual([{ id: 'chainlightning' }, { id: 'clover' }, { id: 'syringe' }, { id: 'critglasses', core: true, role: '×10' }])
  })

  test('typos come back with a suggestion, and the rest of the build is kept', () => {
    const { build, errors } = parseBuildInput({ name: 'x', survivor: 'Comando', items: ['Ukelele', 'Crowbar'] })
    expect(errors).toEqual(['survivor: unknown "Comando" — did you mean "Commando"?', 'items[0]: unknown item "Ukelele" — did you mean "Ukulele"?'])
    expect(build?.items).toEqual([{ id: 'crowbar' }])
  })

  test('a readable link gives the same build as the share link', async () => {
    const input = { name: 'Lien', items: ['Polylute', "Soldier's Syringe"], howTo: 'Un.\nDeux.', synergies: [{ items: ['Polylute', 'Syringe'], text: 'Ensemble.' }] }
    const { build, errors } = parseBuildParam(JSON.stringify(input))
    expect(errors).toEqual([])
    expect(build?.howTo).toEqual(['Un.', 'Deux.'])
    expect(await decodeBuild(await encodeBuild(build!))).toEqual(JSON.parse(JSON.stringify(build)))
  })

  test('broken JSON and missing fields are reported, not thrown', () => {
    expect(parseBuildParam('{name:').errors[0]).toMatch(/not valid JSON/)
    expect(parseBuildInput({}).errors).toEqual(['items: a non-empty list is required', 'name: required'])
    expect(parseBuildInput([]).build).toBeNull()
  })
})

test('accents sent in Windows-1252 by a Windows shell are recovered', () => {
  // "dégâts — flèche" in Windows-1252, then in UTF-8.
  expect(queryParam('?b=d%E9g%E2ts%20%97%20fl%E8che', 'b')).toBe('dégâts — flèche')
  expect(queryParam('?x=1&b=d%C3%A9g%C3%A2ts+ok', 'b')).toBe('dégâts ok')
  expect(queryParam('?x=1', 'b')).toBeNull()
})
