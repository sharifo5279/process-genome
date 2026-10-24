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
| Command Center page | `cc.css`, `retail.css`; `data.js`, `cc.js`, `retail-data.js`, `retail.js`; page template in `apply.py` |

Build both after a master rebuild, or after editing any module:

```sh
node tools/build-site.mjs /path/to/master.html
python3 tools/command-center/apply.py site/index.html
node --test tools/command-center/retail.test.cjs
```

`apply.py` installs the model block into a fresh master build, or replaces only that block when it is
already installed, then writes the prototype page. Retail process names and steps are read from the
Process Genome page. All checks run before anything is written.

### Structure

- One dashboard, one findings list and one action queue. Every dashboard component, finding and action
  names its module: Integration Monitor, Performance Monitor or Retail add-on. A module filter narrows all three.
- Root: Overview, Findings, Action queue, Workspace (all agents) and Configuration (Rules & Policies, partner settings).
- Integration Monitor: Partners, Community, Projections and anomalies. Performance Monitor: Business processes
  (with the Solution tab, the client's documents mapped to EDI and ERP), Performance Analytics.
- Demo data covers one client solution of three processes: Order to cash; Receive, match and pay; Deductions.
- Retail add-on (`retail-data.js`, `retail.js`): partner participation, orders and commitments, ASNs and
  readiness, invoices and deductions; its policy templates appear under Configuration (`CXCFG`). It registers its cases with `CXITEMS`,
  its dashboard components with `CXDASH`, its Aviator questions with `CXQ` and its navigation group with
  `CXNAV`. Other industries can add modules the same way.

### Perspectives and demo state

The perspective switch selects Northfield Stores (retailer) or Nuvori Beauty (CPG supplier). Core findings
carry both perspectives (`CCF` and `CCFR` in `data.js`); retail cases carry both in `RTDATA`.
Case assignments, prepared actions, watchlists and policy settings are stored in this browser under
`process-genome-retail-v1`, separately for each perspective. Reset demo clears only the selected perspective.
Every record is illustrative. Preparing a retail action creates a local review packet; approving a core
action marks the finding resolved in the page only. No messages, documents or transactions are sent.

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
