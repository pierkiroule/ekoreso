# Reso•° API (eko-reso)

Base frugale pour l'API Reso•°, un inconscient artificiel collectif au service de l'écosystème ekosite / échobulle / ekoreso. Cette version v1 pose une architecture Express prête pour le serverless Vercel et l'intégration Supabase, sans collecte de données personnelles et avec une sécurité par clés API simples.

## Vision et rôle
- **Reso•°** : agrège des signaux symboliques (tags) et génère des « échobulles » illustrant des cooccurrences.
- **Ecosystème** :
  - **ekosite** : couche interface et expérimentation.
  - **échobulle** : représentations visuelles ou narratives du graphe de signaux.
  - **eko-Reso API** : ce repo, socle backend extensible (cooccurrences, échobulles, mini-admin interne).

## Stack
- Node.js (ESM) + Express
- CORS + JSON middleware
- @supabase/supabase-js prêt à l'emploi
- dotenv pour la configuration
- Déploiement serverless Vercel

## Arborescence
```
/ 
├─ package.json
├─ vercel.json
├─ .env.example
├─ README.md
└─ src
   ├─ index.js
   ├─ config.js
   ├─ db/
   │  └─ supabase.js
   ├─ routes/
   │  ├─ public.js
   │  ├─ echobulle.js
   │  └─ admin.js
   └─ services/
      ├─ resonanceEngine.js
      ├─ echobulleGenerator.js
      └─ decay.js
```

## Installation locale
1. Cloner le repo et installer les dépendances :
   ```bash
   npm install
   ```
2. Dupliquer `.env.example` en `.env` et renseigner les variables (voir section suivante).
3. Lancer en développement (watch) :
   ```bash
   npm run dev
   ```
   ou en mode simple :
   ```bash
   npm start
   ```
4. Tester l'accueil : `GET http://localhost:3000/` → aperçu JSON des endpoints.
5. Vérifier la santé : `GET http://localhost:3000/health` → `{ "status": "ok" }`.

## Variables d'environnement
- `SUPABASE_URL` : URL du projet Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` : clé service role (usage backend uniquement).
- `RESO_PUBLIC_KEY` : clé API publique pour `/echo`.
- `RESO_ADMIN_KEY` : clé API admin pour `/admin`.
- `CORS_ORIGINS` : liste séparée par des virgules (ou `*`) des origines autorisées.
- `PORT` : port local (3000 par défaut).

## Déploiement Vercel (Node serverless)
1. Installer Vercel CLI si besoin : `npm i -g vercel`.
2. Renseigner les variables d'environnement sur le projet Vercel (`vercel env add ...`).
3. Déployer :
   ```bash
   vercel --prod
   ```
4. La configuration `vercel.json` route toutes les requêtes vers `src/index.js` et exporte l'app Express.

## Endpoints
- `GET /` : message d'accueil avec la liste des endpoints disponibles.
- `GET /health` : statut rapide du service.
- `GET /public/hublot` : flux agrégé simulé (mock) basé sur l'état actuel.
- `POST /echo` (header `X-API-KEY: RESO_PUBLIC_KEY`) : enregistre un ensemble de `tags` et met à jour le graphe de cooccurrence.
- `GET /echobulle` : génère une échobulle à partir du graphe en mémoire.
- `POST /admin/content` (header `X-API-KEY: RESO_ADMIN_KEY`) : injection interne de contenu symbolique (`tags`, `media_url`).

## Services internes
- **resonanceEngine** : graphe en mémoire (pondération + cooccurrences) avec décroissance temporelle simple.
- **decay** : utilitaire de décroissance (demi-vie d'1h par défaut).
- **echobulleGenerator** : transforme l'état du graphe (top signaux, edges, densité) en objet échobulle.

## Supabase
- Le client est instancié dans `src/db/supabase.js`. Si `SUPABASE_URL` ou `SUPABASE_SERVICE_ROLE_KEY` sont absents, le client reste `null` et un warning est logué.
- Pour persister le graphe ou historiser les signaux, créer des tables dans Supabase puis injecter le client dans les services (ex : écrire un enregistrement à chaque `/echo`).

## Sécurité
- Pas d'auth utilisateur, seulement des clés API :
  - Clé publique pour les endpoints participatifs (`/echo`).
  - Clé admin pour les opérations internes (`/admin`).
- Aucun stockage de données personnelles ; le graphe en mémoire peut être purgé à chaud (redeploiement).

## Evolutions possibles
- Persistance des cooccurrences dans Supabase (cron, triggers).
- Génération d'échobulles enrichies (media, narrations, échantillons).
- Mini-console admin sobre pour visualiser les signaux.
