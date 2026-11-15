import { chanceAtOne } from './related'
import { formatValue } from './stacking'
import type { Item, Lang, Loc, TriggerKind } from './types'

const L = (fr: string, en: string): Loc => ({ fr, en })

/** Default sentence for each trigger, used when data/triggers.json gives no custom text. */
const MAIN: Record<TriggerKind, Loc> = {
  hit: L('Quand une de vos attaques touche un ennemi.', 'When one of your attacks hits an enemy.'),
  'big-hit': L('Quand un seul coup inflige au moins 400 % de dégâts.', 'When a single hit deals at least 400% damage.'),
  crit: L('Quand vous faites un coup critique.', 'When you land a critical strike.'),
  kill: L('Quand vous tuez un ennemi.', 'When you kill an enemy.'),
  'kill-elite': L('Quand vous tuez un ennemi élite.', 'When you kill an elite enemy.'),
  hurt: L('Quand vous subissez des dégâts.', 'When you take damage.'),
  'low-health': L('Quand vos PV passent sous 25 %.', 'When your health drops below 25%.'),
  heal: L('Quand vous êtes soigné.', 'When you get healed.'),
  sprint: L('Pendant que vous sprintez.', 'While you sprint.'),
  jump: L('Quand vous sautez.', 'When you jump.'),
  landing: L('Quand vous retombez au sol à grande vitesse.', 'When you hit the ground at high speed.'),
  still: L('Quand vous restez immobile.', 'While you stand still.'),
  interact: L('Quand vous activez un élément du décor (coffre, autel, baril…).', 'When you activate an interactable (chest, shrine, barrel…).'),
  pickup: L('Quand vous ramassez un objet.', 'When you pick up an item.'),
  'stage-start': L('Au début de chaque niveau.', 'At the start of each stage.'),
  teleporter: L('Pendant l’événement du téléporteur.', 'During the teleporter event.'),
  'level-up': L('Quand vous gagnez un niveau.', 'When you level up.'),
  equipment: L('Quand vous activez votre équipement.', 'When you activate your equipment.'),
  primary: L('Quand vous utilisez votre compétence principale (clic gauche).', 'When you use your Primary skill (left click).'),
  secondary: L('Quand vous utilisez votre compétence secondaire (clic droit).', 'When you use your Secondary skill (right click).'),
  skill: L('Quand vous utilisez une compétence.', 'When you use a skill.'),
  timer: L('Tout seul, à intervalles réguliers.', 'On its own, at regular intervals.'),
  allies: L('Par vos alliés, sans action de votre part.', 'Through your allies, with no action from you.'),
  combat: L('Pendant que vous êtes en combat.', 'While you are in combat.'),
  'out-of-combat': L('Hors combat.', 'Out of combat.'),
  death: L('Quand vous mourez.', 'When you die.'),
  ritual: L('Débloque un rituel du N’tormat.', 'Unlocks a ritual in the N’tormat.'),
  passive: L('En permanence : rien à déclencher.', 'Always on: nothing to trigger.'),
}

const HIT_SOURCES = L(
  'Toutes vos attaques comptent, pas seulement le clic gauche : vos 4 compétences, votre équipement, et même les dégâts d’autres objets (missiles, bombes…) tant qu’ils ont un coef. de proc au-dessus de 0. Ne comptent pas : les dégâts sur la durée (saignement, brûlure, poison) et les attaques de vos drones.',
  'Every attack counts, not just left click: all 4 skills, your equipment, and even damage from other items (missiles, bombs…) as long as it has a proc coefficient above 0. Does not count: damage over time (bleed, burn, poison) and your drones’ attacks.',
)
const KILL_SOURCES = L(
  'Le coup fatal doit venir de vous : une attaque, un objet ou des dégâts sur la durée (saignement, brûlure). Les ennemis achevés par vos drones et alliés ne comptent pas.',
  'The killing blow must be yours: an attack, an item or damage over time (bleed, burn). Enemies finished by your drones and allies do not count.',
)

const DETAIL: Partial<Record<TriggerKind, Loc>> = {
  hit: HIT_SOURCES,
  'big-hit': L(
    'C’est le pourcentage écrit sur la compétence qui compte, pas le total de plusieurs coups. La plupart des clics gauches (100 à 300 %) sont trop faibles : ce sont surtout les grosses compétences secondaires et spéciales qui l’atteignent.',
    'What counts is the percentage written on the skill, not the sum of several hits. Most left clicks (100 to 300%) are too weak: it is mostly big Secondary and Special skills that reach it.',
  ),
  crit: L('N’importe quelle attaque compte, du moment qu’elle est critique.', 'Any attack counts, as long as it crits.'),
  kill: KILL_SOURCES,
  'kill-elite': KILL_SOURCES,
  'low-health': L(
    'Il faut que des dégâts vous fassent passer sous le seuil : être déjà bas ne suffit pas.',
    'Damage has to push you below the threshold: already being low is not enough.',
  ),
}

/** Extra line about the chance roll, when the item has one. */
function chanceLine(item: Item, kind: TriggerKind, lang: Lang): string | null {
  const p = chanceAtOne(item)
  if (p === null) return null
  const pct = formatValue(p, '%', 1, lang)
  const fr = lang === 'fr'
  if (kind === 'hit')
    return fr
      ? `Chaque coup tente sa chance : ${pct} × le coef. de proc de l’attaque. À 1,0 (la plupart des clics gauches) la chance est pleine ; une attaque très rapide à 0,5 n’en a que la moitié. Une attaque qui touche 3 ennemis tente 3 fois.`
      : `Every hit rolls: ${pct} × the attack’s proc coefficient. At 1.0 (most left clicks) you get the full chance; a very fast attack at 0.5 gets half. An attack hitting 3 enemies rolls 3 times.`
  if (kind === 'kill' || kind === 'kill-elite')
    return fr ? `Chaque ennemi tué tente sa chance (${pct}).` : `Every kill rolls the chance (${pct}).`
  return null
}

export type TriggerInfo = { main: string; details: string[] }

export function triggerInfo(item: Item, lang: Lang): TriggerInfo | null {
  const t = item.trigger
  if (!t) return null
  const main = (t.text ?? MAIN[t.kind])[lang]
  const details = [DETAIL[t.kind]?.[lang], chanceLine(item, t.kind, lang)].filter((x): x is string => !!x)
  return { main, details }
}

export const TRIGGER_KINDS = Object.keys(MAIN) as TriggerKind[]
