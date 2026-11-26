import type { DlcId, Loc } from '#/lib/types'

/**
 * Teleporters and portals shown on /teleporters. Names are the game's official ones (language files,
 * PORTAL_*_NAME, MAP_*_TITLE); every rule comes from the wiki page in `wiki`. Item ids are those of
 * src/data/items.json, checked by the test suite. `id` is the page anchor (/teleporters#<id>): keep it stable.
 */
export type Portal = {
  id: string
  kind: 'teleporter' | 'portal'
  name: Loc
  dlc: DlcId
  /** Accent colour of the card. Decorative, close to the portal's look in game. */
  color: string
  /** Where it leads. */
  leadsTo: Loc
  /** What you find there and what it is for. */
  what: Loc[]
  /** Each way to make it appear. */
  how: Loc[]
  notes?: Loc[]
  items?: string[]
  /** Wiki page (and section) the rules come from. */
  wiki: string
}

const L = (fr: string, en: string): Loc => ({ fr, en })
const wiki = (page: string) => `https://riskofrain2.wiki.gg/wiki/${page}`

/** General rules, shown above the list. */
export const PORTAL_RULES: Loc[] = [
  L(
    'Les portails ne s’ouvrent presque jamais seuls : une action faite avant l’événement du téléporteur fait apparaître un orbe qui tourne autour du téléporteur. L’orbe devient un portail une fois le téléporteur chargé et son boss vaincu.',
    'Portals almost never open on their own: an action done before the Teleporter event spawns an orb that circles the Teleporter. The orb turns into a portal once the Teleporter is charged and its boss is dead.',
  ),
  L(
    'Plusieurs orbes peuvent tourner autour du même téléporteur, mais on ne prend qu’une sortie : un des portails ou le téléporteur.',
    'Several orbs can circle the same Teleporter, but you only take one exit: one of the portals or the Teleporter itself.',
  ),
  L(
    'Les royaumes cachés mettent le chrono et la difficulté en pause et ne comptent pas comme une étape. Exceptions : le Locus du vide et le Planétarium comptent, le chrono y tourne.',
    'Hidden Realms pause the timer and difficulty and do not count as a stage. Exceptions: the Void Locus and the Planetarium do count, and the timer keeps running.',
  ),
  L(
    'Depuis l’étape 5, prendre un portail (bleu, doré, d’artefact…) te renvoie à l’étape 1 après le royaume caché, quel que soit l’alignement du téléporteur primordial.',
    'From stage 5, taking a portal (blue, gold, artifact…) sends you back to stage 1 after the Hidden Realm, whatever the Primordial Teleporter’s alignment.',
  ),
]

export const PORTALS: Portal[] = [
  // ------------------------------------------------------------ base game
  {
    id: 'teleporter',
    kind: 'teleporter',
    name: L('Téléporteur', 'Teleporter'),
    dlc: 'base',
    color: '#f07878',
    leadsTo: L('L’étape suivante', 'The next stage'),
    what: [
      L(
        'Objectif principal de chaque étape. L’activer lance l’événement du téléporteur : un boss et des vagues de monstres apparaissent, et une zone rouge d’environ 120 m de diamètre se forme.',
        'The main objective of each stage. Activating it starts the Teleporter event: a boss and waves of monsters spawn, and a red zone about 120 m wide forms.',
      ),
      L(
        'Il se charge seulement quand des joueurs sont dans la zone : 90 s au minimum si toute l’équipe y reste. Il faut aussi tuer le boss. À 99 %, les monstres cessent d’apparaître.',
        'It only charges while players are inside the zone: 90 s minimum if the whole team stays in. The boss must also die. At 99%, monsters stop spawning.',
      ),
      L(
        'Pendant la charge, les objets à acheter hors de la zone sont verrouillés (sauf les barils et les recycleurs).',
        'While it charges, interactables outside the zone are locked (except barrels and scrappers).',
      ),
      L(
        'Récompense : 1 objet vert par joueur, même mort. Chaque objet a 15 % de chances d’être l’objet de boss du boss vaincu. Chaque Autel de la Montagne activé avant ajoute +100 % d’objets.',
        'Reward: 1 green item per player, dead ones included. Each has a 15% chance to be the defeated boss’s boss item. Each Shrine of the Mountain activated beforehand adds +100% items.',
      ),
    ],
    how: [L('Un par étape, sur toutes les étapes normales, toujours loin du point d’arrivée. Des particules orange qui flottent autour aident à le repérer de loin.', 'One per stage on every normal stage, always far from where you land. Floating orange particles help you spot it from afar.')],
    notes: [
      L(
        'Convergence concentrée accélère la charge mais rétrécit la zone (3 exemplaires au maximum, pour toute l’équipe).',
        'Focused Convergence speeds up the charge but shrinks the zone (3 stacks at most, for the whole team).',
      ),
    ],
    items: ['focusconvergence'],
    wiki: wiki('Teleporter'),
  },
  {
    id: 'primordial-teleporter',
    kind: 'teleporter',
    name: L('Téléporteur primordial', 'Primordial Teleporter'),
    dlc: 'base',
    color: '#8fb8ff',
    leadsTo: L('Commencement (la lune, Mithrix) ou l’étape 1 (boucle)', 'Commencement (the moon, Mithrix) or stage 1 (loop)'),
    what: [
      L(
        'Il marche comme un téléporteur normal, mais on choisit sa destination. Avant de lancer l’événement, interagis avec ses flèches extérieures pour changer d’alignement.',
        'It works like a normal Teleporter, but you pick where it goes. Before starting the event, interact with its outer spires to change its alignment.',
      ),
      L(
        'Aligné avec la lune (spirale presque circulaire, par défaut) : direction Commencement et le boss final Mithrix. Aligné avec la planète (deux blocs face à face) : boucle vers l’étape 1.',
        'Aligned with the moon (near-circular spiral, the default): to Commencement and the final boss Mithrix. Aligned with the planet (two opposite clumps): loop back to stage 1.',
      ),
    ],
    how: [
      L('Remplace le téléporteur sur les étapes 5 : Prairie céleste et Couveuse pour helminthes.', 'Replaces the Teleporter on stage 5: Sky Meadow and Helminth Hatchery.'),
      L('Hallowed Concepts : battre l’Écho de Providence dans Lucidité terminale fait aussi apparaître un téléporteur primordial.', 'Hallowed Concepts: defeating the Echo of Providence in Terminal Lucidity also spawns a Primordial Teleporter.'),
    ],
    wiki: wiki('Teleporter#Primordial_Teleporter'),
  },
  {
    id: 'blue-portal',
    kind: 'portal',
    name: L('Portail bleu', 'Blue Portal'),
    dlc: 'base',
    color: '#4a90f0',
    leadsTo: L('Royaume caché : Bazar entre le Temps', 'Hidden Realm: Bazaar Between Time'),
    what: [
      L(
        'La boutique du jeu, payée en pièces lunaires. 5 objets lunaires à 2 pièces chacun (relance de la vitrine : 1, 2, 4, 8… pièces).',
        'The game’s shop, paid in Lunar Coins. 5 Lunar items at 2 coins each (rerolling the shelf costs 1, 2, 4, 8… coins).',
      ),
      L(
        'Deux chaudrons échangent 3 objets blancs contre 1 vert, ou 5 verts contre 1 rouge. Le Voyant lunaire (3 pièces) choisit la prochaine étape, à condition de repartir par le portail bleu.',
        'Two cauldrons trade 3 white items for 1 green, or 5 greens for 1 red. The Lunar Seer (3 coins) picks the next stage, as long as you leave through the Blue Portal.',
      ),
      L('Le Triton tient la boutique : si tu l’attaques, il te chasse et ferme le bazar.', 'Newt runs the shop: attack it and it kicks you out and seals the Bazaar.'),
    ],
    how: [
      L(
        'Donne 1 pièce lunaire à un Autel du Triton (caché, 3 à 5 emplacements possibles par étape) avant la fin de l’événement du téléporteur. Message : « Un orbe bleu apparaît... ». Après l’événement, le don ne sert à rien.',
        'Give 1 Lunar Coin to a Newt Altar (hidden, 3 to 5 possible spots per stage) before the Teleporter event ends. Message: “A blue orb appears..”. After the event, donating does nothing.',
      ),
      L(
        'Par hasard au début d’une étape : 5 % de chances, divisées par (portails bleus déjà ouverts + 1).',
        'By chance when a stage starts: 5%, divided by (Blue Portals already opened + 1).',
      ),
    ],
    wiki: wiki('Bazaar_Between_Time#Blue_Portal'),
  },
  {
    id: 'gold-portal',
    kind: 'portal',
    name: L('Portail doré', 'Gold Portal'),
    dlc: 'base',
    color: '#f2c94c',
    leadsTo: L('Royaume caché : Côte dorée', 'Hidden Realm: Gilded Coast'),
    what: [
      L(
        'Combat contre Aurelionite. Active les Balises Halcyon (7 sur la carte, prix d’un petit coffre) : elle apparaît à la 4e et reste invulnérable tant qu’une balise est éteinte. Au bout d’un moment, elle les éteint toutes.',
        'A fight against Aurelionite. Activate the Halcyon Beacons (7 on the map, small-chest price): she spawns at the 4th and stays invulnerable while any beacon is off. After a while she switches them all off.',
      ),
      L('La battre donne 1 Graine Halcyon par joueur et ouvre un portail doré pour repartir.', 'Beating her gives 1 Halcyon Seed per player and opens a Gold Portal to leave.'),
      L('Garde de l’or avant de la faire apparaître : si elle éteint les balises, il faut toutes les racheter.', 'Save gold before making her spawn: if she switches the beacons off, you have to buy them all again.'),
    ],
    how: [
      L(
        'Achète un Autel de l’Or (200 $ de base, jamais sur l’étape 1, rare) avant de lancer le téléporteur. La Balise : piratage du Capitaine l’ouvre gratuitement.',
        'Buy an Altar of Gold (base $200, never on stage 1, rare) before starting the Teleporter. Captain’s Beacon: Hacking opens it for free.',
      ),
      L(
        'Au Voyant lunaire du bazar : chaque choix a 5 % de chances d’être la Côte dorée (15 % avec Seekers of the Storm tant que le Fils illégitime n’est pas battu).',
        'At the Bazaar’s Lunar Seer: each choice has a 5% chance to be the Gilded Coast (15% with Seekers of the Storm until the False Son is beaten).',
      ),
      L(
        'Seekers of the Storm : un Autel Halcyon ouvre un portail doré au lieu d’un vert sur les étapes 4 et 5, ou sur les étapes 1 à 3 si tu as déjà pris un portail vert.',
        'Seekers of the Storm: a Halcyon Shrine opens a Gold Portal instead of a green one on stages 4 and 5, or on stages 1 to 3 once you have taken a Green Portal.',
      ),
    ],
    items: ['titangoldduringtp'],
    wiki: wiki('Gilded_Coast#Gold_Portal'),
  },
  {
    id: 'celestial-portal',
    kind: 'portal',
    name: L('Portail céleste', 'Celestial Portal'),
    dlc: 'base',
    color: '#a8e6ff',
    leadsTo: L('Royaume caché : Un moment, fracturé', 'Hidden Realm: A Moment, Fractured'),
    what: [
      L(
        'Îles flottantes qui mènent à l’Obélisque. S’y effacer met fin à la partie pour tous et donne 5 pièces lunaires à chacun. C’est aussi le défi qui débloque le Mercenaire, et en Mousson le défi de maîtrise du survivant.',
        'Floating islands that lead to the Obelisk. Obliterating there ends the run for everyone and gives each player 5 Lunar Coins. It is also the challenge that unlocks the Mercenary, and on Monsoon the survivor’s Mastery challenge.',
      ),
      L(
        'Avec des Perles de fidélité, la partie continue : tout le monde part dans Un moment, entier. Pour continuer normalement, un portail apparaît près de l’Obélisque.',
        'With Beads of Fealty the run goes on: everyone goes to A Moment, Whole. To carry on normally, a portal appears near the Obelisk.',
      ),
    ],
    how: [
      L(
        'Automatique : après au moins une boucle, sur chaque étape 3 (Ralliement Delta, Étendues brûlées, Bassins de soufre), un orbe céleste tourne autour du téléporteur.',
        'Automatic: after at least one loop, on every stage 3 (Rallypoint Delta, Scorched Acres, Sulfur Pools), a celestial orb circles the Teleporter.',
      ),
    ],
    items: ['lunartrinket'],
    wiki: wiki('A_Moment,_Fractured#Celestial_Portal'),
  },
  {
    id: 'null-portal',
    kind: 'portal',
    name: L('Portail zéro', 'Null Portal'),
    dlc: 'base',
    color: '#9b6bd6',
    leadsTo: L('Royaume caché : Champs astraux', 'Hidden Realm: Void Fields'),
    what: [
      L(
        'Arène de 9 cellules à charger une par une (1 minute, zone de 20 m). Hors des cellules, le brouillard du Vide inflige des dégâts en % de la vie max, de plus en plus forts.',
        'An arena of 9 cells to charge one by one (1 minute, 20 m zone). Outside the cells, the Void fog deals damage based on max health, more and more over time.',
      ),
      L(
        'Chaque cellule donne un Potentiel du vide par joueur : blanc pour les 4 premières, vert pour les 4 suivantes, rouge pour la dernière. Les monstres reçoivent aussi des objets à chaque vague.',
        'Each cell gives one Void Potential per player: white for the first 4, green for the next 4, red for the last. Monsters also get items each wave.',
      ),
      L(
        'Tu peux repartir à tout moment par le portail de sortie, mais on n’y revient pas. C’est le défi qui débloque Acrid.',
        'You can leave at any time through the exit portal, but you cannot come back. It is the challenge that unlocks Acrid.',
      ),
    ],
    how: [
      L(
        'Dans le Bazar entre le Temps : descends sous la plateforme du portail bleu jusqu’à une grotte verte dans la paroi. Une seule fois par partie.',
        'In the Bazaar Between Time: drop below the Blue Portal’s platform to a green cave in the wall. Once per run.',
      ),
    ],
    notes: [L('Y aller annule l’étape achetée au Voyant lunaire : l’étape d’après est tirée au hasard.', 'Going there cancels the stage bought at the Lunar Seer: the next stage is random.')],
    wiki: wiki('Bazaar_Between_Time#Null_Portal'),
  },
  {
    id: 'artifact-portal',
    kind: 'portal',
    name: L('Portail d’artefact', 'Artifact Portal'),
    dlc: 'base',
    color: '#e07bd8',
    leadsTo: L('Royaume caché : Sacristie du rempart', 'Hidden Realm: Bulwark’s Ambry'),
    what: [
      L(
        'Une épreuve qui débloque l’artefact correspondant au code entré. 19 des 20 artefacts se débloquent ici.',
        'A trial that unlocks the artifact matching the code you entered. 19 of the 20 artifacts are unlocked here.',
      ),
    ],
    how: [
      L(
        'Au Générateur de composés : sur l’île sous la Prairie céleste, ou tout en haut de la Couveuse pour helminthes. Règle les 9 symboles (carré, rond, triangle, losange) sur le code d’un artefact, puis valide sur l’ordinateur portable. Un mauvais code échoue, tu peux réessayer.',
        'At the Compound Generator: on the island below Sky Meadow, or at the very top of Helminth Hatchery. Set the 9 symbols (square, circle, triangle, diamond) to an artifact’s code, then submit on the laptop. A wrong code fails and you can try again.',
      ),
    ],
    notes: [L('Le portail peut se prendre avant ou après l’événement du téléporteur : il permet de sauter l’événement.', 'You can take it before or after the Teleporter event: it lets you skip the event.')],
    wiki: wiki('Sky_Meadow#Compound_Generator'),
  },

  // ------------------------------------------------------------ Survivors of the Void
  {
    id: 'void-portal',
    kind: 'portal',
    name: L('Portail du vide', 'Void Portal'),
    dlc: 'sotv',
    color: '#b05cff',
    leadsTo: L('Royaume caché : Locus du vide', 'Hidden Realm: Void Locus'),
    what: [
      L(
        'Étape du Vide : des Potentiels et des Berceaux du vide à la place des coffres, et des monstres du Vide. Elle compte comme une étape et le chrono tourne.',
        'A Void stage: Void Potentials and Void Cradles instead of chests, and Void monsters. It counts as a stage and the timer runs.',
      ),
      L(
        '4 Signaux du vide profond à charger, comme les cellules des Champs astraux : pendant la charge, le brouillard couvre toute la carte. Une fois les 4 chargés, un portail du vide profond s’ouvre en haut de la carte.',
        '4 Deep Void Signals to charge, like the Void Fields cells: while one charges, the fog covers the whole map. Once all 4 are charged, a Deep Void Portal opens at the top of the map.',
      ),
    ],
    how: [
      L('Termine les 9 cellules des Champs astraux : il s’ouvre à côté du portail de sortie.', 'Clear all 9 cells of the Void Fields: it opens next to the exit portal.'),
      L('Par hasard après un téléporteur, à partir de l’étape 7 : 10 % de chances.', 'By chance after a Teleporter, from stage 7: 10% chance.'),
      L('Au Voyant lunaire, à partir de l’étape 5 (pas en Éclipse) : 10 % de chances par choix.', 'At the Lunar Seer, from stage 5 (not on Eclipse): 10% chance per choice.'),
      L('Alloyed Collective : refuse l’offre du Cœur Solus dans le Sanctuaire neuronal.', 'Alloyed Collective: reject the Solus Heart’s offer in the Neural Sanctum.'),
    ],
    wiki: wiki('Void_Locus'),
  },
  {
    id: 'deep-void-portal',
    kind: 'portal',
    name: L('Portail du vide profond', 'Deep Void Portal'),
    dlc: 'sotv',
    color: '#6d3fc0',
    leadsTo: L('Royaume caché : Le planétarium', 'Hidden Realm: The Planetarium'),
    what: [
      L(
        'Fin alternative : combat contre le Vidillon. Le battre débloque le Démon du vide.',
        'An alternate ending: a fight against the Voidling. Beating it unlocks the Void Fiend.',
      ),
    ],
    how: [
      L('Charge les 4 Signaux du vide profond du Locus du vide.', 'Charge the 4 Deep Void Signals in the Void Locus.'),
      L(
        'Sur Commencement, après avoir battu Mithrix : retourne au cercle du téléporteur du début et caresse la grenouille de verre 10 fois (1 pièce lunaire à chaque fois).',
        'On Commencement, after beating Mithrix: go back to the starting Teleporter ring and pet the glass frog 10 times (1 Lunar Coin each).',
      ),
    ],
    wiki: wiki('The_Planetarium'),
  },
  {
    id: 'infinite-portal',
    kind: 'portal',
    name: L('Portail infini', 'Infinite Portal'),
    dlc: 'sotv',
    color: '#57d1c9',
    leadsTo: L('L’environnement suivant du Simulacre', 'The next Simulacrum environment'),
    what: [
      L(
        'Mode Simulacre uniquement. Après lui, il faut réactiver le Focus d’évaluation pour lancer la vague suivante.',
        'Simulacrum mode only. Afterwards, interact with the Assessment Focus again to start the next wave.',
      ),
    ],
    how: [L('Apparaît à la fin de chaque 10e vague. Aucun autre portail n’existe dans ce mode.', 'Appears after every 10th wave. No other portal exists in this mode.')],
    wiki: wiki('Simulacrum'),
  },

  // ------------------------------------------------------------ Seekers of the Storm
  {
    id: 'green-portal',
    kind: 'portal',
    name: L('Portail vert', 'Green Portal'),
    dlc: 'sots',
    color: '#5ed16a',
    leadsTo: L('Le Chemin du Colosse, jusqu’au Premier méridien', 'The Path of the Colossus, up to Prime Meridian'),
    what: [
      L(
        'Chemin parallèle vers le Fils illégitime, le boss final du DLC. Depuis l’étape 1 : Autel réformé. Depuis l’étape 2 : Colonie arborescente (Dépérissement doré après une boucle). Depuis l’étape 3 : Premier méridien.',
        'A side path to the False Son, the DLC’s final boss. From stage 1: Reformed Altar. From stage 2: Treeborn Colony (Golden Dieback after a loop). From stage 3: Prime Meridian.',
      ),
      L(
        'Sur le chemin, un portail vert apparaît après chaque téléporteur pour continuer. Prendre le téléporteur à la place te ramène aux étapes normales.',
        'Along the path, a Green Portal appears after each Teleporter to keep going. Taking the Teleporter instead brings you back to the normal stages.',
      ),
    ],
    how: [
      L(
        'Autel Halcyon (surtout sur l’étape 1) : active-le et reste près de lui, il aspire ton or. Arrête-le à partir de 75 $ (ou laisse-le aller jusqu’à 150 ou 300 $ pour plus de récompenses), puis tue l’Halcyonite doré qui apparaît. Marche sur les étapes 1 à 3 tant que tu n’as pris aucun portail vert. Message : « L’orage vous attend. ». Le portail se prend même sans avoir activé le téléporteur.',
        'Halcyon Shrine (mostly on stage 1): activate it and stay near it while it drains your gold. Stop it from $75 (or let it go to $150 or $300 for better rewards), then kill the Gilded Halcyonite that spawns. Works on stages 1 to 3 as long as you have not taken a Green Portal. Message: “The storm beckons.”. You can take the portal without activating the Teleporter.',
      ),
      L(
        'Dans le bazar, si « Vous entendez le grondement du tonnerre. » s’affiche : détruis les 3 Géodes d’Aurelionite cachées. Impossible en arrivant d’une étape 4 ou si le Premier méridien est déjà fait.',
        'In the Bazaar, if “You hear thunder rumbling.” shows up: destroy the 3 hidden Aurelionite Geodes. Not possible when coming from a stage 4 or if Prime Meridian is already done.',
      ),
      L('Sur la Côte dorée après Aurelionite, si tu y es venu depuis une étape 1 à 3.', 'On the Gilded Coast after Aurelionite, if you came from a stage 1 to 3.'),
    ],
    wiki: wiki('Halcyon_Shrine#Green_Portal'),
  },
  {
    id: 'destination-portal',
    kind: 'portal',
    name: L('Portail de destination', 'Destination Portal'),
    dlc: 'sots',
    color: '#e9d9a6',
    leadsTo: L('Une étape 4 au hasard', 'A random stage 4'),
    what: [
      L(
        'Continue la partie après le Premier méridien, sans faire avancer le compteur d’étapes. Le prendre, c’est renoncer à offrir un objet à l’Autel de la Résurrection (offrir met fin à la partie : l’objet sera ton objet de départ avec l’Artefact de résurrection).',
        'Carries the run on past Prime Meridian, without advancing the stage counter. Taking it means not offering an item to the Shrine of Rebirth (offering ends the run: that item becomes your starting item with the Artifact of Rebirth).',
      ),
    ],
    how: [L('Bats le Fils illégitime sur le Premier méridien, puis interagis une fois avec l’Autel de la Résurrection.', 'Beat the False Son on Prime Meridian, then interact once with the Shrine of Rebirth.')],
    wiki: wiki('Prime_Meridian#Destination_Portal'),
  },

  // ------------------------------------------------------------ Alloyed Collective
  {
    id: 'encrypted-portal',
    kind: 'portal',
    name: L('Portail crypté', 'Encrypted Portal'),
    dlc: 'ac',
    color: '#3fd0e0',
    leadsTo: L('Canyon conducteur (depuis l’étape 3) ou Repère solutionnel (depuis l’étape 4)', 'Conduit Canyon (from stage 3) or Solutional Haunt (from stage 4)'),
    what: [
      L(
        'Entrée du chemin du Collectif, qui mène à l’Égide Solus puis au Cœur Solus. Le Canyon conducteur mène directement au Repère solutionnel, où l’on affronte l’Égide Solus.',
        'The way into the Collective’s path, towards the Solus Wing and then the Solus Heart. Conduit Canyon leads straight to Solutional Haunt, where you fight the Solus Wing.',
      ),
      L(
        'Attention : dans le Repère solutionnel, aucun autre portail ne peut apparaître. Une fois entré, il faut battre l’Égide Solus.',
        'Careful: no other portal can spawn in Solutional Haunt. Once in, you have to beat the Solus Wing.',
      ),
    ],
    how: [
      L(
        'Active un Nœud d’accès (étapes 3 normales sauf la Colonie arborescente, et aussi le Cratère recyclé en étape 4). Un orbe virtuel tourne autour du téléporteur, et un Amalgameur Solus s’ajoute au boss : un objet de plus, qui peut être son Coupleur fonctionnel.',
        'Activate an Access Node (normal stage 3s except Treeborn Colony, plus Repurposed Crater on stage 4). A virtual orb circles the Teleporter, and a Solus Amalgamator joins the boss: one more item, which can be its Functional Coupler.',
      ),
      L('Sur le Premier méridien : il apparaît 15 s après avoir touché l’Autel de la Résurrection (vers le Canyon conducteur).', 'On Prime Meridian: it appears 15 s after you touch the Shrine of Rebirth (to Conduit Canyon).'),
      L(
        'Sur l’Appel de la sirène : battre l’Unité d’alliage vénérée (détruis les 6 nids de vautours) ajoute un orbe au téléporteur, qui ouvre un portail vers le Repère solutionnel.',
        'On Siren’s Call: beating the Alloy Worship Unit (destroy the 6 vulture nests) adds an orb to the Teleporter that opens a portal to Solutional Haunt.',
      ),
    ],
    notes: [
      L(
        'Une seule fois par partie. Une fois l’Égide Solus battue, les Nœuds d’accès n’apparaissent plus et ces portails mènent au Comptoir d’échange informatique.',
        'Once per run. Once the Solus Wing is beaten, Access Nodes stop spawning and these portals lead to the Computational Exchange instead.',
      ),
    ],
    items: ['extraequipment'],
    wiki: wiki('Access_Node'),
  },
  {
    id: 'mainline-portal',
    kind: 'portal',
    name: L('Portail principal', 'Mainline Portal'),
    dlc: 'ac',
    color: '#7fe3ff',
    leadsTo: L('Royaume caché : Comptoir d’échange informatique', 'Hidden Realm: Computational Exchange'),
    what: [
      L(
        'Le Comptoir abrite SPEX et le CHEF errant. Le CHEF transforme le Cervelet crypté en Cervelet exposé, l’offrande qui ouvre le portail décrypté.',
        'The Exchange holds SPEX and the Wandering CHEF. The CHEF turns the Encrypted Cerebellum into the Exposed Cerebellum, the offering that opens the Decrypted Portal.',
      ),
    ],
    how: [L('Bats l’Égide Solus dans le Repère solutionnel. Elle laisse aussi le Cervelet crypté.', 'Beat the Solus Wing in Solutional Haunt. It also drops the Encrypted Cerebellum.')],
    items: ['masterbattery'],
    wiki: wiki('Computational_Exchange'),
  },
  {
    id: 'decrypted-portal',
    kind: 'portal',
    name: L('Portail décrypté', 'Decrypted Portal'),
    dlc: 'ac',
    color: '#9ff0ff',
    leadsTo: L('Royaume caché : Sanctuaire neuronal', 'Hidden Realm: Neural Sanctum'),
    what: [
      L(
        'Fin alternative : combat contre le Cœur Solus. Vaincu, il propose de t’assimiler au Collectif. Accepter (interagir) termine la partie. Refuser (le tuer) donne un objet rouge et ouvre un portail virtuel vers l’étape suivante, plus un portail du vide avec Survivors of the Void.',
        'An alternate ending: a fight against the Solus Heart. Once beaten, it offers to assimilate you into the Collective. Accepting (interacting) ends the run. Rejecting (killing it) gives a red item and opens a Virtual Portal to the next stage, plus a Void Portal with Survivors of the Void.',
      ),
      L('En Éclipse, l’offre est refusée d’office : la partie continue.', 'On Eclipse the offer is rejected automatically: the run goes on.'),
    ],
    how: [
      L(
        'Dans le Comptoir d’échange informatique, offre le Cervelet exposé à SPEX. SPEX n’accepte plus rien une fois le Cœur Solus tué dans la partie.',
        'In the Computational Exchange, offer the Exposed Cerebellum to SPEX. SPEX takes no more offerings once the Solus Heart has been killed in the run.',
      ),
    ],
    items: ['mastercore'],
    wiki: wiki('Computational_Exchange'),
  },
  {
    id: 'virtual-portal',
    kind: 'portal',
    name: L('Portail virtuel', 'Virtual Portal'),
    dlc: 'ac',
    color: '#3fe0a8',
    leadsTo: L('L’étape suivante, ou le Comptoir d’échange informatique', 'The next stage, or the Computational Exchange'),
    what: [L('La sortie numérique du chemin du Collectif.', 'The digital way out of the Collective’s path.')],
    how: [
      L(
        'Dans le Comptoir d’échange informatique : il est derrière toi à l’arrivée et permet de continuer la partie sans aller au Sanctuaire neuronal.',
        'In the Computational Exchange: it is behind you when you arrive and lets you carry on without going to the Neural Sanctum.',
      ),
      L('Dans le Sanctuaire neuronal, après avoir refusé l’offre du Cœur Solus.', 'In the Neural Sanctum, after rejecting the Solus Heart’s offer.'),
      L(
        'Une fois l’Égide Solus battue, il remplace les portails cryptés (Nœud d’accès, Premier méridien, Unité d’alliage vénérée) et mène au Comptoir d’échange informatique.',
        'Once the Solus Wing is beaten, it replaces the Encrypted Portals (Access Node, Prime Meridian, Alloy Worship Unit) and leads to the Computational Exchange.',
      ),
    ],
    wiki: wiki('Computational_Exchange#Virtual_Portal'),
  },

  // ------------------------------------------------------------ Hallowed Concepts
  {
    id: 'anima-portal',
    kind: 'portal',
    name: L('Portail d’anima', 'Anima Portal'),
    dlc: 'hc',
    color: '#c99a5b',
    leadsTo: L('Une épreuve de N’kuhana (Sélection par la prédation, la survie ou la mortalité)', 'A Trial of N’kuhana (Winnowing of Predation, Survival or Mortality)'),
    what: [
      L(
        'Épreuve chronométrée : tes objets te sont retirés et tu en choisis 5 au plus pour l’épreuve. Le chrono de 3 min 30 s est partagé par toute la partie et ne se recharge jamais : s’il tombe à zéro, tout le monde meurt et la partie s’arrête.',
        'A timed trial: your items are taken away and you pick up to 5 of them for the trial. The 3 min 30 s timer is shared by the whole run and never refills: if it hits zero, everyone dies and the run ends.',
      ),
      L(
        'Réussir donne une page du N’tormat par joueur, le N’tormat à ceux qui ne l’ont pas, et un objet trouvé pendant l’épreuve à garder. Ensuite, un portail d’anima ramène à une étape normale et un gong enchaîne sur une autre épreuve.',
        'Success gives one N’tormat page per player, the N’tormat to those without one, and one item found during the trial to keep. Then an Anima Portal takes you back to a normal stage and a gong chains into another trial.',
      ),
    ],
    how: [
      L(
        'Fais sonner un Gong de rituel (interaction, ou un coup d’au moins 33 dégâts). Il y en a toujours un dans le Bazar entre le Temps et à la fin de chaque épreuve.',
        'Ring a Ritual Gong (interact, or hit it for at least 33 damage). There is always one in the Bazaar Between Time and at the end of each trial.',
      ),
      L(
        'Ou lance Réincarnation dans les zones de sacrifice de l’Aspect du marais et du Bourbier ténébreux.',
        'Or cast Reincarnation inside the sacrifice zones of Wetland Aspect and Tenebrous Quagmire.',
      ),
    ],
    items: ['pagedie'],
    wiki: wiki("Trials_of_N'kuhana"),
  },
  {
    id: 'ritual-portal',
    kind: 'portal',
    name: L('Portail de rituel', 'Ritual Portal'),
    dlc: 'hc',
    color: '#ff5c5c',
    leadsTo: L('Royaume caché : Aube spirituelle', 'Hidden Realm: Soulbound Threshold'),
    what: [
      L(
        'Un rituel chronométré qui finit par un combat en deux phases contre la Faucheuse d’anima. Le réussir met fin aux catastrophes pour le reste de la partie. C’est là qu’on débloque l’Acolyte.',
        'A timed ritual that ends with a two-phase fight against the Anima Harvester. Completing it ends Catastrophes for the rest of the run. It is where the Acolyte is unlocked.',
      ),
    ],
    how: [
      L(
        'Un Autel de la Descente apparaît si l’équipe a assez de pages du N’tormat : 1 en solo, 4 à deux, 9 à trois, 16 à quatre. Prie-le : le prochain téléporteur devient le Défi de lien d’âme. Après 100 %, il se surcharge jusqu’à environ 666 % et un boss élite du Styx en plus apparaît. Une fois le défi fini et le boss mort, le portail s’ouvre à 10–40 m du téléporteur.',
        'A Shrine of Descent appears if the team has enough N’tormat pages: 1 solo, 4 for two, 9 for three, 16 for four. Pray to it: the next Teleporter becomes the Soul-binding trial. After 100% it overcharges to about 666% and an extra Stygian boss spawns. Once the trial is over and the boss is dead, the portal opens 10–40 m from the Teleporter.',
      ),
      L(
        'Ou lance Réincarnation dans la zone de sacrifice du Sanctuaire neuronal (tant que le rituel n’a pas été fait dans la partie).',
        'Or cast Reincarnation inside the Neural Sanctum’s sacrifice zone (as long as the ritual has not been done this run).',
      ),
    ],
    notes: [
      L(
        'Une fois par partie. Après le défi, le téléporteur ne marche plus (sauf sur le Canyon conducteur) : sors par ce portail ou par un autre portail ouvert, comme un portail bleu.',
        'Once per run. After the trial the Teleporter no longer works (except on Conduit Canyon): leave through this portal or another open one, like a Blue Portal.',
      ),
    ],
    items: ['pagedie'],
    wiki: wiki('Shrine_of_Descent'),
  },
  {
    id: 'mortal-portal',
    kind: 'portal',
    name: L('Portail des mortels', 'Mortal Portal'),
    dlc: 'hc',
    color: '#e8e0d0',
    leadsTo: L('L’étape suivante', 'The next stage'),
    what: [L('La sortie normale de l’Aube spirituelle.', 'The normal way out of the Soulbound Threshold.')],
    how: [
      L(
        'Bats la Faucheuse d’anima, puis interagis avec l’orbe de l’autel pour finir le rituel. Un Autel sacré amélioré apparaît aussi.',
        'Beat the Anima Harvester, then interact with the altar’s orb to complete the ritual. An improved Hallowed Shrine also appears.',
      ),
    ],
    wiki: wiki('Soulbound_Threshold#Completing_the_ritual'),
  },
  {
    id: 'veil-of-memory',
    kind: 'portal',
    name: L('Voile mnésique', 'Veil of Memory'),
    dlc: 'hc',
    color: '#ffb3e6',
    leadsTo: L('Royaume caché : Lucidité terminale', 'Hidden Realm: Terminal Lucidity'),
    what: [
      L(
        'Combat en quatre phases contre l’Écho de Providence. Le battre fait apparaître un téléporteur primordial.',
        'A four-phase fight against the Echo of Providence. Beating it spawns a Primordial Teleporter.',
      ),
    ],
    how: [
      L(
        'Après avoir fini le rituel de l’Aube spirituelle, lance Réincarnation dans la zone de sacrifice (18 m) autour du pédestal central. Personne n’y meurt et pas besoin d’un porteur du N’tormat dans le cercle.',
        'After completing the Soulbound Threshold ritual, cast Reincarnation inside the sacrifice zone (18 m) around the central pedestal. Nobody dies there and no N’tormat holder is needed in the circle.',
      ),
    ],
    notes: [
      L(
        'Lucidité terminale s’atteint aussi avec Réincarnation dans les zones de sacrifice de la Sacristie du rempart, de la Couveuse pour helminthes, de l’Autel réformé ou du Premier méridien.',
        'Terminal Lucidity can also be reached with Reincarnation in the sacrifice zones of Bulwark’s Ambry, Helminth Hatchery, Reformed Altar or Prime Meridian.',
      ),
    ],
    items: ['pagedie'],
    wiki: wiki('Soulbound_Threshold#Veil_of_Memory'),
  },
]
