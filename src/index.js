import express from 'express';
import cors from 'cors';
import { CORS_ORIGINS, PORT } from './config.js';
import publicRouter from './routes/public.js';
import echobulleRouter from './routes/echobulle.js';
import adminRouter from './routes/admin.js';

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (CORS_ORIGINS.includes('*') || CORS_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (_req, res) => {
  const homepage = `<!DOCTYPE html>
  <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Reso•° API · Accueil</title>
      <style>
        :root {
          color-scheme: light dark;
          --bg: #0b1021;
          --fg: #e8eefc;
          --accent: #63f5b0;
          --muted: #9fb2d8;
          --card: #11172d;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: var(--bg);
          color: var(--fg);
          line-height: 1.6;
          padding: 32px 20px 48px;
          display: flex;
          justify-content: center;
        }
        main {
          width: min(960px, 100%);
          display: grid;
          gap: 24px;
        }
        header {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        h1 {
          margin: 0;
          font-size: 2.1rem;
          letter-spacing: -0.02em;
        }
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 99px;
          background: rgba(99, 245, 176, 0.12);
          color: var(--accent);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.78rem;
          width: fit-content;
        }
        p { margin: 0; color: var(--muted); }
        section {
          background: var(--card);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 18px 20px;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.18);
        }
        h2 {
          margin: 0 0 12px;
          font-size: 1.2rem;
        }
        ul { margin: 0; padding-left: 18px; color: var(--fg); }
        code { background: rgba(255, 255, 255, 0.06); padding: 3px 6px; border-radius: 6px; }
        .endpoint {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 8px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .endpoint:last-child { border-bottom: none; }
        .method {
          font-weight: 700;
          color: var(--accent);
          min-width: 70px;
        }
        footer {
          text-align: center;
          color: var(--muted);
          font-size: 0.9rem;
        }
        a { color: var(--accent); text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <main>
        <header>
          <span class="pill">Reso•° API</span>
          <h1>Inconscient collectif transnumériste</h1>
          <p>Base Express serverless pour orchestrer les signaux, générer des échobulles et administrer le graphe éphémère.</p>
        </header>

        <section>
          <h2>Points d'entrée</h2>
          <div class="endpoint">
            <span class="method">GET</span>
            <span>/health</span>
            <span>Statut rapide du service</span>
          </div>
          <div class="endpoint">
            <span class="method">GET</span>
            <span>/public/hublot</span>
            <span>Flux agrégé simulé (mock)</span>
          </div>
          <div class="endpoint">
            <span class="method">POST</span>
            <span>/echo</span>
            <span>Enregistre des <code>tags</code> (X-API-KEY publique requise)</span>
          </div>
          <div class="endpoint">
            <span class="method">GET</span>
            <span>/echobulle</span>
            <span>Génère une échobulle depuis l'état courant</span>
          </div>
          <div class="endpoint">
            <span class="method">GET</span>
            <span>/admin/dashboard</span>
            <span>Vue JSON admin (clé admin requise)</span>
          </div>
          <div class="endpoint">
            <span class="method">POST</span>
            <span>/admin/content</span>
            <span>Injection interne de contenu (clé admin requise)</span>
          </div>
          <div class="endpoint">
            <span class="method">POST</span>
            <span>/admin/reset</span>
            <span>Purge le graphe en mémoire (clé admin requise)</span>
          </div>
        </section>

        <section>
          <h2>Démarrage rapide</h2>
          <ul>
            <li><code>npm install</code> puis <code>npm run dev</code> pour un watch local.</li>
            <li>Configurer les clés dans <code>.env</code> (<code>RESO_PUBLIC_KEY</code>, <code>RESO_ADMIN_KEY</code>, etc.).</li>
            <li>Tester l'accueil : <code>GET /</code> (vous y êtes).</li>
          </ul>
        </section>

        <footer>Résolument frugal, prêt pour Vercel · Inspiré par l'écosystème ekosite / échobulle / ekoreso.</footer>
      </main>
    </body>
  </html>`;

  return res.set('Content-Type', 'text/html').send(homepage);
});

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'Reso•° API' }));
app.use('/public', publicRouter);
app.use('/', echobulleRouter);
app.use('/admin', adminRouter);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Reso•° API en écoute sur le port ${PORT}`);
  });
}

export default app;
export { app };
