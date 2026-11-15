import { formatValue, valueAt } from './stacking'
import type { Item, Lang, LinkKind, Loc } from './types'

export type Related = { kind: LinkKind; item: Item; why: string }

const CLOVER = 'clover'
const LENS = 'critglasses'

/** Chance (0-100) for one copy, from a "chance" stat or the description. */
export function chanceAtOne(item: Item): number | null {
  const s = item.stacking.find((x) => x.unit === '%' && /chance/i.test(x.stat.en))
  if (s) return valueAt(s, 1)
  const m = /(\d+(?:\.\d+)?)% chance/i.exec(item.desc.en.replace(/<[^>]+>/g, ''))
  return m ? Number(m[1]) : null
}

/**
 * Items that change how this one behaves: automatic rules (luck, crits) plus
 * hand-written combos from data/overrides.json.
 */
export function relatedItems(item: Item, byId: Map<string, Item>, lang: Lang = 'fr'): Related[] {
  const fr = lang === 'fr'
  const pct = (x: number) => formatValue(x, '%', 1, lang)
  const out: Related[] = []
  const add = (kind: LinkKind, id: string, why: string) => {
    const it = byId.get(id)
    if (!it || it.id === item.id) return
    if (out.some((r) => r.item.id === id && r.kind === kind)) return
    out.push({ kind, item: it, why })
  }

  // Hand-written first: they are more specific.
  for (const l of item.links) add(l.kind, l.id, l.why[lang] || l.why.fr)

  if (item.luck === 'affected') {
    const p = chanceAtOne(item)
    const reroll = (n: number) => (p === null ? 0 : 100 * (1 - Math.pow(1 - p / 100, n + 1)))
    const known = p !== null && p < 100
    add(
      'boost',
      CLOVER,
      fr
        ? known
          ? `Relance les jets ratés : ${pct(p!)} → ${pct(reroll(1))} avec 1 trèfle, ${pct(reroll(2))} avec 2.`
          : 'Relance les jets de chance ratés.'
        : known
          ? `Rerolls failed rolls: ${pct(p!)} → ${pct(reroll(1))} with 1 clover, ${pct(reroll(2))} with 2.`
          : 'Rerolls failed chance rolls.',
    )
  } else if (item.luck === 'unaffected') {
    add('none', CLOVER, fr ? 'Le trèfle relance tous les effets aléatoires… sauf celui-ci.' : 'The clover rerolls every random effect… except this one.')
  }

  if (item.totalDamage)
    add('boost', LENS, fr ? 'Dégâts TOTAUX : si le coup est critique, l’effet l’est aussi.' : 'TOTAL damage: if the hit crits, so does the effect.')

  return out
}

// ---------------------------------------------------------------- synergy families

const plain = (it: Item) => it.desc.en.replace(/<[^>]+>/g, '').toLowerCase()
const has = (it: Item, tag: string) => it.tags.includes(tag)
const isItem = (it: Item) => it.kind === 'item'

const P = {
  attackSpeed: (it: Item) => isItem(it) && has(it, 'attack-speed') && !it.stacking.some((s) => s.bad),
  onHitChance: (it: Item) => isItem(it) && has(it, 'on-hit') && it.luck === 'affected',
  crit: (it: Item) => /crit/.test(plain(it)),
  critSource: (it: Item) =>
    it.stacking.some((s) => /crit/i.test(s.stat.en) && /chance/i.test(s.stat.en)) || /critical (strike )?chance/.test(plain(it)),
  onKill: (it: Item) => isItem(it) && has(it, 'on-kill'),
  aoe: (it: Item) => isItem(it) && has(it, 'aoe') && has(it, 'damage'),
  dot: (it: Item) => has(it, 'dot'),
  shieldGiver: (it: Item) => /(gain|grants?|equal to).{0,40}shield|shield.{0,20}equal|into (regenerating )?shields?/.test(plain(it)),
  shieldUser: (it: Item) => /while (you have )?(a )?shield|shield is active|while shields|break.{0,10}shield|shield.{0,10}break/.test(plain(it)),
  equipBooster: (it: Item) => isItem(it) && has(it, 'equipment'),
  sprint: (it: Item) => has(it, 'sprint'),
  lowHealth: (it: Item) => has(it, 'low-health'),
  teleporter: (it: Item) => has(it, 'teleporter'),
  barrier: (it: Item) => /barrier/.test(plain(it)),
  jump: (it: Item) => isItem(it) && /\bjump/.test(plain(it)),
  healTrigger: (it: Item) =>
    /(when|whenever) you (heal|are healed)|heal.{0,30}(fire|spawn|nova|blades)|10% .*health.*heal/.test(plain(it)),
  defense: (it: Item) => isItem(it) && has(it, 'defense'),
}


type Family = {
  /** Does the selected item take part, and with which counterpart? */
  me: (it: Item) => boolean
  them: (it: Item) => boolean
  title: Loc
  why: Loc
}

const L = (fr: string, en: string): Loc => ({ fr, en })

/** Families are read from the selected item's point of view; two-way pairs are listed in both directions. */
const FAMILIES: Family[] = [
  { me: (it) => it.id === CLOVER, them: (it) => it.luck === 'affected' && it.kind === 'item', title: L('Objets à chance', 'Chance-based items'), why: L('Le trèfle relance leurs jets ratés : ils se déclenchent plus souvent.', 'The clover rerolls their failed rolls: they trigger more often.') },
  { me: P.onHitChance, them: P.attackSpeed, title: L('Plus de coups par seconde', 'More hits per second'), why: L('Ils augmentent la vitesse d’attaque : plus de coups, donc plus de déclenchements.', 'They raise attack speed: more hits, so more triggers.') },
  { me: P.attackSpeed, them: P.onHitChance, title: L('Se déclenchent plus souvent', 'Trigger more often'), why: L('Objets à l’impact : chaque coup en plus est une chance de plus.', 'On-hit items: every extra hit is one more chance.') },
  { me: P.shieldUser, them: P.shieldGiver, title: L('Donnent du bouclier', 'Give shield'), why: L('Cet objet a besoin d’un bouclier : ceux-ci en fournissent.', 'This item needs a shield: these provide one.') },
  { me: P.shieldGiver, them: P.shieldUser, title: L('Exploitent le bouclier', 'Use your shield'), why: L('Ils ne marchent que tant que vous avez un bouclier.', 'They only work while you have a shield.') },
  { me: P.onKill, them: P.aoe, title: L('Tuent plusieurs ennemis d’un coup', 'Kill several enemies at once'), why: L('Les dégâts de zone enchaînent les éliminations, donc vos effets « à la mort ».', 'Area damage chains kills, and so your on-kill effects.') },
  { me: P.aoe, them: P.onKill, title: L('Effets à la mort d’un ennemi', 'On-kill effects'), why: L('Vos dégâts de zone tuent en groupe : ces effets se déclenchent en cascade.', 'Your area damage kills in groups: these effects chain.') },
  { me: (it) => it.totalDamage, them: P.critSource, title: L('Plus de coups critiques', 'More critical strikes'), why: L('Dégâts TOTAUX : chaque critique rend aussi l’effet critique.', 'TOTAL damage: every crit also makes the effect crit.') },
  { me: P.crit, them: P.crit, title: L('Autour des critiques', 'Around critical strikes'), why: L('Ils donnent des critiques ou en profitent.', 'They give crits or benefit from them.') },
  { me: P.dot, them: P.dot, title: L('Saignement, brûlure & co.', 'Bleed, burn & co.'), why: L('Ils appliquent ou exploitent les dégâts sur la durée.', 'They apply or exploit damage over time.') },
  { me: (it) => it.kind === 'equipment', them: P.equipBooster, title: L('Améliorent l’équipement', 'Improve your equipment'), why: L('Plus de charges, une recharge plus courte ou des effets en plus.', 'More charges, shorter cooldown or extra effects.') },
  { me: P.equipBooster, them: (it) => it.kind === 'item' && P.equipBooster(it), title: L('Autres objets d’équipement', 'Other equipment items'), why: L('Tous jouent sur votre équipement : ils se complètent.', 'All work on your equipment: they complement each other.') },
  { me: P.healTrigger, them: P.healTrigger, title: L('Se déclenchent en vous soignant', 'Trigger when you heal'), why: L('Chaque soin alimente aussi ces effets.', 'Every heal also feeds these effects.') },
  { me: P.barrier, them: P.barrier, title: L('Barrière', 'Barrier'), why: L('Ils donnent de la barrière ou en profitent.', 'They give barrier or benefit from it.') },
  { me: P.sprint, them: P.sprint, title: L('Sprint', 'Sprint'), why: L('Tous récompensent le sprint.', 'All reward sprinting.') },
  { me: P.jump, them: P.jump, title: L('Sauts', 'Jumps'), why: L('Tous jouent sur les sauts.', 'All play on jumps.') },
  { me: P.lowHealth, them: P.lowHealth, title: L('PV bas', 'Low health'), why: L('Tous se déclenchent quand vos PV sont bas.', 'All trigger when your health is low.') },
  { me: P.teleporter, them: P.teleporter, title: L('Téléporteur', 'Teleporter'), why: L('Tous agissent pendant l’événement du téléporteur.', 'All act during the teleporter event.') },
  { me: P.defense, them: P.defense, title: L('Autres objets de survie', 'Other survival items'), why: L('Ils se cumulent pour encaisser davantage.', 'They stack up so you can take more hits.') },
]

const EXCLUDED = new Set(['untiered', 'hex', 'page', 'elite'])

export type SynergyGroup = { title: string; why: string; items: Item[] }

/** Automatic synergy groups, most specific first, without repeating an item. */
export function synergyGroups(
  item: Item,
  all: Item[],
  rarityOrder: Record<string, number>,
  skip: Set<string> = new Set(),
  lang: Lang = 'fr',
): SynergyGroup[] {
  const used = new Set<string>([item.id, ...skip])
  const groups: SynergyGroup[] = []
  for (const f of FAMILIES) {
    if (!f.me(item)) continue
    const list = all
      .filter((it) => !used.has(it.id) && !EXCLUDED.has(it.rarity) && f.them(it))
      .sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity] || a.name[lang].localeCompare(b.name[lang], lang))
    if (!list.length) continue
    list.forEach((it) => used.add(it.id))
    groups.push({ title: f.title[lang], why: f.why[lang], items: list })
  }
  return groups
}

export type Fact = { k: string; v: string }

/** Short "what you need to know" lines shown above the stacking cards. */
export function itemFacts(item: Item, lang: Lang = 'fr'): Fact[] {
  const fr = lang === 'fr'
  const tr = (a: string, b: string) => (fr ? a : b)
  const facts: Fact[] = []
  // What sets the item off is shown on its own (see triggerInfo), not in this table.
  if (item.kind === 'equipment' && item.cooldown !== undefined) facts.push({ k: tr('Recharge', 'Cooldown'), v: `${item.cooldown} s` })
  if (item.totalDamage) facts.push({ k: tr('Dégâts', 'Damage'), v: tr('TOTAUX : profite des coups critiques.', 'TOTAL: benefits from critical strikes.') })
  if (item.procCoefficient !== undefined) {
    const pc = formatValue(item.procCoefficient, '', 1, lang)
    facts.push({
      k: tr('Enchaîne', 'Chains'),
      v:
        item.procCoefficient === 0
          ? tr('Non : coef. de proc 0, ne déclenche pas les objets à l’impact.', 'No: proc coefficient 0, does not trigger on-hit items.')
          : tr(`Oui : coef. de proc ${pc}, peut déclencher d’autres objets.`, `Yes: proc coefficient ${pc}, can trigger other items.`),
    })
  }
  if (item.luck === 'affected') facts.push({ k: tr('Chance', 'Luck'), v: tr('Améliorée par le trèfle (luck).', 'Improved by 57 Leaf Clover (luck).') })
  if (item.luck === 'unaffected') facts.push({ k: tr('Chance', 'Luck'), v: tr('Le trèfle (luck) ne l’améliore pas.', 'Not affected by luck (57 Leaf Clover).') })
  if (item.limit) facts.push({ k: tr('Limite', 'Limit'), v: item.limit[lang] || item.limit.fr })
  return facts
}
