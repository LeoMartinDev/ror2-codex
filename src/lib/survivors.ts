/**
 * Playable survivors, in the order of the game's character select screen. Names and subtitles come from
 * the game's language files (*_BODY_NAME, *_BODY_SUBTITLE). Portraits are downloaded by `bun run data`
 * to public/survivors/<id>.png from the wiki file `<wiki>.png`. No imports so the data script can use this list.
 */
export const SURVIVORS = [
  { id: 'commando', wiki: 'Commando', name: { fr: 'Commando', en: 'Commando' }, subtitle: { fr: 'Pistolero acculé', en: 'Cornered Gunslinger' } },
  { id: 'huntress', wiki: 'Huntress', name: { fr: 'Chasseuse', en: 'Huntress' }, subtitle: { fr: 'Juge, jury, bourreau', en: 'Judge, Jury, Executioner' } },
  { id: 'bandit', wiki: 'Bandit', name: { fr: 'Bandit', en: 'Bandit' }, subtitle: { fr: 'Hors-la-loi sans scrupule', en: 'Desperate Outlaw' } },
  { id: 'mult', wiki: 'MUL-T', name: { fr: 'POL-Y', en: 'MUL-T' }, subtitle: { fr: 'Le bon outil pour le mauvais travail', en: 'Right Tool for the Wrong Job' } },
  { id: 'engineer', wiki: 'Engineer', name: { fr: 'Ingénieur', en: 'Engineer' }, subtitle: { fr: 'Expert en fortification', en: 'Fortification Expert' } },
  { id: 'artificer', wiki: 'Artificer', name: { fr: 'Artificière', en: 'Artificer' }, subtitle: { fr: 'Héraut de la maison de l’au-delà', en: 'Herald of the House Beyond' } },
  { id: 'mercenary', wiki: 'Mercenary', name: { fr: 'Mercenaire', en: 'Mercenary' }, subtitle: { fr: 'Lame engagée', en: 'Hired Blade' } },
  { id: 'rex', wiki: 'REX', name: { fr: 'REX', en: 'REX' }, subtitle: { fr: 'Symbiotes', en: 'Symbiotes' } },
  { id: 'loader', wiki: 'Loader', name: { fr: 'Chargeuse', en: 'Loader' }, subtitle: { fr: 'Centrale bionique', en: 'Bionic Powerhouse' } },
  { id: 'acrid', wiki: 'Acrid', name: { fr: 'Acrid', en: 'Acrid' }, subtitle: { fr: 'Cobaye', en: 'Test Subject' } },
  { id: 'captain', wiki: 'Captain', name: { fr: 'Capitaine', en: 'Captain' }, subtitle: { fr: 'Vétéran las', en: 'Tired Veteran' } },
  { id: 'railgunner', wiki: 'Railgunner', name: { fr: 'Tireuse d’élite', en: 'Railgunner' }, subtitle: { fr: 'Nomade oubliée', en: 'Forgotten Nomad' } },
  { id: 'voidfiend', wiki: 'Void Fiend', name: { fr: 'Démon du vide', en: 'Void Fiend' }, subtitle: { fr: 'Amnésique corrompu', en: 'Corrupted Amnesiac' } },
  { id: 'seeker', wiki: 'Seeker', name: { fr: 'Chercheuse', en: 'Seeker' }, subtitle: { fr: 'Devineresse de la Maison de l’au-delà', en: 'Diviner of House Beyond' } },
  { id: 'falseson', wiki: 'False Son', name: { fr: 'Fils illégitime', en: 'False Son' }, subtitle: { fr: 'L’héritier brisé', en: 'The Shattered Heir' } },
  { id: 'chef', wiki: 'CHEF', name: { fr: 'CHEF', en: 'CHEF' }, subtitle: { fr: 'Adepte de la cuisine', en: 'Culinarian Adept' } },
  { id: 'drifter', wiki: 'Drifter', name: { fr: 'Vagabonde', en: 'Drifter' }, subtitle: { fr: 'Collectionneuse sans limites', en: 'Unchecked Hoarder' } },
  { id: 'operator', wiki: 'Operator', name: { fr: 'Opérateur', en: 'Operator' }, subtitle: { fr: 'Spécialiste contraint', en: 'Coerced Specialist' } },
  { id: 'enforcer', wiki: 'Enforcer', name: { fr: 'Exécuteur', en: 'Enforcer' }, subtitle: { fr: 'Furieux et indestructible', en: 'Too Angry to Die' } },
] as const

export type SurvivorId = (typeof SURVIVORS)[number]['id']
export type Survivor = (typeof SURVIVORS)[number]

export const SURVIVOR_BY_ID = Object.fromEntries(SURVIVORS.map((s) => [s.id, s])) as Record<SurvivorId, Survivor>
export const isSurvivorId = (v: unknown): v is SurvivorId => typeof v === 'string' && v in SURVIVOR_BY_ID
export const survivorIcon = (id: SurvivorId) => `/survivors/${id}.png`
