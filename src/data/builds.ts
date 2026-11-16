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
      'Pardonne-moi déclenche tes effets « à la mort » sans tuer personne. Le Signe du noyé la relance tout seul et le Catalyseur spirituel entretient la boucle. Ajoute au moins une source de dégâts à la mort.',
      'Forgive Me Please sets off your on-kill effects without killing anything. Gesture of the Drowned fires it on its own and Soulbound Catalyst keeps the loop going. Add at least one on-kill damage source.',
    ),
    skills: {
      label: L('Boucle du build', 'Build loop'),
      text: L(
        'Poupée → effets à la mort → recharge réduite par le Catalyseur → nouvelle poupée',
        'Doll → on-kill effects → cooldown cut by the Catalyst → next doll',
      ),
    },
    items: [
      { id: 'deathprojectile', core: true, role: L('×1 · équipement requis', '×1 · required equipment') },
      { id: 'autocastequipment', core: true, role: L('×1 · automatisation', '×1 · automation') },
      { id: 'talisman', core: true, role: L('×1 · entretient la boucle', '×1 · keeps the loop going') },
      { id: 'igniteonkill', role: L('×1 ou plus · dégâts faciles à trouver', '×1 or more · easy-to-find damage') },
      { id: 'explodeondeath', role: L('×1 ou plus · dégâts de zone', '×1 or more · area damage') },
      { id: 'dagger', role: L('×1 ou plus · amélioration majeure', '×1 or more · major upgrade') },
      { id: 'barrieronkill', role: L('×1 ou plus · protection', '×1 or more · protection') },
      { id: 'equipmentmagazine', role: L('Optionnel · cadence et charges', 'Optional · rate and charges') },
      { id: 'strengthenburn', role: L('Optionnel · renforce les brûlures', 'Optional · stronger burns') },
    ],
    synergies: [
      {
        items: ['deathprojectile', 'autocastequipment'],
        text: L(
          'Le Signe du noyé utilise la poupée dès qu’elle est prête et divise sa recharge par deux.',
          'Gesture of the Drowned uses the doll as soon as it is ready and halves its cooldown.',
        ),
      },
      {
        items: ['deathprojectile', 'talisman'],
        text: L(
          'Chaque impulsion de la poupée compte comme une élimination : elle réduit elle-même sa recharge.',
          'Every pulse of the doll counts as a kill: it shortens its own cooldown.',
        ),
      },
      {
        items: ['deathprojectile', 'igniteonkill', 'explodeondeath', 'dagger'],
        text: L(
          'La poupée ne fait pas de dégâts seule : ce sont ces objets qui frappent à chaque impulsion. Explosions et flammes partent de la poupée ; les dagues cherchent leurs cibles.',
          'The doll deals no damage on its own: these items do, on every pulse. Explosions and flames start from the doll; daggers seek their targets.',
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
        'Pour la boucle complète, ajoute un Catalyseur spirituel. Limite : 3 poupées actives par joueur.',
        'For the full loop, add a Soulbound Catalyst. Limit: 3 active dolls per player.',
      ),
      L(
        'Le Réservoir d’ignition n’est utile que si tu as l’Essence ; il n’est pas nécessaire à la boucle. Il demande Survivors of the Void.',
        'Ignition Tank only helps if you have Gasoline; the loop does not need it. It requires Survivors of the Void.',
      ),
    ],
    sources: [
      { label: 'Forgive Me Please', url: wiki('Forgive_Me_Please') },
      { label: 'Ceremonial Dagger', url: wiki('Ceremonial_Dagger') },
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
        '1 Tonique Spinelle + 1 Signe du noyé + 3 Piles à combustible',
        '1 Spinel Tonic + 1 Gesture of the Drowned + 3 Fuel Cells',
      ),
    },
    items: [
      { id: 'tonic', core: true, role: L('×1 · équipement requis', '×1 · required equipment') },
      { id: 'autocastequipment', core: true, role: L('×1 · automatisation', '×1 · automation') },
      { id: 'equipmentmagazine', core: true, role: L('×3 · seuil du bonus permanent', '×3 · permanent-buff threshold') },
    ],
    synergies: [
      {
        items: ['tonic', 'autocastequipment', 'equipmentmagazine'],
        text: L(
          'Avec 1 Signe et 3 Piles, la recharge tombe à environ 18,4 s : le tonique est relancé avant la fin de ses 20 s d’effet.',
          'With 1 Gesture and 3 Fuel Cells the cooldown drops to about 18.4 s: the tonic is used again before its 20 s run out.',
        ),
      },
    ],
    howTo: [
      L(
        'Après le premier, les Signes supplémentaires réduisent la recharge comme des Piles : 4 Signes sans Pile suffisent aussi.',
        'After the first one, extra Gestures shorten the cooldown like Fuel Cells: 4 Gestures and no Fuel Cell also work.',
      ),
      L(
        'Si le bonus s’interrompt, les afflictions accumulées deviennent pénalisantes. Ne change pas d’équipement sans y penser.',
        'If the buff drops, the stacked afflictions hurt. Think twice before swapping equipment.',
      ),
      L(
        'Moins bon sur l’Ingénieur : ses tourelles ne profitent pas du tonique.',
        'Weaker on Engineer: his turrets do not get the tonic buff.',
      ),
    ],
    sources: [
      { label: 'Spinel Tonic', url: wiki('Spinel_Tonic') },
      { label: 'Engineer', url: wiki('Engineer') },
    ],
  },
  {
    slug: 'automatic-missiles',
    survivor: null,
    name: L('Missiles automatiques', 'Automatic missiles'),
    tagline: L('Les missiles travaillent pendant que tu bouges.', 'Missiles do the work while you move.'),
    tag: L('Dégâts automatiques', 'Hands-free damage'),
    summary: L(
      'Le Signe du noyé tire le lance-missile tout seul. Les Piles augmentent sa cadence ; l’I.C.B.M de poche multiplie les projectiles.',
      'Gesture of the Drowned fires the launcher on its own. Fuel Cells raise its rate; Pocket I.C.B.M. multiplies the projectiles.',
    ),
    skills: {
      label: L('Assemblage', 'Set'),
      text: L(
        'Lance-missile jetable + Signe du noyé + Piles ; puis I.C.B.M de poche si tu le trouves',
        'Disposable Missile Launcher + Gesture of the Drowned + Fuel Cells; then Pocket I.C.B.M. if you find it',
      ),
    },
    items: [
      { id: 'commandmissile', core: true, role: L('×1 · équipement requis', '×1 · required equipment') },
      { id: 'autocastequipment', core: true, role: L('×1 · automatisation', '×1 · automation') },
      { id: 'equipmentmagazine', core: true, role: L('Plusieurs · cadence', 'Several · fire rate') },
      { id: 'moremissile', role: L('×1 · amélioration majeure', '×1 · major upgrade') },
      { id: 'talisman', role: L('×1 ou plus · recharge sur élimination', '×1 or more · cooldown on kill') },
      { id: 'missile', role: L('Optionnel · dégâts en plus', 'Optional · extra damage') },
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
        items: ['commandmissile', 'moremissile'],
        text: L(
          'Le premier I.C.B.M triple les missiles du lanceur ; les suivants augmentent leurs dégâts.',
          'The first I.C.B.M. triples the launcher’s missiles; more copies raise their damage.',
        ),
      },
    ],
    howTo: [
      L(
        'Le Catalyseur dépend des éliminations : contre un boss seul, il ne garantit pas une recharge continue.',
        'The Catalyst depends on kills: against a lone boss it does not guarantee a constant recharge.',
      ),
      L(
        'Marche avec tous les survivants, sans cadence de tir élevée. Continue à prendre de la mobilité et de la protection.',
        'Works with every survivor, no high fire rate needed. Keep picking up mobility and protection.',
      ),
    ],
    sources: [
      { label: 'Disposable Missile Launcher', url: wiki('Disposable_Missile_Launcher') },
      { label: 'Pocket I.C.B.M.', url: wiki('Pocket_I.C.B.M.') },
    ],
  },
  {
    slug: 'blast-shower-bands',
    survivor: null,
    name: L('Douche + bracelets', 'Shower + bands'),
    tagline: L('Réarmer les bracelets et la protection.', 'Re-arm the bands and the shield.'),
    tag: L('Demande de gros coups', 'Needs big hits'),
    summary: L(
      'La Douche explosive réinitialise la recharge des bracelets. Avec le Signe du noyé et des Piles, ils se déclenchent bien plus souvent.',
      'Blast Shower resets the bands’ cooldown. With Gesture of the Drowned and Fuel Cells they trigger far more often.',
    ),
    skills: {
      label: L('Assemblage', 'Set'),
      text: L(
        'Douche explosive + Signe du noyé + Piles + bracelet(s) ; Espaces aseptisés en bonus défensif',
        'Blast Shower + Gesture of the Drowned + Fuel Cells + band(s); Safer Spaces as a defensive bonus',
      ),
    },
    items: [
      { id: 'cleanse', core: true, role: L('×1 · équipement requis', '×1 · required equipment') },
      { id: 'autocastequipment', core: true, role: L('×1 · automatisation', '×1 · automation') },
      { id: 'equipmentmagazine', core: true, role: L('Plusieurs · réinitialisations plus fréquentes', 'Several · more frequent resets') },
      { id: 'icering', role: L('×1 ou plus · dégâts', '×1 or more · damage') },
      { id: 'firering', role: L('×1 ou plus · dégâts de zone', '×1 or more · area damage') },
      { id: 'bearvoid', role: L('Optionnel · protection réarmée', 'Optional · re-armed protection') },
    ],
    synergies: [
      {
        items: ['cleanse', 'icering', 'firering'],
        text: L(
          'La douche remet les bracelets à zéro, mais il faut encore un coup assez fort pour les déclencher.',
          'The shower resets the bands, but you still need a hit strong enough to set them off.',
        ),
      },
      {
        items: ['cleanse', 'autocastequipment', 'equipmentmagazine'],
        text: L(
          'Signe seul : douche toutes les 10 s, comme les bracelets. 4 Piles en plus : environ 5,2 s.',
          'Gesture alone: a shower every 10 s, like the bands. With 4 Fuel Cells: about 5.2 s.',
        ),
      },
      {
        items: ['cleanse', 'bearvoid'],
        text: L('La douche réarme aussi Espaces aseptisés.', 'The shower also re-arms Safer Spaces.'),
      },
    ],
    howTo: [
      L(
        'Favorise les survivants capables de gros coups réguliers.',
        'Favour survivors that land big hits regularly.',
      ),
      L(
        'Ce montage ne rend pas invincible entre deux douches. Espaces aseptisés demande Survivors of the Void.',
        'This set does not make you invincible between showers. Safer Spaces requires Survivors of the Void.',
      ),
    ],
    sources: [
      { label: 'Blast Shower', url: wiki('Blast_Shower') },
      { label: 'Safer Spaces', url: wiki('Safer_Spaces') },
    ],
  },
  {
    slug: 'plasma-shrimp-polylute',
    survivor: null,
    name: L('Crevettes + Polyluth', 'Shrimp + Polylute'),
    tagline: L('Multiplier les impacts, puis les missiles.', 'Multiply hits, then missiles.'),
    tag: L('Recommandé pour les tirs rapides · SotV', 'Best with fast attacks · SotV'),
    summary: L(
      'Une excellente base contre les boss : chaque éclair du Polyluth peut lancer un missile des Crevettes de plasma. Les attaques rapides alimentent le tout.',
      'A great base against bosses: every Polylute strike can fire a Plasma Shrimp missile. Fast attacks feed it all.',
    ),
    skills: {
      label: L('Assemblage', 'Set'),
      text: L(
        'Crevettes de plasma + Polyluth ; puis I.C.B.M de poche et Trèfle si possible',
        'Plasma Shrimp + Polylute; then Pocket I.C.B.M. and Clover if you can',
      ),
    },
    items: [
      { id: 'missilevoid', core: true, role: L('×1 ou plus · missiles', '×1 or more · missiles') },
      { id: 'chainlightningvoid', core: true, role: L('×1 ou plus · impacts répétés', '×1 or more · repeated hits') },
      { id: 'moremissile', role: L('×1 · amélioration majeure', '×1 · major upgrade') },
      { id: 'clover', role: L('×1 ou plus · plus de déclenchements', '×1 or more · more triggers') },
      { id: 'syringe', role: L('Plusieurs · selon le personnage', 'Several · depends on the survivor') },
      { id: 'bearvoid', role: L('Optionnel · protection', 'Optional · protection') },
    ],
    synergies: [
      {
        items: ['chainlightningvoid', 'missilevoid'],
        text: L(
          'Chaque éclair du Polyluth est un impact : il peut lancer un missile des Crevettes.',
          'Every Polylute strike is a hit: it can fire a Plasma Shrimp missile.',
        ),
      },
      {
        items: ['missilevoid', 'moremissile'],
        text: L('L’I.C.B.M triple les missiles des Crevettes.', 'The I.C.B.M. triples the Shrimp’s missiles.'),
      },
      {
        items: ['clover', 'chainlightningvoid'],
        text: L(
          'Le Trèfle améliore les déclenchements du Polyluth ; il n’apporte rien au missile garanti des Crevettes.',
          'The Clover improves Polylute’s triggers; it adds nothing to the Shrimp’s guaranteed missile.',
        ),
      },
    ],
    howTo: [
      L(
        'Idéal pour les tirs rapides ou multiples : Commando, POL-Y au cloueur, fusil à pompe du Bandit. Moins naturel pour les personnages qui frappent rarement.',
        'Best with fast or multi-hit attacks: Commando, MUL-T’s nailgun, Bandit’s shotgun. Less natural on survivors that hit rarely.',
      ),
      L(
        'Les Crevettes n’agissent que tant qu’il te reste du bouclier. Elles en donnent ; si tu le perds, éloigne-toi pour le recharger.',
        'The Shrimp only work while you have shield. They give some; if it breaks, back off to recharge it.',
      ),
      L(
        'Les Crevettes corrompent les missiles AtG et le Polyluth les Ukulélés : tu ne gardes pas les deux versions. Évite Pureté, qui rend les effets aléatoires moins fiables.',
        'Plasma Shrimp corrupts AtG Missiles and Polylute corrupts Ukuleles: you cannot keep both versions. Avoid Purity, which makes random effects less reliable.',
      ),
    ],
    sources: [
      { label: 'Plasma Shrimp', url: wiki('Plasma_Shrimp') },
      { label: 'Polylute', url: wiki('Polylute') },
    ],
  },
  {
    slug: 'drone-army',
    survivor: null,
    name: L('Armée de drones', 'Drone army'),
    tagline: L('Tes alliés deviennent ta force de frappe.', 'Your allies become your firepower.'),
    tag: L('Dégâts autonomes · 2 objets rares', 'Autonomous damage · 2 rare items'),
    summary: L(
      'Les Pièces détachées de drone renforcent les sondes des Noyaux d’empathie. Acheter des drones et en appeler avec Le renfort grossit encore l’armée.',
      'Spare Drone Parts boost the probes from Empathy Cores. Buying drones and calling more with The Back-up grows the army further.',
    ),
    skills: {
      label: L('Assemblage', 'Set'),
      text: L(
        'Pièces détachées de drone + Noyaux d’empathie ; Le renfort et drones achetés en complément',
        'Spare Drone Parts + Empathy Cores; The Back-up and bought drones on top',
      ),
    },
    items: [
      { id: 'droneweapons', core: true, role: L('×1 · améliore les drones', '×1 · upgrades drones') },
      { id: 'roboballbuddy', core: true, role: L('×1 ou plus · sondes Solus', '×1 or more · Solus probes') },
      { id: 'dronebackup', role: L('Optionnel · renforts', 'Optional · reinforcements') },
      { id: 'autocastequipment', role: L('Optionnel · automatise Le renfort', 'Optional · automates The Back-up') },
      { id: 'equipmentmagazine', role: L('×5 avec 1 Signe · renforts permanents', '×5 with 1 Gesture · permanent back-up') },
      { id: 'hoof', role: L('Mobilité · pour toi', 'Mobility · for you') },
    ],
    synergies: [
      {
        items: ['droneweapons', 'roboballbuddy'],
        text: L(
          'Les sondes des Noyaux comptent comme des drones : les Pièces leur ajoutent des armes et de la cadence.',
          'The Cores’ probes count as drones: Spare Drone Parts give them weapons and fire rate.',
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
        'Ne dépend pas des dégâts de tes compétences. Le Capitaine adore les drones ; l’Ingénieur profite aussi des Pièces sur ses tourelles.',
        'Does not rely on your skills’ damage. Captain loves drones; Engineer’s turrets also benefit from the Parts.',
      ),
      L(
        'Les Noyaux ne sont pas obligatoires : les drones achetés pendant la partie sont déjà une bonne base.',
        'The Cores are not required: drones bought during the run are already a good base.',
      ),
      L(
        'Il existe une limite d’alliés : trop de petites invocations peuvent empêcher le retour des sondes. Les Pièces demandent Survivors of the Void.',
        'There is an ally limit: too many small summons can stop the probes from coming back. Spare Drone Parts require Survivors of the Void.',
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
      { id: 'critglasses', core: true, role: L('Jusqu’à 10 · selon tes autres bonus', 'Up to 10 · depends on other bonuses') },
      { id: 'attackspeedoncrit', core: true, role: L('×1 ou plus · cadence', '×1 or more · attack speed') },
      { id: 'healoncrit', core: true, role: L('×1 ou plus · soins', '×1 or more · healing') },
      { id: 'bleedonhitandexplode', role: L('×1 · amélioration majeure', '×1 · major upgrade') },
      { id: 'critdamage', role: L('×1 ou plus · dégâts critiques', '×1 or more · crit damage') },
      { id: 'syringe', role: L('Selon le kit · vitesse d’attaque', 'Depends on kit · attack speed') },
    ],
    synergies: [
      {
        items: ['critglasses', 'attackspeedoncrit', 'healoncrit'],
        text: L(
          'Chaque Instincts et chaque Faux donne aussi 5 % de critique : 9 Lunettes suffisent souvent pour 100 %.',
          'Each Instincts and Scythe also gives 5% crit chance: 9 Glasses are often enough for 100%.',
        ),
      },
      {
        items: ['critglasses', 'bleedonhitandexplode'],
        text: L(
          'La Rate explosive fait saigner sur critique ; les ennemis qui saignent explosent à leur mort.',
          'Shatterspleen bleeds on crit; bleeding enemies explode when they die.',
        ),
      },
    ],
    howTo: [
      L(
        'Le Bandit a déjà des critiques garantis dans le dos : privilégie les effets sur critique plutôt que 10 Lunettes. La Tireuse d’élite a ses propres règles de critique.',
        'Bandit already crits from behind: favour on-crit effects over 10 Glasses. Railgunner has her own crit rules.',
      ),
      L(
        'La Rate explosive est un bonus de boss, pas une condition de départ. La Visée laser demande Survivors of the Void.',
        'Shatterspleen is a boss bonus, not a starting condition. Laser Scope requires Survivors of the Void.',
      ),
    ],
    sources: [
      { label: 'Lens-Maker’s Glasses', url: wiki('Lens-Maker%27s_Glasses') },
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
      'La Teinture infernale te brûle volontairement, ce qui déclenche les Barbelés en continu. L’Armure de répulsion et Planula font supporter ces petits dégâts répétés.',
      'Helfire Tincture burns you on purpose, which sets off Razorwire nonstop. Repulsion Armor Plate and Planula let you endure the small repeated hits.',
    ),
    skills: {
      label: L('Assemblage', 'Set'),
      text: L(
        'Teinture + Barbelés + Armures + Planula ; puis Signe et Piles une fois la survie assurée',
        'Tincture + Razorwire + Plates + Planula; then Gesture and Fuel Cells once you can sustain it',
      ),
    },
    items: [
      { id: 'burnnearby', core: true, role: L('×1 · équipement requis', '×1 · required equipment') },
      { id: 'thorns', core: true, role: L('×1 ou plus · ripostes', '×1 or more · retaliation') },
      { id: 'armorplate', core: true, role: L('Plusieurs selon tes PV · réduction', 'Several, by your health · mitigation') },
      { id: 'parentegg', core: true, role: L('×1 ou plus · récupération', '×1 or more · recovery') },
      { id: 'autocastequipment', role: L('Optionnel · une fois stable', 'Optional · once stable') },
      { id: 'equipmentmagazine', role: L('×5 avec 1 Signe · feu continu', '×5 with 1 Gesture · constant fire') },
      { id: 'missile', role: L('Optionnel · effet à l’impact', 'Optional · on-hit effect') },
    ],
    synergies: [
      {
        items: ['burnnearby', 'thorns'],
        text: L(
          'Chaque tic de brûlure sur toi compte comme des dégâts reçus : les Barbelés ripostent à chaque fois.',
          'Every burn tick on you counts as damage taken: Razorwire strikes back each time.',
        ),
      },
      {
        items: ['burnnearby', 'armorplate', 'parentegg'],
        text: L(
          'L’Armure retire un montant fixe à chaque petit tic et Planula soigne à chaque coup reçu.',
          'The Plate removes a flat amount from each small tick and Planula heals on every hit taken.',
        ),
      },
      {
        items: ['thorns', 'missile'],
        text: L('Les lames des Barbelés peuvent déclencher les effets à l’impact.', 'Razorwire’s blades can trigger on-hit effects.'),
      },
    ],
    howTo: [
      L(
        'Teste d’abord à la main que ta survie compense le feu. Le nombre d’Armures dépend de tes PV et des dégâts reçus.',
        'First check by hand that your sustain beats the fire. How many Plates you need depends on your health and the damage taken.',
      ),
      L(
        'Avec 1 Signe et 5 Piles, la recharge passe sous les 12 s d’effet : tu brûles en permanence, il faut donc tenir en continu.',
        'With 1 Gesture and 5 Fuel Cells the cooldown drops under the 12 s effect: you burn all the time, so you must hold out nonstop.',
      ),
      L(
        'La Teinture blesse aussi les alliés proches : garde tes distances en coopération. Très amusant avec l’Artefact du Commandement.',
        'The Tincture also hurts nearby allies: keep your distance in co-op. Great fun with the Artifact of Command.',
      ),
    ],
    sources: [
      { label: 'Helfire Tincture', url: wiki('Helfire_Tincture') },
      { label: 'Planula', url: wiki('Planula') },
    ],
  },

  // ------------------------------------------------------------ CHEF
  {
    slug: 'chef-oil-and-fire',
    survivor: 'chef',
    name: L('Huile + brûlures', 'Oil + burns'),
    tagline: L('Huiler, saisir, embraser.', 'Oil, sear, ignite.'),
    tag: L('Recommandé · Sear + Glaze', 'Recommended · Sear + Glaze'),
    summary: L(
      'Un build centré sur les brûlures du lance-flammes. L’huile prépare les cibles ; l’Essence propage le feu après les premières éliminations.',
      'A build around the flamethrower’s burns. Oil sets targets up; Gasoline spreads the fire after the first kills.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Hachoir (Dice) · Lance-flammes (Sear) · Roulade (Roll) · Huile (Glaze)',
        'Dice · Sear · Roll · Glaze',
      ),
    },
    items: [
      { id: 'strengthenburn', core: true, role: L('×1 · brûlures ×4', '×1 · burns ×4') },
      { id: 'igniteonkill', core: true, role: L('Plusieurs · propage le feu', 'Several · spreads fire') },
      { id: 'secondaryskillmagazine', core: true, role: L('Plusieurs · plus de lance-flammes', 'Several · more Sear') },
      { id: 'nearbydamagebonus', role: L('Le CHEF se bat de près', 'CHEF fights up close') },
      { id: 'syringe', role: L('Applique les brûlures plus vite', 'Applies burns faster') },
      { id: 'hoof' },
      { id: 'feather' },
      { id: 'missile' },
    ],
    synergies: [
      {
        items: ['igniteonkill', 'strengthenburn'],
        text: L(
          'Le Réservoir d’ignition renforce toutes tes brûlures, celles du lance-flammes comme celles de l’Essence.',
          'Ignition Tank strengthens all your burns, from Sear and from Gasoline alike.',
        ),
      },
    ],
    howTo: [
      L('Combo : huile (Glaze), puis lance-flammes (Sear). Garde la roulade pour te repositionner.', 'Combo: Glaze, then Sear. Keep Roll to reposition.'),
      L(
        'Toucher une cible avec au moins deux compétences différentes avant de la tuer fait apparaître de la nourriture qui soigne.',
        'Hitting a target with at least two different skills before killing it drops healing food.',
      ),
      L(
        'Sans Survivors of the Void (pas de Réservoir), le combo huile + feu marche toujours : complète avec des dégâts généraux et des missiles.',
        'Without Survivors of the Void (no Ignition Tank) the oil + fire combo still works: fill in with general damage and missiles.',
      ),
    ],
  },
  {
    slug: 'chef-ice-and-bands',
    survivor: 'chef',
    name: L('Glace + bracelets', 'Ice + bands'),
    tagline: L('Un gros glaçon pour les grandes cibles.', 'A big ice block for big targets.'),
    tag: L('Variante · Ice Box + Yes, CHEF!', 'Variant · Ice Box + Yes, CHEF!'),
    summary: L(
      'Avec les variantes débloquées, Yes, CHEF! renforce la glacière pour un gros coup qui déclenche les bracelets.',
      'With the variants unlocked, Yes, CHEF! empowers Ice Box into a big hit that sets off the bands.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L('Hachoir (Dice) · Glacière (Ice Box) · Roulade (Roll) · Yes, CHEF!', 'Dice · Ice Box · Roll · Yes, CHEF!'),
    },
    items: [
      { id: 'secondaryskillmagazine', core: true, role: L('Plus de glacières', 'More Ice Box') },
      { id: 'icering', core: true },
      { id: 'firering', core: true },
      { id: 'missile' },
      { id: 'hoof' },
      { id: 'feather' },
    ],
    synergies: [
      {
        items: ['icering', 'firering'],
        text: L(
          'Le glaçon renforcé dépasse le seuil des bracelets : les deux partent sur le même coup quand ils sont prêts.',
          'The empowered ice block passes the bands’ threshold: both go off on the same hit when ready.',
        ),
      },
    ],
    howTo: [
      L('Combo : Yes, CHEF!, puis tout de suite la glacière renforcée.', 'Combo: Yes, CHEF!, then the empowered Ice Box right away.'),
      L(
        'La plupart des boss ne gèlent pas : ici, ce sont les dégâts du glaçon et des bracelets qui comptent.',
        'Most bosses cannot be frozen: here the ice block’s and the bands’ damage is what matters.',
      ),
    ],
  },

  // ------------------------------------------------------------ Enforcer
  {
    slug: 'enforcer-shotgun-shield',
    survivor: 'enforcer',
    name: L('Fusil + bouclier', 'Shotgun + shield'),
    tagline: L('Tenir la ligne, garder une sortie.', 'Hold the line, keep a way out.'),
    tag: L('Polyvalent · compétences de départ', 'Versatile · starting skills'),
    summary: L(
      'Le choix simple pour commencer : bonne cadence, effets à l’impact et de la mobilité pour ne pas être encerclé.',
      'The simple pick to start: good fire rate, on-hit effects and mobility so you do not get surrounded.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Fusil de départ · Bouclier avec parade · Charge · Balise de rassemblement',
        'Starting shotgun · Shield with parry · Charge · Rally beacon',
      ),
    },
    items: [
      { id: 'syringe', core: true },
      { id: 'hoof', core: true },
      { id: 'feather' },
      { id: 'chainlightning' },
      { id: 'missile' },
      { id: 'utilityskillmagazine', role: L('Confort, pas obligatoire', 'Comfort, not required') },
    ],
    synergies: [],
    howTo: [
      L(
        'La protection est frontale : baisse le bouclier et bouge si les ennemis passent derrière toi.',
        'The shield only covers the front: lower it and move if enemies get behind you.',
      ),
      L('Aucun objet légendaire n’est nécessaire.', 'No legendary item is needed.'),
    ],
  },
  {
    slug: 'enforcer-barrier-burst',
    survivor: 'enforcer',
    name: L('Barrière + explosion', 'Barrier + burst'),
    tagline: L('Accumuler. Bloquer. Faire exploser.', 'Stack. Block. Blow up.'),
    tag: L('Variante · Surge Protection', 'Variant · Surge Protection'),
    summary: L(
      'Le bouclier alternatif consomme ta barrière et ton bouclier pour alimenter son explosion : la protection devient aussi des dégâts.',
      'The alternate shield spends your barrier and shield to fuel its blast: protection becomes damage too.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L('Surge Protection (bouclier alternatif) · Balise de rassemblement conseillée', 'Surge Protection (alternate shield) · Rally beacon advised'),
    },
    items: [
      { id: 'barrieronkill', core: true },
      { id: 'personalshield', core: true },
      { id: 'barrieronoverheal', role: L('Demande des soins en excès', 'Needs overhealing') },
      { id: 'hoof' },
      { id: 'feather' },
    ],
    synergies: [
      {
        items: ['barrieronkill', 'personalshield'],
        text: L(
          'Barrière et bouclier sont le carburant de Surge Protection : plus tu en as, plus l’explosion est forte.',
          'Barrier and shield are Surge Protection’s fuel: the more you have, the bigger the blast.',
        ),
      },
    ],
    howTo: [
      L(
        'La balise donne de la barrière, surtout quand ton équipe élimine des ennemis dans sa zone.',
        'The beacon grants barrier, especially when your team kills enemies inside it.',
      ),
      L(
        'Après l’explosion, ta protection est vide : prévois de te déplacer hors du danger.',
        'After the blast your protection is spent: plan to move out of danger.',
      ),
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
      text: L('Burst (fusil à pompe) · poignard au choix · Smoke Bomb · Desperado', 'Burst · any dagger · Smoke Bomb · Desperado'),
    },
    items: [
      { id: 'icering', core: true },
      { id: 'firering', core: true },
      { id: 'crowbar', role: L('Renforce l’ouverture', 'Stronger opener') },
      { id: 'nearbydamagebonus' },
      { id: 'fragiledamagebonus', role: L('SotV', 'SotV') },
      { id: 'critdamage', role: L('SotV', 'SotV') },
    ],
    synergies: [
      {
        items: ['icering', 'firering'],
        text: L('Un tir de Desperado chargé déclenche les deux bracelets.', 'A stacked Desperado shot sets off both bands.'),
      },
      {
        items: ['crowbar', 'critdamage'],
        text: L(
          'Les attaques dans le dos sont critiques : le Pied-de-biche et la Visée laser font un premier tir énorme.',
          'Backstabs crit: Crowbar and Laser Scope make a huge opening shot.',
        ),
      },
    ],
    howTo: [L('Les cumuls de Desperado disparaissent à chaque nouvel étage.', 'Desperado stacks reset on every new stage.')],
  },
  {
    slug: 'bandit-shotgun-crits',
    survivor: 'bandit',
    name: L('Fusil + critiques', 'Shotgun + crits'),
    tagline: L('Chaque plomb profite du dos adverse.', 'Every pellet loves a backstab.'),
    tag: L('Souple · Lights Out ou Desperado', 'Flexible · Lights Out or Desperado'),
    summary: L(
      'Le fusil à pompe et les critiques dans le dos alimentent la vitesse d’attaque, les soins et le saignement.',
      'The shotgun and backstab crits feed attack speed, healing and bleed.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L(
        'Burst · Smoke Bomb · Lights Out (réinitialise les compétences) ou Desperado',
        'Burst · Smoke Bomb · Lights Out (resets skills) or Desperado',
      ),
    },
    items: [
      { id: 'attackspeedoncrit', core: true },
      { id: 'healoncrit', core: true },
      { id: 'bleedonhitandexplode', role: L('Bonus de boss', 'Boss bonus') },
      { id: 'critdamage', role: L('SotV', 'SotV') },
      { id: 'hoof' },
      { id: 'feather' },
    ],
    synergies: [
      {
        items: ['attackspeedoncrit', 'healoncrit'],
        text: L(
          'Chaque plomb critique relance les Instincts et soigne avec la Faux.',
          'Every critting pellet refreshes Instincts and heals with the Scythe.',
        ),
      },
    ],
    howTo: [
      L(
        'Avec Lights Out, une élimination au revolver réinitialise tes compétences et recharge le fusil.',
        'With Lights Out, a revolver kill resets your skills and reloads the shotgun.',
      ),
      L('La Rate explosive n’est pas nécessaire au build.', 'Shatterspleen is not needed for the build to work.'),
    ],
  },
  {
    slug: 'bandit-desperado-purity',
    survivor: 'bandit',
    name: L('Desperado + Pureté', 'Desperado + Purity'),
    tagline: L('Revenir plus vite au revolver.', 'Back to the revolver sooner.'),
    tag: L('Spécialisé · lunaire', 'Niche · lunar'),
    summary: L(
      'La réduction des recharges permet de réutiliser les compétences plus souvent. Favorise les dégâts directs et les effets garantis.',
      'Shorter cooldowns let you use your skills more often. Favour direct damage and guaranteed effects.',
    ),
    skills: {
      label: L('Compétences', 'Skills'),
      text: L('Desperado · Smoke Bomb · Pureté comme objet central', 'Desperado · Smoke Bomb · Purity as the core item'),
    },
    items: [
      { id: 'lunarbadluck', core: true },
      { id: 'icering' },
      { id: 'firering' },
      { id: 'crowbar' },
      { id: 'critdamage', role: L('SotV', 'SotV') },
      { id: 'hoof' },
    ],
    synergies: [
      {
        items: ['lunarbadluck', 'icering', 'firering'],
        text: L(
          'Les bracelets ne dépendent pas de la chance : Pureté ne les gêne pas.',
          'The bands do not rely on luck: Purity does not hurt them.',
        ),
      },
    ],
    howTo: [
      L(
        'Pureté rend les effets aléatoires moins fiables : réserve-la aux parties centrées sur les compétences.',
        'Purity makes random effects less reliable: keep it for skill-focused runs.',
      ),
      L('Les cumuls de Desperado se réinitialisent à chaque étage.', 'Desperado stacks reset on every stage.'),
    ],
  },
]

export const OFFICIAL_BY_SLUG = new Map(OFFICIAL_BUILDS.map((b) => [b.slug, b]))
