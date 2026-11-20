import type { OfficialBuild } from '#/lib/builds'
import type { Loc } from '#/lib/types'

/**
 * Hand-written builds shown on /builds. Item ids are those of src/data/items.json; the test suite
 * checks they all exist. Item names in the texts use the game's official names in each language.
 * Slugs are URLs (/builds/<slug>): keep them stable once published.
 */
const L = (fr: string, en: string): Loc => ({ fr, en })
const wiki = (page: string) => `https://riskofrain2.wiki.gg/wiki/${page}`

export const OFFICIAL_BUILDS: OfficialBuild[] = [
  // ------------------------------------------------------------ generic
  {
    slug: 'forgive-me-please-loop',
    survivor: null,
    name: L('Poupée automatique', 'Automatic doll'),
    tagline: L('La poupée déclenche toute la chaîne.', 'The doll sets off the whole chain.'),
    tag: L('Très puissant une fois assemblé', 'Very strong once assembled'),
    summary: L(
      'Pardonne-moi déclenche tes effets « à l’élimination » sans tuer personne. Le Signe du noyé la relance tout seul et le Catalyseur spirituel entretient la boucle. Ajoute au moins une source de dégâts à l’élimination.',
      'Forgive Me Please sets off your on-kill effects without killing anything. Gesture of the Drowned fires it on its own and Soulbound Catalyst keeps the loop going. Add at least one on-kill damage source.',
    ),
    skills: {
      label: L('Boucle du build', 'Build loop'),
      text: L(
        'Poupée → effets à l’élimination → recharge réduite par le Catalyseur → nouvelle poupée',
        'Doll → on-kill effects → cooldown cut by the Catalyst → next doll',
      ),
    },
    items: [
      { id: 'deathprojectile', core: true, role: L('×1 · équipement requis', '×1 · required equipment') },
      { id: 'autocastequipment', core: true, role: L('×1 · la lance seul, recharge 45 s → 22,5 s', '×1 · fires it for you, cooldown 45 s → 22.5 s') },
      { id: 'talisman', core: true, role: L('×1 · −4 s par impulsion : boucle continue', '×1 · −4 s per pulse: nonstop loop') },
      { id: 'igniteonkill', role: L('×1 ou plus · dégâts faciles à trouver', '×1 or more · easy-to-find damage') },
      { id: 'explodeondeath', role: L('×1 ou plus · dégâts de zone', '×1 or more · area damage') },
      { id: 'dagger', role: L('×1 ou plus · amélioration majeure', '×1 or more · major upgrade') },
      { id: 'barrieronkill', role: L('×1 ou plus · protection', '×1 or more · protection') },
      { id: 'equipmentmagazine', role: L('Optionnel · recharge plus courte', 'Optional · shorter cooldown') },
      { id: 'strengthenburn', role: L('Optionnel · brûlures de l’Essence ×4 · SotV', 'Optional · Gasoline burns ×4 · SotV') },
    ],
    synergies: [
      {
        items: ['deathprojectile', 'talisman'],
        text: L(
          'Chaque impulsion compte comme une élimination : 8 impulsions × 4 s = 32 s retirées par poupée avec 1 Catalyseur, plus que la recharge. Seule la limite de 3 poupées actives freine la boucle.',
          'Every pulse counts as a kill: 8 pulses × 4 s = 32 s cut per doll with 1 Catalyst, more than the cooldown. Only the 3-active-doll limit holds the loop back.',
        ),
      },
      {
        items: ['deathprojectile', 'igniteonkill', 'explodeondeath', 'dagger'],
        text: L(
          'La poupée ne fait pas de dégâts seule : ce sont ces objets qui frappent à chaque impulsion. Flammes et piliers de lave partent de la poupée ; les dagues cherchent leurs cibles.',
          'The doll deals no damage on its own: these items do, on every pulse. Flames and lava pillars start from the doll; daggers seek their targets.',
        ),
      },
      {
        items: ['deathprojectile', 'barrieronkill'],
        text: L('Chaque impulsion donne aussi de la barrière.', 'Every pulse also grants barrier.'),
      },
    ],
    howTo: [
      L(
        'Pour commencer : poupée + Signe du noyé + Essence ou Feu follet. Sans Catalyseur, la poupée fonctionne déjà, avec des pauses plus longues.',
        'To start: doll + Gesture of the Drowned + Gasoline or Will-o’-the-wisp. Without the Catalyst the doll already works, with longer pauses.',
      ),
      L(
        'Les effets à condition ne partent pas : Tiges encéphaliques, Sillage de vautours. Lance la poupée près des ennemis : tout part de l’endroit où elle se colle.',
        'Conditional effects do not fire: Brainstalks, Wake of Vultures. Throw the doll near enemies: everything starts from where it sticks.',
      ),
      L(
        'Le Réservoir d’ignition ne sert que si tu as l’Essence. Évite la Cellule de Lysat : elle corrompt tes Piles à combustible.',
        'Ignition Tank only helps if you have Gasoline. Avoid Lysate Cell: it corrupts your Fuel Cells.',
      ),
    ],
    sources: [
      { label: 'Forgive Me Please', url: wiki('Forgive_Me_Please') },
      { label: 'Soulbound Catalyst', url: wiki('Soulbound_Catalyst') },
      { label: 'Gesture of the Drowned', url: wiki('Gesture_of_the_Drowned') },
    ],
  },
  {
    slug: 'permanent-spinel-tonic',
    survivor: null,
    name: L('Tonique permanent', 'Permanent tonic'),
    tagline: L('Garder le bonus du tonique actif.', 'Keep the tonic buff up.'),
    tag: L('Simple à assembler · lunaire', 'Easy to assemble · lunar'),
    summary: L(
      'Une combinaison compacte qui renforce directement ton survivant. Le seuil à atteindre : une recharge plus courte que les 20 secondes d’effet du tonique.',
      'A compact combo that directly boosts your survivor. The threshold: a cooldown shorter than the tonic’s 20-second effect.',
    ),
    skills: {
      label: L('Assemblage minimal', 'Minimum set'),
      text: L(
        '1 Tonique Spinelle + 1 Signe du noyé + 3 Piles à combustible (ou 4 Signes)',
        '1 Spinel Tonic + 1 Gesture of the Drowned + 3 Fuel Cells (or 4 Gestures)',
      ),
    },
    items: [
      { id: 'tonic', core: true, role: L('×1 · équipement requis', '×1 · required equipment') },
      { id: 'autocastequipment', core: true, role: L('×1 · automatisation, recharge 60 s → 30 s', '×1 · automation, cooldown 60 s → 30 s') },
      { id: 'equipmentmagazine', core: true, role: L('×3 · seuil du bonus permanent', '×3 · permanent-buff threshold') },
      { id: 'clover', role: L('Optionnel · Détresse 20 % → 4 % par prise', 'Optional · Affliction 20% → 4% per drink') },
      { id: 'talisman', role: L('Optionnel · les éliminations raccourcissent la recharge', 'Optional · kills shorten the cooldown') },
    ],
    synergies: [
      {
        items: ['tonic', 'autocastequipment', 'equipmentmagazine'],
        text: L(
          'Avec 1 Signe et 3 Piles, la recharge tombe à environ 18,4 s : le tonique est relancé avant la fin de ses 20 s d’effet.',
          'With 1 Gesture and 3 Fuel Cells the cooldown drops to about 18.4 s: the tonic is used again before its 20 s run out.',
        ),
      },
      {
        items: ['tonic', 'autocastequipment'],
        text: L(
          'Chaque prise tire sa chance de Détresse, mais les Détresses ne s’appliquent qu’à la fin de l’effet : tant qu’il ne s’arrête pas, elles s’accumulent sans effet, puis tombent toutes d’un coup. Changer d’étage pendant l’effet les annule.',
          'Each drink rolls its Affliction chance, but Afflictions only apply when the buff ends: while it never ends they pile up harmlessly, then land all at once. Changing stage during the buff cancels them.',
        ),
      },
    ],
    howTo: [
      L(
        'Après le premier, chaque Signe réduit la recharge comme une Pile : 4 Signes sans Pile suffisent aussi.',
        'After the first one, each Gesture shortens the cooldown like a Fuel Cell: 4 Gestures and no Fuel Cell also work.',
      ),
      L(
        'Ne change pas d’équipement et ne perds pas de Pile en route : le bonus s’arrête et toutes les Détresses en attente tombent. Évite la Cellule de Lysat, qui corrompt les Piles.',
        'Do not swap equipment or lose Fuel Cells on the way: the buff stops and every pending Affliction lands. Avoid Lysate Cell, which corrupts Fuel Cells.',
      ),
      L(
        'Moins bon sur l’Ingénieur : ses tourelles ne profitent pas du tonique, mais héritent de ses Détresses.',
        'Weaker on Engineer: his turrets do not get the tonic buff, but they inherit its Afflictions.',
      ),
    ],
    sources: [
      { label: 'Spinel Tonic', url: wiki('Spinel_Tonic') },
      { label: 'Gesture of the Drowned', url: wiki('Gesture_of_the_Drowned') },
      { label: 'Fuel Cell', url: wiki('Fuel_Cell') },
    ],
  },
  {
    slug: 'automatic-missiles',
    survivor: null,
    name: L('Missiles automatiques', 'Automatic missiles'),
    tagline: L('Les missiles travaillent pendant que tu bouges.', 'Missiles do the work while you move.'),
    tag: L('Dégâts automatiques · I.C.B.M : SotV', 'Hands-free damage · I.C.B.M.: SotV'),
    summary: L(
      'Le Signe du noyé tire le lance-missile tout seul. Les Piles augmentent sa cadence ; l’I.C.B.M de poche triple les projectiles.',
      'Gesture of the Drowned fires the launcher on its own. Fuel Cells raise its rate; Pocket I.C.B.M. triples the projectiles.',
    ),
    skills: {
      label: L('Assemblage', 'Set'),
      text: L(
        'Lance-missile jetable + Signe du noyé + Piles ; puis I.C.B.M de poche si tu le trouves',
        'Disposable Missile Launcher + Gesture of the Drowned + Fuel Cells; then Pocket I.C.B.M. if you find it',
      ),
    },
    items: [
      { id: 'commandmissile', core: true, role: L('×1 · 12 missiles à 300 %', '×1 · 12 missiles at 300%') },
      { id: 'autocastequipment', core: true, role: L('×1 · automatisation, recharge ÷2', '×1 · automation, cooldown halved') },
      { id: 'equipmentmagazine', core: true, role: L('×3 ou plus · cadence', '×3 or more · fire rate') },
      { id: 'moremissile', role: L('×1 · 36 missiles par salve ; les suivants : dégâts', '×1 · 36 missiles per salvo; more copies: damage') },
      { id: 'talisman', role: L('×1 ou plus · −4 s de recharge par élimination', '×1 or more · −4 s cooldown per kill') },
      { id: 'missile', role: L('Optionnel · dégâts en plus, triplés aussi', 'Optional · extra damage, also tripled') },
    ],
    synergies: [
      {
        items: ['commandmissile', 'autocastequipment', 'equipmentmagazine'],
        text: L(
          '1 Signe ramène la recharge de 45 s à 22,5 s. Avec 3 Piles, environ 13,8 s ; avec 10, environ 4,4 s.',
          '1 Gesture brings the cooldown from 45 s to 22.5 s. With 3 Fuel Cells, about 13.8 s; with 10, about 4.4 s.',
        ),
      },
      {
        items: ['commandmissile', 'moremissile', 'missile'],
        text: L(
          'Le premier I.C.B.M triple chaque missile du lanceur et du Missile air-sol ; les suivants n’ajoutent que des dégâts (+50 %).',
          'The first I.C.B.M. triples every missile from the launcher and the AtG Missile; more copies only add damage (+50%).',
        ),
      },
    ],
    howTo: [
      L(
        'Le Catalyseur dépend des éliminations : contre un boss seul, il ne garantit pas une recharge continue.',
        'The Catalyst depends on kills: against a lone boss it does not guarantee a constant recharge.',
      ),
      L(
        'Marche avec tous les survivants, sans cadence de tir élevée. Continue à prendre de la mobilité et de la protection. Évite la Cellule de Lysat, qui corrompt les Piles.',
        'Works with every survivor, no high fire rate needed. Keep picking up mobility and protection. Avoid Lysate Cell, which corrupts Fuel Cells.',
      ),
    ],
    sources: [
      { label: 'Pocket I.C.B.M.', url: wiki('Pocket_I.C.B.M.') },
      { label: 'Gesture of the Drowned', url: wiki('Gesture_of_the_Drowned') },
      { label: 'Soulbound Catalyst', url: wiki('Soulbound_Catalyst') },
    ],
  },
  {
    slug: 'blast-shower-bands',
    survivor: null,
    name: L('Douche + bracelets', 'Shower + bands'),
    tagline: L('Réarmer les bracelets et la protection.', 'Re-arm the bands and the shield.'),
    tag: L('Demande de gros coups', 'Needs big hits'),
    summary: L(
      'La recharge des bracelets compte comme un effet négatif : la Douche explosive l’efface. Avec le Signe du noyé et des Piles, ils se déclenchent bien plus souvent que toutes les 10 s.',
      'The bands’ cooldown counts as a debuff: Blast Shower wipes it. With Gesture of the Drowned and Fuel Cells they trigger far more often than every 10 s.',
    ),
    skills: {
      label: L('Assemblage', 'Set'),
      text: L(
        'Douche explosive + Signe du noyé + Piles + bracelet(s) ; Espaces aseptisés en bonus défensif',
        'Blast Shower + Gesture of the Drowned + Fuel Cells + band(s); Safer Spaces as a defensive bonus',
      ),
    },
    items: [
      { id: 'cleanse', core: true, role: L('×1 · efface la recharge des bracelets', '×1 · wipes the bands’ cooldown') },
      { id: 'autocastequipment', core: true, role: L('×1 · automatisation, recharge 20 s → 10 s', '×1 · automation, cooldown 20 s → 10 s') },
      { id: 'equipmentmagazine', core: true, role: L('×4 ou plus · douche plus fréquente', '×4 or more · more frequent showers') },
      { id: 'icering', role: L('×1 ou plus · dégâts mono-cible', '×1 or more · single-target damage') },
      { id: 'firering', role: L('×1 ou plus · dégâts de zone', '×1 or more · area damage') },
      { id: 'bearvoid', role: L('Optionnel · bouclier réarmé · SotV', 'Optional · re-armed block · SotV') },
    ],
    synergies: [
      {
        items: ['cleanse', 'icering', 'firering'],
        text: L(
          'La douche remet les bracelets à zéro, mais il faut encore un coup d’au moins 400 % de dégâts de compétence pour les déclencher : critiques et bonus d’objets ne comptent pas.',
          'The shower resets the bands, but you still need a hit of at least 400% skill damage to set them off: crits and item bonuses do not count.',
        ),
      },
      {
        items: ['cleanse', 'autocastequipment', 'equipmentmagazine'],
        text: L(
          'Signe seul : douche toutes les 10 s, comme la recharge des bracelets, donc aucun gain. Ce sont les Piles qui comptent : 4 Piles en plus, environ 5,2 s.',
          'Gesture alone: a shower every 10 s, the same as the bands’ cooldown, so no gain. Fuel Cells make the difference: with 4 more, about 5.2 s.',
        ),
      },
      {
        items: ['cleanse', 'bearvoid'],
        text: L('La douche réarme aussi Espaces aseptisés.', 'The shower also re-arms Safer Spaces.'),
      },
    ],
    howTo: [
      L(
        'Favorise les survivants qui portent des coups de plus de 400 % souvent : revolver du Bandit (600 %), Grillade du CHEF (600 %).',
        'Favour survivors that often land hits above 400%: Bandit’s revolver (600%), CHEF’s Sear (600%).',
      ),
      L(
        'La douche recharge aussi l’Imperméable de Ben, le Kit de furtivité de la Vieille Guerre et l’Ailette de rupture si tu les trouves.',
        'The shower also recharges Ben’s Raincoat, Old War Stealthkit and Breaching Fin if you find them.',
      ),
      L(
        'Ce montage ne rend pas invincible entre deux douches. Espaces aseptisés demande Survivors of the Void ; évite la Cellule de Lysat, qui corrompt les Piles.',
        'This set does not make you invincible between showers. Safer Spaces requires Survivors of the Void; avoid Lysate Cell, which corrupts Fuel Cells.',
      ),
    ],
    sources: [
      { label: 'Blast Shower', url: wiki('Blast_Shower') },
      { label: 'Kjaro’s Band', url: wiki('Kjaro%27s_Band') },
      { label: 'Gesture of the Drowned', url: wiki('Gesture_of_the_Drowned') },
    ],
  },
  {
    slug: 'plasma-shrimp-polylute',
    survivor: null,
    name: L('Crevettes + Polyluth', 'Shrimp + Polylute'),
    tagline: L('Multiplier les impacts, puis les missiles.', 'Multiply hits, then missiles.'),
    tag: L('Recommandé pour les tirs rapides · SotV', 'Best with fast attacks · SotV'),
    summary: L(
      'Une excellente base contre les boss : tant que tu as du bouclier, chaque impact lance un missile des Crevettes de plasma, y compris chaque frappe du Polyluth. Les attaques rapides alimentent le tout.',
      'A great base against bosses: while you have shield, every hit fires a Plasma Shrimp missile, including each Polylute strike. Fast attacks feed it all.',
    ),
    skills: {
      label: L('Assemblage', 'Set'),
      text: L(
        'Crevettes de plasma + Polyluth ; puis I.C.B.M de poche et Trèfle si possible',
        'Plasma Shrimp + Polylute; then Pocket I.C.B.M. and Clover if you can',
      ),
    },
    items: [
      { id: 'missilevoid', core: true, role: L('×1 ou plus · un missile par impact', '×1 or more · one missile per hit') },
      { id: 'chainlightningvoid', core: true, role: L('×1 ou plus · 3 frappes par déclenchement', '×1 or more · 3 strikes per trigger') },
      { id: 'moremissile', role: L('×1 · triple les missiles', '×1 · triples the missiles') },
      { id: 'clover', role: L('×1 ou plus · Polyluth plus fréquent', '×1 or more · Polylute more often') },
      { id: 'syringe', role: L('Plusieurs · selon le personnage', 'Several · depends on the survivor') },
      { id: 'personalshield', role: L('Optionnel · plus de bouclier à perdre', 'Optional · more shield to lose') },
      { id: 'bearvoid', role: L('Optionnel · un coup bloqué ne coûte pas de bouclier', 'Optional · a blocked hit costs no shield') },
    ],
    synergies: [
      {
        items: ['chainlightningvoid', 'missilevoid'],
        text: L(
          'Chaque frappe du Polyluth est un impact à part : elle lance son propre missile des Crevettes.',
          'Every Polylute strike is a separate hit: it fires its own Plasma Shrimp missile.',
        ),
      },
      {
        items: ['missilevoid', 'moremissile'],
        text: L('L’I.C.B.M triple les missiles des Crevettes.', 'The I.C.B.M. triples the Shrimp’s missiles.'),
      },
    ],
    howTo: [
      L(
        'Les Crevettes ne tirent pas au hasard : tout impact lance un missile, même à faible coefficient de proc. Les attaques à plusieurs projectiles brillent : Commando, cloueur de POL-Y, Mitraille du Bandit (5 plombs).',
        'The Shrimp do not roll: every hit fires a missile, even at a low proc coefficient. Multi-projectile attacks shine: Commando, MUL-T’s nailgun, Bandit’s Burst (5 pellets).',
      ),
      L(
        'Les Crevettes n’agissent que tant qu’il te reste du bouclier. Elles en donnent (10 % des PV max) ; s’il casse, éloigne-toi 7 s pour le recharger.',
        'The Shrimp only work while you have shield. They give some (10% of max health); if it breaks, back off for 7 s to recharge it.',
      ),
      L(
        'Les Crevettes corrompent les Missiles air-sol Mq. 1 et le Polyluth les Ukulélés. Évite Pureté : le Polyluth se déclenche bien moins souvent.',
        'Plasma Shrimp corrupts AtG Missiles Mk. 1 and Polylute corrupts Ukuleles. Avoid Purity: Polylute triggers far less often.',
      ),
    ],
    sources: [
      { label: 'Plasma Shrimp', url: wiki('Plasma_Shrimp') },
      { label: 'Polylute', url: wiki('Polylute') },
      { label: 'Pocket I.C.B.M.', url: wiki('Pocket_I.C.B.M.') },
    ],
  },
  {
    slug: 'drone-army',
    survivor: null,
    name: L('Armée de drones', 'Drone army'),
    tagline: L('Tes alliés deviennent ta force de frappe.', 'Your allies become your firepower.'),
    tag: L('Dégâts autonomes · Pièces : SotV', 'Autonomous damage · Parts: SotV'),
    summary: L(
      'Les Pièces détachées de drone renforcent tous tes alliés mécaniques, sondes des Noyaux d’empathie comprises. Chaque allié en plus augmente les dégâts des sondes : les drones du Renfort les font exploser.',
      'Spare Drone Parts boost all your mechanical allies, Empathy Cores probes included. Every extra ally raises the probes’ damage: The Back-up’s drones send it soaring.',
    ),
    skills: {
      label: L('Assemblage', 'Set'),
      text: L(
        'Pièces détachées de drone + Noyaux d’empathie ; Le renfort et drones achetés en complément',
        'Spare Drone Parts + Empathy Cores; The Back-up and bought drones on top',
      ),
    },
    items: [
      { id: 'droneweapons', core: true, role: L('×1 ou plus · arme et cadence pour les drones', '×1 or more · gun and fire rate for drones') },
      { id: 'roboballbuddy', core: true, role: L('×1 ou plus · 2 sondes, +100 % par allié', '×1 or more · 2 probes, +100% per ally') },
      { id: 'dronebackup', role: L('Optionnel · 4 drones pendant 25 s', 'Optional · 4 drones for 25 s') },
      { id: 'autocastequipment', role: L('Optionnel · automatise Le renfort', 'Optional · automates The Back-up') },
      { id: 'equipmentmagazine', role: L('×5 avec 1 Signe · renforts permanents', '×5 with 1 Gesture · permanent back-up') },
      { id: 'hoof', role: L('Mobilité · pour toi', 'Mobility · for you') },
    ],
    synergies: [
      {
        items: ['droneweapons', 'roboballbuddy'],
        text: L(
          'Les sondes des Noyaux comptent comme des alliés mécaniques : les Pièces leur ajoutent la mitrailleuse, les missiles et la cadence.',
          'The Cores’ probes count as mechanical allies: Spare Drone Parts give them the chain gun, missiles and fire rate.',
        ),
      },
      {
        items: ['roboballbuddy', 'dronebackup'],
        text: L(
          'Les sondes gagnent +100 % de dégâts par allié : les 4 drones du Renfort leur ajoutent +400 % tant qu’ils sont là.',
          'The probes gain +100% damage per ally: The Back-up’s 4 drones add +400% while they are out.',
        ),
      },
      {
        items: ['dronebackup', 'autocastequipment', 'equipmentmagazine'],
        text: L(
          '1 Signe + 5 Piles : environ 22,2 s de recharge pour 25 s de renforts, donc toujours présents.',
          '1 Gesture + 5 Fuel Cells: about 22.2 s of cooldown for 25 s of back-up, so they never leave.',
        ),
      },
    ],
    howTo: [
      L(
        'Ne dépend pas des dégâts de tes compétences. Les tourelles de l’Ingénieur sont mécaniques : les Pièces les renforcent aussi.',
        'Does not rely on your skills’ damage. Engineer’s turrets are mechanical: Spare Drone Parts boost them too.',
      ),
      L(
        'Les Noyaux ne sont pas obligatoires : les drones achetés pendant la partie sont déjà une bonne base.',
        'The Cores are not required: drones bought during the run are already a good base.',
      ),
      L(
        'Les sondes ne reviennent plus à partir de 16 alliés, et les 4 drones du Renfort comptent : reste sous 15 alliés pour les garder. Les Pièces demandent Survivors of the Void.',
        'The probes stop coming back at 16 allies, and The Back-up’s 4 drones count: stay under 15 allies to keep them. Spare Drone Parts require Survivors of the Void.',
      ),
    ],
    sources: [
      { label: 'Spare Drone Parts', url: wiki('Spare_Drone_Parts') },
      { label: 'Empathy Cores', url: wiki('Empathy_Cores') },
      { label: 'The Back-up', url: wiki('The_Back-up') },
    ],
  },
  {
    slug: 'crits-and-bleed',
    survivor: null,
    name: L('Critiques + saignement', 'Crits + bleed'),
    tagline: L('Critiquer, accélérer, se soigner.', 'Crit, speed up, heal.'),
    tag: L('Polyvalent · sans équipement imposé', 'Versatile · no equipment needed'),
    summary: L(
      'Une base classique pour les personnages qui touchent souvent. Les critiques alimentent la cadence, les soins et, avec la Rate explosive, le saignement et les explosions.',
      'A classic base for survivors that hit often. Crits feed attack speed, healing and, with Shatterspleen, bleed and explosions.',
    ),
    skills: {
      label: L('Assemblage progressif', 'Build-up'),
      text: L(
        'Lunettes + Instincts + Faux ; puis Rate explosive et Visée laser si tu les trouves',
        'Glasses + Instincts + Scythe; then Shatterspleen and Laser Scope if you find them',
      ),
    },
    items: [
      { id: 'critglasses', core: true, role: L('×9 avec Instincts + Faux · 100 % de critique', '×9 with Instincts + Scythe · 100% crit') },
      { id: 'attackspeedoncrit', core: true, role: L('×1 ou plus · +5 % critique (1er seul), cadence', '×1 or more · +5% crit (1st only), attack speed') },
      { id: 'healoncrit', core: true, role: L('×1 ou plus · +5 % critique (1er seul), soins', '×1 or more · +5% crit (1st only), healing') },
      { id: 'bleedonhitandexplode', role: L('×1 · amélioration majeure (boss)', '×1 · major upgrade (boss item)') },
      { id: 'critdamage', role: L('×1 ou plus · critiques ×3 · SotV', '×1 or more · crits ×3 · SotV') },
      { id: 'syringe', role: L('Selon le kit · vitesse d’attaque', 'Depends on kit · attack speed') },
    ],
    synergies: [
      {
        items: ['attackspeedoncrit', 'healoncrit'],
        text: L(
          'Le soin de la Faux et la durée du bonus des Instincts (3 s) sont multipliés par le coefficient de proc du coup : les attaques à coefficient 1 en profitent à fond, les petits projectiles beaucoup moins.',
          'The Scythe’s heal and the Instincts buff duration (3 s) are multiplied by the hit’s proc coefficient: proc-1 attacks get the full value, small projectiles much less.',
        ),
      },
    ],
    howTo: [
      L(
        'Seul le premier exemplaire des Instincts et de la Faux donne 5 % de critique : vise 9 Lunettes, pas plus.',
        'Only the first copy of Instincts and Scythe gives 5% crit chance: aim for 9 Glasses, no more.',
      ),
      L(
        'La Rate explosive fait saigner sur critique. Un ennemi tué d’un seul critique n’explose pas : il meurt avant de saigner. Son saignement ne s’ajoute pas à celui de la Tri-dague.',
        'Shatterspleen bleeds on crit. An enemy killed by a single crit does not explode: it dies before bleeding. Its bleed does not add up with Tri-Tip Dagger’s.',
      ),
      L(
        'Le Bandit a déjà des critiques garantis dans le dos : privilégie les effets sur critique plutôt que 9 Lunettes. La Tireuse d’élite convertit la chance de critique en dégâts critiques.',
        'Bandit already crits from behind: favour on-crit effects over 9 Glasses. Railgunner converts crit chance into crit damage.',
      ),
    ],
    sources: [
      { label: 'Lens-Maker’s Glasses', url: wiki('Lens-Maker%27s_Glasses') },
      { label: 'Predatory Instincts', url: wiki('Predatory_Instincts') },
      { label: 'Harvester’s Scythe', url: wiki('Harvester%27s_Scythe') },
      { label: 'Shatterspleen', url: wiki('Shatterspleen') },
    ],
  },
  {
    slug: 'helfire-razorwire',
    survivor: null,
    name: L('Feu sur soi + barbelés', 'Self-burn + razorwire'),
    tagline: L('Transformer les petits dégâts reçus en ripostes.', 'Turn small hits taken into retaliation.'),
    tag: L('Spécialisé · demande de la survie', 'Niche · needs sustain'),
    summary: L(
      'La Teinture infernale te brûle volontairement, 5 fois par seconde, ce qui déclenche les Barbelés en continu. L’Armure de répulsion et Planula transforment ces petits tics en soin.',
      'Helfire Tincture burns you on purpose, 5 times a second, which sets off Razorwire nonstop. Repulsion Armor Plate and Planula turn those small ticks into healing.',
    ),
    skills: {
      label: L('Assemblage', 'Set'),
      text: L(
        'Teinture + Barbelés + Armure + Planula ; puis Signe et Piles une fois la survie assurée',
        'Tincture + Razorwire + Plate + Planula; then Gesture and Fuel Cells once you can sustain it',
      ),
    },
    items: [
      { id: 'burnnearby', core: true, role: L('×1 · équipement requis', '×1 · required equipment') },
      { id: 'thorns', core: true, role: L('×1 ou plus · une riposte par tic', '×1 or more · one strike per tick') },
      { id: 'armorplate', core: true, role: L('×1 par ~1 000 PV max · tic ramené à 1', '×1 per ~1,000 max health · tick cut to 1') },
      { id: 'parentegg', core: true, role: L('×1 ou plus · +15 PV par tic', '×1 or more · +15 health per tick') },
      { id: 'autocastequipment', role: L('Optionnel · une fois stable', 'Optional · once stable') },
      { id: 'equipmentmagazine', role: L('×4 avec 1 Signe · feu continu', '×4 with 1 Gesture · constant fire') },
      { id: 'missile', role: L('Optionnel · les lames peuvent le déclencher', 'Optional · the blades can trigger it') },
    ],
    synergies: [
      {
        items: ['burnnearby', 'thorns'],
        text: L(
          'Chaque tic de brûlure sur toi compte comme des dégâts reçus : les Barbelés ripostent jusqu’à 5 fois par seconde.',
          'Every burn tick on you counts as damage taken: Razorwire strikes back up to 5 times a second.',
        ),
      },
      {
        items: ['burnnearby', 'armorplate', 'parentegg'],
        text: L(
          'Un tic vaut 0,5 % de tes PV max. L’Armure en retire 5 (minimum 1) et Planula rend 15 PV par tic : bien dosé, le feu te soigne au lieu de te blesser.',
          'A tick is 0.5% of your max health. The Plate removes 5 (minimum 1) and Planula heals 15 per tick: with the right amount, the fire heals you instead of hurting you.',
        ),
      },
      {
        items: ['burnnearby', 'autocastequipment', 'equipmentmagazine'],
        text: L(
          'Recharge de 45 s : 1 Signe + 4 Piles la ramènent à environ 11,7 s, sous les 12 s d’effet. Tu brûles en permanence.',
          '45 s cooldown: 1 Gesture + 4 Fuel Cells bring it to about 11.7 s, under the 12 s effect. You burn all the time.',
        ),
      },
    ],
    howTo: [
      L(
        'Teste d’abord à la main que ta survie compense le feu. La brûlure ne peut pas te tuer (elle s’arrête à 1 PV), mais les ennemis, si.',
        'First check by hand that your sustain beats the fire. The burn cannot kill you (it stops at 1 health), but enemies can.',
      ),
      L(
        'Pas de Réservoir d’ignition : il rend aussi ta propre brûlure bien plus forte. Mauvaise passe et Espaces aseptisés bloquent parfois un tic, donc une riposte.',
        'No Ignition Tank: it also makes your own burn much stronger. Tougher Times and Safer Spaces sometimes block a tick, and so a strike.',
      ),
      L(
        'La Teinture blesse aussi les alliés proches : garde tes distances en coopération. Très amusant avec l’Artefact du Commandement.',
        'The Tincture also hurts nearby allies: keep your distance in co-op. Great fun with the Artifact of Command.',
      ),
    ],
    sources: [
      { label: 'Helfire Tincture', url: wiki('Helfire_Tincture') },
      { label: 'Razorwire', url: wiki('Razorwire') },
      { label: 'Repulsion Armor Plate', url: wiki('Repulsion_Armor_Plate') },
      { label: 'Planula', url: wiki('Planula') },
    ],
  },
  {
    slug: 'automatic-lightning',
    survivor: null,
    name: L('Foudre automatique', 'Automatic lightning'),
    tagline: L('Un éclair à 3 000 % qui réveille les bracelets à chaque fois.', 'A 3,000% strike that wakes the bands every time.'),
    tag: L('Très fort · tous survivants · sans DLC', 'Very strong · any survivor · no DLC'),
    summary: L(
      'Le Condensateur royal frappe à 3 000 % avec un coefficient de 1,0 : il dépasse le seuil des bracelets et déclenche tes effets à l’impact, dont les dégâts TOTAUX sont calculés sur l’éclair. Le Signe du noyé le lance tout seul, pile au rythme des bracelets.',
      'Royal Capacitor hits for 3,000% with a 1.0 proc coefficient: it clears the bands’ threshold and sets off your on-hit effects, whose TOTAL damage is based on the strike. Gesture of the Drowned fires it on its own, right on the bands’ rhythm.',
    ),
    skills: {
      label: L('Assemblage', 'Set'),
      text: L(
        'Condensateur royal + Signe du noyé + bracelet(s) ; puis Piles, Missile air-sol et Perforateur chargé',
        'Royal Capacitor + Gesture of the Drowned + band(s); then Fuel Cells, AtG Missile and Charged Perforator',
      ),
    },
    items: [
      { id: 'lightning', core: true, role: L('×1 · équipement requis, 3 000 %', '×1 · required equipment, 3,000%') },
      { id: 'autocastequipment', core: true, role: L('×1 · automatisation, recharge 20 s → 10 s', '×1 · automation, cooldown 20 s → 10 s') },
      { id: 'icering', core: true, role: L('×1 ou plus · 250 % TOTAL, soit 7 500 % par éclair', '×1 or more · 250% TOTAL, so 7,500% per strike') },
      { id: 'firering', core: true, role: L('×1 ou plus · 300 % TOTAL, soit 9 000 % par éclair', '×1 or more · 300% TOTAL, so 9,000% per strike') },
      { id: 'equipmentmagazine', role: L('×3 · un éclair toutes les 6 s environ', '×3 · a strike about every 6 s') },
      { id: 'missile', role: L('×1 ou plus · missile à 9 000 % sur un éclair', '×1 or more · a 9,000% missile off a strike') },
      { id: 'lightningstrikeonhit', role: L('×1 ou plus · foudre à 15 000 % sur un éclair', '×1 or more · 15,000% lightning off a strike') },
      { id: 'clover', role: L('Optionnel · missiles et foudre plus fréquents', 'Optional · missiles and lightning more often') },
      { id: 'energizedonequipmentuse', role: L('×2 · +70 % de vitesse d’attaque en continu', '×2 · constant +70% attack speed') },
      { id: 'shockdamageaura', role: L('Optionnel · éclairs toujours critiques sous Énergie · AC', 'Optional · strikes always crit while Energized · AC') },
      { id: 'randomequipmenttrigger', role: L('Optionnel · un autre équipement à chaque éclair · SotV', 'Optional · another equipment on every strike · SotV') },
    ],
    synergies: [
      {
        items: ['lightning', 'icering', 'firering'],
        text: L(
          'L’éclair (3 000 %, coefficient 1,0) dépasse toujours le seuil de 400 % : les deux bracelets partent ensemble, et leurs dégâts TOTAUX sont calculés sur les 3 000 % de l’éclair.',
          'The strike (3,000%, proc 1.0) always clears the 400% threshold: both bands fire together, and their TOTAL damage is based on the strike’s 3,000%.',
        ),
      },
      {
        items: ['lightning', 'autocastequipment', 'equipmentmagazine'],
        text: L(
          'Signe seul : un éclair toutes les 10 s, exactement la recharge des bracelets, donc chaque éclair les déclenche. Les Piles ajoutent des éclairs entre deux bracelets : avec 3 Piles, environ 6,1 s.',
          'Gesture alone: a strike every 10 s, exactly the bands’ cooldown, so every strike triggers them. Fuel Cells add strikes in between: with 3, about 6.1 s.',
        ),
      },
      {
        items: ['lightning', 'missile', 'lightningstrikeonhit'],
        text: L(
          'Leurs dégâts sont TOTAUX : déclenchés par l’éclair, le missile vaut 300 % de 3 000 % et le Perforateur 500 % de 3 000 %. Ils n’ont que 10 % de chance chacun : le Trèfle les fait passer à 19 %.',
          'Their damage is TOTAL: set off by the strike, the missile is worth 300% of 3,000% and the Perforator 500% of 3,000%. Each only has a 10% chance: Clover raises it to 19%.',
        ),
      },
      {
        items: ['lightning', 'energizedonequipmentuse'],
        text: L(
          'Le Cor de guerre dure 8 s, +4 s par exemplaire : avec 2 Cors (12 s) et un éclair toutes les 10 s, le bonus ne tombe jamais.',
          'War Horn lasts 8 s, +4 s per copy: with 2 Horns (12 s) and a strike every 10 s, the buff never drops.',
        ),
      },
    ],
    howTo: [
      L(
        'Avec le Signe, le Condensateur attend une cible : garde le viseur sur l’ennemi à tuer, l’éclair part tout seul. Il tombe 0,5 s après, dans 3 m : une cible rapide peut l’esquiver.',
        'With Gesture, the Capacitor waits for a target: keep your crosshair on the enemy to kill and it fires on its own. It lands 0.5 s later, within 3 m: a fast target can dodge it.',
      ),
      L(
        'Aucune cadence de tir ni gros coup demandé : c’est la version tous survivants des builds à bracelets. Mets le reste en mobilité et en protection.',
        'No fire rate or big hit needed: this is the any-survivor version of band builds. Spend the rest on mobility and protection.',
      ),
      L(
        'Évite la Cellule de Lysat, qui corrompt les Piles, et le Bracelet de singularité, qui remplace les deux bracelets par un seul effet toutes les 20 s.',
        'Avoid Lysate Cell, which corrupts Fuel Cells, and Singularity Band, which replaces both bands with a single effect every 20 s.',
      ),
    ],
    sources: [
      { label: 'Royal Capacitor', url: wiki('Royal_Capacitor') },
      { label: 'Runald’s Band', url: wiki('Runald%27s_Band') },
      { label: 'Gesture of the Drowned', url: wiki('Gesture_of_the_Drowned') },
      { label: 'TheGamer: best equipment for Gesture', url: 'https://www.thegamer.com/risk-rain-2-gesture-drowned-best-equipment-combo/' },
    ],
  },
  {
    slug: 'clover-proc-chain',
    survivor: null,
    name: L('Chaîne d’effets', 'Proc chain'),
    tagline: L('Tes objets déclenchent tes objets.', 'Your items set off your items.'),
    tag: L('Très fort en fin de partie · sans DLC', 'Very strong late game · no DLC'),
    summary: L(
      'Un missile ou une foudre déclenchés par un tir peuvent à leur tour déclencher les autres objets à l’impact, avec des dégâts TOTAUX calculés sur le coup précédent. Le Trèfle à 57 feuilles double presque toutes ces chances : c’est la pièce qui fait basculer le build.',
      'A missile or lightning bolt set off by a shot can in turn set off your other on-hit items, with TOTAL damage based on the previous hit. 57 Leaf Clover nearly doubles all those chances: it is the piece that tips the build over.',
    ),
    skills: {
      label: L('Assemblage progressif', 'Build-up'),
      text: L(
        'Missile air-sol + Ukulélé + cadence ; puis Perforateurs, Crochet à viande et surtout le Trèfle',
        'AtG Missile + Ukulele + attack speed; then Perforators, Meat Hook and above all the Clover',
      ),
    },
    items: [
      { id: 'missile', core: true, role: L('×1 ou plus · maillon principal, coefficient 1,0', '×1 or more · main link, proc 1.0') },
      { id: 'chainlightning', core: true, role: L('×1 ou plus · nettoie les groupes', '×1 or more · clears groups') },
      { id: 'clover', core: true, role: L('×1 · 10 % → 19 %, 25 % → 44 %', '×1 · 10% → 19%, 25% → 44%') },
      { id: 'lightningstrikeonhit', role: L('×1 ou plus · 500 % TOTAL, coefficient 1,0', '×1 or more · 500% TOTAL, proc 1.0') },
      { id: 'fireballsonhit', role: L('×1 ou plus · 3 boules à 300 % TOTAL, contre les boss', '×1 or more · 3 balls at 300% TOTAL, against bosses') },
      { id: 'bouncenearby', role: L('×1 ou plus · jusqu’à 10 crochets, regroupe les ennemis', '×1 or more · up to 10 hooks, pulls enemies together') },
      { id: 'stickybomb', role: L('Plusieurs · 5 % par exemplaire, 180 % TOTAL', 'Several · 5% per copy, 180% TOTAL') },
      { id: 'syringe', role: L('Plusieurs · plus de coups, plus de chaînes', 'Several · more hits, more chains') },
      { id: 'behemoth', role: L('Optionnel · chaque maillon explose en zone', 'Optional · every link explodes in an area') },
    ],
    synergies: [
      {
        items: ['missile', 'lightningstrikeonhit', 'fireballsonhit'],
        text: L(
          'Le missile a un coefficient de 1,0 : son impact peut déclencher un Perforateur, dont les dégâts TOTAUX sont alors calculés sur le missile (500 % de 300 % du tir d’origine). Et inversement : la foudre du Perforateur chargé peut lancer un missile.',
          'The missile has a 1.0 proc coefficient: its hit can set off a Perforator, whose TOTAL damage is then based on the missile (500% of 300% of the original shot). And the other way round: Charged Perforator’s lightning can fire a missile.',
        ),
      },
      {
        items: ['clover', 'missile', 'chainlightning'],
        text: L(
          'Le Trèfle relance chaque tirage raté, à chaque maillon de la chaîne : les chances se multiplient entre elles. Un objet ne peut pas se déclencher lui-même dans une même chaîne.',
          'Clover rerolls every failed roll, at every link of the chain: the odds multiply together. An item cannot trigger itself within the same chain.',
        ),
      },
      {
        items: ['chainlightning', 'bouncenearby', 'stickybomb'],
        text: L(
          'Ces trois-là terminent les chaînes plus qu’ils ne les relancent : coefficient 0,2 pour l’Ukulélé, 0,33 pour les crochets, 0 pour la Bombe collante.',
          'These three end chains more than they extend them: proc 0.2 for Ukulele, 0.33 for the hooks, 0 for Sticky Bomb.',
        ),
      },
    ],
    howTo: [
      L(
        'Marche avec tout survivant qui touche souvent avec un bon coefficient de proc. Les chances sont multipliées par le coefficient du coup : les attaques à 1,0 valent bien plus que les petits projectiles.',
        'Works with any survivor that hits often with a good proc coefficient. Chances are multiplied by the hit’s coefficient: proc-1 attacks are worth far more than small projectiles.',
      ),
      L(
        'Sans Trèfle, le build fonctionne déjà : empile les Missiles air-sol (+300 % par exemplaire) et la vitesse d’attaque. Avec le Trèfle, prends tout ce qui a une chance à l’impact.',
        'Without Clover the build already works: stack AtG Missiles (+300% per copy) and attack speed. With Clover, take anything with an on-hit chance.',
      ),
      L(
        'Évite Pureté (chaque exemplaire annule un Trèfle) et la Fleur benthique, qui corrompt les Trèfles. Les Crevettes de plasma et le Polyluth remplacent Missile et Ukulélé : c’est un autre build.',
        'Avoid Purity (each copy cancels one Clover) and Benthic Bloom, which corrupts Clovers. Plasma Shrimp and Polylute replace the Missile and Ukulele: that is another build.',
      ),
    ],
    sources: [
      { label: '57 Leaf Clover', url: wiki('57_Leaf_Clover') },
      { label: 'AtG Missile Mk. 1', url: wiki('AtG_Missile_Mk._1') },
      { label: 'Charged Perforator', url: wiki('Charged_Perforator') },
    ],
  },
  {
    slug: 'on-kill-chain-reaction',
    survivor: null,
    name: L('Réaction en chaîne', 'Chain reaction'),
    tagline: L('Un ennemi tué fait tomber tout le groupe.', 'One kill brings the whole pack down.'),
    tag: L('Nettoyage de foules · sans DLC', 'Crowd clear · no DLC'),
    summary: L(
      'Chaque élimination explose, enflamme et lance des dagues ; ces dégâts tuent les voisins, qui explosent à leur tour. Les éliminations faites par tes objets comptent : une fois le premier ennemi tombé, la vague se vide seule.',
      'Every kill explodes, ignites and throws daggers; that damage kills the neighbours, which explode in turn. Kills made by your items count: once the first enemy falls, the wave clears itself.',
    ),
    skills: {
      label: L('Assemblage progressif', 'Build-up'),
      text: L(
        'Essence + Feu follet dès le début ; puis Dague cérémoniale, Relique glacée et Disque de résonance',
        'Gasoline + Will-o’-the-wisp from the start; then Ceremonial Dagger, Frost Relic and Resonance Disc',
      ),
    },
    items: [
      { id: 'igniteonkill', core: true, role: L('×2 ou plus · 12 m (+4 m), brûlure plus longue', '×2 or more · 12 m (+4 m), longer burn') },
      { id: 'explodeondeath', core: true, role: L('×2 ou plus · 350 % (+280 %) dans 12 m', '×2 or more · 350% (+280%) within 12 m') },
      { id: 'dagger', role: L('×1 ou plus · 3 dagues à 150 % par élimination', '×1 or more · 3 daggers at 150% per kill') },
      { id: 'icicle', role: L('×1 · tempête à 1 200 %/s qui grandit', '×1 · a growing 1,200%/s storm') },
      { id: 'laserturbine', role: L('×1 · se charge avec 4 éliminations en 7 s', '×1 · charges with 4 kills in 7 s') },
      { id: 'strengthenburn', role: L('Optionnel · brûlure de l’Essence ×4 · SotV', 'Optional · Gasoline burn ×4 · SotV') },
      { id: 'barrieronkill', role: L('Plusieurs · barrière à chaque élimination', 'Several · barrier on every kill') },
      { id: 'movespeedonkill', role: L('Optionnel · +125 % de vitesse par élimination · SotV', 'Optional · +125% speed per kill · SotV') },
      { id: 'warcryonmultikill', role: L('Optionnel · +100 % de cadence après 4 éliminations', 'Optional · +100% attack speed after 4 kills') },
      { id: 'bossdamagebonus', role: L('Plusieurs · le build manque de dégâts sur boss', 'Several · the build lacks boss damage') },
    ],
    synergies: [
      {
        items: ['igniteonkill', 'explodeondeath', 'dagger'],
        text: L(
          'Toute mort causée par toi ou par tes objets relance les trois : l’Essence explose tout de suite, le Feu follet 1 s après, et les dagues vont chercher les ennemis jusqu’à 130 m.',
          'Any death caused by you or your items sets all three off again: Gasoline explodes at once, the Wisp 1 s later, and the daggers seek enemies up to 130 m away.',
        ),
      },
      {
        items: ['igniteonkill', 'strengthenburn'],
        text: L(
          'Le Réservoir ne renforce que la brûlure de l’Essence : le Feu follet n’inflige pas de brûlure.',
          'The Tank only boosts Gasoline’s burn: Will-o’-the-wisp does not ignite.',
        ),
      },
      {
        items: ['icicle', 'laserturbine', 'warcryonmultikill'],
        text: L(
          'Ils demandent des éliminations rapprochées, que la chaîne fournit : la tempête gagne 2 m et 5 s par élimination, et la Spalière se déclenche tant que tu tues au moins un ennemi par seconde.',
          'They need kills in quick succession, which the chain provides: the storm gains 2 m and 5 s per kill, and the Pauldron triggers as long as you kill at least one enemy a second.',
        ),
      },
    ],
    howTo: [
      L(
        'Tout se joue sur la première élimination : vise l’ennemi le plus faible au milieu du groupe, pas le plus gros.',
        'It all hangs on the first kill: aim for the weakest enemy in the middle of the pack, not the biggest.',
      ),
      L(
        'Les dégâts de ces objets sont des dégâts de BASE : ils suivent ton niveau, pas tes compétences. N’importe quel survivant les utilise aussi bien.',
        'These items deal BASE damage: it follows your level, not your skills. Any survivor uses them just as well.',
      ),
      L(
        'Contre un boss seul, il n’y a personne à tuer : garde une vraie source de dégâts (Munitions perforantes, bracelets). Évite la Flamme venue du vide : elle corrompt les Feux follets et ne se déclenche plus à l’élimination.',
        'Against a lone boss there is nobody to kill: keep a real damage source (Armor-Piercing Rounds, bands). Avoid Voidsent Flame: it corrupts Will-o’-the-wisps and no longer triggers on kill.',
      ),
    ],
    sources: [
      { label: 'Gasoline', url: wiki('Gasoline') },
      { label: 'Will-o’-the-wisp', url: wiki('Will-o%27-the-wisp') },
      { label: 'Ceremonial Dagger', url: wiki('Ceremonial_Dagger') },
    ],
  },
  {
    slug: 'death-mark-debuffs',
    survivor: null,
    name: L('Condamnation à mort', 'Death Mark'),
    tagline: L('Quatre altérations, +50 % de dégâts pour tout le monde.', 'Four debuffs, +50% damage for everyone.'),
    tag: L('Contre les boss · à assembler', 'Boss killer · takes assembling'),
    summary: L(
      'Un ennemi qui porte 4 altérations différentes est condamné : il subit +50 % de dégâts de toutes les sources, alliés et drones compris. Il suffit de réunir quatre objets qui posent chacun la leur.',
      'An enemy with 4 different debuffs is marked for death: it takes +50% damage from all sources, allies and drones included. You just need four items that each apply their own.',
    ),
    skills: {
      label: L('Assemblage', 'Set'),
      text: L(
        'Condamnation à mort + Tri-dague + Chronoboule + deux autres altérations (armure, brûlure)',
        'Death Mark + Tri-Tip Dagger + Chronobauble + two more debuffs (armor, burn)',
      ),
    },
    items: [
      { id: 'deathmark', core: true, role: L('×1 · +50 % de dégâts subis pendant 7 s (+7 s)', '×1 · +50% damage taken for 7 s (+7 s)') },
      { id: 'bleedonhit', core: true, role: L('×3 ou plus · saignement', '×3 or more · bleed') },
      { id: 'slowonhit', core: true, role: L('×1 · ralentissement à chaque coup, sans tirage', '×1 · slow on every hit, no roll') },
      { id: 'armorreductiononhit', role: L('×1 · −60 d’armure après 5 coups', '×1 · −60 armor after 5 hits') },
      { id: 'permanentdebuffonhit', role: L('×1 · −2 d’armure par coup · SotV', '×1 · −2 armor per hit · SotV') },
      { id: 'fireballsonhit', role: L('×1 · brûlure sur les boss', '×1 · burn on bosses') },
      { id: 'icering', role: L('×1 · ralentissement de 80 %, si tu as un gros coup', '×1 · 80% slow, if you have a big hit') },
      { id: 'triggerenemydebuffs', role: L('Optionnel · propage les altérations à la mort · SotS', 'Optional · spreads debuffs on death · SotS') },
      { id: 'syringe', role: L('Plusieurs · poser les altérations plus vite', 'Several · apply debuffs faster') },
    ],
    synergies: [
      {
        items: ['deathmark', 'bleedonhit', 'slowonhit'],
        text: L(
          'Il faut 4 altérations DIFFÉRENTES, puis un coup à coefficient de proc supérieur à 0 pour marquer. L’étourdissement et le gel ne comptent pas. La marque reste même si les altérations disparaissent.',
          'You need 4 DIFFERENT debuffs, then a hit with a proc coefficient above 0 to mark. Stun and freeze do not count. The mark stays even if the debuffs wear off.',
        ),
      },
      {
        items: ['slowonhit', 'icering', 'deathmark'],
        text: L(
          'Chaque ralentissement est une altération à part : celui de la Chronoboule (60 %) et celui du Bracelet de Runald (80 %) comptent pour deux.',
          'Each slow is its own debuff: Chronobauble’s (60%) and Runald’s Band’s (80%) count as two.',
        ),
      },
      {
        items: ['triggerenemydebuffs', 'deathmark'],
        text: L(
          'À chaque élimination, l’Épine transfère un tiers des altérations (au moins 1 de chaque) à un ennemi proche : le suivant est condamné presque tout de suite.',
          'On every kill, the Thorn transfers a third of the debuffs (at least 1 of each) to a nearby enemy: the next one is marked almost at once.',
        ),
      },
    ],
    howTo: [
      L(
        'Compte tes altérations fiables : la Chronoboule marche à chaque coup, la Justice en 5 coups. Le saignement et la brûlure dépendent d’un tirage : monte la Tri-dague à 3 ou plus.',
        'Count your reliable debuffs: Chronobauble works on every hit, Justice in 5 hits. Bleed and burn depend on a roll: get Tri-Tip Dagger to 3 or more.',
      ),
      L(
        'Le bonus profite à toute l’équipe : excellent en coopération, avec des drones ou les tourelles de l’Ingénieur.',
        'The bonus helps the whole team: excellent in co-op, with drones or Engineer’s turrets.',
      ),
      L(
        'La marque ne se prolonge pas : elle dure 7 s par exemplaire, puis il faut la reposer. Évite la Piqûre d’aiguille (elle remplace le saignement des Tri-dagues) et la Tentaboule (elle remplace la Chronoboule par un tirage à 5 %).',
        'The mark cannot be extended: it lasts 7 s per copy, then you must apply it again. Avoid Needletick (it replaces Tri-Tip Dagger’s bleed) and Tentabauble (it replaces Chronobauble with a 5% roll).',
      ),
    ],
    sources: [
      { label: 'Death Mark', url: wiki('Death_Mark') },
      { label: 'Noxious Thorn', url: wiki('Noxious_Thorn') },
      { label: 'Gameplay.tips: item synergies', url: 'https://gameplay.tips/guides/6116-risk-of-rain-2.html' },
    ],
  },
  {
    slug: 'healing-skulls-fruit',
    survivor: null,
    name: L('Soins offensifs', 'Offensive healing'),
    tagline: L('Chaque soin devient un crâne, le surplus une barrière.', 'Every heal becomes a skull, the overflow a barrier.'),
    tag: L('Très résistant · sans DLC', 'Very tanky · no DLC'),
    summary: L(
      'L’Opinion de N’kuhana transforme tous tes soins en crânes à tête chercheuse, même à pleine santé. Le Fruit étranger lancé par le Signe du noyé donne un gros soin régulier ; le Râtelier le double et l’Égide change le surplus en barrière.',
      'N’kuhana’s Opinion turns all your healing into homing skulls, even at full health. Foreign Fruit fired by Gesture of the Drowned gives a big regular heal; the Rack doubles it and Aegis turns the overflow into barrier.',
    ),
    skills: {
      label: L('Assemblage', 'Set'),
      text: L(
        'Opinion de N’kuhana + Fruit étranger + Signe du noyé ; puis Râtelier, Égide, Piles et PV max',
        'N’kuhana’s Opinion + Foreign Fruit + Gesture of the Drowned; then Rack, Aegis, Fuel Cells and max health',
      ),
    },
    items: [
      { id: 'novaonheal', core: true, role: L('×1 ou plus · un crâne par 10 % de PV max soignés', '×1 or more · one skull per 10% max health healed') },
      { id: 'fruit', core: true, role: L('×1 · soin de 50 % des PV max', '×1 · heals 50% of max health') },
      { id: 'autocastequipment', core: true, role: L('×1 · automatisation, recharge 45 s → 22,5 s', '×1 · automation, cooldown 45 s → 22.5 s') },
      { id: 'increasehealing', role: L('×1 · soins doublés, donc crânes doublés', '×1 · double healing, so double skulls') },
      { id: 'barrieronoverheal', role: L('×1 · 50 % du soin en trop devient barrière', '×1 · 50% of overhealing becomes barrier') },
      { id: 'equipmentmagazine', role: L('×4 · un fruit toutes les 12 s environ', '×4 · a fruit about every 12 s') },
      { id: 'infusion', role: L('×1 ou plus · PV max, donc crânes plus forts', '×1 or more · max health, so stronger skulls') },
      { id: 'knurl', role: L('Optionnel · PV max et régénération', 'Optional · max health and regen') },
      { id: 'healoncrit', role: L('Optionnel · soins entre deux fruits, si critiques', 'Optional · healing between fruits, with crits') },
      { id: 'seed', role: L('Optionnel · soin à chaque coup', 'Optional · heals on every hit') },
    ],
    synergies: [
      {
        items: ['fruit', 'novaonheal', 'increasehealing'],
        text: L(
          'Un fruit soigne 50 % des PV max : 5 crânes d’un coup, 10 avec le Râtelier. Chaque crâne inflige 250 % de dégâts de base plus environ 25 % de tes PV max.',
          'A fruit heals 50% of max health: 5 skulls at once, 10 with the Rack. Each skull deals 250% base damage plus about 25% of your max health.',
        ),
      },
      {
        items: ['fruit', 'barrieronoverheal'],
        text: L(
          'À pleine santé, le fruit n’est pas perdu : l’Égide en fait une barrière, et l’Opinion compte le soin quand même.',
          'At full health the fruit is not wasted: Aegis turns it into barrier, and the Opinion counts the heal anyway.',
        ),
      },
      {
        items: ['fruit', 'autocastequipment', 'equipmentmagazine'],
        text: L(
          '1 Signe : un fruit toutes les 22,5 s. Avec 4 Piles, environ 11,7 s.',
          '1 Gesture: a fruit every 22.5 s. With 4 Fuel Cells, about 11.7 s.',
        ),
      },
    ],
    howTo: [
      L(
        'Les crânes visent seuls dans un rayon de 40 m et grossissent avec tes PV max, pas avec tes dégâts : prends Infusion, Nœud titanesque et Perles plutôt que des objets offensifs.',
        'Skulls aim on their own within 40 m and scale with your max health, not your damage: take Infusion, Titanic Knurl and Pearls rather than offensive items.',
      ),
      L(
        'Tout soin compte, sauf la régénération naturelle : Faux du moissonneur, Graine sangsue et Dents de monstre remplissent l’intervalle entre deux fruits.',
        'All healing counts, except natural regen: Harvester’s Scythe, Leeching Seed and Monster Tooth fill the gap between fruits.',
      ),
      L(
        'Évite Transcendance (les soins deviennent presque inutiles) et la Fleur putride, qui étale tes soins dans le temps. Évite aussi la Cellule de Lysat, qui corrompt les Piles.',
        'Avoid Transcendence (healing becomes nearly useless) and Corpsebloom, which spreads your healing over time. Also avoid Lysate Cell, which corrupts Fuel Cells.',
      ),
    ],
    sources: [
      { label: 'N’kuhana’s Opinion', url: wiki('N%27kuhana%27s_Opinion') },
      { label: 'Rejuvenation Rack', url: wiki('Rejuvenation_Rack') },
      { label: 'Foreign Fruit', url: wiki('Foreign_Fruit') },
      { label: 'Gameplay.tips: item synergies', url: 'https://gameplay.tips/guides/6116-risk-of-rain-2.html' },
    ],
  },
  {
    slug: 'bleed-stacking',
    survivor: null,
    name: L('Hémorragie', 'Hemorrhage'),
    tagline: L('100 % de saignement, empilé sans limite.', '100% bleed, stacked without limit.'),
    tag: L('Fort avec les tirs rapides · sans DLC', 'Strong with fast attacks · no DLC'),
    summary: L(
      'Avec 100 % de chance de saignement, chaque coup ajoute une charge de 240 % de dégâts de base, et les charges se rafraîchissent entre elles : sur un boss, elles s’empilent sans limite. Aucun critique demandé.',
      'With a 100% bleed chance every hit adds a stack worth 240% base damage, and stacks refresh each other: on a boss they pile up without limit. No crits needed.',
    ),
    skills: {
      label: L('Assemblage', 'Set'),
      text: L(
        '10 Tri-dagues (ou moins avec l’Épine toxique et le Calice de sang) + vitesse d’attaque',
        '10 Tri-Tip Daggers (or fewer with Noxious Thorn and Sanguine Chalice) + attack speed',
      ),
    },
    items: [
      { id: 'bleedonhit', core: true, role: L('×10 · 10 % par exemplaire, 100 % à 10', '×10 · 10% per copy, 100% at 10') },
      { id: 'syringe', core: true, role: L('Plusieurs · plus de coups, plus de charges', 'Several · more hits, more stacks') },
      { id: 'triggerenemydebuffs', role: L('×1 · +10 % de saignement, propage à la mort · SotS', '×1 · +10% bleed, spreads on death · SotS') },
      { id: 'sanguinechalice', role: L('×1 · +10 %, le saignement te soigne · Hallowed Concepts', '×1 · +10%, bleed heals you · Hallowed Concepts') },
      { id: 'bleedonhitandexplode', role: L('×1 · les ennemis qui saignent explosent', '×1 · bleeding enemies explode') },
      { id: 'deathmark', role: L('Optionnel · le saignement est déjà 1 altération sur 4', 'Optional · bleed is already 1 debuff out of 4') },
      { id: 'nearbydamagebonus', role: L('Optionnel · +20 % à moins de 13 m, saignement compris', 'Optional · +20% within 13 m, bleed included') },
    ],
    synergies: [
      {
        items: ['bleedonhit', 'triggerenemydebuffs', 'sanguinechalice'],
        text: L(
          'Les trois chances s’additionnent en un seul tirage : 8 Tri-dagues + Épine + Calice font 100 %. La chance et la durée sont multipliées par le coefficient de proc du coup.',
          'The three chances add up into a single roll: 8 Tri-Tip Daggers + Thorn + Chalice make 100%. Chance and duration are multiplied by the hit’s proc coefficient.',
        ),
      },
      {
        items: ['sanguinechalice', 'bleedonhit'],
        text: L(
          'Le Calice soigne 0,5 % de tes PV max par tic, multiplié par le nombre de charges sur l’ennemi, 4 fois par seconde : avec 10 charges, 20 % de tes PV max par seconde.',
          'The Chalice heals 0.5% of your max health per tick, multiplied by the number of stacks on the enemy, 4 times a second: with 10 stacks, 20% of your max health a second.',
        ),
      },
      {
        items: ['triggerenemydebuffs', 'bleedonhit'],
        text: L(
          'Quand un ennemi meurt, l’Épine transfère un tiers de ses charges à un voisin : le saignement passe d’un ennemi à l’autre.',
          'When an enemy dies, the Thorn transfers a third of its stacks to a neighbour: the bleed jumps from one enemy to the next.',
        ),
      },
    ],
    howTo: [
      L(
        'Fait pour les attaques rapides à coefficient 1,0 : Commando, Chasseuse, POL-Y, Mercenaire. Une attaque lente pose trop peu de charges.',
        'Made for fast proc-1 attacks: Commando, Huntress, MUL-T, Mercenary. A slow attack applies too few stacks.',
      ),
      L(
        'Le saignement est en dégâts de BASE : il suit ton niveau, pas tes compétences, et brille sur les cibles qui vivent longtemps, donc les boss. Le Trèfle ne sert plus une fois à 100 %.',
        'Bleed is BASE damage: it follows your level, not your skills, and shines on targets that live long, so bosses. Clover does nothing once you reach 100%.',
      ),
      L(
        'Évite la Piqûre d’aiguille : elle corrompt toutes tes Tri-dagues. Le saignement de la Rate explosive, de l’Épine et du Calice, lui, reste.',
        'Avoid Needletick: it corrupts all your Tri-Tip Daggers. Bleed from Shatterspleen, the Thorn and the Chalice stays.',
      ),
    ],
    sources: [
      { label: 'Tri-Tip Dagger', url: wiki('Tri-Tip_Dagger') },
      { label: 'Noxious Thorn', url: wiki('Noxious_Thorn') },
      { label: 'Shatterspleen', url: wiki('Shatterspleen') },
      { label: 'GamersDecide: best builds', url: 'https://gamersdecide.com/articles/risk-of-rain-2-best-builds' },
    ],
  },
  {
    slug: 'sprint-is-damage',
    survivor: null,
    name: L('La vitesse tue', 'Speed kills'),
    tagline: L('Plus tu cours vite, plus tes objets frappent.', 'The faster you run, the harder your items hit.'),
    tag: L('Mobile · expérimental · AC', 'Mobile · experimental · AC'),
    summary: L(
      'Trois objets grossissent avec ta vitesse de déplacement : le Petit disciple tire plus vite, le Noyau abandonné frappe plus fort et l’Éperon Faraday se recharge en courant. Chaque Patte de chèvre devient un objet de dégâts.',
      'Three items scale with your movement speed: Little Disciple fires faster, Orphaned Core hits harder and Faraday Spur recharges as you run. Every Goat Hoof becomes a damage item.',
    ),
    skills: {
      label: L('Assemblage', 'Set'),
      text: L(
        'Petit disciple ou Noyau abandonné + objets de vitesse ; puis Éperon Faraday et Bouclier de la rose',
        'Little Disciple or Orphaned Core + speed items; then Faraday Spur and Rose Buckler',
      ),
    },
    items: [
      { id: 'sprintwisp', core: true, role: L('×1 ou plus · 300 % par feu follet, en sprint', '×1 or more · 300% per wisp, while sprinting') },
      { id: 'hoof', core: true, role: L('Plusieurs · vitesse, donc dégâts', 'Several · speed, so damage') },
      { id: 'sprintbonus', core: true, role: L('Plusieurs · +25 % de vitesse en sprint', 'Several · +25% sprint speed') },
      { id: 'physicsprojectile', role: L('×1 ou plus · 400 %, multiplié par sa vitesse · AC', '×1 or more · 400%, multiplied by its speed · AC') },
      { id: 'jumpdamagestrike', role: L('×1 · décharge de 400 % au saut, jusqu’à 32 m · AC', '×1 · 400% discharge on jump, up to 32 m · AC') },
      { id: 'sprintdamage', role: L('Optionnel · crâne à 300 % en sprint · Hallowed Concepts', 'Optional · 300% skull while sprinting · Hallowed Concepts') },
      { id: 'sprintarmor', role: L('×1 ou plus · +30 d’armure en sprint', '×1 or more · +30 armor while sprinting') },
      { id: 'attackspeedandmovespeed', role: L('Plusieurs · vitesse et cadence · SotV', 'Several · speed and attack speed · SotV') },
      { id: 'movespeedonkill', role: L('Optionnel · +125 % de vitesse par élimination · SotV', 'Optional · +125% speed per kill · SotV') },
    ],
    synergies: [
      {
        items: ['sprintwisp', 'hoof', 'sprintbonus'],
        text: L(
          'Le Petit disciple tire toutes les 1,6 s à la vitesse de base, environ toutes les 0,83 s à 14 m/s : doubler ta vitesse double presque sa cadence.',
          'Little Disciple fires every 1.6 s at base speed, about every 0.83 s at 14 m/s: doubling your speed nearly doubles its fire rate.',
        ),
      },
      {
        items: ['physicsprojectile', 'hoof', 'attackspeedandmovespeed'],
        text: L(
          'Le Noyau hérite de tes objets de vitesse (Patte de chèvre, Boisson énergisante, Moka) et multiplie ses dégâts par sa vitesse. Il ajoute 1 000 % en percutant un gros ennemi.',
          'The Core inherits your speed items (Goat Hoof, Energy Drink, Mocha) and multiplies its damage by its speed. It adds 1,000% when ramming a heavy enemy.',
        ),
      },
      {
        items: ['jumpdamagestrike', 'sprintwisp'],
        text: L(
          'L’Éperon se charge en bougeant et donne jusqu’à +160 % de vitesse, ce qui accélère aussi le Petit disciple. Sauter le vide : sa charge ne change que le rayon, pas les dégâts.',
          'The Spur charges as you move and gives up to +160% speed, which also speeds up Little Disciple. Jumping empties it: its charge only changes the radius, not the damage.',
        ),
      },
    ],
    howTo: [
      L(
        'Ne t’arrête jamais de sprinter : le Petit disciple et le Casque rituel ne tirent qu’en sprint. Les survivants qui attaquent en sprintant (Chasseuse, POL-Y) en profitent le plus.',
        'Never stop sprinting: Little Disciple and Ritual Helmet only fire while sprinting. Survivors that attack while sprinting (Huntress, MUL-T) get the most out of it.',
      ),
      L(
        'Build déduit des effets des objets, pas un classique de la communauté : garde une source de dégâts sûre à côté tant que tu ne l’as pas éprouvé.',
        'A build worked out from item effects, not a community classic: keep a safe damage source alongside until you have tried it.',
      ),
      L(
        'Évite la Spalière de flux rocailleux : elle divise ta vitesse par trois. Les tourelles de l’Ingénieur ne sprintent pas et ne profitent pas du Petit disciple.',
        'Avoid Stone Flux Pauldron: it cuts your speed to a third. Engineer’s turrets do not sprint and get nothing from Little Disciple.',
      ),
    ],
    sources: [
      { label: 'Little Disciple', url: wiki('Little_Disciple') },
      { label: 'Orphaned Core', url: wiki('Orphaned_Core') },
      { label: 'Faraday Spur', url: wiki('Faraday_Spur') },
    ],
  },
  {
    slug: 'permanent-gorag-opus',
    survivor: null,
    name: L('Frénésie permanente', 'Permanent frenzy'),
    tagline: L('+100 % de vitesse d’attaque pour toute l’équipe, sans pause.', '+100% attack speed for the whole team, nonstop.'),
    tag: L('Demande 8 Piles · fort en équipe', 'Needs 8 Fuel Cells · strong in a team'),
    summary: L(
      'L’Opus de Gorag donne +100 % de vitesse d’attaque et +50 % de vitesse à tous les alliés pendant 7 s, drones et tourelles compris. Avec le Signe du noyé et 8 Piles, la recharge passe sous ces 7 s : la frénésie ne s’arrête plus.',
      'Gorag’s Opus gives +100% attack speed and +50% movement speed to all allies for 7 s, drones and turrets included. With Gesture of the Drowned and 8 Fuel Cells the cooldown drops under those 7 s: the frenzy never stops.',
    ),
    skills: {
      label: L('Assemblage', 'Set'),
      text: L(
        'Opus de Gorag + Signe du noyé + 8 Piles ; Catalyseur spirituel et Cor de guerre en complément',
        'Gorag’s Opus + Gesture of the Drowned + 8 Fuel Cells; Soulbound Catalyst and War Horn on top',
      ),
    },
    items: [
      { id: 'teamwarcry', core: true, role: L('×1 · équipement requis, 7 s de frénésie', '×1 · required equipment, 7 s of frenzy') },
      { id: 'autocastequipment', core: true, role: L('×1 · automatisation, recharge 45 s → 22,5 s', '×1 · automation, cooldown 45 s → 22.5 s') },
      { id: 'equipmentmagazine', core: true, role: L('×8 · recharge d’environ 6,1 s : frénésie continue', '×8 · about 6.1 s cooldown: constant frenzy') },
      { id: 'talisman', role: L('×1 ou plus · −4 s par élimination, moins de Piles', '×1 or more · −4 s per kill, fewer Fuel Cells') },
      { id: 'energizedonequipmentuse', role: L('×1 · +70 % de vitesse d’attaque en plus, pour toi', '×1 · another +70% attack speed, for you') },
      { id: 'droneweapons', role: L('Optionnel · des drones qui profitent de la frénésie · SotV', 'Optional · drones that enjoy the frenzy · SotV') },
      { id: 'roboballbuddy', role: L('Optionnel · 2 sondes accélérées elles aussi', 'Optional · 2 probes, sped up as well') },
      { id: 'chainlightning', role: L('Optionnel · plus de coups, plus d’effets à l’impact', 'Optional · more hits, more on-hit effects') },
    ],
    synergies: [
      {
        items: ['teamwarcry', 'autocastequipment', 'equipmentmagazine'],
        text: L(
          'Recharge de 45 s : 22,5 s avec le Signe, environ 7,2 s avec 7 Piles, 6,1 s avec 8. Il en faut 8 pour passer sous les 7 s d’effet. Chaque Signe en plus compte comme une Pile.',
          '45 s cooldown: 22.5 s with Gesture, about 7.2 s with 7 Fuel Cells, 6.1 s with 8. You need 8 to get under the 7 s effect. Each extra Gesture counts as a Fuel Cell.',
        ),
      },
      {
        items: ['teamwarcry', 'energizedonequipmentuse'],
        text: L(
          'Le Cor de guerre dure 8 s par activation : dès que l’Opus part toutes les 8 s ou moins, tu cumules +100 % et +70 % en continu.',
          'War Horn lasts 8 s per activation: once the Opus fires every 8 s or less, you hold +100% and +70% at all times.',
        ),
      },
      {
        items: ['teamwarcry', 'droneweapons', 'roboballbuddy'],
        text: L(
          'La frénésie touche tous les alliés : chaque drone, sonde ou tourelle tire deux fois plus vite, pas seulement toi.',
          'The frenzy hits every ally: each drone, probe or turret fires twice as fast, not just you.',
        ),
      },
    ],
    howTo: [
      L(
        'Avant les 8 Piles, le build marche déjà par à-coups : 7 s de frénésie à chaque recharge. Le Catalyseur comble l’écart tant que tu tues.',
        'Before 8 Fuel Cells the build already works in bursts: 7 s of frenzy per cooldown. The Catalyst fills the gap as long as you are killing.',
      ),
      L(
        'Plus il y a d’alliés, plus il vaut : coopération, Ingénieur, Capitaine ou armée de drones. Seul et sans drones, préfère un équipement de dégâts.',
        'The more allies, the more it is worth: co-op, Engineer, Captain or a drone army. Alone with no drones, prefer a damage equipment.',
      ),
      L(
        'Ne prends pas la Spalière de berserker : son bonus ne s’ajoute pas à celui de l’Opus, le dernier activé remplace l’autre. Évite la Cellule de Lysat, qui corrompt les Piles.',
        'Skip Berzerker’s Pauldron: its buff does not add to the Opus, the last one activated replaces the other. Avoid Lysate Cell, which corrupts Fuel Cells.',
      ),
    ],
    sources: [
      { label: 'Gorag’s Opus', url: wiki('Gorag%27s_Opus') },
      { label: 'War Horn', url: wiki('War_Horn') },
      { label: 'TheGamer: best equipment for Gesture', url: 'https://www.thegamer.com/risk-rain-2-gesture-drowned-best-equipment-combo/' },
    ],
  },
  {
    slug: 'egocentrism-stacking',
    survivor: null,
    name: L('Égocentrisme', 'Egocentrism'),
    tagline: L('Laisser un objet manger tous les autres.', 'Let one item eat all the others.'),
    tag: L('Autonome · lunaire · SotV', 'Hands-free · lunar · SotV'),
    summary: L(
      'Toutes les 60 s, l’Égocentrisme transforme un de tes objets en un exemplaire de lui-même. Chaque exemplaire raccourcit le délai entre deux bombes à 360 % : à 20 exemplaires, une bombe toutes les 0,15 s, sans viser ni tirer.',
      'Every 60 s, Egocentrism turns one of your items into a copy of itself. Each copy shortens the time between 360% bombs: at 20 copies, one bomb every 0.15 s, with no aiming or shooting.',
    ),
    skills: {
      label: L('Assemblage', 'Set'),
      text: L(
        'Égocentrisme, le plus tôt possible ; puis de quoi survivre au contact pendant qu’il grossit',
        'Egocentrism, as early as possible; then enough to survive up close while it grows',
      ),
    },
    items: [
      { id: 'lunarsun', core: true, role: L('×1 pour démarrer · +1 par minute, tout seul', '×1 to start · +1 a minute, on its own') },
      { id: 'nearbydamagebonus', role: L('Plusieurs · +20 % à moins de 13 m, où tes bombes frappent', 'Several · +20% within 13 m, where your bombs hit') },
      { id: 'lunardagger', role: L('×1 · dégâts de base doublés, PV max divisés par 2', '×1 · double base damage, half max health') },
      { id: 'missile', role: L('Optionnel · les bombes (coefficient 1,0) le déclenchent', 'Optional · bombs (proc 1.0) set it off') },
      { id: 'chainlightning', role: L('Optionnel · idem, contre les groupes', 'Optional · same, against groups') },
      { id: 'hoof', role: L('Plusieurs · aller chercher les ennemis', 'Several · get to the enemies') },
      { id: 'bear', role: L('Plusieurs · tu joues près des ennemis', 'Several · you play close to enemies') },
    ],
    synergies: [
      {
        items: ['lunarsun'],
        text: L(
          'Le délai entre deux bombes vaut 3 s divisé par ton nombre d’exemplaires, et tu en stockes 3, +1 par exemplaire. Les bombes traversent le décor.',
          'The time between bombs is 3 s divided by your number of copies, and you hold 3, +1 per copy. Bombs go through terrain.',
        ),
      },
      {
        items: ['lunarsun', 'missile', 'chainlightning'],
        text: L(
          'Chaque bombe a un coefficient de 1,0 : elle déclenche tes effets à l’impact comme un tir. Mais ces objets finiront convertis à leur tour.',
          'Each bomb has a 1.0 proc coefficient: it sets off your on-hit effects like a shot would. But those items will end up converted too.',
        ),
      },
      {
        items: ['lunarsun', 'nearbydamagebonus'],
        text: L(
          'Les bombes tournent autour de toi et frappent à courte portée : le Cristal de concentration s’applique presque toujours.',
          'Bombs orbit you and hit at short range: Focus Crystal almost always applies.',
        ),
      },
    ],
    howTo: [
      L(
        'L’objet converti est tiré au hasard parmi tes types d’objets, quel que soit le nombre d’exemplaires : un objet unique (un rouge) a autant de chances d’y passer qu’une pile de 10 Seringues.',
        'The converted item is picked at random among your item types, whatever the stack size: a single item (a red) is as likely to go as a stack of 10 Syringes.',
      ),
      L(
        'Ne le prends donc pas sur un build qui tient à un objet précis (Trèfle, Signe du noyé). Il brille sur les survivants à faible cadence ou quand ton build n’a pas encore pris.',
        'So do not take it on a build that hangs on one specific item (Clover, Gesture of the Drowned). It shines on slow-firing survivors or when your build has not come together yet.',
      ),
      L(
        'Continue à ramasser tout ce que tu trouves : chaque objet, même inutile, est un futur exemplaire. Les objets sans rareté ne sont pas convertis.',
        'Keep picking up everything: every item, even a useless one, is a future copy. Items with no rarity are not converted.',
      ),
    ],
    sources: [
      { label: 'Egocentrism', url: wiki('Egocentrism') },
      { label: 'GamersDecide: best builds', url: 'https://gamersdecide.com/articles/risk-of-rain-2-best-builds' },
    ],
  },
  {
    slug: 'transcendence-shield',
    survivor: null,
    name: L('Tout en bouclier', 'All shield'),
    tagline: L('Plus de vie à soigner : un bouclier qui revient seul.', 'No health to heal: a shield that comes back by itself.'),
    tag: L('Lunaire · Crevettes : SotV', 'Lunar · Shrimp: SotV'),
    summary: L(
      'Transcendance change toute ta vie en bouclier (+50 % de PV max) qui se recharge en entier après 7 s sans dégâts. Les Crevettes de plasma tirent tant qu’il te reste du bouclier : ici, c’est jusqu’à ton dernier point de vie.',
      'Transcendence turns all your health into shield (+50% max health) that fully recharges after 7 s without damage. Plasma Shrimp fires while you have any shield left: here, that means down to your last point of health.',
    ),
    skills: {
      label: L('Assemblage', 'Set'),
      text: L(
        'Transcendance + Crevettes de plasma ; puis Générateurs de bouclier, Stabilisateur cinétique et Égide',
        'Transcendence + Plasma Shrimp; then Shield Generators, Kinetic Dampener and Aegis',
      ),
    },
    items: [
      { id: 'shieldonly', core: true, role: L('×1 · tout en bouclier, +50 % de PV max', '×1 · all shield, +50% max health') },
      { id: 'missilevoid', core: true, role: L('×1 ou plus · un missile par impact, sans tirage · SotV', '×1 or more · one missile per hit, no roll · SotV') },
      { id: 'personalshield', role: L('Plusieurs · +8 % de bouclier par exemplaire', 'Several · +8% shield per copy') },
      { id: 'shieldbooster', role: L('×1 ou plus · +30 d’armure tant que tu as du bouclier · AC', '×1 or more · +30 armor while you have shield · AC') },
      { id: 'barrieronoverheal', role: L('×1 · rend tes soins utiles : 50 % en barrière', '×1 · makes healing useful: 50% as barrier') },
      { id: 'moremissile', role: L('×1 · triple les missiles des Crevettes · SotV', '×1 · triples the Shrimp’s missiles · SotV') },
      { id: 'bearvoid', role: L('×1 ou plus · un coup bloqué ne coûte pas de bouclier · SotV', '×1 or more · a blocked hit costs no shield · SotV') },
      { id: 'armorplate', role: L('Plusieurs · petits coups presque annulés', 'Several · small hits nearly cancelled') },
      { id: 'infusion', role: L('Optionnel · PV max, donc bouclier', 'Optional · max health, so shield') },
    ],
    synergies: [
      {
        items: ['shieldonly', 'missilevoid'],
        text: L(
          'Sans Transcendance, les Crevettes s’arrêtent dès que ton petit bouclier casse. Avec, toute ta barre est du bouclier : les missiles ne s’arrêtent qu’à 1 PV.',
          'Without Transcendence the Shrimp stop as soon as your small shield breaks. With it your whole bar is shield: missiles only stop at 1 health.',
        ),
      },
      {
        items: ['shieldonly', 'shieldbooster'],
        text: L(
          'Le Stabilisateur donne +30 d’armure tant qu’il reste du bouclier, donc presque tout le temps. Si le bouclier tombe à zéro, il lâche une onde égale à 100 % de ton bouclier max dans 12,5 m.',
          'The Dampener gives +30 armor while any shield is left, so nearly always. If the shield hits zero, it releases a pulse worth 100% of your max shield within 12.5 m.',
        ),
      },
      {
        items: ['shieldonly', 'barrieronoverheal'],
        text: L(
          'Avec 1 seul PV de vie, tout soin est du soin en trop : l’Égide en change la moitié en barrière. C’est la seule façon de rendre tes soins utiles.',
          'With only 1 point of health every heal is overhealing: Aegis turns half of it into barrier. It is the only way to make your healing useful.',
        ),
      },
    ],
    howTo: [
      L(
        'Le bouclier ne revient qu’après 7 s sans dégâts, puis se remplit en 2 s : tu joues par allers-retours, pas en échange continu. Les dégâts sur la durée repoussent la recharge.',
        'Shield only comes back after 7 s without damage, then refills in 2 s: you play in and out, not in a constant trade. Damage over time delays the recharge.',
      ),
      L(
        'Ne prends plus de soins (Faux, Graine, Champignon) sauf si tu as l’Égide. Mets tout en PV max, armure et mobilité pour rompre le combat.',
        'Stop taking healing (Scythe, Seed, Fungus) unless you have Aegis. Put everything into max health, armor and mobility to break off fights.',
      ),
      L(
        'Les Crevettes corrompent tes Missiles air-sol. Évite le Verre profilé : il réduit aussi ton bouclier.',
        'Plasma Shrimp corrupts your AtG Missiles. Avoid Shaped Glass: it shrinks your shield too.',
      ),
    ],
    sources: [
      { label: 'Transcendence', url: wiki('Transcendence') },
      { label: 'Plasma Shrimp', url: wiki('Plasma_Shrimp') },
      { label: 'Kinetic Dampener', url: wiki('Kinetic_Dampener') },
      { label: 'Gameplay.tips: item synergies', url: 'https://gameplay.tips/guides/6116-risk-of-rain-2.html' },
    ],
  },

  // ------------------------------------------------------------ Commando
  {
    slug: 'commando-double-tap-procs',
    survivor: 'commando',
    name: L('Rafale d’effets', 'Proc storm'),
    tagline: L('Chaque balle du Coup double déclenche tes objets.', 'Every Double Tap bullet sets off your items.'),
    tag: L('Facile · sans DLC', 'Easy · no DLC'),
    summary: L(
      'Le Coup double tire très vite avec un coefficient de 1,0 : c’est l’une des meilleures attaques du jeu pour les effets à l’impact. Monte la cadence, empile les effets à l’impact et garde de la mobilité.',
      'Double Tap fires very fast with a 1.0 proc coefficient: one of the best attacks in the game for on-hit effects. Raise attack speed, stack on-hit effects and keep some mobility.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Coup double · Munitions phasiques · Glissade tactique · Tir de suppression',
        'Double Tap · Phase Round · Tactical Slide · Suppressive Fire',
      ),
    },
    items: [
      { id: 'syringe', core: true, role: L('×3 ou plus · cadence et balles du Tir de suppression', '×3 or more · fire rate and Suppressive Fire bullets') },
      { id: 'chainlightning', core: true, role: L('×1 ou plus · nettoie les groupes', '×1 or more · clears groups') },
      { id: 'missile', role: L('×1 ou plus · dégâts sur cible unique', '×1 or more · single-target damage') },
      { id: 'bleedonhit', role: L('×3 ou plus · saignement presque permanent', '×3 or more · near-constant bleed') },
      { id: 'armorreductiononhit', role: L('×1 · contre les boss', '×1 · against bosses') },
      { id: 'seed', role: L('×1 ou plus · soin à chaque balle', '×1 or more · heals on every bullet') },
      { id: 'attackspeedoncrit', role: L('Optionnel · si tu as des critiques', 'Optional · if you have crits') },
      { id: 'hoof', role: L('Plusieurs · le Commando bouge peu', 'Several · Commando lacks mobility') },
    ],
    synergies: [
      {
        items: ['syringe', 'attackspeedoncrit'],
        text: L(
          'Le nombre de balles du Tir de suppression est fixé au lancement : les critiques pendant la rafale n’en ajoutent pas. Monte d’abord les Instincts avec le Coup double, puis lance-le.',
          'Suppressive Fire’s bullet count is set when you start it: crits during the burst add none. Build Instincts up with Double Tap first, then use it.',
        ),
      },
      {
        items: ['armorreductiononhit'],
        text: L(
          'Il faut 5 coups pour briser l’armure : le Coup double les enchaîne en un instant, même sur un boss.',
          'It takes 5 hits to shred armor: Double Tap lands them in an instant, even on a boss.',
        ),
      },
    ],
    howTo: [
      L(
        'Tire en glissant : la Glissade tactique se lance en sprint et te laisse tirer pendant le mouvement.',
        'Shoot while sliding: Tactical Slide works while sprinting and lets you keep firing as you move.',
      ),
      L(
        'Le Tir de suppression étourdit : garde-le pour les ennemis dangereux. Les Munitions phasiques traversent les murs et gagnent des dégâts à chaque ennemi transpercé.',
        'Suppressive Fire stuns: keep it for dangerous enemies. Phase Round goes through walls and gains damage for each enemy it pierces.',
      ),
      L(
        'Le Tir phasique (fusil) est une bonne variante au corps à corps. Avec Survivors of the Void, le Polyluth et les Crevettes de plasma vont aussi très bien.',
        'Phase Blast (shotgun) is a good close-range variant. With Survivors of the Void, Polylute and Plasma Shrimp also fit well.',
      ),
    ],
    sources: [
      { label: 'Commando', url: wiki('Commando') },
      { label: 'Predatory Instincts', url: wiki('Predatory_Instincts') },
      { label: 'Nerd Lodge: Commando guide', url: 'https://nerdlodge.com/risk-of-rain-2-commando-guide/' },
    ],
  },
  {
    slug: 'commando-phase-bands',
    survivor: 'commando',
    name: L('Grenades + bracelets', 'Grenades + bands'),
    tagline: L('De gros coups pour réveiller les bracelets.', 'Big hits to wake the bands up.'),
    tag: L('Contre les boss · sans DLC', 'Boss killer · no DLC'),
    summary: L(
      'Le Commando a deux coups qui dépassent le seuil des bracelets : les Munitions phasiques qui transpercent et la Grenade à fragmentation. Le Coup double s’occupe du reste.',
      'Commando has two hits that pass the bands’ threshold: a piercing Phase Round and Frag Grenade. Double Tap handles the rest.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Coup double · Munitions phasiques · Glissade tactique · Grenade à fragmentation',
        'Double Tap · Phase Round · Tactical Slide · Frag Grenade',
      ),
    },
    items: [
      { id: 'icering', core: true, role: L('×1 ou plus · dégâts sur cible unique', '×1 or more · single-target damage') },
      { id: 'firering', core: true, role: L('×1 ou plus · dégâts de zone', '×1 or more · area damage') },
      { id: 'secondaryskillmagazine', role: L('×2 ou plus · plus de Munitions phasiques', '×2 or more · more Phase Rounds') },
      { id: 'alienhead', role: L('×1 · grenades plus souvent', '×1 · grenades more often') },
      { id: 'bandolier', role: L('×1 ou plus · recharges remises à zéro', '×1 or more · cooldown resets') },
      { id: 'syringe', role: L('Plusieurs · Coup double entre deux gros coups', 'Several · Double Tap between big hits') },
      { id: 'hoof', role: L('Plusieurs · mobilité', 'Several · mobility') },
    ],
    synergies: [
      {
        items: ['icering', 'firering'],
        text: L(
          'Munitions phasiques : 300 % sur le premier ennemi, +40 % à chaque traversée. Elles déclenchent les bracelets à partir du 2e ennemi touché. Les critiques ne comptent pas pour le seuil.',
          'Phase Round: 300% on the first enemy, +40% per enemy pierced. It sets off the bands from the 2nd enemy hit. Crits do not count toward the threshold.',
        ),
      },
      {
        items: ['icering', 'firering'],
        text: L(
          'La grenade (700 %) ne fait ses pleins dégâts qu’au centre de l’explosion : vise la cible directement pour déclencher les bracelets.',
          'Frag Grenade (700%) only deals full damage at the center of the blast: aim straight at the target to set off the bands.',
        ),
      },
      {
        items: ['secondaryskillmagazine', 'icering', 'firering'],
        text: L(
          'Les deux bracelets partagent une recharge de 10 s : les charges en plus ajoutent des dégâts, pas des déclenchements.',
          'Both bands share one 10 s cooldown: extra charges add damage, not extra triggers.',
        ),
      },
    ],
    howTo: [
      L(
        'Aligne les ennemis avant de tirer les Munitions phasiques : plus elles transpercent, plus elles frappent fort. Elles passent aussi à travers les murs.',
        'Line enemies up before firing Phase Round: the more it pierces, the harder it hits. It also goes through walls.',
      ),
      L(
        'Contre un boss seul, ouvre avec une grenade bien placée quand les bracelets sont prêts, puis enchaîne au Coup double.',
        'Against a lone boss, open with a well-placed grenade when the bands are ready, then keep up Double Tap.',
      ),
      L(
        'Avec Survivors of the Void, le Bracelet de singularité remplace les deux bracelets : ne le prends que si tu veux regrouper les ennemis.',
        'With Survivors of the Void, Singularity Band replaces both bands: only take it if you want to pull enemies together.',
      ),
    ],
    sources: [
      { label: 'Commando', url: wiki('Commando') },
      { label: 'Runald’s Band', url: wiki('Runald%27s_Band') },
      { label: 'Kjaro’s Band', url: wiki('Kjaro%27s_Band') },
    ],
  },

  // ------------------------------------------------------------ Huntress
  {
    slug: 'huntress-flurry-crits',
    survivor: 'huntress',
    name: L('Volée critique', 'Critical Flurry'),
    tagline: L('Une volée critique, c’est 6 flèches au lieu de 3.', 'A critical Flurry fires 6 arrows instead of 3.'),
    tag: L('Fort une fois lancé · Visée laser : SotV', 'Strong once rolling · Laser Scope: SotV'),
    summary: L(
      'Volée devient l’attaque la plus forte de la Chasseuse quand elle critique souvent. Les Lunettes viennent en premier, puis les effets sur critique accélèrent et soignent.',
      'Flurry becomes Huntress’s strongest attack once she crits often. Glasses come first, then on-crit effects speed her up and heal her.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L('Volée · Glaive laser · Flash · Baliste', 'Flurry · Laser Glaive · Blink · Ballista'),
    },
    items: [
      { id: 'critglasses', core: true, role: L('Jusqu’à 9 · avec la Faux et les Instincts', 'Up to 9 · with the Scythe and Instincts') },
      { id: 'attackspeedoncrit', core: true, role: L('×1 ou plus · cadence', '×1 or more · attack speed') },
      { id: 'healoncrit', core: true, role: L('×1 ou plus · soin à chaque flèche critique', '×1 or more · heals on every crit arrow') },
      { id: 'critdamage', role: L('×1 · chaque flèche critique frappe à ×3', '×1 · every crit arrow hits for ×3') },
      { id: 'bleedonhitandexplode', role: L('Optionnel · saignement sur critique', 'Optional · bleed on crit') },
      { id: 'hoof', role: L('Plusieurs · rester en mouvement', 'Several · keep moving') },
      { id: 'feather', role: L('×1 ou plus · esquive verticale', '×1 or more · vertical dodge') },
    ],
    synergies: [
      {
        items: ['critglasses'],
        text: L(
          'Volée tire le critique une fois avant la volée : réussi, elle lance 6 flèches critiques au lieu de 3, soit environ 4× les dégâts.',
          'Flurry rolls crit once before firing: on a crit it shoots 6 critical arrows instead of 3, about 4× the damage.',
        ),
      },
      {
        items: ['attackspeedoncrit', 'healoncrit'],
        text: L(
          'Les flèches de Volée ont un coefficient de 0,7 : le bonus des Instincts dure moins longtemps et la Faux soigne moins par flèche. Les 6 flèches d’une volée critique compensent.',
          'Flurry arrows have a 0.7 proc coefficient: the Instincts buff lasts shorter and the Scythe heals less per arrow. The 6 arrows of a critical volley make up for it.',
        ),
      },
    ],
    howTo: [
      L(
        'Avec peu de critiques, Volée est plus faible que Pas de côté. Prends les Lunettes en priorité ; sans elles, joue plutôt l’autre build.',
        'With little crit chance, Flurry is weaker than Strafe. Grab Glasses first; without them, play the other build instead.',
      ),
      L(
        'Volée se tire en sprintant : ne t’arrête jamais. Garde Flash pour esquiver les attaques de boss.',
        'Flurry can be fired while sprinting: never stop. Keep Blink to dodge boss attacks.',
      ),
      L(
        'Baliste (3 tirs de 900 %) est la meilleure option contre les boss ; Pluie de flèches sert surtout contre les foules. Évite les Verres du voyant perdu, qui remplacent tes Lunettes.',
        'Ballista (3 × 900% shots) is the best pick against bosses; Arrow Rain is mostly for crowds. Avoid Lost Seer’s Lenses, which replace your Glasses.',
      ),
    ],
    sources: [
      { label: 'Huntress', url: wiki('Huntress') },
      { label: 'Harvester’s Scythe', url: wiki('Harvester%27s_Scythe') },
      { label: 'Steam: huntress help (2023)', url: 'https://steamcommunity.com/app/632360/discussions/0/3801652929329887051' },
    ],
  },
  {
    slug: 'huntress-strafe-sprint',
    survivor: 'huntress',
    name: L('Tir en sprint', 'Sprint shooter'),
    tagline: L('Tirer sans jamais ralentir.', 'Shoot without ever slowing down.'),
    tag: L('Fiable · sans DLC', 'Reliable · no DLC'),
    summary: L(
      'Pas de côté vise tout seul et se tire en sprintant, avec un coefficient de 1,0. Tu cours en permanence, l’armure du sprint reste active et les effets à l’impact font le reste.',
      'Strafe aims itself and fires while sprinting, with a 1.0 proc coefficient. You run all the time, sprint armor stays up and on-hit effects do the rest.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Pas de côté · Glaive laser · Flash (ou Flash phasique) · Baliste',
        'Strafe · Laser Glaive · Blink (or Phase Blink) · Ballista',
      ),
    },
    items: [
      { id: 'sprintarmor', core: true, role: L('×2 ou plus · armure en tirant', '×2 or more · armor while shooting') },
      { id: 'syringe', core: true, role: L('×3 ou plus · plus de flèches', '×3 or more · more arrows') },
      { id: 'chainlightning', role: L('×1 ou plus · nettoie les groupes', '×1 or more · clears groups') },
      { id: 'missile', role: L('×1 ou plus · dégâts sur cible unique', '×1 or more · single-target damage') },
      { id: 'secondaryskillmagazine', role: L('×1 ou plus · plus de glaives', '×1 or more · more glaives') },
      { id: 'utilityskillmagazine', role: L('×1 · triple Flash', '×1 · triple Blink') },
      { id: 'hoof', role: L('Plusieurs · vitesse', 'Several · speed') },
    ],
    synergies: [
      {
        items: ['sprintarmor'],
        text: L(
          'Pas de côté, Volée et Glaive laser ne coupent pas le sprint : l’armure du Bouclier de la rose reste active pendant que tu attaques.',
          'Strafe, Flurry and Laser Glaive do not break your sprint: Rose Buckler’s armor stays on while you attack.',
        ),
      },
      {
        items: ['chainlightning', 'missile'],
        text: L(
          'Pas de côté a un coefficient de 1,0, contre 0,7 pour Volée : sans critiques, chaque flèche déclenche mieux l’Ukulélé et les missiles.',
          'Strafe has a 1.0 proc coefficient, against 0.7 for Flurry: without crits, every arrow triggers Ukulele and missiles more often.',
        ),
      },
      {
        items: ['utilityskillmagazine'],
        text: L(
          '+2 charges de Flash et une recharge plus courte : de quoi traverser une arène ou sortir de n’importe quel piège.',
          '+2 Blink charges and a shorter cooldown: enough to cross an arena or escape any trap.',
        ),
      },
    ],
    howTo: [
      L(
        'Les flèches de Pas de côté visent l’ennemi le plus proche et contournent les obstacles : concentre-toi sur tes déplacements.',
        'Strafe arrows lock onto the nearest enemy and curve around cover: focus on your movement.',
      ),
      L(
        'Baliste te téléporte en arrière dans les airs pour 3 tirs puissants : garde-la pour les boss du téléporteur.',
        'Ballista teleports you back into the air for 3 powerful shots: save it for teleporter bosses.',
      ),
      L(
        'La Chasseuse est fragile : prends tôt des Pattes de chèvre et une Plume d’Hopoo plutôt que des dégâts en plus.',
        'Huntress is fragile: grab Goat Hooves and a Hopoo Feather early rather than more damage.',
      ),
    ],
    sources: [
      { label: 'Huntress', url: wiki('Huntress') },
      { label: 'Rose Buckler', url: wiki('Rose_Buckler') },
      { label: 'Steam: huntress help (2023)', url: 'https://steamcommunity.com/app/632360/discussions/0/3801652929329887051' },
    ],
  },

  // ------------------------------------------------------------ Bandit
  {
    slug: 'bandit-desperado-bands',
    survivor: 'bandit',
    name: L('Desperado + bracelets', 'Desperado + bands'),
    tagline: L('Un revolver taillé pour les boss.', 'A revolver made for bosses.'),
    tag: L('Gros dégâts · Desperado', 'Big damage · Desperado'),
    summary: L(
      'Accumule les éliminations au revolver en ouvrant les coffres, puis vide ces dégâts accumulés et les bracelets sur les grandes cibles.',
      'Stack revolver kills while looting, then unload that stored damage and your bands on big targets.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Mitraille · Dague dentelée ou Surin dentelé · Bombe fumigène · Desperado',
        'Burst · Serrated Dagger or Serrated Shiv · Smoke Bomb · Desperado',
      ),
    },
    items: [
      { id: 'icering', core: true, role: L('×1 ou plus · grossit avec le tir', '×1 or more · scales with the shot') },
      { id: 'firering', core: true, role: L('×1 ou plus · part avec Runald', '×1 or more · fires with Runald’s') },
      { id: 'crowbar', role: L('Plusieurs · +75 % sur les cibles à plus de 90 % PV', 'Several · +75% on targets above 90% health') },
      { id: 'nearbydamagebonus', role: L('Plusieurs · +20 % à moins de 13 m', 'Several · +20% within 13 m') },
      { id: 'fragiledamagebonus', role: L('Plusieurs · +20 %, casse sous 25 % PV · SotV', 'Several · +20%, breaks under 25% health · SotV') },
      { id: 'critdamage', role: L('×1 ou plus · critiques ×3 · SotV', '×1 or more · crits ×3 · SotV') },
    ],
    synergies: [
      {
        items: ['icering', 'firering'],
        text: L(
          'Le tir de Desperado (600 %) passe toujours le seuil de 400 % des bracelets. Leurs dégâts sont TOTAUX : ils grossissent avec tes jetons.',
          'The Desperado shot (600%) always clears the bands’ 400% threshold. Their damage is TOTAL: it grows with your tokens.',
        ),
      },
      {
        items: ['crowbar', 'critdamage'],
        text: L(
          'Les attaques dans le dos sont toujours critiques : le Pied-de-biche et la Visée laser font un premier tir énorme.',
          'Backstabs always crit: Crowbar and Laser Scope make a huge opening shot.',
        ),
      },
    ],
    howTo: [
      L(
        'Achève les ennemis au revolver : chaque élimination donne un jeton (+10 % de dégâts au Desperado), et les dégâts grimpent encore sur les cibles affaiblies.',
        'Finish enemies with the revolver: each kill gives a token (+10% Desperado damage), and damage climbs further on weakened targets.',
      ),
      L('Les jetons de Desperado disparaissent à chaque nouvel étage : les boss de fin d’étage en profitent le plus.', 'Desperado tokens reset on every new stage: end-of-stage bosses get the most out of them.'),
    ],
    sources: [
      { label: 'Bandit', url: wiki('Bandit') },
      { label: 'Kjaro’s Band', url: wiki('Kjaro%27s_Band') },
      { label: 'Rogue Ranker: Bandit', url: 'https://rogueranker.com/risk-of-rain-2-bandit/' },
    ],
  },
  {
    slug: 'bandit-shotgun-crits',
    survivor: 'bandit',
    name: L('Fusil + critiques', 'Shotgun + crits'),
    tagline: L('Chaque plomb profite du dos adverse.', 'Every pellet loves a backstab.'),
    tag: L('Souple · Extinction des feux ou Desperado', 'Flexible · Lights Out or Desperado'),
    summary: L(
      'Dans le dos, les 5 plombs de la Mitraille sont tous critiques : ils alimentent la vitesse d’attaque, les soins et le saignement.',
      'From behind, all 5 pellets of Burst crit: they feed attack speed, healing and bleed.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Mitraille · Dague dentelée · Bombe fumigène · Extinction des feux (réinitialise les recharges) ou Desperado',
        'Burst · Serrated Dagger · Smoke Bomb · Lights Out (resets cooldowns) or Desperado',
      ),
    },
    items: [
      { id: 'attackspeedoncrit', core: true, role: L('×1 ou plus · cadence sur critique', '×1 or more · attack speed on crit') },
      { id: 'healoncrit', core: true, role: L('×1 ou plus · soin sur critique', '×1 or more · heal on crit') },
      { id: 'bleedonhitandexplode', role: L('Bonus de boss · les cibles qui saignent explosent', 'Boss bonus · bleeding targets explode') },
      { id: 'critdamage', role: L('×1 ou plus · critiques ×3 · SotV', '×1 or more · crits ×3 · SotV') },
      { id: 'hoof', role: L('Mobilité · passer dans le dos', 'Mobility · get behind targets') },
      { id: 'feather', role: L('Mobilité · passer dans le dos', 'Mobility · get behind targets') },
    ],
    synergies: [
      {
        items: ['attackspeedoncrit', 'healoncrit'],
        text: L(
          'Chaque plomb a un coefficient de proc de 0,5 : il soigne à moitié avec la Faux et donne 1,5 s de bonus aux Instincts. Avec 5 plombs critiques par tir, ça s’additionne vite.',
          'Each pellet has a 0.5 proc coefficient: it heals at half value with the Scythe and gives a 1.5 s Instincts buff. With 5 critting pellets per shot, it adds up fast.',
        ),
      },
    ],
    howTo: [
      L(
        'Avec Extinction des feux, une élimination au revolver réinitialise toutes tes recharges : Dague, Bombe et revolver reviennent aussitôt.',
        'With Lights Out, a revolver kill resets all your cooldowns: Dagger, Smoke Bomb and revolver come back at once.',
      ),
      L(
        'La Dague dentelée dans le dos est critique, donc applique l’hémorragie. La Rate explosive n’est pas nécessaire au build.',
        'Serrated Dagger from behind crits, so it applies hemorrhage. Shatterspleen is not needed for the build to work.',
      ),
    ],
    sources: [
      { label: 'Bandit', url: wiki('Bandit') },
      { label: 'Predatory Instincts', url: wiki('Predatory_Instincts') },
      { label: 'Harvester’s Scythe', url: wiki('Harvester%27s_Scythe') },
    ],
  },
  {
    slug: 'bandit-desperado-purity',
    survivor: 'bandit',
    name: L('Desperado + Pureté', 'Desperado + Purity'),
    tagline: L('Revenir plus vite au revolver.', 'Back to the revolver sooner.'),
    tag: L('Spécialisé · lunaire', 'Niche · lunar'),
    summary: L(
      'Pureté retire 2 s à chaque recharge : le revolver revient deux fois plus vite. Favorise les dégâts directs et les effets garantis, que la malchance ne touche pas.',
      'Purity cuts 2 s from every cooldown: the revolver comes back twice as fast. Favour direct damage and guaranteed effects, which bad luck does not touch.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L('Mitraille · Dague dentelée · Bombe fumigène · Desperado', 'Burst · Serrated Dagger · Smoke Bomb · Desperado'),
    },
    items: [
      { id: 'lunarbadluck', core: true, role: L('×1 ou plus · −2 s par recharge (+1 s par cumul)', '×1 or more · −2 s per cooldown (+1 s per stack)') },
      { id: 'icering', core: true, role: L('×1 ou plus · sans jet de chance', '×1 or more · no luck roll') },
      { id: 'firering', role: L('×1 ou plus · part avec Runald', '×1 or more · fires with Runald’s') },
      { id: 'crowbar', role: L('Plusieurs · premier tir renforcé', 'Several · stronger opening shot') },
      { id: 'critdamage', role: L('×1 ou plus · critiques ×3 · SotV', '×1 or more · crits ×3 · SotV') },
      { id: 'hoof', role: L('Mobilité · passer dans le dos', 'Mobility · get behind targets') },
    ],
    synergies: [
      {
        items: ['lunarbadluck', 'icering', 'firering'],
        text: L(
          'Les bracelets ne dépendent pas de la chance : Pureté ne les gêne pas. Desperado et Dague passent de 4 s à 2 s de recharge, la Bombe de 6 s à 4 s ; les bracelets gardent leurs 10 s.',
          'The bands do not rely on luck: Purity does not hurt them. Desperado and Dagger go from 4 s to 2 s of cooldown, Smoke Bomb from 6 s to 4 s; the bands keep their 10 s.',
        ),
      },
      {
        items: ['lunarbadluck', 'critdamage'],
        text: L(
          'Pureté réduit tes chances de critique, mais pas les critiques garantis dans le dos : la Visée laser garde toute sa valeur.',
          'Purity lowers your crit chance, but not guaranteed backstab crits: Laser Scope keeps its full value.',
        ),
      },
    ],
    howTo: [
      L(
        'Pureté rend les effets aléatoires moins fiables (Ukulélé, Missile air-sol…) : réserve-la aux parties centrées sur les compétences. Une recharge ne descend pas sous 0,5 s.',
        'Purity makes random effects less reliable (Ukulele, AtG Missile…): keep it for skill-focused runs. A cooldown cannot go below 0.5 s.',
      ),
      L('Les jetons de Desperado se réinitialisent à chaque étage.', 'Desperado tokens reset on every stage.'),
    ],
    sources: [
      { label: 'Purity', url: wiki('Purity') },
      { label: 'Bandit', url: wiki('Bandit') },
      { label: 'Rogue Ranker: Bandit', url: 'https://rogueranker.com/risk-of-rain-2-bandit/' },
    ],
  },

  // ------------------------------------------------------------ MUL-T
  {
    slug: 'mult-power-mode-procs',
    survivor: 'mult',
    name: L('Mode Puissance à l’impact', 'Power Mode on-hit'),
    tagline: L('Deux armes à la fois, deux fois plus d’effets.', 'Two weapons at once, twice the on-hit effects.'),
    tag: L('Jeu de base (Moka : SotV) · Mode Puissance', 'Base game (Mocha: SotV) · Power Mode'),
    summary: L(
      'En Mode Puissance, POL-Y utilise la Scie électrique et le Pistolet à clous auto en même temps : environ deux fois plus de dégâts et d’effets à l’impact, avec 100 d’armure en plus mais 60 % de vitesse en moins.',
      'In Power Mode, MUL-T uses Power-Saw and Auto-Nailgun at the same time: roughly double the damage and on-hit effects, with 100 extra armor but 60% less movement speed.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Scie électrique + Pistolet à clous auto · Grenade explosive · Mode transport · Mode Puissance',
        'Power-Saw + Auto-Nailgun · Blast Canister · Transport Mode · Power Mode',
      ),
    },
    items: [
      { id: 'seed', core: true, role: L('×2 ou plus · soin à chaque coup', '×2 or more · healing on every hit') },
      { id: 'chainlightning', core: true, role: L('×2 ou plus · nettoie les groupes', '×2 or more · clears groups') },
      { id: 'syringe', role: L('×3 ou plus · cadence des deux armes', '×3 or more · both weapons’ rate') },
      { id: 'missile', role: L('×1 ou plus · dégâts sur une cible', '×1 or more · single-target damage') },
      { id: 'lightningstrikeonhit', role: L('Boss · ×1 ou plus · éclairs', 'Boss · ×1 or more · lightning') },
      { id: 'hoof', role: L('×2 ou plus · compense la lenteur', '×2 or more · offsets the slowdown') },
      { id: 'attackspeedandmovespeed', role: L('SotV · cadence et vitesse', 'SotV · fire rate and speed') },
    ],
    synergies: [
      {
        items: ['seed'],
        text: L(
          'Le soin de la Graine est multiplié par le coefficient de proc du coup : la Scie soigne plus par coup que les clous, et en Mode Puissance tu cumules les deux.',
          'Leeching Seed’s heal is multiplied by the hit’s proc coefficient: the Saw heals more per hit than the nails, and Power Mode gives you both.',
        ),
      },
      {
        items: ['hoof', 'attackspeedandmovespeed'],
        text: L(
          'Le Mode Puissance retire 60 % de vitesse de déplacement : la Patte et le Moka la rendent, et le Moka accélère aussi tes armes.',
          'Power Mode costs 60% movement speed: Hoof and Mocha give it back, and Mocha also speeds up your weapons.',
        ),
      },
      {
        items: ['syringe'],
        text: L(
          'La vitesse d’attaque accélère les clous et le rythme de la Scie. Avec beaucoup de vitesse, le recul de la salve finale des clous te garde en l’air.',
          'Attack speed speeds up the nails and the Saw’s tick rate. With a lot of it, the recoil of the nails’ final burst keeps you airborne.',
        ),
      },
    ],
    howTo: [
      L(
        'Mets la Scie électrique en arme principale : elle supprime la dispersion des clous en Mode Puissance. Les clous disparaissent au-delà de 40 m : reste au contact.',
        'Pick Power-Saw as the main weapon: it removes the nails’ spread in Power Mode. Nails vanish beyond 40 m: stay close.',
      ),
      L(
        'Place-toi avant d’entrer en Mode Puissance, puis étourdis le groupe avec la Grenade explosive.',
        'Get into position before entering Power Mode, then stun the group with Blast Canister.',
      ),
      L(
        'Sans DLC, oublie le Moka : la Patte de chèvre de Paul suffit à compenser la lenteur.',
        'Without DLC, skip Mocha: Paul’s Goat Hoof is enough to offset the slowdown.',
      ),
    ],
    sources: [
      { label: 'MUL-T', url: wiki('MUL-T') },
      { label: 'Leeching Seed', url: wiki('Leeching_Seed') },
      { label: 'Steam: Power Mode proc build (2024)', url: 'https://steamcommunity.com/app/632360/discussions/0/4297068552115058259/' },
      { label: 'Rogue Ranker: MUL-T', url: 'https://rogueranker.com/mul-t-risk-of-rain-2/' },
    ],
  },
  {
    slug: 'mult-rebar-bands',
    survivor: 'mult',
    name: L('Armature + bracelets', 'Rebar + bands'),
    tagline: L('Chaque tir dépasse 400 %.', 'Every shot clears 400%.'),
    tag: L('Jeu de base · Réoutillage', 'Base game · Retool'),
    summary: L(
      'Le Coup d’armature perce et inflige 600 % : chaque tir déclenche les bracelets dès qu’ils sont prêts. Réoutillage te donne aussi deux équipements, dont la Douche explosive qui recharge les bracelets.',
      'Rebar Puncher pierces for 600%: every shot sets off the bands whenever they are ready. Retool also gives you two equipment slots, one of them for Blast Shower, which recharges the bands.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Coup d’armature (×2, ou + Pistolet à clous auto) · Grenade explosive · Mode transport · Réoutillage',
        'Rebar Puncher (×2, or + Auto-Nailgun) · Blast Canister · Transport Mode · Retool',
      ),
    },
    items: [
      { id: 'crowbar', core: true, role: L('×3 ou plus · premier tir énorme', '×3 or more · huge first shot') },
      { id: 'firering', core: true, role: L('×1 ou plus · tornade sur chaque gros tir', '×1 or more · tornado on big shots') },
      { id: 'icering', role: L('×1 ou plus · ralentit et frappe', '×1 or more · slows and hits') },
      { id: 'cleanse', role: L('Équipement · recharge les bracelets', 'Equipment · recharges the bands') },
      { id: 'equipmentmagazine', role: L('×1 ou plus · Douche plus fréquente', '×1 or more · Shower more often') },
      { id: 'bossdamagebonus', role: L('×2 ou plus · dégâts contre les boss', '×2 or more · boss damage') },
    ],
    synergies: [
      {
        items: ['crowbar'],
        text: L(
          'Le Pied-de-biche vise les ennemis à plus de 90 % de PV : un Coup d’armature suffit souvent à tuer d’un coup. Évite le saignement et les drones offensifs : ils entament les PV avant ton tir.',
          'Crowbar targets enemies above 90% health: one Rebar Puncher shot often kills outright. Avoid bleed and offensive drones: they chip health before your shot.',
        ),
      },
      {
        items: ['firering', 'icering'],
        text: L(
          'À 600 %, le Coup d’armature dépasse toujours le seuil de 400 % : les deux bracelets partent ensemble dès la fin de leur recharge commune.',
          'At 600%, Rebar Puncher always clears the 400% threshold: both bands fire together as soon as their shared cooldown ends.',
        ),
      },
      {
        items: ['cleanse', 'firering', 'icering'],
        text: L(
          'La recharge des bracelets est un malus temporaire : la Douche explosive l’efface, et ton tir suivant les relance aussitôt.',
          'The bands’ cooldown is a timed debuff: Blast Shower wipes it, so your next shot fires them again.',
        ),
      },
      {
        items: ['bossdamagebonus'],
        text: L(
          'Le bonus des Munitions perforantes ne compte pas pour le seuil des bracelets, mais le Coup d’armature le dépasse déjà seul.',
          'Armor-Piercing Rounds’ bonus does not count toward the bands’ threshold, but Rebar Puncher clears it on its own anyway.',
        ),
      },
    ],
    howTo: [
      L(
        'Avec deux Coups d’armature : tire, Réoutillage, tire. Alterner ainsi est plus rapide que garder le bouton enfoncé, sauf avec énormément de vitesse d’attaque.',
        'With two Rebar Punchers: shoot, Retool, shoot. Alternating is faster than holding the button unless you have a huge amount of attack speed.',
      ),
      L(
        'Réoutillage change aussi d’équipement : garde la Douche explosive d’un côté et un équipement offensif de l’autre. Le Signe du noyé n’active que l’équipement en main.',
        'Retool swaps equipment too: keep Blast Shower on one side and an offensive equipment on the other. Gesture of the Drowned only fires the equipment in hand.',
      ),
      L(
        'La Douche retire aussi brûlures et malus : si les bracelets sont déjà prêts, garde-la pour te sauver.',
        'The Shower also removes burns and debuffs: if the bands are already ready, keep it to save yourself.',
      ),
    ],
    sources: [
      { label: 'MUL-T', url: wiki('MUL-T') },
      { label: 'Kjaro’s Band', url: wiki("Kjaro's_Band") },
      { label: 'Blast Shower', url: wiki('Blast_Shower') },
      { label: 'Gesture of the Drowned', url: wiki('Gesture_of_the_Drowned') },
      { label: 'Rogue Ranker: MUL-T', url: 'https://rogueranker.com/mul-t-risk-of-rain-2/' },
    ],
  },

  // ------------------------------------------------------------ Engineer
  {
    slug: 'engineer-fungus-turrets',
    survivor: 'engineer',
    name: L('Tourelles champignons', 'Fungus turrets'),
    tagline: L('Des tourelles qui se soignent toutes seules.', 'Turrets that heal themselves.'),
    tag: L('Facile · sans DLC', 'Easy · no DLC'),
    summary: L(
      'Les tourelles TR12 copient tes objets et ne bougent jamais : le Champignon revigorant les soigne en continu. Ajoute de la cadence et des effets à l’impact, elles font le gros des dégâts.',
      'TR12 turrets copy your items and never move: Bustling Fungus heals them nonstop. Add attack speed and on-hit effects; they do most of the damage.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Grenades rebondissantes · Mines à pression · Bouclier bulle · Auto-tourelle de Gauss TR12',
        'Bouncing Grenades · Pressure Mines · Bubble Shield · TR12 Gauss Auto-Turret',
      ),
    },
    items: [
      { id: 'mushroom', core: true, role: L('×2 ou plus · soin et rayon plus grands', '×2 or more · more healing and radius') },
      { id: 'syringe', core: true, role: L('×3 ou plus · cadence des tourelles', '×3 or more · turret fire rate') },
      { id: 'novaonheal', role: L('×1 · chaque tourelle tire ses crânes', '×1 · each turret fires its own skulls') },
      { id: 'missile', role: L('×1 ou plus · dégâts sur cible unique', '×1 or more · single-target damage') },
      { id: 'chainlightning', role: L('×1 ou plus · nettoie les groupes', '×1 or more · clears groups') },
      { id: 'bleedonhit', role: L('×3 ou plus · saignement', '×3 or more · bleed') },
      { id: 'hoof', role: L('Plusieurs · pour toi, pas les tourelles', 'Several · for you, not the turrets') },
    ],
    synergies: [
      {
        items: ['mushroom'],
        text: L(
          'Une tourelle TR12 ne bouge jamais : sa zone de soin reste toujours active. Pose les deux tourelles côte à côte pour qu’elles se soignent l’une l’autre.',
          'A TR12 turret never moves: its healing zone is always on. Place both turrets side by side so they heal each other.',
        ),
      },
      {
        items: ['mushroom', 'novaonheal'],
        text: L(
          'Les crânes partent même quand la tourelle est à pleine vie : le champignon les alimente sans arrêt, et chaque tourelle tire les siens.',
          'Skulls fire even when the turret is at full health: the fungus feeds them nonstop, and each turret fires its own.',
        ),
      },
    ],
    howTo: [
      L(
        'Les tourelles copient tes objets seulement quand tu les poses : replace-les après chaque coffre important.',
        'Turrets only copy your items when you place them: redeploy them after every important pickup.',
      ),
      L(
        'Évite Transcendance : elle change la vie des tourelles en bouclier et le champignon ne les soigne plus. Elles portent ton équipement sans pouvoir l’utiliser.',
        'Avoid Transcendence: it turns the turrets’ health into shield and the fungus stops healing them. They hold your equipment but cannot use it.',
      ),
      L(
        'Pose les tourelles avant le téléporteur et reste près d’elles ; le Bouclier bulle protège tout le monde contre les gros coups.',
        'Place the turrets before starting the teleporter and stay near them; Bubble Shield protects everyone from big hits.',
      ),
    ],
    sources: [
      { label: 'Engineer', url: wiki('Engineer') },
      { label: 'Bustling Fungus', url: wiki('Bustling_Fungus') },
      { label: 'N’kuhana’s Opinion', url: wiki('N%27kuhana%27s_Opinion') },
      { label: 'Steam: Best Synergies with engineer turret?', url: 'https://steamcommunity.com/app/632360/discussions/0/2872668209262732630' },
    ],
  },
  {
    slug: 'engineer-mobile-turrets',
    survivor: 'engineer',
    name: L('Tourelles mobiles', 'Mobile turrets'),
    tagline: L('Trois tourelles qui te suivent partout.', 'Three turrets that follow you everywhere.'),
    tag: L('Mobile · demande SotV', 'Mobile · needs SotV'),
    summary: L(
      'Les tourelles carbonisatrices TR58 te suivent et ralentissent les ennemis. La Cellule de Lysat en ajoute une troisième et les Pièces détachées de drone les arment davantage.',
      'TR58 Carbonizer turrets follow you and slow enemies. Lysate Cell adds a third one and Spare Drone Parts give them more weapons.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Grenades rebondissantes · Mines araignée · Harpons thermiques · Tourelle carbonisatrice TR58',
        'Bouncing Grenades · Spider Mines · Thermal Harpoons · TR58 Carbonizer Turret',
      ),
    },
    items: [
      { id: 'equipmentmagazinevoid', core: true, role: L('×1 · 3e tourelle (pas plus de 3)', '×1 · 3rd turret (3 at most)') },
      { id: 'droneweapons', core: true, role: L('×1 ou plus · arme et accélère les tourelles', '×1 or more · arms and speeds up turrets') },
      { id: 'syringe', role: L('×3 ou plus · cadence', '×3 or more · fire rate') },
      { id: 'chainlightning', role: L('×1 ou plus · nettoie les groupes', '×1 or more · clears groups') },
      { id: 'bandolier', role: L('×1 ou plus · reposer les tourelles plus vite', '×1 or more · redeploy turrets sooner') },
      { id: 'bear', role: L('Plusieurs · survie, copiée par les tourelles', 'Several · survival, copied by turrets') },
      { id: 'hoof', role: L('Plusieurs · mobilité', 'Several · mobility') },
    ],
    synergies: [
      {
        items: ['droneweapons'],
        text: L(
          'Les tourelles comptent comme des alliés mécaniques : elles gagnent la cadence, la réduction de recharge, le missile et la mitrailleuse des Pièces. Le Col. Droneman, lui, n’est que pour toi.',
          'Turrets count as mechanical allies: they get the Parts’ attack speed, cooldown reduction, missile and chain gun. Col. Droneman is for you only.',
        ),
      },
      {
        items: ['bandolier', 'equipmentmagazinevoid'],
        text: L(
          'Une munition de la Cartouchière remet tes recharges à zéro : repose aussitôt une tourelle tombée.',
          'A Bandolier ammo pack resets your cooldowns: put a fallen turret back down right away.',
        ),
      },
    ],
    howTo: [
      L(
        'Les TR58 bougent : le Champignon revigorant leur sert peu. Compte sur leur ralentissement et sur tes harpons pour ne pas être débordé.',
        'TR58s move around: Bustling Fungus does little for them. Rely on their slow and your harpoons to avoid being swarmed.',
      ),
      L(
        'Les Pièces détachées ont été affaiblies de moitié dans Alloyed Collective : elles restent un bon bonus, pas une victoire assurée.',
        'Spare Drone Parts were cut in half in Alloyed Collective: still a good boost, not a guaranteed win.',
      ),
      L(
        'Laser tranchant (Hallowed Concepts, gratuit) soigne tes tourelles et drones quand tu les vises, mais s’arrête sur le premier allié touché : ne tire pas à travers tes tourelles.',
        'Laser Cutter (Hallowed Concepts, free) heals your turrets and drones when you aim at them, but stops at the first ally hit: do not fire through your turrets.',
      ),
    ],
    sources: [
      { label: 'Engineer', url: wiki('Engineer') },
      { label: 'Spare Drone Parts', url: wiki('Spare_Drone_Parts') },
      { label: 'Lysate Cell', url: wiki('Lysate_Cell') },
    ],
  },

  // ------------------------------------------------------------ Artificer
  {
    slug: 'artificer-nano-bands',
    survivor: 'artificer',
    name: L('Nano-bombes + bracelets', 'Nano-bombs + bands'),
    tagline: L('Une bombe chargée, deux bracelets, un boss en moins.', 'One charged bomb, two bands, one boss fewer.'),
    tag: L('Gros dégâts · sans DLC', 'Burst damage · no DLC'),
    summary: L(
      'La Nano-bombe chargée frappe largement au-dessus du seuil des bracelets. Le Chargeur de secours te donne plusieurs bombes d’affilée pour vider un boss.',
      'Charged Nano-Bomb hits far above the bands’ threshold. Backup Magazine gives you several bombs in a row to melt a boss.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Éclair plasmatique · Nano-bombe chargée · Instagel · Surtension ionique',
        'Plasma Bolt · Charged Nano-Bomb · Snapfreeze · Ion Surge',
      ),
    },
    items: [
      { id: 'icering', core: true, role: L('×1 ou plus · dégâts sur cible unique', '×1 or more · single-target damage') },
      { id: 'firering', core: true, role: L('×1 ou plus · dégâts de zone', '×1 or more · area damage') },
      { id: 'secondaryskillmagazine', core: true, role: L('×3 ou plus · bombes d’affilée', '×3 or more · bombs back to back') },
      { id: 'syringe', role: L('Plusieurs · charge plus vite', 'Several · faster charge') },
      { id: 'alienhead', role: L('×1 ou plus · recharges', '×1 or more · cooldowns') },
      { id: 'hoof', role: L('Plusieurs · elle n’a aucune esquive', 'Several · she has no dodge skill') },
      { id: 'bear', role: L('Plusieurs · survie', 'Several · survival') },
    ],
    synergies: [
      {
        items: ['icering', 'firering'],
        text: L(
          'Chargée, la bombe monte jusqu’à 2000 %. Seule l’explosion déclenche les bracelets : ses éclairs ont été affaiblis exprès pour ne plus le faire.',
          'Fully charged, the bomb reaches 2000%. Only the blast sets off the bands: its sparks were weakened on purpose so they no longer do.',
        ),
      },
      {
        items: ['syringe', 'secondaryskillmagazine'],
        text: L(
          'La vitesse d’attaque raccourcit la charge de la nano-bombe : tu vides tes charges du Chargeur bien plus vite.',
          'Attack speed shortens the Nano-Bomb’s charge: you empty your Backup Magazine charges much faster.',
        ),
      },
    ],
    howTo: [
      L(
        'Charge la bombe au maximum sur les grosses cibles ; un tir direct fait la différence. Les Éclairs plasmatiques explosent en zone pour finir les groupes.',
        'Fully charge the bomb on big targets; a direct hit makes the difference. Plasma Bolts explode in an area to finish off groups.',
      ),
      L(
        'Variante : la Nano-lance gèle, et un ennemi gelé à faible vie meurt sur le coup. La plupart des boss ne gèlent pas.',
        'Variant: Nano-Spear freezes, and a frozen enemy at low health dies instantly. Most bosses cannot be frozen.',
      ),
      L(
        'L’Artificière n’a aucune compétence défensive : Surtension ionique est ta seule fuite. Reste en mouvement et ne plane pas trop longtemps.',
        'Artificer has no defensive skill: Ion Surge is your only escape. Keep moving and do not hover for too long.',
      ),
    ],
    sources: [
      { label: 'Artificer', url: wiki('Artificer') },
      { label: 'Backup Magazine', url: wiki('Backup_Magazine') },
      { label: 'Game Rant: Artificer builds', url: 'https://gamerant.com/risk-rain-2-artificer-best-build-items-tips/' },
    ],
  },
  {
    slug: 'artificer-fire-ignition',
    survivor: 'artificer',
    name: L('Flammes renforcées', 'Empowered flames'),
    tagline: L('Allumer, renforcer, propager.', 'Ignite, empower, spread.'),
    tag: L('Très fort · Réservoir d’ignition : SotV', 'Very strong · Ignition Tank: SotV'),
    summary: L(
      'Éclair de feu et Lance-flammes enflamment tout ce qu’ils touchent. Le Réservoir d’ignition multiplie ces brûlures et l’Essence les propage après chaque élimination.',
      'Flame Bolt and Flamethrower ignite everything they hit. Ignition Tank multiplies those burns and Gasoline spreads them after every kill.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Éclair de feu · Nano-bombe chargée · Instagel (ou Rafale tectonique) · Lance-flammes',
        'Flame Bolt · Charged Nano-Bomb · Snapfreeze (or Tectonic Blast) · Flamethrower',
      ),
    },
    items: [
      { id: 'strengthenburn', core: true, role: L('×1 ou plus · brûlures ×4, puis +3× par copie', '×1 or more · burns ×4, then +3× per copy') },
      { id: 'igniteonkill', core: true, role: L('×1 ou plus · propage le feu', '×1 or more · spreads fire') },
      { id: 'syringe', role: L('Plusieurs · plus de coups de lance-flammes', 'Several · more Flamethrower hits') },
      { id: 'alienhead', role: L('×1 ou plus · lance-flammes plus souvent', '×1 or more · Flamethrower more often') },
      { id: 'headhunter', role: L('Optionnel · le pouvoir enflammé brûle tout','Optional · Blazing power ignites everything') },
      { id: 'hoof', role: L('Plusieurs · mobilité', 'Several · mobility') },
      { id: 'bear', role: L('Plusieurs · survie', 'Several · survival') },
    ],
    synergies: [
      {
        items: ['strengthenburn'],
        text: L(
          'Le Réservoir renforce les brûlures d’Éclair de feu et du Lance-flammes. Il n’agit pas sur le Feu follet ni le Bracelet de Kjaro, qui n’enflamment pas.',
          'The Tank boosts burns from Flame Bolt and Flamethrower. It does nothing for Will-o’-the-wisp or Kjaro’s Band, which do not ignite.',
        ),
      },
      {
        items: ['strengthenburn'],
        text: L(
          'Rafale tectonique huile les ennemis : la brûlure suivante fait 4× plus de dégâts et consomme l’huile. Huile d’abord, puis Lance-flammes.',
          'Tectonic Blast oils enemies: the next burn deals 4× damage and uses up the oil. Oil first, then Flamethrower.',
        ),
      },
      {
        items: ['headhunter', 'strengthenburn'],
        text: L(
          'Tuer un élite enflammé te donne son pouvoir : toutes tes attaques enflamment et profitent du Réservoir.',
          'Killing a Blazing elite gives you its power: all your attacks ignite and benefit from the Tank.',
        ),
      },
    ],
    howTo: [
      L(
        'Le Lance-flammes ne s’utilise pas en sprint et tire le critique une seule fois au lancement. Gèle ou ralentis d’abord, puis brûle de près.',
        'Flamethrower cannot be used while sprinting and rolls crit once when it starts. Freeze or slow first, then burn up close.',
      ),
      L(
        'La vitesse d’attaque recharge aussi plus vite les Éclairs de feu : alterne-les avec la nano-bombe.',
        'Attack speed also recharges Flame Bolts faster: weave them between Nano-Bombs.',
      ),
      L(
        'Rafale tectonique (Hallowed Concepts, gratuite) remplace l’Instagel : plus de dégâts, mais tu perds ton seul outil de contrôle. Sans Survivors of the Void, garde le combo feu + Essence.',
        'Tectonic Blast (Hallowed Concepts, free) replaces Snapfreeze: more damage, but you lose your only control tool. Without Survivors of the Void, keep the fire + Gasoline combo.',
      ),
    ],
    sources: [
      { label: 'Artificer', url: wiki('Artificer') },
      { label: 'Ignition Tank', url: wiki('Ignition_Tank') },
      { label: 'Rogue Ranker: Ignition Tank', url: 'https://rogueranker.com/ignition-tank-ror2/' },
    ],
  },

  // ------------------------------------------------------------ Mercenary
  {
    slug: 'mercenary-eviscerate-onhit',
    survivor: 'mercenary',
    name: L('Éviscérer à l’impact', 'Eviscerate on-hit'),
    tagline: L('Plus tu frappes vite, plus Éviscérer frappe.', 'The faster you swing, the more Eviscerate hits.'),
    tag: L('Classique · jeu de base (Lysat : SotV)', 'Classic · base game (Lysate: SotV)'),
    summary: L(
      'Le Mercenaire des compétences de départ, porté par la vitesse d’attaque et les effets à l’impact. Éviscérer frappe plus souvent avec chaque bonus de vitesse d’attaque, sans durer plus longtemps, et tu ne peux pas être touché pendant l’attaque.',
      'Starting-skill Mercenary carried by attack speed and on-hit effects. Eviscerate hits more often with every bit of attack speed, without lasting longer, and you cannot be hit while it runs.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L('Épée laser · Tourbillon · Attaque aveuglante · Éviscérer', 'Laser Sword · Whirlwind · Blinding Assault · Eviscerate'),
    },
    items: [
      { id: 'syringe', core: true, role: L('Plusieurs · plus de coups d’Éviscérer', 'Several · more Eviscerate hits') },
      { id: 'healoncrit', core: true, role: L('×1 ou plus · soin pendant l’invincibilité', '×1 or more · healing while untouchable') },
      { id: 'critglasses', role: L('×3 ou plus · alimente la Faux', '×3 or more · feeds the Scythe') },
      { id: 'attackspeedoncrit', role: L('×1 · vitesse d’attaque en plus', '×1 · extra attack speed') },
      { id: 'chainlightning', role: L('×1 ou plus · dégâts de groupe', '×1 or more · group damage') },
      { id: 'bandolier', role: L('×1 ou plus · relance Éviscérer', '×1 or more · Eviscerate again') },
      { id: 'equipmentmagazinevoid', role: L('SotV · ×1 · 2e charge d’Éviscérer', 'SotV · ×1 · 2nd Eviscerate charge') },
    ],
    synergies: [
      {
        items: ['syringe'],
        text: L(
          'La vitesse d’attaque ajoute des coups à Éviscérer sans allonger sa durée : chaque coup en plus déclenche tes effets à l’impact.',
          'Attack speed adds hits to Eviscerate without making it longer: every extra hit rolls your on-hit effects.',
        ),
      },
      {
        items: ['healoncrit'],
        text: L(
          'Pendant Éviscérer, tu ne peux pas être touché : chaque critique te soigne sans que tu perdes de PV.',
          'You cannot be hit during Eviscerate: every crit heals you while you take no damage.',
        ),
      },
      {
        items: ['bandolier'],
        text: L(
          'Un pack de munitions recharge l’équivalent d’une recharge complète : Éviscérer revient juste après un groupe nettoyé.',
          'An ammo pack restocks a full cooldown’s worth: Eviscerate is back right after you clear a group.',
        ),
      },
      {
        items: ['equipmentmagazinevoid'],
        text: L(
          'Une charge d’Éviscérer en plus : une fenêtre d’invincibilité de réserve contre les attaques annoncées.',
          'One more Eviscerate charge: a spare invincibility window against telegraphed attacks.',
        ),
      },
    ],
    howTo: [
      L(
        'Garde Éviscérer pour esquiver les grosses attaques annoncées (lasers, frappes de boss) : c’est ton meilleur outil défensif.',
        'Save Eviscerate to dodge big telegraphed attacks (lasers, boss slams): it is your best defensive tool.',
      ),
      L(
        'Attaque aveuglante se relance jusqu’à 3 fois si tu touches un ennemi : vise le groupe, garde la dernière ruée pour fuir.',
        'Blinding Assault recasts up to 3 times if you hit an enemy: aim at the group, keep the last dash to escape.',
      ),
      L(
        'Beaucoup de vitesse d’attaque raccourcit les déplacements du Tourbillon : passe ensuite aux critiques et aux soins.',
        'Lots of attack speed shortens how far Whirlwind carries you: move on to crits and healing after that.',
      ),
    ],
    sources: [
      { label: 'Mercenary', url: wiki('Mercenary') },
      { label: 'Bandolier', url: wiki('Bandolier') },
      { label: 'Steam: good items and tips for Mercenary (2024)', url: 'https://steamcommunity.com/app/632360/discussions/0/6546631477884074090/' },
      { label: 'Rogue Ranker: Mercenary', url: 'https://rogueranker.com/?p=1619' },
    ],
  },
  {
    slug: 'mercenary-expose-loop',
    survivor: 'mercenary',
    name: L('Exposé en boucle', 'Expose loop'),
    tagline: L('Chaque Exposé fait revenir tes compétences.', 'Every Expose brings your skills back.'),
    tag: L('Avancé · objets rouges · Assaut concentré', 'Advanced · red items · Focused Assault'),
    summary: L(
      'Frapper un ennemi exposé réduit toutes tes recharges d’1 s et ajoute +350 % de dégâts. Assaut concentré et Vents tranchants exposent eux-mêmes ; avec le Béhémoth rutilant, tu exposes encore plus souvent et tes compétences reviennent presque aussitôt.',
      'Hitting an Exposed enemy cuts all your cooldowns by 1 s and adds +350% damage. Focused Assault and Slicing Winds Expose on their own; with Brilliant Behemoth you Expose even more often and your skills come back almost at once.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L('Épée laser · Tourbillon · Assaut concentré · Vents tranchants', 'Laser Sword · Whirlwind · Focused Assault · Slicing Winds'),
    },
    items: [
      { id: 'behemoth', core: true, role: L('×1 · un Exposé de plus par cycle', '×1 · one more Expose per cycle') },
      { id: 'utilityskillmagazine', core: true, role: L('×1 · 3 Assauts concentrés', '×1 · 3 Focused Assaults') },
      { id: 'alienhead', role: L('×1 ou plus · recharges plus courtes', '×1 or more · shorter cooldowns') },
      { id: 'killelitefrenzy', role: L('×1 ou plus · Vents tranchants en rafale', '×1 or more · Slicing Winds spam') },
    ],
    synergies: [
      {
        items: ['behemoth'],
        text: L(
          'L’Exposé ignore le coefficient de proc : l’explosion du Béhémoth peut ajouter un second Exposé et exposer les ennemis voisins. Chaque Exposé consommé retire 1 s à toutes tes recharges.',
          'Expose ignores proc coefficient: the Behemoth blast can add a second Expose and Expose nearby enemies. Every Expose you pop takes 1 s off all your cooldowns.',
        ),
      },
      {
        items: ['killelitefrenzy'],
        text: L(
          'Après une élite tuée, tes recharges tombent au minimum : enchaîne Vents tranchants et Assaut concentré tant que dure la frénésie.',
          'After an elite kill your cooldowns drop to the minimum: chain Slicing Winds and Focused Assault while the frenzy lasts.',
        ),
      },
    ],
    howTo: [
      L(
        'Lance une compétence juste avant que le 3e coup de l’Épée laser touche : l’Exposé est posé puis consommé aussitôt, avec le bonus de dégâts et la recharge réduite.',
        'Use a skill just before the third Laser Sword hit lands: the Expose is applied and popped at once, with the damage bonus and the cooldown cut.',
      ),
      L(
        'Prends Assaut concentré et Vents tranchants ensemble : ce style se joue plus à distance et tu continues à frapper pendant les Vents.',
        'Take Focused Assault and Slicing Winds together: this style keeps more distance and you keep attacking while the Winds run.',
      ),
      L(
        'Seul le Mercenaire profite de l’Exposé : tes alliés ne le consomment pas.',
        'Only Mercenary benefits from Expose: allies do not pop it.',
      ),
    ],
    sources: [
      { label: 'Mercenary', url: wiki('Mercenary') },
      { label: 'Brilliant Behemoth', url: wiki('Brilliant_Behemoth') },
      { label: 'Kjaro’s Band', url: wiki("Kjaro's_Band") },
      { label: 'Steam: good items and tips for Mercenary (2024)', url: 'https://steamcommunity.com/app/632360/discussions/0/6546631477884074090/' },
    ],
  },

  // ------------------------------------------------------------ REX
  {
    slug: 'rex-healing-skulls',
    survivor: 'rex',
    name: L('Soins offensifs', 'Healing that hurts'),
    tagline: L('Tes soins deviennent des crânes.', 'Your healing turns into skulls.'),
    tag: L('Moyen · gestion des PV · aucun DLC', 'Medium · HP management · no DLC'),
    summary: L(
      'REX paie ses compétences en PV et se soigne en frappant. Le Râtelier de récupération double ces soins et l’Opinion de N’kuhana les transforme en crânes qui attaquent tout seuls.',
      'REX pays for its skills with HP and heals by hitting. Rejuvenation Rack doubles that healing and N’kuhana’s Opinion turns it into skulls that attack on their own.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'DIRECTIVE : injecter · Barrage de graines · Volée d’épines · Croissance emmêlée',
        'DIRECTIVE: Inject · Seed Barrage · Bramble Volley · Tangling Growth',
      ),
    },
    items: [
      { id: 'increasehealing', core: true, role: L('×1 ou plus · double tous tes soins', '×1 or more · doubles all your healing') },
      { id: 'novaonheal', core: true, role: L('×1 ou plus · soins → crânes chercheurs', '×1 or more · healing → homing skulls') },
      { id: 'medkit', role: L('×3 ou plus · se déclenche sur le coût en PV', '×3 or more · triggers on HP costs') },
      { id: 'armorplate', role: L('×3 ou plus · réduit le coût des compétences', '×3 or more · cuts skill costs') },
      { id: 'deathmark', role: L('×1 · REX applique déjà des altérations', '×1 · REX already applies debuffs') },
      { id: 'syringe', role: L('×2 ou plus · injecter plus souvent', '×2 or more · Inject more often') },
      { id: 'infusion', role: L('×1 · plus de PV max', '×1 · more max health') },
      { id: 'hoof', role: L('×2 ou plus · REX n’a pas d’esquive', '×2 or more · REX has no dodge') },
    ],
    synergies: [
      {
        items: ['increasehealing', 'novaonheal'],
        text: L(
          'Le Râtelier double les soins stockés par N’kuhana, donc les crânes. Injecter, qui rend 60 % des dégâts infligés, les alimente en continu.',
          'The Rack doubles the healing N’kuhana stores, so the skulls too. Inject, which heals 60% of damage dealt, feeds them nonstop.',
        ),
      },
      {
        items: ['medkit', 'armorplate'],
        text: L(
          'Les coûts en PV comptent comme des dégâts subis : ils déclenchent le Kit de soin, et l’Armure de répulsion les réduit (sauf Croissance emmêlée).',
          'HP costs count as damage taken: they trigger Medkit, and Repulsion Armor Plate reduces them (except Tangling Growth).',
        ),
      },
      {
        items: ['deathmark'],
        text: L(
          'L’Affaiblissement de REX et l’enracinement de Croissance emmêlée comptent comme altérations : il en manque peu pour marquer.',
          'REX’s Weaken and Tangling Growth’s root both count as debuffs: little else is needed to mark.',
        ),
      },
    ],
    howTo: [
      L(
        'Les coûts en PV ne peuvent pas te tuer, mais te laissent fragile. Lance Volée d’épines dans un groupe : elle soigne pour chaque cible touchée.',
        'HP costs cannot kill you, but they leave you fragile. Fire Bramble Volley into a group: it heals for every target hit.',
      ),
      L(
        'Croissance emmêlée retient les ennemis dans son cercle : vise le centre d’un groupe, puis bombarde-le au Barrage de graines.',
        'Tangling Growth holds enemies in its ring: aim at the middle of a group, then shell it with Seed Barrage.',
      ),
      L(
        'Évite Transcendance et la Couronne fragile : tes coûts en PV les rendent pénalisantes.',
        'Avoid Transcendence and Brittle Crown: your HP costs make them a liability.',
      ),
    ],
    sources: [
      { label: 'REX', url: wiki('REX') },
      { label: 'N’kuhana’s Opinion', url: wiki('N%27kuhana%27s_Opinion') },
      { label: 'Rejuvenation Rack', url: wiki('Rejuvenation_Rack') },
      { label: 'Death Mark', url: wiki('Death_Mark') },
      { label: 'Rogue Ranker: REX', url: 'https://rogueranker.com/?p=1621' },
    ],
  },

  // ------------------------------------------------------------ Loader
  {
    slug: 'loader-charged-punch',
    survivor: 'loader',
    name: L('Un seul coup de poing', 'One punch'),
    tagline: L('Prends de la vitesse, frappe une fois.', 'Build speed, hit once.'),
    tag: L('Classique · jeu de base', 'Classic · base game'),
    summary: L(
      'Le Gantelet chargé gagne des dégâts avec ta vitesse : balance-toi au grappin, puis lâche le coup au sommet. Il perce et touche chaque ennemi sur sa ligne, et chaque ennemi touché te donne de la barrière.',
      'Charged Gauntlet gains damage with your speed: swing on the grapple, then release at the top. It pierces every enemy in its path, and each enemy hit grants barrier.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Explosion de phalanges · Poing clouté (ou Poing-grappin) · Gantelet chargé · Frappe foudroyante',
        'Knuckleboom · Spiked Fist (or Grapple Fist) · Charged Gauntlet · Thunderslam',
      ),
    },
    items: [
      { id: 'secondaryskillmagazine', core: true, role: L('×2 ou plus · grappin toujours prêt', '×2 or more · grapple always ready') },
      { id: 'firering', core: true, role: L('×1 ou plus · chaque coup chargé la déclenche', '×1 or more · every charged punch fires it') },
      { id: 'crowbar', role: L('×3 ou plus · ouverture énorme', '×3 or more · huge opener') },
      { id: 'hoof', role: L('×2 ou plus · plus de vitesse, plus de dégâts', '×2 or more · more speed, more damage') },
      { id: 'chainlightning', role: L('×1 ou plus · éclairs sur les groupes', '×1 or more · lightning on groups') },
      { id: 'bandolier', role: L('×1 ou plus · ramassée en traversant', '×1 or more · picked up as you pass through') },
      { id: 'utilityskillmagazine', role: L('×1 · 3 Gantelets d’affilée', '×1 · 3 Gauntlets in a row') },
    ],
    synergies: [
      {
        items: ['hoof'],
        text: L(
          'Le Gantelet chargé gagne des dégâts de base selon ta vitesse réelle : tout bonus de vitesse augmente donc ses dégâts.',
          'Charged Gauntlet gains base damage from your actual velocity: every speed bonus raises its damage.',
        ),
      },
      {
        items: ['bandolier', 'utilityskillmagazine'],
        text: L(
          'Le coup perce les groupes et te fait traverser les ennemis : tu ramasses les packs de la Cartouchière au passage, et la Postcombustion garde des charges d’avance.',
          'The punch pierces groups and carries you through the enemies: you grab Bandolier packs on the way, and the Afterburner keeps spare charges ready.',
        ),
      },
      {
        items: ['secondaryskillmagazine'],
        text: L(
          'Le grappin ne se recharge que s’il touche un ennemi ou une surface. Une charge en plus te laisse de quoi fuir après chaque coup.',
          'The grapple only goes on cooldown if it hits an enemy or terrain. One more charge leaves you a way out after every punch.',
        ),
      },
    ],
    howTo: [
      L(
        'Charge le Gantelet pendant que tu es accrochée, puis lâche-le au sommet de l’arc pour garder ton élan. C’est ta vitesse qui compte, pas ta direction.',
        'Charge the Gauntlet while hooked, then release at the top of the arc to keep your momentum. Your speed matters, not your direction.',
      ),
      L(
        'Le Poing clouté ramène les petits ennemis vers toi au lieu de te tirer : garde le Poing-grappin si tu veux te balancer pour prendre de la vitesse.',
        'Spiked Fist pulls light enemies to you instead of pulling you: keep Grapple Fist if you want to swing for speed.',
      ),
      L(
        'Ta barrière vient de tes coups de poing : la Frappe foudroyante et le Pylône M551 n’en donnent pas.',
        'Your barrier comes from your punches: Thunderslam and M551 Pylon grant none.',
      ),
    ],
    sources: [
      { label: 'Loader', url: wiki('Loader') },
      { label: 'Rogue Ranker: Loader', url: 'https://rogueranker.com/loader-ror2/' },
      { label: 'Steam: Loader on Monsoon tips', url: 'https://steamcommunity.com/app/632360/discussions/0/3147430975634665421/' },
    ],
  },
  {
    slug: 'loader-thunderslam-h3ad',
    survivor: 'loader',
    name: L('Chute foudroyante', 'Thunder drop'),
    tagline: L('Monte au grappin, retombe sur eux.', 'Grapple up, drop on them.'),
    tag: L('Objet rouge conseillé · Gantelet de foudre', 'Red item advised · Thunder Gauntlet'),
    summary: L(
      'La Chargeuse ne subit pas de dégâts de chute et grimpe haut au grappin : le H3AD-5T v2 transforme ça en arme. Ta vitesse de chute renforce aussi le Gantelet de foudre, et son rebond prépare la Frappe foudroyante.',
      'Loader takes no fall damage and climbs high with her grapple: H3AD-5T v2 turns that into a weapon. Your fall speed also powers Thunder Gauntlet, and its bounce sets up Thunderslam.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Explosion de phalanges · Poing-grappin · Gantelet de foudre · Frappe foudroyante',
        'Knuckleboom · Grapple Fist · Thunder Gauntlet · Thunderslam',
      ),
    },
    items: [
      { id: 'fallboots', core: true, role: L('×1 · explosion à l’atterrissage', '×1 · landing explosion') },
      { id: 'secondaryskillmagazine', core: true, role: L('×2 ou plus · grimper plus haut', '×2 or more · climb higher') },
      { id: 'firering', role: L('×1 ou plus · un coup suffit', '×1 or more · one hit is enough') },
      { id: 'icering', role: L('×1 ou plus · un coup suffit', '×1 or more · one hit is enough') },
      { id: 'nearbydamagebonus', role: L('×3 ou plus · tu frappes de près', '×3 or more · you hit up close') },
      { id: 'feather', role: L('×1 ou plus · hauteur et sécurité', '×1 or more · height and safety') },
      { id: 'utilityskillmagazine', role: L('×1 · plus de Gantelets en vol', '×1 · more Gauntlets in the air') },
    ],
    synergies: [
      {
        items: ['fallboots', 'secondaryskillmagazine'],
        text: L(
          'L’explosion du H3AD grandit avec la hauteur de chute : enchaîne les grappins pour monter, puis maintiens Interagir en l’air pour plonger.',
          'H3AD’s blast grows with fall distance: chain grapples to climb, then hold Interact in the air to dive.',
        ),
      },
      {
        items: ['fallboots'],
        text: L(
          'Ta vitesse de chute compte pour le bonus « Lourd » : un Gantelet lancé en tombant frappe plus fort.',
          'Your fall speed counts for the Heavy bonus: a Gauntlet thrown while falling hits harder.',
        ),
      },
      {
        items: ['firering', 'icering'],
        text: L(
          'Le coup du Gantelet de foudre (2 100 %) dépasse largement le seuil de 400 %. Le cône électrique, lui, ne profite pas du bonus de vitesse.',
          'Thunder Gauntlet’s punch (2,100%) clears the 400% threshold easily. Its lightning cone does not get the speed bonus.',
        ),
      },
    ],
    howTo: [
      L(
        'Le Gantelet de foudre se charge vite et s’utilise en courant : il bat le Gantelet chargé en début de partie, puis passe derrière.',
        'Thunder Gauntlet charges fast and works while sprinting: it beats Charged Gauntlet early, then falls behind.',
      ),
      L(
        'Le rebond du Gantelet de foudre sur sa cible prépare bien la Frappe foudroyante.',
        'Thunder Gauntlet’s bounce off its target is a good setup for Thunderslam.',
      ),
      L(
        'Pour le H3AD, maintiens Interagir en l’air ; relâcher trop tôt annule. Sans lui, le schéma grappin, Gantelet, Frappe marche déjà.',
        'For H3AD, hold Interact in the air; letting go too early cancels it. Without it, the grapple, Gauntlet, slam pattern already works.',
      ),
    ],
    sources: [
      { label: 'Loader', url: wiki('Loader') },
      { label: 'H3AD-5T v2', url: wiki('H3AD-5T_v2') },
      { label: 'Rogue Ranker: Loader', url: 'https://rogueranker.com/loader-ror2/' },
    ],
  },

  // ------------------------------------------------------------ Acrid
  {
    slug: 'acrid-poison-epidemic',
    survivor: 'acrid',
    name: L('Poison + Épidémie', 'Poison + Epidemic'),
    tagline: L('Le poison ronge, les objets achèvent.', 'Poison eats, items finish.'),
    tag: L('Classique · jeu de base · contre les boss', 'Classic · base game · boss killer'),
    summary: L(
      'Le Poison inflige des dégâts selon les PV max de la cible : il fait fondre les gros ennemis mais ne peut pas tuer. Épidémie le propage dans tout le groupe ; tes objets portent le coup final.',
      'Poison deals damage based on the target’s max health: it melts big enemies but cannot kill. Epidemic spreads it through the group; your items land the final blow.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Poison · Blessures vicieuses · Neurotoxine · Bond caustique · Épidémie',
        'Poison · Vicious Wounds · Neurotoxin · Caustic Leap · Epidemic',
      ),
    },
    items: [
      { id: 'executelowhealthelite', core: true, role: L('×2 ou plus · le poison achève les élites', '×2 or more · poison finishes elites') },
      { id: 'chainlightning', core: true, role: L('×1 ou plus · achève les empoisonnés', '×1 or more · finishes poisoned enemies') },
      { id: 'missile', role: L('×1 ou plus · lancé par Épidémie', '×1 or more · fired by Epidemic') },
      { id: 'explodeondeath', role: L('×1 ou plus · réaction en chaîne', '×1 or more · chain reaction') },
      { id: 'armorreductiononhit', role: L('×1 · le poison subit l’armure', '×1 · poison is cut by armor') },
      { id: 'alienhead', role: L('×1 ou plus · Épidémie plus souvent', '×1 or more · Epidemic more often') },
      { id: 'nearbydamagebonus', role: L('×3 ou plus · tu te bats de près', '×3 or more · you fight up close') },
    ],
    synergies: [
      {
        items: ['executelowhealthelite'],
        text: L(
          'Le Poison ne peut pas tuer, mais la Vieille guillotine exécute les élites sous son seuil : le poison suffit alors à les achever.',
          'Poison cannot kill, but Old Guillotine executes elites below its threshold: poison alone can then finish them.',
        ),
      },
      {
        items: ['chainlightning', 'missile'],
        text: L(
          'Chaque saut d’Épidémie peut déclencher tes effets à l’impact : éclairs et missiles partent sur tout le groupe et achèvent les ennemis que le poison laisse à 1 PV.',
          'Every Epidemic jump can roll your on-hit effects: lightning and missiles spread over the group and finish the enemies poison leaves at 1 HP.',
        ),
      },
      {
        items: ['armorreductiononhit'],
        text: L(
          'Les dégâts du Poison sont réduits par l’armure : la Justice fracassante la retire sur les boss après quelques coups de griffe.',
          'Poison damage is reduced by armor: Shattering Justice strips it from bosses after a few claw hits.',
        ),
      },
    ],
    howTo: [
      L(
        'Empoisonne tout ce que tu vois (Neurotoxine, Bond caustique, Épidémie), puis passe à la cible suivante : le poison travaille seul pendant 10 s.',
        'Poison everything in sight (Neurotoxin, Caustic Leap, Epidemic), then move on: poison works on its own for 10 s.',
      ),
      L(
        'Une exécution de la Guillotine compte comme une élimination : le Feu follet peut lancer une réaction en chaîne dans le groupe.',
        'A Guillotine execution counts as a kill: Will-o’-the-wisp can start a chain reaction through the group.',
      ),
      L(
        'Le Poison ne se cumule pas : à plusieurs Acrid, un seul le prend, les autres jouent Fléau.',
        'Poison does not stack: with several Acrids, one takes it and the others play Blight.',
      ),
    ],
    sources: [
      { label: 'Acrid', url: wiki('Acrid') },
      { label: 'Old Guillotine', url: wiki('Old_Guillotine') },
      { label: 'Rogue Ranker: Acrid', url: 'https://rogueranker.com/?p=1630' },
      { label: 'Steam: What do you build on Acrid?', url: 'https://steamcommunity.com/app/632360/discussions/0/3829691444563905498/' },
    ],
  },
  {
    slug: 'acrid-blight-stacks',
    survivor: 'acrid',
    name: L('Fléau en cumul', 'Blight stacking'),
    tagline: L('Plus de crachats, plus de cumuls.', 'More spit, more stacks.'),
    tag: L('Fléau à débloquer · SotV / SotS en option', 'Blight unlock · SotV / SotS optional'),
    summary: L(
      'Le Fléau inflige moins que le Poison sur les gros ennemis, mais il se cumule et peut tuer. Chaque compétence empoisonnante ajoute un cumul : plus tu lances de Neurotoxines, plus ça fond.',
      'Blight deals less than Poison to big enemies, but it stacks and can kill. Every poisonous skill adds a stack: the more Neurotoxin you throw, the faster things melt.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Fléau · Blessures vicieuses · Neurotoxine · Bond caustique · Épidémie',
        'Blight · Vicious Wounds · Neurotoxin · Caustic Leap · Epidemic',
      ),
    },
    items: [
      { id: 'secondaryskillmagazine', core: true, role: L('×2 ou plus · Neurotoxines d’affilée', '×2 or more · Neurotoxins in a row') },
      { id: 'lunarbadluck', core: true, role: L('×1 · Neurotoxine presque sans recharge', '×1 · Neurotoxin almost on demand') },
      { id: 'alienhead', role: L('×1 ou plus · toutes les recharges', '×1 or more · every cooldown') },
      { id: 'killelitefrenzy', role: L('×1 · crachats sans limite après une élite', '×1 · endless spit after an elite') },
      { id: 'equipmentmagazinevoid', role: L('SotV · ×1 ou plus · 2e Épidémie', 'SotV · ×1 or more · 2nd Epidemic') },
      { id: 'triggerenemydebuffs', role: L('SotS · ×1 ou plus · transmet les cumuls', 'SotS · ×1 or more · passes stacks on') },
      { id: 'nearbydamagebonus', role: L('×3 ou plus · tu te bats de près', '×3 or more · you fight up close') },
    ],
    synergies: [
      {
        items: ['secondaryskillmagazine', 'lunarbadluck'],
        text: L(
          'Pureté fait tomber la Neurotoxine à sa recharge minimale et les Chargeurs ajoutent des charges : tu craches en rafale, un cumul par crachat.',
          'Purity drops Neurotoxin to its minimum cooldown and Magazines add charges: you spit in bursts, one stack per spit.',
        ),
      },
      {
        items: ['triggerenemydebuffs'],
        text: L(
          'Quand un ennemi meurt, l’Épine toxique transmet un tiers de ses cumuls de Fléau à un voisin : tes cumuls survivent à leur cible.',
          'When an enemy dies, Noxious Thorn passes a third of its Blight stacks to a neighbour: your stacks outlive their target.',
        ),
      },
      {
        items: ['lunarbadluck'],
        text: L(
          'Le Fléau ne dépend pas de la chance : le défaut de Pureté ne touche ici que le saignement de l’Épine.',
          'Blight does not rely on luck: Purity’s downside only hits the Thorn’s bleed here.',
        ),
      },
    ],
    howTo: [
      L(
        'Chaque cumul a sa propre durée et les nouveaux ne rafraîchissent pas les anciens : crache sans arrêt plutôt que d’attendre.',
        'Each stack has its own timer and new ones do not refresh old ones: keep spitting instead of waiting.',
      ),
      L(
        'Le Fléau ne dépend pas des PV de la cible : il brille sur les petits ennemis et en début de partie. Contre les gros boss de fin de partie, le Poison reprend l’avantage.',
        'Blight does not depend on the target’s health: it shines on small enemies and early on. Against big late-game bosses, Poison takes over.',
      ),
      L(
        'Morsure vorace remplace bien la Neurotoxine si tu veux te soigner au contact : elle profite aussi des Chargeurs et de Pureté.',
        'Ravenous Bite is a fine swap for Neurotoxin if you want to heal in melee: it also benefits from Magazines and Purity.',
      ),
    ],
    sources: [
      { label: 'Acrid', url: wiki('Acrid') },
      { label: 'Noxious Thorn', url: wiki('Noxious_Thorn') },
      { label: 'Steam: What do you build on Acrid?', url: 'https://steamcommunity.com/app/632360/discussions/0/3829691444563905498/' },
    ],
  },

  // ------------------------------------------------------------ Captain
  {
    slug: 'captain-shotgun-onhit',
    survivor: 'captain',
    name: L('Fusil à impacts', 'On-hit shotgun'),
    tagline: L('Huit plombs, huit chances de déclencher tes objets.', 'Eight pellets, eight rolls for your on-hit items.'),
    tag: L('Facile · aucun DLC requis', 'Easy · no DLC needed'),
    summary: L(
      'Le Fusil à pompe Vulcain tire 8 plombs qui déclenchent chacun tes effets à l’impact. Saignement, éclairs et missiles s’accumulent vite ; les sondes orbitales achèvent ce que le Taser immobilise.',
      'Vulcan Shotgun fires 8 pellets that each set off your on-hit effects. Bleed, lightning and missiles pile up fast; Orbital Probes finish what the Power Tazer pins down.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Fusil à pompe Vulcain · Taser · Sonde orbitale · Balise : piratage + Balise : Soin',
        'Vulcan Shotgun · Power Tazer · Orbital Probe · Beacon: Hacking + Beacon: Healing',
      ),
    },
    items: [
      { id: 'bleedonhit', core: true, role: L('×3 ou plus · saignement sur chaque plomb', '×3 or more · bleed on every pellet') },
      { id: 'chainlightning', core: true, role: L('×1 ou plus · éclairs contre les groupes', '×1 or more · lightning for crowds') },
      { id: 'missile', role: L('×1 ou plus · missiles fréquents', '×1 or more · frequent missiles') },
      { id: 'armorreductiononhit', role: L('×1 · un seul tir suffit à l’appliquer', '×1 · one blast is enough to apply it') },
      { id: 'bandolier', role: L('×1 ou plus · recharge tes sondes', '×1 or more · refills your probes') },
      { id: 'syringe', role: L('×2 ou plus · tirs et Microbots plus rapides', '×2 or more · faster shots and Microbots') },
      { id: 'hoof', role: L('×2 ou plus · compense l’absence de mobilité', '×2 or more · makes up for no mobility skill') },
      { id: 'feather', role: L('×1 ou plus · pour le relief', '×1 or more · for uneven ground') },
    ],
    synergies: [
      {
        items: ['bleedonhit', 'chainlightning', 'missile'],
        text: L(
          'Chaque plomb a un coefficient de proc de 0,75 : sa chance de déclencher baisse d’un quart, mais un tir fait 8 jets au lieu d’un.',
          'Each pellet has a 0.75 proc coefficient: its trigger chance drops by a quarter, but one shot makes 8 rolls instead of one.',
        ),
      },
      {
        items: ['armorreductiononhit'],
        text: L(
          'Elle demande 5 coups sur la même cible : un tir dont 5 plombs touchent l’applique d’un coup.',
          'It needs 5 hits on the same target: one shot that lands 5 pellets applies it at once.',
        ),
      },
      {
        items: ['bandolier'],
        text: L(
          'Ramasser une munition pendant que tu vises la Sonde orbitale te rend une sonde, jusqu’à 3.',
          'Picking up an ammo pack while aiming Orbital Probe gives back one probe, up to 3.',
        ),
      },
      {
        items: ['syringe'],
        text: L(
          'La vitesse d’attaque accélère aussi la recharge des Microbots défensifs : ils détruisent plus de projectiles.',
          'Attack speed also speeds up Defensive Microbots’ recharge: they shoot down more projectiles.',
        ),
      },
    ],
    howTo: [
      L(
        'Charge le tir pour resserrer la dispersion à distance ; tire sans charger au contact. Le critique est tiré une fois par tir : tous les plombs sont critiques, ou aucun.',
        'Charge the shot to tighten the spread at range; fire uncharged up close. Crit is rolled once per shot: all pellets crit, or none.',
      ),
      L(
        'Le Taser électrocute un ennemi non-boss et l’immobilise : place tes 3 sondes dessus.',
        'Power Tazer shocks a non-boss enemy and holds it in place: drop your 3 probes on it.',
      ),
      L(
        'Piratage pour les objets gratuits, Soin pour tenir les combats. Sondes et balises ne marchent pas dans les royaumes cachés.',
        'Hacking for free items, Healing to last through fights. Probes and beacons do not work in Hidden Realms.',
      ),
    ],
    sources: [
      { label: 'Captain', url: wiki('Captain') },
      { label: 'Tri-Tip Dagger', url: wiki('Tri-Tip_Dagger') },
      { label: 'Defensive Microbots', url: wiki('Defensive_Microbots') },
      { label: 'Rogue Ranker: Captain', url: 'https://rogueranker.com/captain-ror2/' },
    ],
  },
  {
    slug: 'captain-drone-fleet',
    survivor: 'captain',
    name: L('Flotte de drones', 'Drone fleet'),
    tagline: L('Tes drones héritent de tes Microbots.', 'Your drones get your Microbots.'),
    tag: L('Moyen · SotV + AC', 'Medium · SotV + AC'),
    summary: L(
      'Le Capitaine donne ses Microbots défensifs à tous ses drones : ils détruisent les projectiles ennemis autour d’eux. La Balise : piratage achète les drones gratuitement ; Le renfort et les Pièces détachées de drone font le reste.',
      'Captain gives his Defensive Microbots to all his drones: they shoot down enemy projectiles around them. Beacon: Hacking buys drones for free; The Back-up and Spare Drone Parts do the rest.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Fusil à pompe Vulcain · Taser · Sonde orbitale · Balise : piratage + Balise : réapprovisionnement',
        'Vulcan Shotgun · Power Tazer · Orbital Probe · Beacon: Hacking + Beacon: Resupply',
      ),
    },
    items: [
      { id: 'droneweapons', core: true, role: L('×1 ou plus · cadence, missiles et mitrailleuse', '×1 or more · fire rate, missiles and chain gun') },
      { id: 'dronebackup', core: true, role: L('×1 · 4 drones d’attaque à la demande', '×1 · 4 Strike Drones on demand') },
      { id: 'dronesdropdynamite', role: L('×1 ou plus · dynamite qui étourdit (AC)', '×1 or more · stunning dynamite (AC)') },
      { id: 'equipmentmagazine', role: L('×2 ou plus · plus de renforts', '×2 or more · more Back-ups') },
      { id: 'energizedonequipmentuse', role: L('×1 · vitesse d’attaque à chaque renfort', '×1 · attack speed on every Back-up') },
      { id: 'hoof', role: L('×2 ou plus · mobilité', '×2 or more · mobility') },
      { id: 'feather', role: L('×1 ou plus · mobilité', '×1 or more · mobility') },
    ],
    synergies: [
      {
        items: ['dronebackup', 'droneweapons'],
        text: L(
          'Les 4 drones d’attaque du renfort reçoivent les Microbots du Capitaine et les bonus des Pièces détachées : cadence, missiles, mitrailleuse.',
          'The 4 Strike Drones from The Back-up get Captain’s Microbots and the Spare Drone Parts bonuses: fire rate, missiles, chain gun.',
        ),
      },
      {
        items: ['dronebackup', 'equipmentmagazine'],
        text: L(
          'La Balise : réapprovisionnement recharge ton équipement (3 utilisations) : avec les Piles, plusieurs vagues de drones d’affilée.',
          'Beacon: Resupply recharges your equipment (3 uses): with Fuel Cells, several waves of drones in a row.',
        ),
      },
      {
        items: ['dronebackup', 'energizedonequipmentuse'],
        text: L(
          'Chaque renfort déclenche le Cor de guerre : ton fusil tire plus vite et tes Microbots se rechargent plus vite.',
          'Every Back-up sets off War Horn: your shotgun fires faster and your Microbots recharge faster.',
        ),
      },
      {
        items: ['dronesdropdynamite'],
        text: L(
          'Sans drone, l’objet te donne son propre petit drone : il marche dès le premier exemplaire.',
          'With no drones, the item gives you its own small drone: it works from the first copy.',
        ),
      },
    ],
    howTo: [
      L(
        'Pose la Balise : piratage près des coffres et des drones à réparer : elle achète aussi les drones.',
        'Drop Beacon: Hacking near chests and broken drones: it buys the drones too.',
      ),
      L(
        'Depuis Alloyed Collective, les drones visent ta cible et restent près de toi. Les Pièces détachées ont été réduites de moitié mais restent le cœur du build.',
        'Since Alloyed Collective, drones focus your target and stay close. Spare Drone Parts was cut by half but is still the core of the build.',
      ),
    ],
    sources: [
      { label: 'Captain', url: wiki('Captain') },
      { label: 'Spare Drone Parts', url: wiki('Spare_Drone_Parts') },
      { label: 'The Back-up', url: wiki('The_Back-up') },
      { label: 'Box of Dynamite', url: wiki('Box_of_Dynamite') },
      { label: 'Alloyed Collective Update', url: wiki('Alloyed_Collective_Update') },
      { label: 'Steam: Thoughts on Captain?', url: 'https://steamcommunity.com/app/632360/discussions/0/2945872608904828863' },
    ],
  },

  // ------------------------------------------------------------ Railgunner
  {
    slug: 'railgunner-weak-point-crits',
    survivor: 'railgunner',
    name: L('Points faibles critiques', 'Weak point crits'),
    tagline: L('Un tir, une cible en moins.', 'One shot, one less target.'),
    tag: L('Visée précise · SotV', 'Precise aim · SotV'),
    summary: L(
      'La Tireuse d’élite n’est critique qu’en touchant un point faible, mais toute sa chance de critique devient des dégâts critiques. Les objets de critique multiplient donc chaque tir réussi du M99 et de la Surcharge.',
      'Railgunner only crits on weak points, but all her crit chance turns into crit damage. Crit items multiply every M99 and Supercharge shot that lands.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Système de munitions intelligentes XQR · M99 Sniper · Dispositif de choc · Surcharge',
        'XQR Smart Round System · M99 Sniper · Concussion Device · Supercharge',
      ),
    },
    items: [
      { id: 'critglasses', core: true, role: L('×5 ou plus · +10 % de dégâts critiques chacune', '×5 or more · +10% crit damage each') },
      { id: 'critdamage', core: true, role: L('×1 ou plus · +100 % de dégâts critiques (SotV)', '×1 or more · +100% crit damage (SotV)') },
      { id: 'crowbar', role: L('×2 ou plus · premier tir sur cible intacte', '×2 or more · opening shot on a fresh target') },
      { id: 'firering', role: L('×1 · tornade sur les gros tirs', '×1 · tornado on big shots') },
      { id: 'icering', role: L('×1 · ralentit la cible touchée', '×1 · slows the target hit') },
      { id: 'attackspeedoncrit', role: L('×1 · fenêtre de rechargement plus large', '×1 · wider reload window') },
      { id: 'bossdamagebonus', role: L('×2 ou plus · contre les boss', '×2 or more · against bosses') },
      { id: 'critonuse', role: L('Équipement · +100 % de dégâts critiques 8 s', 'Equipment · +100% crit damage for 8 s') },
    ],
    synergies: [
      {
        items: ['critglasses', 'critdamage'],
        text: L(
          'Ses critiques partent de ×2 et chaque % de chance de critique ajoute 1 % de dégâts critiques : les Lunettes restent utiles au-delà de 10.',
          'Her crits start at ×2 and each 1% crit chance adds 1% crit damage: Glasses stay useful past 10 copies.',
        ),
      },
      {
        items: ['critonuse'],
        text: L(
          'L’Interface oculaire devient +100 % de dégâts critiques sur les points faibles pendant 8 s : garde-la pour un boss et ta Surcharge.',
          'Ocular HUD becomes +100% crit damage on weak points for 8 s: save it for a boss and your Supercharge.',
        ),
      },
      {
        items: ['firering', 'icering', 'bossdamagebonus'],
        text: L(
          'Le M99 (1000 %) passe le seuil de 400 % des bracelets à chaque tir. Les critiques et les Munitions perforantes ne comptent pas pour ce seuil.',
          'M99 (1000%) clears the bands’ 400% threshold on every shot. Crits and Armor-Piercing Rounds do not count toward that threshold.',
        ),
      },
      {
        items: ['attackspeedoncrit'],
        text: L(
          'Chaque point faible touché donne de la vitesse d’attaque, et la zone du rechargement parfait s’élargit avec la vitesse d’attaque.',
          'Every weak point hit grants attack speed, and the perfect reload zone widens with attack speed.',
        ),
      },
    ],
    howTo: [
      L(
        'Après un tir du M99, réussis le rechargement actif : tu recharges plus vite et ton tir suivant gagne +500 % de dégâts. Rater bloque le tir environ 2 s.',
        'After an M99 shot, land the Active Reload: you reload faster and your next shot gets +500% damage. Missing locks you out for about 2 s.',
      ),
      L(
        'La Surcharge (4000 %) multiplie ses dégâts critiques par 1,5, puis coupe tes armes 5 s. Ta compétence utilitaire reste disponible pour fuir.',
        'Supercharge (4000%) multiplies its crit damage by 1.5, then disables your weapons for 5 s. Your utility skill still works to get away.',
      ),
      L(
        'Les munitions XQR ne sont jamais critiques : garde-les pour les petits ennemis.',
        'XQR rounds never crit: keep them for small enemies.',
      ),
    ],
    sources: [
      { label: 'Railgunner', url: wiki('Railgunner') },
      { label: 'Lens-Maker’s Glasses', url: wiki('Lens-Maker%27s_Glasses') },
      { label: 'Kjaro’s Band', url: wiki('Kjaro%27s_Band') },
      { label: 'Ocular HUD', url: wiki('Ocular_HUD') },
      { label: 'Rogue Ranker: Railgunner', url: 'https://rogueranker.com/railgunner-ror2/' },
    ],
  },
  {
    slug: 'railgunner-hh44-crowd',
    survivor: 'railgunner',
    name: L('HH44 anti-foule', 'HH44 crowd control'),
    tagline: L('Tenir les groupes à distance sans arrêter de tirer.', 'Hold off crowds without ever stopping.'),
    tag: L('Plus tolérant · SotV', 'More forgiving · SotV'),
    summary: L(
      'Le point faible de la Tireuse d’élite, ce sont les groupes. Ici, les munitions XQR et le HH44, rapide et perforant, déclenchent des effets à l’impact en continu ; la Cryocharge gèle sans couper tes armes.',
      'Railgunner’s weak spot is crowds. Here XQR rounds and the fast, piercing HH44 set off on-hit effects nonstop; Cryocharge freezes without disabling your weapons.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Système de munitions intelligentes XQR · HH44 Tireur de précision · Dispositif de champs polaire · Cryocharge',
        'XQR Smart Round System · HH44 Marksman · Polar Field Device · Cryocharge',
      ),
    },
    items: [
      { id: 'chainlightning', core: true, role: L('×2 ou plus · éclairs en chaîne', '×2 or more · chain lightning') },
      { id: 'missile', core: true, role: L('×1 ou plus · missiles réguliers', '×1 or more · steady missiles') },
      { id: 'syringe', role: L('×3 ou plus · plus de tirs, plus d’effets', '×3 or more · more shots, more procs') },
      { id: 'critglasses', role: L('×3 ou plus · dégâts des points faibles', '×3 or more · weak point damage') },
      { id: 'healoncrit', role: L('×1 ou plus · soin sur chaque point faible', '×1 or more · heal on every weak point') },
      { id: 'slowonhit', role: L('×1 · cibles lentes, plus faciles à viser', '×1 · slow targets, easier to aim at') },
      { id: 'hoof', role: L('×2 ou plus · garder la distance', '×2 or more · keep your distance') },
    ],
    synergies: [
      {
        items: ['chainlightning', 'missile'],
        text: L(
          'Les munitions XQR et le HH44 ont un coefficient de proc de 1,0 : chaque impact a sa pleine chance de lancer éclairs et missiles.',
          'XQR rounds and HH44 have a 1.0 proc coefficient: every hit gets its full chance to fire lightning and missiles.',
        ),
      },
      {
        items: ['healoncrit', 'critglasses'],
        text: L(
          'Les munitions XQR ne sont jamais critiques : la Faux soigne seulement sur les points faibles touchés au HH44, mais à coup sûr. Sa chance de critique devient des dégâts critiques.',
          'XQR rounds never crit: the Scythe only heals on HH44 weak point hits, but every time. Its crit chance becomes crit damage.',
        ),
      },
      {
        items: ['slowonhit'],
        text: L(
          'Un ennemi ralenti est plus facile à toucher au point faible.',
          'A slowed enemy is easier to hit in the weak point.',
        ),
      },
    ],
    howTo: [
      L(
        'Le HH44 n’a pas de rechargement actif : tire en continu et vise les points faibles quand tu peux.',
        'HH44 has no Active Reload: keep firing and aim for weak points when you can.',
      ),
      L(
        'La Cryocharge (2000 %) gèle les ennemis touchés ; un ennemi gelé sous 30 % de PV meurt au coup suivant. Les boss ne gèlent pas.',
        'Cryocharge (2000%) freezes enemies hit; a frozen enemy under 30% health dies to the next hit. Bosses do not freeze.',
      ),
      L(
        'Le Dispositif de champs polaire ralentit ennemis et projectiles pendant 12 s : pose-le quand un groupe arrive sur toi.',
        'Polar Field Device slows enemies and projectiles for 12 s: drop it when a group closes in.',
      ),
    ],
    sources: [
      { label: 'Railgunner', url: wiki('Railgunner') },
      { label: 'Harvester’s Scythe', url: wiki('Harvester%27s_Scythe') },
      { label: 'Rogue Ranker: Railgunner', url: 'https://rogueranker.com/railgunner-ror2/' },
    ],
  },

  // ------------------------------------------------------------ Void Fiend
  {
    slug: 'voidfiend-crit-corruption',
    survivor: 'voidfiend',
    name: L('Corruption par critiques', 'Crit corruption'),
    tagline: L('Corrompu plus vite, plus longtemps.', 'Corrupt sooner, stay longer.'),
    tag: L('Moyen · SotV', 'Medium · SotV'),
    summary: L(
      'À 100 % de corruption, le Démon du vide passe en forme corrompue : rayon à courte portée bien plus puissant et +100 d’armure. Les coups critiques remplissent la jauge, la vitesse d’attaque accélère le rayon corrompu.',
      'At 100% Corruption, Void Fiend switches to its corrupted form: a much stronger short-range beam and +100 armor. Crits fill the meter, attack speed speeds up the corrupted beam.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L('Noyade · Inondation · Intrusion · Suppression', 'Drown · Flood · Trespass · Suppress'),
    },
    items: [
      { id: 'critglasses', core: true, role: L('×5 ou plus · les critiques remplissent la jauge', '×5 or more · crits fill the meter') },
      { id: 'attackspeedoncrit', core: true, role: L('×1 ou plus · plus de tirs, plus de critiques', '×1 or more · more shots, more crits') },
      { id: 'syringe', role: L('×2 ou plus · Noyade corrompue plus rapide', '×2 or more · faster corrupted Drown') },
      { id: 'secondaryskillmagazine', role: L('×1 ou plus · charges d’Inondation', '×1 or more · Flood charges') },
      { id: 'bear', role: L('×2 ou plus · bloque le coût de Suppression', '×2 or more · blocks Suppress’s cost') },
      { id: 'firering', role: L('×1 · déclenché par Inondation', '×1 · set off by Flood') },
      { id: 'critonuse', role: L('Équipement · garde la jauge pleine', 'Equipment · keeps the meter full') },
    ],
    synergies: [
      {
        items: ['critglasses', 'attackspeedoncrit'],
        text: L(
          'Chaque critique ajoute de la corruption, davantage sur une attaque à fort coefficient de proc comme Noyade (1,0).',
          'Every crit adds Corruption, more on an attack with a high proc coefficient such as Drown (1.0).',
        ),
      },
      {
        items: ['secondaryskillmagazine'],
        text: L(
          'Toutes tes charges d’Inondation reviennent à chaque changement de forme : vide-les avant de basculer.',
          'All your Flood charges come back on every form change: empty them before you switch.',
        ),
      },
      {
        items: ['bear'],
        text: L(
          'La Suppression corrompue coûte 25 % de tes PV max pour gagner 25 % de corruption ; la Mauvaise passe peut bloquer ce coût.',
          'Corrupted Suppress costs 25% of your max health to gain 25% Corruption; Tougher Times can block that cost.',
        ),
      },
      {
        items: ['critonuse'],
        text: L(
          'Pendant la Noyade corrompue, l’Interface oculaire garde la jauge presque pleine.',
          'During corrupted Drown, Ocular HUD keeps the meter close to full.',
        ),
      },
    ],
    howTo: [
      L(
        'Tout soin réduit la corruption, dans les deux formes : évite Kit de soin, Champignon pleureur et Fleur putride.',
        'Any healing lowers Corruption, in both forms: avoid Medkit, Weeping Fungus and Corpsebloom.',
      ),
      L(
        'Chaque transformation recharge tes compétences et donne 0,5 s d’invulnérabilité : bascule juste avant un gros coup.',
        'Every transformation resets your cooldowns and gives 0.5 s of invulnerability: switch right before a big hit.',
      ),
      L(
        'En forme normale, Suppression échange 25 % de corruption contre 25 % de PV : reste à distance avec Noyade pendant que la jauge monte.',
        'In normal form, Suppress trades 25% Corruption for 25% health: stay at range with Drown while the meter fills.',
      ),
    ],
    sources: [
      { label: 'Void Fiend', url: wiki('Void_Fiend') },
      { label: 'Lens-Maker’s Glasses', url: wiki('Lens-Maker%27s_Glasses') },
      { label: 'Steam: Void Fiend feels really bad', url: 'https://steamcommunity.com/app/632360/discussions/0/3189116298882415232' },
      { label: 'Rogue Ranker: Void Fiend', url: 'https://rogueranker.com/void-fiend-ror2/' },
    ],
  },
  {
    slug: 'voidfiend-void-hoard',
    survivor: 'voidfiend',
    name: L('Collection du vide', 'Void hoard'),
    tagline: L('Chaque objet du vide relève ta corruption minimale.', 'Every void item raises your minimum Corruption.'),
    tag: L('Spécialisé · SotV · coffres du vide', 'Niche · SotV · void chests'),
    summary: L(
      'Chaque objet du vide relève de 2 % la corruption minimale du Démon du vide. Vers 13 objets, la Suppression en forme normale se relance sans fin ; avec le Râtelier de récupération, elle soigne deux fois plus.',
      'Each void item raises Void Fiend’s minimum Corruption by 2%. Around 13 items, normal-form Suppress can be used endlessly; with Rejuvenation Rack it heals twice as much.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L('Noyade · Inondation · Intrusion · Suppression', 'Drown · Flood · Trespass · Suppress'),
    },
    items: [
      { id: 'increasehealing', core: true, role: L('×1 · Suppression soigne deux fois plus', '×1 · Suppress heals twice as much') },
      { id: 'chainlightningvoid', core: true, role: L('×2 ou plus · dégâts de groupe', '×2 or more · crowd damage') },
      { id: 'missilevoid', role: L('×1 ou plus · missiles tant que le bouclier tient', '×1 or more · missiles while shield holds') },
      { id: 'bleedonhitvoid', role: L('×2 ou plus · effondrements', '×2 or more · Collapse') },
      { id: 'critglassesvoid', role: L('×1 ou plus · exécute les non-boss', '×1 or more · executes non-bosses') },
      { id: 'elementalringvoid', role: L('×1 · trou noir déclenché par Inondation', '×1 · black hole set off by Flood') },
      { id: 'bearvoid', role: L('×1 ou plus · bloque le coût de Suppression', '×1 or more · blocks Suppress’s cost') },
      { id: 'equipmentmagazinevoid', role: L('×1 ou plus · charges de Suppression', '×1 or more · Suppress charges') },
    ],
    synergies: [
      {
        items: ['increasehealing'],
        text: L(
          'La Suppression retire toujours 25 % de corruption, quel que soit le soin : le Râtelier double le soin sans rien coûter de plus.',
          'Suppress always removes 25% Corruption whatever it heals: the Rack doubles the heal at no extra cost.',
        ),
      },
      {
        items: ['bearvoid', 'equipmentmagazinevoid'],
        text: L(
          'En forme corrompue, Espaces aseptisés bloque le coût de la Suppression et la Cellule de Lysat ajoute des charges : tu prolonges la forme sans perdre de PV.',
          'In corrupted form, Safer Spaces blocks Suppress’s cost and Lysate Cell adds charges: you extend the form without losing health.',
        ),
      },
      {
        items: ['elementalringvoid'],
        text: L(
          'Inondation dépasse 400 % : le trou noir regroupe les ennemis, et l’Inondation corrompue, au rayon doublé, les frappe tous.',
          'Flood exceeds 400%: the black hole bunches enemies up, and corrupted Flood, with twice the radius, hits them all.',
        ),
      },
    ],
    howTo: [
      L(
        'Ouvre les coffres et cellules du vide. Chaque objet du vide ralentit aussi la baisse de la jauge en forme corrompue.',
        'Open void chests and cradles. Each void item also slows the meter’s drain in corrupted form.',
      ),
      L(
        'Une Cellule de Lysat ramassée en forme corrompue ne compte qu’à la transformation suivante.',
        'A Lysate Cell picked up in corrupted form only counts from the next transformation.',
      ),
      L(
        'À 50 objets du vide, tu restes corrompu en permanence : la forme normale devient inaccessible.',
        'At 50 void items you stay corrupted for good: the normal form is no longer available.',
      ),
    ],
    sources: [
      { label: 'Void Fiend', url: wiki('Void_Fiend') },
      { label: 'Safer Spaces', url: wiki('Safer_Spaces') },
      { label: 'Singularity Band', url: wiki('Singularity_Band') },
      { label: 'Rejuvenation Rack', url: wiki('Rejuvenation_Rack') },
      { label: 'Rogue Ranker: Void Fiend', url: 'https://rogueranker.com/void-fiend-ror2/' },
    ],
  },

  // ------------------------------------------------------------ Seeker
  {
    slug: 'seeker-endless-sojourn',
    survivor: 'seeker',
    name: L('Voyage prolongé', 'Endless Sojourn'),
    tagline: L('Rester en vol, encaisser, exploser.', 'Stay airborne, soak it up, explode.'),
    tag: L('SotS requis · intermédiaire', 'SotS required · intermediate'),
    summary: L(
      'Voyage te coûte des PV en continu, mais par petites pertes fixes : les objets qui réduisent ou soignent chaque perte prolongent le vol et grossissent l’explosion. Vrille spirituelle donne de la barrière à chaque touche ; Méditation fait monter la Sérénité.',
      'Sojourn drains your health constantly, but in small fixed ticks: items that shrink or heal each tick keep you flying longer and grow the explosion. Soul Spiral grants barrier on every hit; Meditate builds Tranquility.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L('Frappe spirituelle · Vrille spirituelle · Voyage · Méditation', 'Spirit Punch · Soul Spiral · Sojourn · Meditate'),
    },
    items: [
      { id: 'armorplate', core: true, role: L('×3 ou plus · réduit chaque perte de PV de Voyage', '×3 or more · shrinks every Sojourn health tick') },
      { id: 'parentegg', core: true, role: L('×1 ou plus · soigne à chaque perte de PV de Voyage', '×1 or more · heals on every Sojourn tick') },
      { id: 'secondaryskillmagazine', role: L('×2 ou plus · plus de Vrilles, donc plus de barrière', '×2 or more · more Spirals, so more barrier') },
      { id: 'sprintarmor', role: L('×1 ou plus · Voyage compte comme un sprint', '×1 or more · Sojourn counts as sprinting') },
      { id: 'sprintwisp', role: L('Bonus · tire pendant tout le vol', 'Bonus · fires during the whole flight') },
      { id: 'thorns', role: L('×1 · se déclenche aussi sur tes propres pertes de PV', '×1 · also triggers on your own health loss') },
      { id: 'nearbydamagebonus', role: L('×3 ou plus · elle se bat surtout de près', '×3 or more · she mostly fights up close') },
    ],
    synergies: [
      {
        items: ['armorplate', 'parentegg'],
        text: L(
          'Voyage retire 5 % de tes PV de base toutes les 0,2 s : des pertes petites et fixes. L’Armure de répulsion réduit chacune et la Planula soigne à chacune ; ensemble, elles peuvent presque l’annuler.',
          'Sojourn takes 5% of your base health every 0.2 s: small, fixed ticks. Repulsion Armor Plate shrinks each one and Planula heals on each one; together they can nearly cancel it.',
        ),
      },
      {
        items: ['sprintarmor', 'sprintwisp'],
        text: L(
          'Voyage compte comme un sprint : le Bouclier de la rose donne son armure et le Petit disciple lance ses feux follets pendant tout le vol.',
          'Sojourn counts as sprinting: Rose Buckler grants its armor and Little Disciple fires its wisps for the whole flight.',
        ),
      },
    ],
    howTo: [
      L(
        'Vrille spirituelle donne de la barrière à chaque touche : tant que tu frappes des ennemis, elle prolonge nettement Voyage.',
        'Soul Spiral grants barrier on every hit: as long as you keep hitting enemies, it greatly extends Sojourn.',
      ),
      L(
        'Plus Voyage dure, plus l’explosion fait mal. Réactive la compétence pour exploser ; si tes PV tombent trop bas, le vol s’arrête tout seul.',
        'The longer Sojourn lasts, the harder the explosion hits. Use the skill again to explode; if your health drops too low, the flight ends on its own.',
      ),
      L(
        'Réussis chaque Méditation : chaque Sérénité renforce tes compétences, jusqu’à 7. À 7, tu obtiens Salut, qui te ranime à ta mort. Une séquence ratée allonge la recharge.',
        'Land every Meditate: each Tranquility empowers your skills, up to 7. At 7 you get Saving Grace, which revives you when you die. A failed sequence lengthens the cooldown.',
      ),
      L(
        'Variante risquée : avec Transcendance, Voyage ne te coûte presque plus rien, mais tes soins ne servent plus.',
        'Risky variant: with Transcendence, Sojourn costs you almost nothing, but your healing stops mattering.',
      ),
    ],
    sources: [
      { label: 'Seeker', url: wiki('Seeker') },
      { label: 'Planula', url: wiki('Planula') },
      { label: 'Repulsion Armor Plate', url: wiki('Repulsion_Armor_Plate') },
      { label: 'Razorwire', url: wiki('Razorwire') },
      { label: 'ItemLevel: Seeker guide', url: 'https://itemlevel.net/risk-of-rain-2-seeker-complete-guide-seekers-of-the-storm-dlc/' },
    ],
  },

  // ------------------------------------------------------------ False Son
  {
    slug: 'falseson-max-growth',
    survivor: 'falseson',
    name: L('Croissance maximale', 'Max Growth'),
    tagline: L('Chaque PV en plus, c’est une pique en plus.', 'Every extra HP is one more spike.'),
    tag: L('SotS requis · facile · Spalière : SotV', 'SotS required · easy · Pauldron: SotV'),
    summary: L(
      'Les PV bonus de tes objets nourrissent la Croissance : plus de Piques lunaires et un Laser du Père plus long. Les piques en réserve donnent vitesse d’attaque et armure, les piques lancées vitesse et régénération.',
      'Bonus health from your items feeds Growth: more Lunar Spikes and a longer Laser of the Father. Spikes in reserve grant attack speed and armor; spent spikes grant movement speed and regen.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Bâton de l’Oublié · Piques lunaires · Pas des frères · Laser du Père',
        'Club of the Forsaken · Lunar Spikes · Step of the Brothers · Laser of the Father',
      ),
    },
    items: [
      { id: 'flathealth', core: true, role: L('×5 ou plus · environ une pique par steak au début', '×5 or more · about one spike per steak early on') },
      { id: 'halfspeeddoublehealth', core: true, role: L('×1 · double tes PV, donc ta Croissance', '×1 · doubles your HP, so your Growth') },
      { id: 'infusion', role: L('×1 ou plus · des PV permanents à chaque élimination', '×1 or more · permanent HP on every kill') },
      { id: 'knurl', role: L('×1 ou plus · PV et régénération', '×1 or more · health and regen') },
      { id: 'secondaryskillmagazine', role: L('×1 ou plus · une pique de plus par chargeur', '×1 or more · one more spike per magazine') },
      { id: 'tonic', role: L('Optionnel · gros bonus de PV pendant l’effet', 'Optional · big health bonus while active') },
    ],
    synergies: [
      {
        items: ['halfspeeddoublehealth', 'flathealth'],
        text: L(
          'La Spalière double tous tes PV max, steaks compris : la Croissance grimpe d’un coup. La lenteur est compensée par tes piques lancées, qui donnent de la vitesse.',
          'The Pauldron doubles all your max health, steaks included: Growth jumps at once. The slowdown is offset by your spent spikes, which grant speed.',
        ),
      },
      {
        items: ['secondaryskillmagazine', 'flathealth'],
        text: L(
          'Les piques du Chargeur s’ajoutent à celles de la Croissance, mais seules celles de la Croissance allongent le Laser du Père.',
          'Backup Magazine spikes add to the Growth ones, but only Growth spikes lengthen Laser of the Father.',
        ),
      },
    ],
    howTo: [
      L(
        'Combat court : garde tes piques pour la vitesse d’attaque et l’armure. Combat long ou fuite : lance-les pour la vitesse et la régénération.',
        'Short fight: keep your spikes for attack speed and armor. Long fight or escape: throw them for speed and regen.',
      ),
      L(
        'Les Piques lunaires appliquent la Ruine lunaire, cumulable : la cible subit plus de dégâts de toutes les sources pendant 5 s. Vide tes piques sur un boss, puis frappe avec le coup chargé du bâton.',
        'Lunar Spikes apply Lunar Ruin, which stacks: the target takes more damage from all sources for 5 s. Empty your spikes on a boss, then hit with the club’s charged slam.',
      ),
      L(
        'Le Laser du Père recharge toutes tes piques : lance-le quand ta réserve est vide.',
        'Laser of the Father refills all your spikes: fire it when your reserve is empty.',
      ),
      L(
        'Le bouclier ne compte pas pour la Croissance : préfère les vrais PV max.',
        'Shield does not count for Growth: prefer real max health.',
      ),
    ],
    sources: [
      { label: 'False Son', url: wiki('False_Son') },
      { label: 'Steam: False Son is BROKEN', url: 'https://steamcommunity.com/app/632360/discussions/0/4764332864599487898' },
      { label: 'Rogue Ranker: False Son', url: 'https://rogueranker.com/false-son-ror2/' },
    ],
  },

  // ------------------------------------------------------------ CHEF
  {
    slug: 'chef-oil-and-fire',
    survivor: 'chef',
    name: L('Huile + brûlures', 'Oil + burns'),
    tagline: L('Huiler, saisir, embraser.', 'Oil, sear, ignite.'),
    tag: L('Recommandé · Grillade + Nappage · SotS', 'Recommended · Sear + Glaze · SotS'),
    summary: L(
      'Un build centré sur les brûlures de la Grillade. Le Nappage huile les cibles, qui subissent alors des brûlures quadruplées ; l’Essence propage le feu après les premières éliminations.',
      'A build around Sear’s burns. Glaze oils targets, which then take quadruple burn damage; Gasoline spreads the fire after the first kills.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L('Émincé · Grillade · Roulade · Nappage', 'Dice · Sear · Roll · Glaze'),
    },
    items: [
      { id: 'strengthenburn', core: true, role: L('×1 · brûlures ×4 · SotV', '×1 · burns ×4 · SotV') },
      { id: 'igniteonkill', core: true, role: L('Plusieurs · propage le feu', 'Several · spreads fire') },
      { id: 'secondaryskillmagazine', core: true, role: L('Plusieurs · plus de Grillades', 'Several · more Sear charges') },
      { id: 'nearbydamagebonus', role: L('×1 ou plus · la Grillade se donne de près', '×1 or more · Sear is a close-range skill') },
      { id: 'syringe', role: L('Quelques-unes · Émincé plus rapide', 'A few · faster Dice') },
      { id: 'hoof', role: L('Mobilité · rester au contact', 'Mobility · stay in range') },
      { id: 'missile', role: L('Optionnel · dégâts à l’impact', 'Optional · on-hit damage') },
    ],
    synergies: [
      {
        items: ['strengthenburn', 'secondaryskillmagazine'],
        text: L(
          'Le Réservoir d’ignition agit sur la Grillade, la Grillade renforcée et les flaques d’huile embrasée : chaque charge en plus est une brûlure ×4 de plus.',
          'Ignition Tank boosts Sear, boosted Sear and ignited oil pools: every extra charge is one more ×4 burn.',
        ),
      },
      {
        items: ['nearbydamagebonus', 'strengthenburn'],
        text: L(
          'Le Cristal augmente aussi les dégâts sur la durée : tes brûlures font +20 % sur les ennemis à moins de 13 m.',
          'Focus Crystal also boosts damage over time: your burns deal +20% to enemies within 13 m.',
        ),
      },
    ],
    howTo: [
      L(
        'Combo : Nappage (huile + affaiblissement), puis Grillade. Une cible huilée subit des brûlures quadruplées. Garde la Roulade pour entrer au contact.',
        'Combo: Glaze (oil + weaken), then Sear. An oiled target takes quadruple burn damage. Keep Roll to close the distance.',
      ),
      L(
        'Surprise du CHEF : un ennemi tué après avoir été touché par au moins deux compétences différentes laisse de la nourriture qui soigne.',
        'CHEF’s Kiss: an enemy killed after being hit by at least two different skills drops healing food.',
      ),
      L(
        'Sans Survivors of the Void (pas de Réservoir), le combo huile + feu marche toujours : complète avec des dégâts généraux et des missiles.',
        'Without Survivors of the Void (no Ignition Tank) the oil + fire combo still works: fill in with general damage and missiles.',
      ),
    ],
    sources: [
      { label: 'CHEF', url: wiki('CHEF') },
      { label: 'Ignition Tank', url: wiki('Ignition_Tank') },
    ],
  },
  {
    slug: 'chef-ice-and-bands',
    survivor: 'chef',
    name: L('Glace + bracelets', 'Ice + bands'),
    tagline: L('Un gros glaçon pour les grandes cibles.', 'A big ice block for big targets.'),
    tag: L('Variante · Glacière + Oui, CHEF ! · SotS', 'Variant · Ice Box + Yes, CHEF! · SotS'),
    summary: L(
      'Avec les variantes débloquées, Oui, CHEF ! renforce la Glacière : un seul gros glaçon à 1 500 %, de quoi déclencher les bracelets à chaque fois.',
      'With the variants unlocked, Yes, CHEF! boosts Ice Box into one big 1500% ice block, enough to set off the bands every time.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L('Émincé · Glacière · Roulade · Oui, CHEF !', 'Dice · Ice Box · Roll · Yes, CHEF!'),
    },
    items: [
      { id: 'icering', core: true, role: L('×1 ou plus · 250 % des dégâts TOTAUX du glaçon', '×1 or more · 250% of the ice block’s TOTAL damage') },
      { id: 'firering', core: true, role: L('×1 ou plus · tornade sur la même cible', '×1 or more · tornado on the same target') },
      { id: 'secondaryskillmagazine', role: L('Plusieurs · plus de Glacières pour geler', 'Several · more Ice Box to freeze') },
      { id: 'missile', role: L('Optionnel · dégâts à l’impact', 'Optional · on-hit damage') },
      { id: 'hoof', role: L('Mobilité', 'Mobility') },
      { id: 'feather', role: L('Mobilité verticale', 'Vertical mobility') },
    ],
    synergies: [
      {
        items: ['icering', 'firering'],
        text: L(
          'Le glaçon renforcé (1 500 %) dépasse largement le seuil de 400 % des bracelets, et Oui, CHEF ! revient toutes les 10 s, comme eux : les deux partent à chaque combo.',
          'The boosted ice block (1500%) is far above the bands’ 400% threshold, and Yes, CHEF! comes back every 10 s, just like them: both go off on every combo.',
        ),
      },
    ],
    howTo: [
      L('Combo : Oui, CHEF !, puis tout de suite la Glacière renforcée.', 'Combo: Yes, CHEF!, then the boosted Ice Box right away.'),
      L(
        'Une Roulade bien chargée (jusqu’à 600 %) passe aussi le seuil des bracelets s’ils sont prêts.',
        'A well-charged Roll (up to 600%) also clears the bands’ threshold if they are ready.',
      ),
      L(
        'Le glaçon renforcé gèle tout autour de lui, mais pas les boss : contre eux, ce sont ses dégâts et ceux des bracelets qui comptent.',
        'The boosted ice block freezes everything around it, but not bosses: against them its damage and the bands’ is what matters.',
      ),
    ],
    sources: [
      { label: 'CHEF', url: wiki('CHEF') },
      { label: 'Kjaro’s Band', url: wiki('Kjaro%27s_Band') },
    ],
  },

  // ------------------------------------------------------------ Drifter
  {
    slug: 'drifter-scrap-hoard',
    survivor: 'drifter',
    name: L('Débris en réserve', 'Scrap hoard'),
    tagline: L('Garde tes débris : ce sont tes stats.', 'Keep your scrap: it is your stats.'),
    tag: L('AC requis · intermédiaire', 'AC required · intermediate'),
    summary: L(
      'Avec Trésor de détritus, chaque débris dans ton inventaire donne un bonus selon sa couleur. Bidouillage casse un objet au sol en un débris de même couleur plus une copie temporaire : tu gardes le bonus et profites de l’objet un moment.',
      'With Trash to Treasure, every scrap in your inventory grants a bonus by colour. Tinker breaks an item on the ground into scrap of the same tier plus a temporary copy: you keep the bonus and use the item for a while.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L('Force brute · Nettoyer · Confiscation · Bidouillage', 'Blunt Force · Cleanup · Repossess · Tinker'),
    },
    items: [
      { id: 'scrapgreen', core: true, role: L('Plusieurs · +3 PV/s de régénération chacun', 'Several · +3 hp/s regen each') },
      { id: 'scrapred', role: L('×1 ou plus · +30 % de vitesse d’attaque chacun', '×1 or more · +30% attack speed each') },
      { id: 'scrapyellow', role: L('×1 ou plus · −15 % de recharge des compétences', '×1 or more · −15% skill cooldowns each') },
      { id: 'secondaryskillmagazine', core: true, role: L('×2 ou plus · Nettoyer est ta source de dégâts', '×2 or more · Cleanup is your main damage') },
      { id: 'equipmentmagazinevoid', role: L('×1 ou plus · Bidouillage plus souvent', '×1 or more · Tinker more often') },
      { id: 'bandolier', role: L('×1 ou plus · réinitialise aussi Bidouillage', '×1 or more · also resets Tinker') },
      { id: 'nearbydamagebonus', role: L('×2 ou plus · elle se bat de près', '×2 or more · she fights up close') },
    ],
    synergies: [
      {
        items: ['scrapgreen', 'scrapred', 'scrapyellow'],
        text: L(
          'Bidouillage sur un objet au sol : un débris de même couleur (bonus permanent) et une copie temporaire. Sur une imprimante 3D ou un multishop, il change l’objet proposé (2 fois maximum).',
          'Tinker on an item on the ground: scrap of the same tier (permanent bonus) and a temporary copy. On a 3D Printer or Multishop it rerolls the item on offer (2 times at most).',
        ),
      },
      {
        items: ['secondaryskillmagazine', 'scrapyellow'],
        text: L(
          'Nettoyer peut sauter sa recharge contre 2 détritus. Les charges en plus et la recharge réduite t’évitent de les dépenser : garde-les pour Bidouillage (8 détritus).',
          'Cleanup can skip its cooldown for 2 Junk. Extra charges and lower cooldowns save you that Junk: keep it for Tinker (8 Junk).',
        ),
      },
    ],
    howTo: [
      L(
        'Ne dépense pas tes débris dans les imprimantes sans raison : tant qu’ils sont dans ton inventaire, ils te renforcent.',
        'Do not spend your scrap at printers without a reason: as long as it sits in your inventory, it makes you stronger.',
      ),
      L(
        'Les détritus viennent surtout de Force brute et de Confiscation : attrape un ennemi, frappe avec le sac (Arme improvisée), puis lance-le (Mise au rebut).',
        'Junk comes mostly from Blunt Force and Repossess: bag an enemy, hit with the bag (Bludgeon), then throw it (Discard).',
      ),
      L(
        'Évite la Zoea fraîchement éclose : elle corrompt les objets jaunes, débris jaunes compris.',
        'Avoid Newly Hatched Zoea: it corrupts yellow items, Yellow Scrap included.',
      ),
      L(
        'En coop, préviens avant de bidouiller : tu peux transformer l’objet d’un coéquipier.',
        'In co-op, warn your team before you Tinker: you can transform a teammate’s item.',
      ),
    ],
    sources: [
      { label: 'Drifter', url: wiki('Drifter') },
      { label: 'Vortex Gaming: Drifter guide', url: 'https://vortexgaming.io/en/postdetail/600170' },
    ],
  },
  {
    slug: 'drifter-boss-stockpile',
    survivor: 'drifter',
    name: L('Réserve pour le boss', 'Boss stockpile'),
    tagline: L('Prépare le tas, ramasse tout au bon moment.', 'Build the pile, grab it all at the right time.'),
    tag: L('AC requis · facile · spéciale de départ', 'AC required · easy · starting special'),
    summary: L(
      'Réutiliser transforme 8 détritus en 4 objets temporaires. Ils ne s’usent qu’une fois ramassés : laisse-les au sol pendant le niveau et ramasse tout juste avant le boss.',
      'Salvage turns 8 Junk into 4 temporary items. They only start to decay once picked up: leave them on the ground during the stage and grab them all right before the boss.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L('Force brute · Nettoyer · Confiscation · Réutiliser', 'Blunt Force · Cleanup · Repossess · Salvage'),
    },
    items: [
      { id: 'speedonpickup', core: true, role: L('×1 ou plus · chaque ramassage booste toutes tes stats', '×1 or more · every pickup boosts all stats') },
      { id: 'equipmentmagazinevoid', core: true, role: L('×1 ou plus · plus de Réutiliser', '×1 or more · more Salvage') },
      { id: 'duplicator', role: L('×1 ou plus · objets temporaires plus durables', '×1 or more · longer-lasting temporary items') },
      { id: 'clover', role: L('×1 · plus de chances d’obtenir des détritus', '×1 · better odds of getting Junk') },
      { id: 'bandolier', role: L('×1 ou plus · relance Réutiliser plus tôt', '×1 or more · Salvage ready sooner') },
      { id: 'secondaryskillmagazine', role: L('×1 ou plus · garde tes détritus pour Réutiliser', '×1 or more · saves your Junk for Salvage') },
    ],
    synergies: [
      {
        items: ['speedonpickup', 'duplicator'],
        text: L(
          'Détritus et objets temporaires comptent comme des ramassages pour la Compulsion du collectionneur. Le Duplicateur médiocre fait durer chaque objet temporaire 10 s de plus par cumul.',
          'Junk and temporary items count as pickups for Collector’s Compulsion. Substandard Duplicator makes each temporary item last 10 s longer per stack.',
        ),
      },
      {
        items: ['equipmentmagazinevoid', 'bandolier'],
        text: L(
          'Réutiliser a une longue recharge : la Cellule de Lysat ajoute des charges, la Cartouchière la réinitialise. Il faut toujours 8 détritus par activation.',
          'Salvage has a long cooldown: Lysate Cell adds charges and Bandolier resets it. Each use still costs 8 Junk.',
        ),
      },
    ],
    howTo: [
      L(
        'Pendant le niveau, empile les objets temporaires près du téléporteur, puis ramasse-les tous au début du combat de boss.',
        'During the stage, pile the temporary items near the teleporter, then grab them all when the boss fight starts.',
      ),
      L(
        'En coop, tu peux laisser des objets temporaires à tes coéquipiers.',
        'In co-op, you can leave temporary items for your teammates.',
      ),
    ],
    sources: [
      { label: 'Drifter', url: wiki('Drifter') },
      { label: 'Collector’s Compulsion', url: wiki('Collector%27s_Compulsion') },
      { label: 'Substandard Duplicator', url: wiki('Substandard_Duplicator') },
    ],
  },

  // ------------------------------------------------------------ Operator
  {
    slug: 'operator-drone-army',
    survivor: 'operator',
    name: L('Armée de drones', 'Drone army'),
    tagline: L('Chaque drone, c’est une commande de plus.', 'Every drone is one more command.'),
    tag: L('AC requis · facile', 'AC required · easy'),
    summary: L(
      'FORÇAGE-ADMINISTRATEUR stocke une charge par drone : achète tous les drones que tu croises. Les attaques commandées comptent comme les tiennes : elles utilisent tes dégâts et déclenchent tes objets.',
      'ADMIN-OVERRIDE stores one charge per drone: buy every drone you pass. Commanded attacks count as yours: they use your damage and trigger your items.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'H3-11 OCR modifié · FORÇAGE-ADMINISTRATEUR · Protocole ascension · Noyau d’éjection',
        'H3-11 OCR Custom · ADMIN-OVERRIDE · Ascent Protocol · Ejection Core',
      ),
    },
    items: [
      { id: 'droneweapons', core: true, role: L('×1 ou plus · drones renforcés + Col. Droneman', '×1 or more · stronger drones + Col. Droneman') },
      { id: 'dronesdropdynamite', core: true, role: L('×1 ou plus · dynamite + Lieutenant Bourdrone', '×1 or more · dynamite + Lt. Droneboy') },
      { id: 'moremissile', role: L('×1 · triple la salve du Drone missile', '×1 · triples the Missile Drone barrage') },
      { id: 'syringe', role: L('Plusieurs · plus de tirs par commande', 'Several · more shots per command') },
      { id: 'chainlightning', role: L('×1 ou plus · se déclenche sur les commandes', '×1 or more · triggers on commands') },
      { id: 'critatlowerelevation', role: L('Plusieurs · tu attaques souvent d’en haut', 'Several · you often attack from above') },
    ],
    synergies: [
      {
        items: ['droneweapons', 'dronesdropdynamite'],
        text: L(
          'Chaque objet ajoute un drone, donc une charge de commande. Commander le Col. Droneman met tous tes alliés en frénésie : +100 % de vitesse d’attaque pendant 5 s.',
          'Each item adds a drone, so one more command charge. Commanding Col. Droneman sends all your allies into a frenzy: +100% attack speed for 5 s.',
        ),
      },
      {
        items: ['syringe', 'dronesdropdynamite'],
        text: L(
          'Le nombre de tirs du Drone mitrailleur commandé et de bâtons largués par le Lieutenant Bourdrone augmente avec ta vitesse d’attaque.',
          'The number of shots from a commanded Gunner Drone and of sticks dropped by Lt. Droneboy grows with your attack speed.',
        ),
      },
      {
        items: ['moremissile', 'chainlightning'],
        text: L(
          'Le Drone missile commandé tire 6 missiles, chacun avec un coefficient de 1 : l’I.C.B.M de poche en fait 18, autant de chances de déclencher l’Ukulélé.',
          'A commanded Missile Drone fires 6 missiles, each with proc coefficient 1: Pocket I.C.B.M. turns that into 18, as many chances to trigger Ukulele.',
        ),
      },
    ],
    howTo: [
      L(
        'Achète les drones : le Drone missile et le Drone incinérateur font partie des meilleures commandes.',
        'Buy drones: Missile Drone and Incinerator Drone are among the best commands.',
      ),
      L(
        'Au Poste de combinaison de drones, le drone fusionné garde les charges de commande des drones utilisés et frappe plus fort.',
        'At a Drone Combiner Station, the merged drone keeps the command charges of the drones used and hits harder.',
      ),
      L(
        'Noyau d’éjection projette les ennemis en l’air et leur applique Nano-bug : tes compétences leur font plus de dégâts jusqu’à ce qu’ils retombent. Enchaîne vite.',
        'Ejection Core launches enemies and applies Nano Bug: your skills deal more damage to them until they land. Follow up fast.',
      ),
    ],
    sources: [
      { label: 'Operator', url: wiki('Operator') },
      { label: 'ADMIN-OVERRIDE', url: wiki('ADMIN-OVERRIDE') },
      { label: 'Box of Dynamite', url: wiki('Box_of_Dynamite') },
      { label: 'Pocket I.C.B.M.', url: wiki('Pocket_I.C.B.M.') },
      { label: 'Vortex Gaming: Operator guide', url: 'https://vortexgaming.io/en/postdetail/600765' },
    ],
  },
  {
    slug: 'operator-amp-core',
    survivor: 'operator',
    name: L('Bombe amplifiée', 'Amp Core bomb'),
    tagline: L('Charge le noyau, regarde-le exploser.', 'Charge the core, watch it blow.'),
    tag: L('AC requis · variante · Noyau d’amplification', 'AC required · variant · Amp Core'),
    summary: L(
      'Noyau d’amplification lance un drone qui attire l’attention des ennemis proches et stocke les dégâts qu’il reçoit, puis explose (300 à 2 000 %). Tire dessus et fais-le percuter par tes drones pour le charger.',
      'Amp Core launches a drone that taunts nearby enemies and stores the damage it takes, then explodes (300 to 2,000%). Shoot it and have your drones ram it to charge it.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'H3-11 OCR modifié · CMD-NUÉE · Protocole ascension · Noyau d’amplification',
        'H3-11 OCR Custom · CMD-SWARM · Ascent Protocol · Amp Core',
      ),
    },
    items: [
      { id: 'equipmentmagazinevoid', core: true, role: L('×1 ou plus · plusieurs noyaux à la fois', '×1 or more · several cores at once') },
      { id: 'droneweapons', core: true, role: L('×1 ou plus · indispensable pour un build de drones', '×1 or more · a must for a drone build') },
      { id: 'bandolier', role: L('×1 ou plus · rend tes noyaux aussitôt', '×1 or more · gives your cores back at once') },
      { id: 'syringe', role: L('Plusieurs · H3-11 se recharge plus vite', 'Several · H3-11 recharges faster') },
      { id: 'crowbar', role: L('Plusieurs · gros premier tir chargé', 'Several · big opening charged shot') },
      { id: 'critatlowerelevation', role: L('Plusieurs · critiques en attaquant d’en haut', 'Several · crits when attacking from above') },
    ],
    synergies: [
      {
        items: ['equipmentmagazinevoid', 'bandolier'],
        text: L(
          'Les noyaux se chargent entre eux : avec plusieurs charges, pose-les côte à côte pour une explosion en chaîne. La Cartouchière les rend aussitôt. Il te faut au moins autant de drones que de Cellules de Lysat.',
          'Cores charge each other: with several charges, drop them side by side for a chain explosion. Bandolier gives them right back. You need at least as many drones as Lysate Cells.',
        ),
      },
      {
        items: ['syringe', 'crowbar'],
        text: L(
          'H3-11 est Rapide : la vitesse d’attaque accélère la recharge de ses charges. Un tir chargé à fond avec le Pied-de-biche ouvre fort chaque combat.',
          'H3-11 is Rapid: attack speed refills its charges faster. A fully charged shot with Crowbar opens every fight hard.',
        ),
      },
    ],
    howTo: [
      L(
        'Lance le noyau dans un groupe : les ennemis proches le visent. Tire dessus avec H3-11 et cible-le avec CMD-NUÉE pour qu’il explose plus fort.',
        'Drop the core in a group: nearby enemies target it. Shoot it with H3-11 and aim CMD-SWARM at it so it explodes harder.',
      ),
      L(
        'Tes objets à l’impact ne se déclenchent ni en frappant le noyau ni avec son explosion : compte sur ses dégâts bruts.',
        'Your on-hit items trigger neither when you hit the core nor from its explosion: rely on its raw damage.',
      ),
      L(
        'CMD-NUÉE a une charge par drone ; ses coups critiques enflamment en plus.',
        'CMD-SWARM has one charge per drone; its critical strikes also ignite.',
      ),
    ],
    sources: [
      { label: 'Operator', url: wiki('Operator') },
      { label: 'Vortex Gaming: Operator guide', url: 'https://vortexgaming.io/en/postdetail/600765' },
    ],
  },

  // ------------------------------------------------------------ Enforcer
  {
    slug: 'enforcer-shotgun-shield',
    survivor: 'enforcer',
    name: L('Fusil + bouclier', 'Shotgun + shield'),
    tagline: L('Tenir la ligne, garder une sortie.', 'Hold the line, keep a way out.'),
    tag: L('Polyvalent · compétences de départ · HC', 'Versatile · starting skills · HC'),
    summary: L(
      'Le choix simple pour commencer : la position défensive bloque l’avant et transforme le fusil en arme perçante, la Charge de bouclier ouvre une sortie, le Point de ralliement protège l’équipe.',
      'The simple pick to start: Defensive Stance blocks the front and turns the shotgun into a piercing weapon, Shield Tackle opens a way out, Rally Point protects the team.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Balayage de tranchée · Protection en acier · Charge de bouclier · Point de ralliement',
        'Trenchbroom · Steel Protection · Shield Tackle · Rally Point',
      ),
    },
    items: [
      { id: 'syringe', core: true, role: L('Plusieurs · tir et rechargement plus rapides', 'Several · faster fire and reload') },
      { id: 'hoof', core: true, role: L('Plusieurs · la Charge va plus vite et plus loin', 'Several · faster, longer Shield Tackle') },
      { id: 'chainlightning', role: L('×1 ou plus · dégâts à l’impact', '×1 or more · on-hit damage') },
      { id: 'missile', role: L('×1 ou plus · dégâts à l’impact', '×1 or more · on-hit damage') },
      { id: 'wardonlevel', role: L('×1 · le Point de ralliement la plante', '×1 · Rally Point plants it') },
      { id: 'utilityskillmagazine', role: L('Confort · +2 charges de Charge de bouclier', 'Comfort · +2 Shield Tackle charges') },
    ],
    synergies: [
      {
        items: ['chainlightning', 'missile'],
        text: L(
          'En position défensive, le fusil tire 6 plombs perçants (coef. 0,7 chacun) : chaque plomb, sur chaque ennemi traversé, tente l’Ukulélé et le missile.',
          'In Defensive Stance the shotgun fires 6 piercing pellets (0.7 proc each): every pellet, on every enemy pierced, rolls for Ukulele and the missile.',
        ),
      },
      {
        items: ['utilityskillmagazine', 'hoof'],
        text: L(
          'Maintenir la Charge de bouclier consomme plus de charges pour aller plus loin : la Postcombustion en ajoute 2, et la vitesse de la charge suit ta vitesse de déplacement.',
          'Holding Shield Tackle spends more charges to go further: Hardlight Afterburner adds 2, and the dash speed follows your movement speed.',
        ),
      },
    ],
    howTo: [
      L(
        'La protection est frontale : baisse le bouclier et bouge si les ennemis passent derrière toi. Ressors juste après avoir bloqué un coup : il est renvoyé avec des dégâts ×6.',
        'The shield only covers the front: lower it and move if enemies get behind you. Exit right after blocking a hit: it is reflected for ×6 damage.',
      ),
      L(
        'Sortir de la position défensive recharge entièrement le fusil. Le Point de ralliement imite une zone de téléporteur : il donne de la barrière (plus à chaque élimination dans la zone) et plante ta Bannière de guerre.',
        'Leaving the stance fully reloads the shotgun. Rally Point mimics a teleporter zone: it grants barrier (more on every kill inside) and plants your Warbanner.',
      ),
      L('Aucun objet légendaire n’est nécessaire. La Plume d’Hopoo sert peu : en position défensive, le saut devient une courte ruée.', 'No legendary item is needed. Hopoo Feather helps little: in stance, jumping becomes a short lunge.'),
    ],
    sources: [
      { label: 'Enforcer', url: wiki('Enforcer') },
      { label: 'GamerBlurb: Enforcer build guide', url: 'https://gamerblurb.com/guides/risk-of-rain-2-enforcer-build-guide' },
    ],
  },
  {
    slug: 'enforcer-barrier-burst',
    survivor: 'enforcer',
    name: L('Barrière + explosion', 'Barrier + burst'),
    tagline: L('Accumuler. Bloquer. Faire exploser.', 'Stack. Block. Blow up.'),
    tag: L('Variante · Parafoudre · HC', 'Variant · Surge Protection · HC'),
    summary: L(
      'Le Parafoudre consomme toute ta barrière et tout ton bouclier pour alimenter son explosion : la protection devient des dégâts. Le Point de ralliement remplit la jauge avant chaque explosion.',
      'Surge Protection spends all your barrier and shield to fuel its blast: protection becomes damage. Rally Point fills the gauge before each blast.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Balayage de tranchée · Parafoudre · Charge de bouclier · Point de ralliement',
        'Trenchbroom · Surge Protection · Shield Tackle · Rally Point',
      ),
    },
    items: [
      { id: 'barrieronkill', core: true, role: L('Plusieurs · barrière à chaque élimination', 'Several · barrier on every kill') },
      { id: 'personalshield', core: true, role: L('Plusieurs · bouclier brûlé à chaque explosion', 'Several · shield spent on every blast') },
      { id: 'barrieronoverheal', role: L('×1 · les soins en trop deviennent barrière', '×1 · overhealing becomes barrier') },
      { id: 'tphealingnova', role: L('×1 · déclenchée par le Point de ralliement', '×1 · triggered by Rally Point') },
      { id: 'flathealth', role: L('Plusieurs · plus de barrière du Point de ralliement', 'Several · more Rally Point barrier') },
      { id: 'hoof', role: L('Mobilité · sortir après l’explosion', 'Mobility · get out after the blast') },
    ],
    synergies: [
      {
        items: ['barrieronkill', 'personalshield'],
        text: L(
          'Barrière et bouclier, de n’importe quelle source, sont le carburant du Parafoudre : plus tu en as, plus l’explosion est forte et large.',
          'Barrier and shield, from any source, are Surge Protection’s fuel: the more you have, the bigger and wider the blast.',
        ),
      },
      {
        items: ['tphealingnova', 'barrieronoverheal'],
        text: L(
          'Le Point de ralliement compte comme une zone de téléporteur : il déclenche la Marguerite de leptons, et à PV pleins son soin devient de la barrière grâce à l’Égide.',
          'Rally Point counts as a teleporter zone: it triggers Lepton Daisy, and at full health its heal turns into barrier through Aegis.',
        ),
      },
    ],
    howTo: [
      L(
        'Pose d’abord le Point de ralliement : barrière de 20 % de tes PV max, puis 10 % à chaque élimination dans la zone. Lance ensuite le Parafoudre : chaque coup bloqué ajoute de la barrière, et tout explose au bout de 5 s ou quand tu le réactives.',
        'Place Rally Point first: barrier worth 20% of your max health, then 10% per kill inside. Then use Surge Protection: every blocked hit adds barrier, and it all blows up after 5 s or when you press it again.',
      ),
      L(
        'Après l’explosion, ta protection est vide et le bouclier ne revient qu’après 7 s sans dégâts : prévois de te déplacer hors du danger.',
        'After the blast your protection is spent and shield only comes back after 7 s without damage: plan to move out of danger.',
      ),
    ],
    sources: [
      { label: 'Enforcer', url: wiki('Enforcer') },
      { label: 'GamerBlurb: Enforcer build guide', url: 'https://gamerblurb.com/guides/risk-of-rain-2-enforcer-build-guide' },
      { label: 'Lepton Daisy', url: wiki('Lepton_Daisy') },
    ],
  },
]

export const OFFICIAL_BY_SLUG = new Map(OFFICIAL_BUILDS.map((b) => [b.slug, b]))
