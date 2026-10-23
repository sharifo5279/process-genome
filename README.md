# Business Network Process Genome on Render

| Service | Type | What it serves |
|---|---|---|
| `process-genome` | Static site, publish directory `site` | The Process Genome (`site/index.html`) and its favicon files |
| `process-genome-stats` | Node web service, `node server/index.mjs` (not created yet) | `POST /api/hit`, `POST /api/event`, `GET /api/stats?days=1..90`, `GET /healthz` |

Master copy: the claude.ai artifact build. `site/index.html` is generated from it, never edited by hand.

## Visitor stats (on hold)
Same model as the Trading Grid Innovation Guide (sharifo5279/tg-innovation-guide), so the Process Genome can join the
2027 H1 guide without changing how it is counted:
- `server/` is the guide's stats service, unchanged apart from comments: same tables (`visits`, `product_events`), same
  daily-salted visitor id, same DB-IP Lite location lookup, no cookies, no stored IP addresses.
- Views play the part of the guide's products: `/api/event` with `{"p": view id, "k": "view" | "act" | "link"}`. View ids
  are prefixed `pg-` (`pg-overview`, `pg-opsmap`, `pg-<industry>-genome`, `pg-<industry>-solutions`), so they never
  collide with guide product ids. Rows can be copied into the guide's tables as they are.
- `tools/stats-template.html` is the guide's stats page with views grouped by industry in place of products.

To turn it on:
1. Create a Postgres database and the `process-genome-stats` web service (build `npm ci --omit=dev --no-audit --no-fund`,
   start `node server/index.mjs`), with `DATABASE_URL` and `ALLOWED_ORIGINS=https://process-genome.onrender.com`.
2. Set `STATS_LIVE = True` in the master build (`home.py`) for the footer "Visitor stats" link.
3. `API_ORIGIN=https://process-genome-stats.onrender.com node tools/build-site.mjs /path/to/master.html` writes
   `site/index.html` (with the open and view scripts) and `site/stats/index.html`.

Tests: `npm test`.
