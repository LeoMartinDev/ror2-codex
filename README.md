# RoR2 Codex

Tous les objets et équipements de Risk of Rain 2 (base, SotV, SotS, Alloyed Collective, Hallowed Concepts) avec leurs effets en français, leurs noms anglais et **comment ils se cumulent**. Pour chaque stat, l'app affiche le modèle de cumul (linéaire, hyperbolique, exponentiel, réciproque…), les plafonds et la courbe selon le nombre d'exemplaires.

Stack : Bun, TanStack Start / Router, Tailwind, Cloudflare Workers.

## Commandes

```bash
bun install
bun run dev        # http://localhost:3000
bun test           # tests du moteur de cumul, des builds + intégrité des données
bun run build      # build Workers + prérendu de /
bun run preview    # build puis runtime Workers local
bun run deploy     # wrangler deploy (nécessite `bunx wrangler login`)
```

## Builds

`/builds` liste des builds, génériques ou par survivant : nom, objets (essentiels ou non, avec leur rôle), compétences, comment le jouer et synergies. L'app ajoute d'elle-même les synergies qu'elle repère entre les objets du build (familles de `src/lib/related.ts`) et signale les conflits (objet du Vide qui en corrompt un autre).

- **Builds du Codex** : `src/data/builds.ts`, écrits en FR et EN, prérendus sur `/builds/<slug>`. `bun test` vérifie que leurs objets existent.
- **Builds des joueurs** : créés dans l'éditeur (`/builds/edit`), sans serveur. Le lien de partage contient tout le build, compressé dans le hash (`/builds/view#<code>`, voir `src/lib/builds.ts`). « Mes builds » sont gardés dans le `localStorage` du navigateur.
- **Par un assistant IA** : il suffit de lui donner l'adresse du site. `/llms.txt` lui explique tout, avec des URL absolues : le format JSON d'un build (objets et survivants nommés en FR ou EN), `/api/items?q=…` pour trouver les objets, et `/api/builds?b=<JSON>` (ou POST) qui valide le build, suggère les noms corrects en cas de faute et renvoie le lien court. Sans API, l'agent peut aussi donner directement le lien lisible `/builds/view?b=<JSON>` : la page affiche le build et les erreurs éventuelles. Le format est défini dans `src/lib/buildInput.ts`.
- **En local** : `bun run build-link build.json [--open]` fait la même chose depuis un fichier, et `--open` ouvre le résultat (pane navigateur Kero, sinon navigateur par défaut). Le lien vise `http://localhost:3000`, sauf `--base <url>` ou `ROR2_CODEX_URL`.

Les portraits des survivants (`public/survivors/`) sont téléchargés par `bun run data`, la liste est dans `src/lib/survivors.ts`.

## Données

`src/data/items.json` et `public/icons/` sont générés par `bun run data`, puis commités. Le déploiement n'a donc pas besoin du jeu.

Le script `scripts/build-data.ts` combine plusieurs sources :

1. **Textes officiels FR/EN** lus dans les fichiers de langue du jeu installé. Le chemin par défaut est Steam (`…/Risk of Rain 2_Data/StreamingAssets/Language`), modifiable avec `ROR2_LANG_DIR`.
2. **Métadonnées du wiki** (`Module:Items/Data`, `Module:Equipment/Data` sur riskofrain2.wiki.gg) : rareté, DLC, catégories et stats de cumul. Elles sont mises en cache dans `.cache/`. Utilise `bun run data --refresh` pour les re-télécharger.
3. **Corrections manuelles** dans `data/overrides.json`, avec l'ID wiki de l'item comme clé. On peut y forcer la rareté, corriger ou ajouter une stat, ou écrire une formule propre (`"model": "table", "expr": "…"` en fonction de `n`).
4. **Déclencheurs** dans `data/triggers.json` (ID de `items.json` comme clé) : ce qui active chaque objet (coup porté, kill, dégâts reçus, sprint…). Les textes par type sont dans `src/lib/triggers.ts` ; on peut remplacer la phrase d'un objet avec `[type, "texte FR", "texte EN"]`. Un objet sans entrée est signalé à la génération.
5. **Traductions des noms de stats** dans `data/stat-labels.fr.json`. Celles qui manquent sont listées dans `.cache/untranslated-stats.json`.
6. **Icônes** téléchargées depuis le wiki, et **couleur dominante** calculée avec `sharp`, ce qui permet le filtre par couleur.

Après une mise à jour du jeu : `bun run data --refresh`, lire le rapport affiché en console, puis compléter `overrides.json` si besoin.

## Modèles de cumul (`src/lib/stacking.ts`)

| Modèle | Formule (n = exemplaires) | Exemple |
| --- | --- | --- |
| linéaire | base + add·(n−1) | Soldier's Syringe |
| hyperbolique | 1 − 1/(1 + base + add·(n−1)) | Tougher Times (13 % réels pour 15 % affichés) |
| exponentiel (réduction) | 1 − (1−base)(1−add)^(n−1) | Alien Head |
| exponentiel (multiplicatif) | (1+base)(1+add)^(n−1) − 1 | Shaped Glass |
| géométrique | base·(1+add)^(n−1) | Old War Stealthkit |
| réciproque | base / (1 + add·(n−1)) | H3AD-5T v2 |
| table | valeurs précalculées | Bandolier |
