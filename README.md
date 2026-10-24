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

Command Center (Retail and CPG console and Product overlay) is maintained in
`tools/command-center/`, separately from the claude.ai master. Keep changes in these source files;
do not hand-edit the generated `site/index.html`.

| Generated block | Source files, in load order |
|---|---|
| Styles | `cc.css`, then `retail.css` |
| Model and Genome overlay | `data.js`, then `pv.js` |
| Console and retail workspace | `cc.js`, then `retail-data.js`, then `retail.js` |
| Console container | The `CC_HTML` template in `apply.py` |

After rebuilding from an **unpatched master**, install Command Center once:

```sh
node tools/build-site.mjs /path/to/master.html
python3 tools/command-center/apply.py site/index.html
```

To update the already-generated site from the source modules, including when the original master
is unavailable, use:

```sh
python3 tools/command-center/apply.py --refresh site/index.html
```

Both modes accept an optional output path for review without modifying the input:

```sh
python3 tools/command-center/apply.py --refresh site/index.html /tmp/process-genome-review.html
```

The generator writes explicit `process-genome:command-center` begin/end markers around its four
managed blocks. Refresh replaces only those blocks, validates the existing integration hooks and
retail-only route guards, and verifies that all content outside the blocks is byte-for-byte
unchanged. It prints a SHA-256 fingerprint for that preserved content. Repeating refresh with the
same sources produces identical output and skips rewriting an unchanged file.

The first refresh can migrate the original unmarked checked-in additions from commit
`b8e45684e99052c663aa9d69ef06ff48cda350e6`. Their frozen block fingerprints must match exactly.
Unknown legacy content, partial/duplicate markers, missing modules, or changed integration anchors
stop generation before output is written. Resolve the source/build mismatch rather than bypassing
those checks. Refresh does not recreate the Genome master or reapply router changes; a fresh master
build still uses the initial installation command above. All seven module files must be present.

### Retail and CPG demo

Open `#retail/command` for the Retail overview. The demo perspective switch selects Northfield
Stores (retailer) or Nuvori Beauty (CPG supplier). Four workspaces cover partner participation,
order commitments, ASN readiness, and invoice/deduction investigation. Eight cases include
documents, policy checks, line comparisons, evidence gaps, and owned next steps.

The existing IM, PM, and Analytics views remain available. Focused retail entry points and cases
sit above the preserved core capability sample, whose Nuvori Beauty context is explicitly labeled.
This is an industry extension of the current prototype, not a replacement CCPM product design.

Case assignments, prepared actions, watchlists, and policy settings are stored in this browser
under `process-genome-retail-v1`, separately for each perspective. Reset demo clears only the
selected perspective. Every record is illustrative. Actions prepare local review packets; no
messages, business documents, operational changes, disputes, or financial transactions are sent.
Policy tests evaluate two fixtures against the edited threshold and any required evidence gate.
Activating a demo policy saves its configuration; it does not rewrite the fixed case snapshot.

Run the focused smoke checks after editing the retail modules:

```sh
node tools/command-center/retail.test.cjs
python3 tools/command-center/apply.py --refresh site/index.html
```

Browser verification should cover both perspectives, each case tab, nested policy/process
dialogs, draft retention, assignment/preparation, searches, filters, downloads, and core navigation.

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
