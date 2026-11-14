import { describe, expect, test } from 'bun:test'
import data from '../data/items.json'
import { displayedTrap, gainAt, milestones, ruleText, stacksToCap, trendOf, valueAt, verdictOf } from './stacking'
import { itemFacts, relatedItems } from './related'
import type { Item, Stacking } from './types'

const items = data as Item[]
const stat = (id: string, en?: string): Stacking => {
  const it = items.find((x) => x.id === id)
  if (!it) throw new Error(`item ${id} not found`)
  const s = en ? it.stacking.find((x) => x.stat.en === en) : it.stacking[0]
  if (!s) throw new Error(`stat ${en} not found on ${id}`)
  return s
}

describe('linear', () => {
  test("Soldier's Syringe: 15% + 15% per stack", () => {
    const s = stat('syringe')
    expect(s.model).toBe('linear')
    expect(valueAt(s, 1)).toBe(15)
    expect(valueAt(s, 2)).toBe(30)
    expect(valueAt(s, 10)).toBe(150)
    expect(gainAt(s, 5)).toBe(15)
  })

  test('chance stats are capped at 100% (Lens-Maker’s Glasses)', () => {
    const s = stat('critglasses')
    expect(s.cap).toBe(100)
    expect(valueAt(s, 10)).toBe(100)
    expect(valueAt(s, 15)).toBe(100)
    expect(stacksToCap(s)).toBe(10)
    expect(gainAt(s, 11)).toBe(0)
  })
})

describe('hyperbolic', () => {
  test('Tougher Times: 1 − 1/(1 + 0.15n)', () => {
    const s = stat('bear')
    expect(s.model).toBe('hyperbolic')
    expect(valueAt(s, 1)).toBeCloseTo(13.04, 2)
    expect(valueAt(s, 2)).toBeCloseTo(23.08, 2)
    expect(valueAt(s, 1000)!).toBeLessThan(100)
    expect(displayedTrap(s)).toMatchObject({ shown1: 15, shown3: 45 })
  })

  test('milestones: 50 % at 7 copies, 75 % at 20', () => {
    expect(milestones(stat('bear'))).toEqual([
      { target: 50, n: 7 },
      { target: 75, n: 20 },
    ])
  })

  test('gains shrink with each stack', () => {
    const s = stat('bear')
    expect(gainAt(s, 3)!).toBeLessThan(gainAt(s, 2)!)
  })
})

describe('exponential', () => {
  test('Shaped Glass doubles damage per stack', () => {
    const s = stat('lunardagger', 'Damage')
    expect(valueAt(s, 1)).toBeCloseTo(100)
    expect(valueAt(s, 2)).toBeCloseTo(300)
    expect(valueAt(s, 3)).toBeCloseTo(700)
  })

  test('Alien Head: cooldown reduction compounds (1 − 0.75^n)', () => {
    const s = stat('alienhead')
    expect(valueAt(s, 1)).toBeCloseTo(25)
    expect(valueAt(s, 2)).toBeCloseTo(43.75)
  })

  test('Old War Stealthkit: 30 s halved per extra stack', () => {
    const s = stat('phasing', 'Cooldown')
    expect(valueAt(s, 1)).toBeCloseTo(30)
    expect(valueAt(s, 3)).toBeCloseTo(7.5)
  })
})

describe('reciprocal and table', () => {
  test('Light Flux Pauldron: remaining attack speed = 1/(1+n)', () => {
    const s = stat('halfattackspeedhalfcooldowns', 'Remaining Attack Speed')
    expect(valueAt(s, 1)).toBeCloseTo(50)
    expect(valueAt(s, 2)).toBeCloseTo(33.33, 1)
  })

  test('Bandolier uses its own curve', () => {
    const s = stat('bandolier')
    expect(s.model).toBe('table')
    expect(valueAt(s, 1)).toBeCloseTo(20.45, 1)
    expect(valueAt(s, 200)).toBe(valueAt(s, 100))
  })

  test('Focused Convergence charge speed capped at 3 stacks', () => {
    const s = stat('focusconvergence', 'Charge Speed')
    expect(stacksToCap(s)).toBe(3)
  })
})

describe('formulas fixed from the wiki', () => {
  test('Ritual Helmet: 10 / (1 + 0.1n) m', () => {
    expect(valueAt(stat('sprintdamage', 'Distance per Charge'), 1)).toBeCloseTo(9.09, 2)
  })
  test('Hex of Haunting: 48 s with one stack', () => {
    expect(valueAt(stat('hexhaunting'), 1)).toBeCloseTo(48)
  })
  test('Hex of Mimicry: 54.5 s with one stack', () => {
    expect(valueAt(stat('mimicry', 'Mimic Interval'), 1)).toBeCloseTo(54.55, 1)
  })
  test('Dream Crucible: 1 − 0.9^n', () => {
    expect(valueAt(stat('lowhealthorbspawner'), 3)).toBeCloseTo(27.1, 1)
  })
})

describe('player-facing summary', () => {
  test('behaviour labels', () => {
    expect(verdictOf(stat('syringe')).label).toBe('Gain constant')
    expect(verdictOf(stat('bear')).label).toBe('Rendement décroissant')
    expect(verdictOf(stat('critglasses')).label).toBe('Max à 10 copies')
    expect(verdictOf(stat('lunardagger', 'Damage')).label).toBe('Effet multiplié')
    expect(verdictOf(stat('lunardagger', 'Health Reduction')).tone).toBe('bad')
  })
  test('rules in plain words', () => {
    expect(ruleText(stat('syringe'))).toBe('+15 % par copie, sans limite.')
    expect(ruleText(stat('critglasses'))).toContain('Rien de plus après 10 copies')
    expect(trendOf(stat('phasing', 'Cooldown'))).toBe('shrinking')
  })
})

describe('related items', () => {
  test('English texts', () => {
    const byIdEn = new Map(items.map((i) => [i.id, i]))
    const r = relatedItems(items.find((i) => i.id === 'missile')!, byIdEn, 'en')
    expect(r.find((x) => x.item.id === 'clover')?.why).toContain('10% → 19% with 1 clover')
    expect(ruleText(stat('syringe'), 'en')).toBe('+15% per stack, no limit.')
  })
  const byId = new Map(items.map((i) => [i.id, i]))
  const find = (id: string) => items.find((i) => i.id === id)!
  test('clover boosts AtG with the right reroll maths', () => {
    const r = relatedItems(find('missile'), byId)
    const clover = r.find((x) => x.item.id === 'clover')
    expect(clover?.kind).toBe('boost')
    expect(clover?.why).toContain('10 % → 19 % avec 1 trèfle')
    expect(r.some((x) => x.item.id === 'firering' && x.kind === 'combo')).toBe(true)
  })
  test('clover does nothing on Tougher Times', () => {
    expect(relatedItems(find('bear'), byId).find((x) => x.item.id === 'clover')?.kind).toBe('none')
  })
  test('facts mention proc coefficient 0 for Brilliant Behemoth', () => {
    expect(itemFacts(find('behemoth')).find((f) => f.k === 'Enchaîne')?.v).toContain('Non')
  })
})

describe('data integrity', () => {
  test('every item has FR + EN names and a known rarity', () => {
    for (const it of items) {
      expect(it.name.fr.length).toBeGreaterThan(0)
      expect(it.name.en.length).toBeGreaterThan(0)
    }
  })
  test('ids are unique', () => {
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length)
  })
  test('Hallowed Concepts content is present', () => {
    expect(items.filter((i) => i.dlc === 'hc').length).toBeGreaterThan(30)
  })
})
