# Business Network Process Genome on Render

| Service | Type | What it serves |
|---|---|---|
| `process-genome` | Static site, publish directory `site` | The Process Genome (`site/index.html`) and its favicon files |
| `process-genome-stats` | Node web service, `node server/index.mjs` (not created yet) | `POST /api/hit`, `POST /api/event`, `GET /api/stats?days=1..90`, `GET /healthz` |

Master copy: the claude.ai artifact build. `site/index.html` is generated from it, never edited by hand:
`node tools/build-site.mjs /path/to/master.html` wraps the master in a full document (charset, phone viewport, title,
description, link preview tags, favicons). Below 1024 px the Process Genome and the Operations map render as lists with
detail sheets.

## Command Center source and generation

Command Center is a clickable prototype on a page of its own, `site/command-center/index.html`
(https://process-genome.onrender.com/command-center/). The Process Genome links to it from the Retail and
CPG view bar and from the Product overlay, opening in a new tab, the way the Trading Grid Innovation Guide
links its prototypes. Sources live in `tools/command-center/`; do not hand-edit generated pages.

| Output | Source files, in load order |
|---|---|
| Process Genome page: one managed block | `data.js` (shared findings data), `pv.js` (Product overlay) |
| Command Center page | `cc.css`, `retail.css`; `data.js`, `cc.js`, `workspace.js`, `retail-data.js`, `retail.js`; page template in `apply.py` |

Build both after a master rebuild, or after editing any module:

```sh
node tools/build-site.mjs /path/to/master.html
python3 tools/command-center/apply.py site/index.html
node --test tools/command-center/retail.test.cjs
```

`apply.py` installs the model block into a fresh master build, or replaces only that block when it is
already installed, then writes the prototype page. Retail process names and steps are read from the
Process Genome page. All checks run before anything is written.

### Packages and structure

A Package selector in the top bar switches between the three client configurations (saved as
`process-genome-cc-package` in this browser):

| Package | Adds |
|---|---|
| Integration Monitor (every Trading Grid client) | Overview (Summary with the daily digest, failure points, network activity and transaction volume; Projections and anomalies with failed-transaction monitors and Explain with Aviator; Network health with network activity, document summary and transaction volume with the refine panel; custom dashboards), Findings, Action queue, Partners (All partners, Network graph, Integration analysis, partner details), Workspace (Reports, Notifications, Tasks and reminders, Agents with Ivy), Configuration (Monitoring) |
| + Performance Monitor (any industry) | Process ring on the Overview, Workspace › Business processes with Solution, the Partner scorecard tab on the Overview, agents Lex, Nora, Liz and Reese, Configuration › Rules & Policies with the rule wizard. Generic process templates: Order to cash, Procure to pay, Claims and disputes |
| + Retail pack (includes Performance Monitor) | Retail process definitions, retail cases with evidence, retail lenses in Business processes, Required documents on Partners, Retail KPIs tab and card on the Overview, retail policy templates, retailer and supplier perspectives |

The navigation is the same six entries for every package. The Overview gains dashboard tabs and Workspace gains sections as
packages are added; the Retail pack adds content rather than screens. Every finding, action and dashboard component names its module.

Modules register through shared lists: `CXITEMS` (findings and actions), `CXDASH` (components), `CXQ` (Aviator),
`CXCFG` (Configuration cards), `CXPTAB` (Partners tabs), `WSPRE` (prebuilt dashboards) and `WSLENS` (process lenses).
Integration Monitor capabilities are in `im.js`. Business process views show only the steps that exchange an EDI document on
Trading Grid; portal, ERP and warehouse-system steps from the reference processes are left out.
Workspace saved items are kept under `process-genome-cc-workspace-v2`.

### Perspectives and demo state

With the Retail pack, the perspective switch selects Northfield Stores (retailer) or Nuvori Beauty (CPG supplier).
Core findings carry both perspectives (`CCF` and `CCFR` in `data.js`); retail cases carry both in `RTDATA`. Retail case
work is stored under `process-genome-retail-v1`, per perspective. Every record is illustrative; no messages, documents or
transactions are sent.

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
