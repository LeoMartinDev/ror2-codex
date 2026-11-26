import { describe, expect, test } from 'bun:test'
import { PORTALS } from '../data/portals'
import { BY_ID } from './items'

describe('teleporters and portals', () => {
  test('anchors are unique slugs', () => {
    const ids = PORTALS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  for (const p of PORTALS)
    test(p.id, () => {
      expect((p.items ?? []).filter((id) => !BY_ID.has(id))).toEqual([])
      expect(p.how.length).toBeGreaterThan(0)
      expect(p.what.length).toBeGreaterThan(0)
      for (const t of [p.name, p.leadsTo, ...p.what, ...p.how, ...(p.notes ?? [])]) {
        expect(t.fr.trim()).not.toBe('')
        expect(t.en.trim()).not.toBe('')
      }
      expect(p.wiki).toStartWith('https://riskofrain2.wiki.gg/wiki/')
    })
})
