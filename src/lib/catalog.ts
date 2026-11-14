import type { CSSProperties } from 'react'
import type { DlcId, RarityId } from './types'

export const RARITIES: { id: RarityId; fr: string; en: string; color: string; group: string }[] = [
  { id: 'white', fr: 'Commun', en: 'Common', color: '#c9ccd1', group: 'Objets' },
  { id: 'green', fr: 'Peu commun', en: 'Uncommon', color: '#5fbf3a', group: 'Objets' },
  { id: 'red', fr: 'Légendaire', en: 'Legendary', color: '#e2463f', group: 'Objets' },
  { id: 'boss', fr: 'Boss', en: 'Boss', color: '#e3c428', group: 'Objets' },
  { id: 'lunar', fr: 'Lunaire', en: 'Lunar', color: '#4a90f0', group: 'Objets' },
  { id: 'void-white', fr: 'Vide (commun)', en: 'Void (Common)', color: '#c04fd6', group: 'Vide' },
  { id: 'void-green', fr: 'Vide (peu commun)', en: 'Void (Uncommon)', color: '#c04fd6', group: 'Vide' },
  { id: 'void-red', fr: 'Vide (légendaire)', en: 'Void (Legendary)', color: '#c04fd6', group: 'Vide' },
  { id: 'void-boss', fr: 'Vide (boss)', en: 'Void (Boss)', color: '#c04fd6', group: 'Vide' },
  { id: 'hallowed', fr: 'Sacré', en: 'Hallowed', color: '#9ad13b', group: 'Hallowed Concepts' },
  { id: 'hex', fr: 'Maléfice', en: 'Hex', color: '#c43a5b', group: 'Hallowed Concepts' },
  { id: 'page', fr: 'Page', en: 'Page', color: '#c99a5b', group: 'Hallowed Concepts' },
  { id: 'meal', fr: 'Repas', en: 'Meal', color: '#f0a35e', group: 'Alloyed Collective' },
  { id: 'equipment', fr: 'Équipement', en: 'Equipment', color: '#f0902a', group: 'Équipements' },
  { id: 'lunar-equipment', fr: 'Équipement lunaire', en: 'Lunar Equipment', color: '#7aa8ff', group: 'Équipements' },
  { id: 'elite', fr: 'Aspect d’élite', en: 'Elite Aspect', color: '#f5c542', group: 'Équipements' },
  { id: 'untiered', fr: 'Hors catégorie', en: 'Untiered', color: '#8a8f98', group: 'Autres' },
]

export const RARITY_BY_ID = Object.fromEntries(RARITIES.map((r) => [r.id, r])) as Record<
  RarityId,
  (typeof RARITIES)[number]
>
export const RARITY_ORDER = Object.fromEntries(RARITIES.map((r, i) => [r.id, i])) as Record<RarityId, number>

/**
 * Rarity tiers as the player sees them in game (used by the filter): the four
 * void sub-tiers share one purple, elite aspects are equipment.
 */
export const TIERS: { id: string; fr: string; en: string; color: string; rarities: RarityId[] }[] = [
  { id: 'white', fr: 'Commun', en: 'Common', color: '#c9ccd1', rarities: ['white'] },
  { id: 'green', fr: 'Peu commun', en: 'Uncommon', color: '#5fbf3a', rarities: ['green'] },
  { id: 'red', fr: 'Légendaire', en: 'Legendary', color: '#e2463f', rarities: ['red'] },
  { id: 'boss', fr: 'Boss', en: 'Boss', color: '#e3c428', rarities: ['boss'] },
  { id: 'lunar', fr: 'Lunaire', en: 'Lunar', color: '#4a90f0', rarities: ['lunar'] },
  { id: 'void', fr: 'Vide', en: 'Void', color: '#c04fd6', rarities: ['void-white', 'void-green', 'void-red', 'void-boss'] },
  { id: 'equipment', fr: 'Équipement (et aspects d’élite)', en: 'Equipment (and elite aspects)', color: '#f0902a', rarities: ['equipment', 'elite'] },
  { id: 'lunar-equipment', fr: 'Équipement lunaire', en: 'Lunar equipment', color: '#7aa8ff', rarities: ['lunar-equipment'] },
  { id: 'hallowed', fr: 'Sacré (Hallowed Concepts)', en: 'Hallowed (Hallowed Concepts)', color: '#9ad13b', rarities: ['hallowed'] },
  { id: 'hex', fr: 'Maléfice (Hallowed Concepts)', en: 'Hex (Hallowed Concepts)', color: '#c43a5b', rarities: ['hex'] },
  { id: 'page', fr: 'Page (Hallowed Concepts)', en: 'Page (Hallowed Concepts)', color: '#c99a5b', rarities: ['page'] },
  { id: 'meal', fr: 'Repas (Alloyed Collective)', en: 'Meal (Alloyed Collective)', color: '#f0a35e', rarities: ['meal'] },
  { id: 'untiered', fr: 'Hors catégorie (objets consommés…)', en: 'Untiered (consumed items…)', color: '#8a8f98', rarities: ['untiered'] },
]
export const TIER_OF = Object.fromEntries(TIERS.flatMap((t) => t.rarities.map((r) => [r, t.id]))) as Record<
  RarityId,
  string
>

const BG = [10, 11, 14]
/** Blend a hex colour into the page background (t = share of the colour). */
export function tint(hex: string, t: number): string {
  const n = parseInt(hex.slice(1), 16)
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  const m = c.map((v, i) => Math.round(v * t + BG[i] * (1 - t)))
  return `rgb(${m[0]},${m[1]},${m[2]})`
}

/** Rarity colour for `.frame` elements (see styles.css), passed as the `--c` custom property. */
export function tileColors(rarity: RarityId) {
  return { '--c': RARITY_BY_ID[rarity].color } as CSSProperties
}

export const DLCS: { id: DlcId; fr: string; en: string; short: string }[] = [
  { id: 'base', fr: 'Jeu de base', en: 'Base game', short: 'Base' },
  { id: 'sotv', fr: 'Survivors of the Void', en: 'Survivors of the Void', short: 'SotV' },
  { id: 'sots', fr: 'Seekers of the Storm', en: 'Seekers of the Storm', short: 'SotS' },
  { id: 'ac', fr: 'Alloyed Collective', en: 'Alloyed Collective', short: 'AC' },
  { id: 'hc', fr: 'Hallowed Concepts', en: 'Hallowed Concepts', short: 'HC' },
]
export const DLC_BY_ID = Object.fromEntries(DLCS.map((d) => [d.id, d])) as Record<DlcId, (typeof DLCS)[number]>

export const COLOR_BUCKETS: { id: string; fr: string; en: string; swatch: string }[] = [
  { id: 'red', fr: 'Rouge', en: 'Red', swatch: '#e04848' },
  { id: 'orange', fr: 'Orange', en: 'Orange', swatch: '#ec8a2f' },
  { id: 'yellow', fr: 'Jaune', en: 'Yellow', swatch: '#e8c937' },
  { id: 'green', fr: 'Vert', en: 'Green', swatch: '#5cbf4a' },
  { id: 'cyan', fr: 'Cyan', en: 'Cyan', swatch: '#3fc4c9' },
  { id: 'blue', fr: 'Bleu', en: 'Blue', swatch: '#3f7fe0' },
  { id: 'purple', fr: 'Violet', en: 'Purple', swatch: '#9b59d9' },
  { id: 'pink', fr: 'Rose / magenta', en: 'Pink / magenta', swatch: '#d4458f' },
  { id: 'white', fr: 'Blanc / gris', en: 'White / grey', swatch: '#d9dce1' },
  { id: 'brown', fr: 'Brun', en: 'Brown', swatch: '#8b5e3c' },
  { id: 'black', fr: 'Noir', en: 'Black', swatch: '#2a2a2e' },
]
export const COLOR_BY_ID = Object.fromEntries(COLOR_BUCKETS.map((c) => [c.id, c]))

/**
 * Fine-grained effect tags stored on each item (computed by scripts/build-data.ts).
 * They power synergies and facts (src/lib/related.ts); the UI filters group them, see EFFECT_FILTERS.
 * `match` runs on the English description (game text, lowercase, tags stripped).
 */
export const TAGS: {
  id: string
  fr: string
  en: string
  categories?: string[]
  match?: RegExp
}[] = [
  { id: 'damage', fr: 'Dégâts', en: 'Damage', categories: ['Damage'] },
  { id: 'crit', fr: 'Coups critiques', en: 'Critical strikes', match: /critical|crit chance|critically/ },
  { id: 'on-hit', fr: 'À l’impact (proc)', en: 'On hit (proc)', match: /on hit|chance on hit|hitting an enemy|hitting enemies|on-hit|chance to (fire|shoot|launch|bleed|ignite|stun|slow|root|freeze|cripple|chain|explode|blight|collapse|inflict|summon|spawn)/ },
  { id: 'on-kill', fr: 'À la mort d’un ennemi', en: 'On kill', categories: ['OnKillEffect'], match: /on kill|killing an enemy|killing enemies|upon killing|enemies killed|on killing/ },
  { id: 'dot', fr: 'Dégâts sur la durée', en: 'Damage over time', match: /bleed|burn|ignite|poison|blight|collapse|damage over time/ },
  { id: 'aoe', fr: 'Zone & explosions', en: 'Area & explosions', match: /radius|explod|explosion|nearby enemies|in an area/ },
  { id: 'attack-speed', fr: 'Vitesse d’attaque', en: 'Attack speed', match: /attack speed/ },
  // `heal(?!th)`: "\bheal" alone also matched "health" (Crowbar, Shaped Glass… were tagged as healing).
  { id: 'healing', fr: 'Soin & régénération', en: 'Healing & regen', categories: ['Healing'], match: /\bheal(?!th)|regenerat/ },
  { id: 'defense', fr: 'Défense (bouclier, armure, barrière)', en: 'Defense (shield, armor, barrier)', match: /shield|barrier|armor|block incoming|invulnerab|damage taken|reduce (all )?incoming/ },
  { id: 'max-health', fr: 'PV max', en: 'Max health', match: /maximum health|max health/ },
  { id: 'low-health', fr: 'PV bas', en: 'Low health', categories: ['LowHealth'], match: /low health|below \d+% health|under \d+% health/ },
  { id: 'mobility', fr: 'Mobilité', en: 'Mobility', categories: ['MobilityRelated'], match: /movement speed|move speed|\bjump|dash|teleport you/ },
  { id: 'sprint', fr: 'Sprint', en: 'Sprint', categories: ['SprintRelated'], match: /sprint/ },
  { id: 'cooldown', fr: 'Temps de recharge', en: 'Cooldowns', match: /cooldown|skill charge|charges? of your|recharge|additional charge/ },
  { id: 'equipment', fr: 'Équipement', en: 'Equipment', categories: ['EquipmentRelated'], match: /equipment/ },
  { id: 'debuff', fr: 'Contrôle & malus', en: 'Crowd control & debuffs', match: /\bslow|stun|root|weaken|cripple|freez|debuff|armor reduction|reduce .* armor/ },
  { id: 'allies', fr: 'Alliés, drones & tourelles', en: 'Allies, drones & turrets', match: /\ball(y|ies)\b|drone|minion|turret|summon|\bclone\b/ },
  { id: 'elite', fr: 'Élites & boss', en: 'Elites & bosses', match: /\belite|\bboss|champion/ },
  { id: 'gold', fr: 'Or & économie', en: 'Gold & economy', match: /\bgold\b|\$\d|money|chests? cost|purchase/ },
  { id: 'interactable', fr: 'Coffres & interactions', en: 'Chests & interactables', categories: ['InteractableRelated'], match: /\bchest|shrine|interactable|printer|scrapper/ },
  { id: 'teleporter', fr: 'Téléporteur & zones', en: 'Teleporter & zones', categories: ['HoldoutZoneRelated'], match: /teleporter/ },
  { id: 'stage-start', fr: 'Début de niveau', en: 'Stage start', categories: ['OnStageBeginEffect'], match: /beginning of each stage|start of each stage|each stage/ },
  { id: 'luck', fr: 'Chance', en: 'Luck', match: /(?<!unaffected by )\bluck\b|favorable outcome/ },
  { id: 'void', fr: 'Corruption du Vide', en: 'Void corruption', match: /corrupts all/ },
  { id: 'utility', fr: 'Utilitaire', en: 'Utility', categories: ['Utility'] },
]
export const TAG_BY_ID = Object.fromEntries(TAGS.map((t) => [t.id, t]))

export type EffectGroup = { id: 'attack' | 'survival' | 'utility'; fr: string; en: string }
export const EFFECT_GROUPS: EffectGroup[] = [
  { id: 'attack', fr: 'Attaque', en: 'Attack' },
  { id: 'survival', fr: 'Survie', en: 'Survival' },
  { id: 'utility', fr: 'Utilitaire', en: 'Utility' },
]

/**
 * The "Effect" filters shown to the player: 14 filters grouping the fine-grained TAGS.
 * Dropped on purpose: "utility" (a third of the catalogue), "void" (same items as the Void rarity),
 * "luck" (2 items) and "elite" (9 items); search finds those. Filter ids reuse a tag id so old links keep working.
 */
export const EFFECT_FILTERS: {
  id: string
  fr: string
  en: string
  group: EffectGroup['id']
  test: (it: { tags: string[]; kind: 'item' | 'equipment' }) => boolean
}[] = (() => {
  const any = (...tags: string[]) => (it: { tags: string[] }) => tags.some((t) => it.tags.includes(t))
  return [
    { id: 'damage', fr: 'Dégâts', en: 'Damage', group: 'attack', test: any('damage') },
    { id: 'on-hit', fr: 'À l’impact (proc)', en: 'On hit (proc)', group: 'attack', test: any('on-hit') },
    { id: 'on-kill', fr: 'À la mort d’un ennemi', en: 'On kill', group: 'attack', test: any('on-kill') },
    { id: 'crit', fr: 'Critiques & vitesse d’attaque', en: 'Crits & attack speed', group: 'attack', test: any('crit', 'attack-speed') },
    { id: 'aoe', fr: 'Zone & explosions', en: 'Area & explosions', group: 'attack', test: any('aoe') },
    { id: 'dot', fr: 'Dégâts sur la durée', en: 'Damage over time', group: 'attack', test: any('dot') },
    { id: 'defense', fr: 'Défense & PV max', en: 'Defense & max health', group: 'survival', test: any('defense', 'max-health', 'low-health') },
    { id: 'healing', fr: 'Soin & régénération', en: 'Healing & regen', group: 'survival', test: any('healing') },
    // The "equipment" tag is on every equipment (the Type filter covers that): only keep items that boost equipment.
    { id: 'cooldown', fr: 'Recharge & équipement', en: 'Cooldowns & equipment', group: 'utility', test: (it) => it.tags.includes('cooldown') || (it.kind === 'item' && it.tags.includes('equipment')) },
    { id: 'mobility', fr: 'Mobilité & sprint', en: 'Mobility & sprint', group: 'utility', test: any('mobility', 'sprint') },
    { id: 'allies', fr: 'Alliés, drones & tourelles', en: 'Allies, drones & turrets', group: 'utility', test: any('allies') },
    { id: 'gold', fr: 'Or & coffres', en: 'Gold & chests', group: 'utility', test: any('gold', 'interactable') },
    { id: 'debuff', fr: 'Contrôle & malus', en: 'Crowd control & debuffs', group: 'utility', test: any('debuff') },
    { id: 'teleporter', fr: 'Téléporteur & niveau', en: 'Teleporter & stage', group: 'utility', test: any('teleporter', 'stage-start') },
  ]
})()
export const EFFECT_FILTER_BY_ID = Object.fromEntries(EFFECT_FILTERS.map((f) => [f.id, f]))

/** Old filter ids (from shared links) → the filter that now covers them. null = filter removed. */
const LEGACY_EFFECT: Record<string, string | null> = {
  'attack-speed': 'crit',
  'max-health': 'defense',
  'low-health': 'defense',
  sprint: 'mobility',
  equipment: 'cooldown',
  interactable: 'gold',
  'stage-start': 'teleporter',
  utility: null,
  void: null,
  luck: null,
  elite: null,
}
export function normalizeEffectIds(ids: string[]): string[] {
  const out = ids.map((id) => (id in LEGACY_EFFECT ? LEGACY_EFFECT[id] : id)).filter((id): id is string => !!id && id in EFFECT_FILTER_BY_ID)
  return [...new Set(out)]
}
