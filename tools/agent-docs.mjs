// Agent-readable version of the Process Genome (owner, Oct 26): plain markdown that Claude, ChatGPT and other agents can read
// without running the page's scripts. Written on every site build from the same data the page renders, so it never drifts:
//   site/llms.txt                 index in the llms.txt convention (https://llmstxt.org)
//   site/llms-full.txt            every section in one file
//   site/agents/*.txt             one file per section, markdown served as text/plain (agent fetchers often refuse text/markdown)
// Run on its own: node tools/agent-docs.mjs [site/index.html]. tools/build-site.mjs calls writeAgentDocs() after it writes the page.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SITE = "https://process-genome.onrender.com/";
const IND = [["retail", "retail", "Retail and CPG"], ["automotive", "automotive", "Automotive"], ["banking", "financial-services", "Financial services"]];
const GUIDE_DISC = "Examples describe typical operating scenarios, not specific customer accounts. Standards, versions, and mandate dates vary by partner and region. Confirm requirements with each partner before building.";

/* End of the object or array literal that starts at s[i]; skips strings and comments. */
function litEnd(s, i) {
  let depth = 0, q = null;
  for (let k = i; k < s.length; k++) {
    const c = s[k];
    if (q) { if (c === "\\") k++; else if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === "`") { q = c; continue; }
    if (c === "/" && s[k + 1] === "*") { k = s.indexOf("*/", k + 2) + 1; continue; }
    if (c === "/" && s[k + 1] === "/") { k = s.indexOf("\n", k); continue; }
    if (c === "{" || c === "[") depth++;
    else if (c === "}" || c === "]") { depth--; if (!depth) return k + 1; }
  }
  throw new Error("unterminated literal at " + i);
}
const PMC = new Proxy({}, { get: () => "" });
const STUBS = { PMC, ovText: (k, extra) => extra || {} };
function val(src, marker, ctx = {}) {
  const a = src.indexOf(marker);
  if (a < 0) throw new Error("agent docs: " + marker + " not found in the page");
  const s = a + marker.length;
  return vm.runInNewContext("(" + src.slice(s, litEnd(src, s)) + ")", { ...STUBS, ...ctx });
}

function head(title, view, status) {
  return `# ${title}\n\nSource: Business Network Process Genome, ${view}.\nStatus: ${status}\n`;
}
const join = (a) => a.filter((x) => x != null).join("\n");

function solutions(k, slug, name, C, rows) {
  const P = Object.fromEntries(C.processes.map((p) => [p.id, p])), R = Object.fromEntries(rows.map((r) => [r[0], r]));
  const out = [head(`${name} solutions on Trading Grid`, `Solution overview for ${name} (${SITE}#${k}/solution)`, C.footer_disclaimer), `${C.hero.headline}. ${C.hero.lead}`, ""];
  out.push("## Solutions by stage", "");
  out.push(C.index.stages.map((s) => `- ${s.title}: ${s.ids.map((i) => P[i].name).join("; ")}`).join("\n"), "");
  for (const s of C.index.stages) {
    out.push(`### ${s.title}`, s.desc, "");
    for (const id of s.ids) {
      const p = P[id], r = R[id];
      out.push(`#### ${p.name}`, `- Purpose: ${p.headline}`, `- Summary: ${p.paragraph}`, "- Capabilities:", ...p.bullets.map((b) => `  - ${b}`),
        r ? `- Parties: ${r[2].map((w) => w[1]).join(", ")}` : null, `- Outcome: ${p.index_line}`, "");
    }
  }
  if (C.why) {
    out.push(`## ${C.why.heading}`, C.why.sub, "");
    for (const g of C.why.groups) out.push(`### ${g.title}`, ...g.items.map((it) => `- ${it[0]}: ${it[1]}`), "");
  }
  if (C.stats) out.push("## Network", ...C.stats.map((x) => `- ${x[0]}: ${x[1]}`), "");
  return join(out);
}

function tokens(doc) {
  return String(doc).split(" / ")[0].replace(/^GDSN /, "").split(/,\s*|\s+or\s+/).map((t) => t.trim()).filter(Boolean);
}
function documents(k, slug, name, G, procs) {
  const out = [head(`${name} documents`, `Process Genome for ${name} (${SITE}#${k}/map)`, GUIDE_DISC)];
  out.push(`Code key: ${G.codeKey}. ${G.el.length} documents, grouped by family in flow order.`, "");
  const used = (e) => {
    const set = new Set(e[10]);
    procs.forEach((p, i) => p.steps.forEach((s) => { if (tokens(s[1]).includes(e[1])) set.add(i); }));
    return [...set].sort((a, b) => a - b).map((i) => procs[i] && procs[i].n).filter(Boolean);
  };
  const std = (x) => typeof x === "string" ? (x ? `Europe and international: ${x}` : "No EDIFACT equivalent")
    : [x.iso && `ISO 20022: ${x.iso}`, x.mt && `SWIFT MT: ${x.mt}`, x.other && `Other: ${x.other}`].filter(Boolean).join("; ") || "No equivalent listed";
  const fams = [];
  for (const e of G.el) if (!fams.includes(e[3])) fams.push(e[3]);
  for (const f of fams) {
    out.push(`## ${G.fam[f] ? G.fam[f][0] : f}`, "");
    for (const e of G.el.filter((x) => x[3] === f)) {
      out.push(`- **${e[1]} ${e[2]}**. Sender: ${e[5]}. Receiver: ${e[6]}. ${std(e[7])}.${e[8] ? " Penalty-prone." : ""} ${e[9]} Used in: ${used(e).join("; ") || "no process"}.`);
    }
    out.push("");
  }
  return join(out);
}

function processes(k, slug, name, procs) {
  const lc = (s) => s.charAt(0).toLowerCase() + s.slice(1);
  const out = [head(`${name} business processes`, `Process Genome for ${name} (${SITE}#${k}/map)`, GUIDE_DISC)];
  procs.forEach((p, i) => {
    out.push(`## ${i + 1}. ${p.n}`, `Outcome: ${p.outcome}`, "");
    if (p.summary) out.push(p.summary, "");
    out.push(`- Parties: ${p.lanes.join(", ")}`, `- Business owner: ${p.owner}`, `- Measures: ${p.measures.join(", ")}`);
    if (p.docs) out.push(`- Documents, North America: ${p.docs.na}`, `- Documents, Europe and international: ${p.docs.eu}`);
    out.push("", "### Steps");
    p.steps.forEach((s, j) => {
      out.push(`${j + 1}. **${s[0]}** (${s[1]}, from ${lc(p.lanes[s[2]] || "")})`);
      if (s.length === 8) out.push(`   - What happens: ${s[3]}`, `   - Rules that bite: ${s[4]}`, `   - EDI team work: ${s[5]}`, `   - If it fails: ${s[6]}`, `   - Work areas: ${s[7].join(", ")}`);
      else out.push(`   - What happens: ${s[3]}`, `   - If it fails: ${s[4]}`, `   - Protected by: ${(s[5] || []).join(", ")}`);
    });
    out.push("");
    if (p.variants && p.variants.length) out.push("### Variants", ...p.variants.map((v) => `- **${v[0]}**${v[2] ? ` (${v[2]})` : ""}: ${v[1]}`), "");
    for (const [h, list] of [["Penalties and disputes", p.penalties], ["Watch for", p.watch], ["Europe and international", p.europe]])
      if (list && list.length) out.push(`### ${h}`, ...list.map((x) => `- ${x}`), "");
  });
  return join(out);
}

function operations(AREAS, GROUPS, BREAKS, BREAK_TEXT, EXAMPLES, STK) {
  const out = [head("B2B operations work areas and stakeholders", `Operations map, common to all industries (${SITE}#all/opsmap)`, GUIDE_DISC)];
  out.push("The work an EDI and B2B operations team does, where each area breaks, and the internal and external stakeholders involved. Roles: owner, contributor, affected.", "");
  const role = { owner: "owner", contributor: "contributor", affected: "affected" };
  for (const a of AREAS) {
    const g = GROUPS.find((x) => x.from === a.n);
    if (g) out.push(`## ${g.name}`, "");
    const ex = IND.map(([k, , n]) => { const t = (EXAMPLES[a.n] && EXAMPLES[a.n][k]) || (a.ex && a.ex[k]); return t ? `  - ${n}: ${t}` : ""; }).filter(Boolean);
    const links = (STK.links[a.n] || []).map((l) => `  - ${l.s} (${l.side === "in" ? "internal" : "external"}, ${role[l.role] || l.role}): ${l.why}`);
    out.push(`### ${a.n}`, a.line, "", "- What the work involves:", ...a.does.map((d) => `  - ${d}`),
      `- Where it breaks: ${BREAKS[a.n] ? BREAK_TEXT[BREAKS[a.n]] + ". " : ""}${a.breaks}`, `- Who is involved: ${a.who}`,
      ex.length ? "- Examples:" : null, ...ex, links.length ? "- Stakeholders:" : null, ...links, "");
  }
  out.push("## Stakeholders", "", "### Internal", ...STK.internal.map((x) => `- ${x.name}: ${x.desc}`), "", "### External", ...STK.external.map((x) => `- ${x.name}: ${x.desc}`), "");
  return join(out);
}

function overlay(PV, OV, DEF, COPY) {
  const L = (rows) => rows.map((r) => `- ${r[0]} (${r[1].join(", ")})`);
  const band = { h: "high", m: "medium", l: "low" };
  const out = [head("Retail and CPG product overlay", `Product overlay on the Retail and CPG Process Genome (${SITE}#retail/map)`, COPY.footer_disclaimer)];
  out.push("The Product overlay maps product coverage onto the retail documents in four steps: Connect, Comply, Optimize and Extend. Document codes follow each capability.", "");
  out.push("## Connect: partner connectivity", "Brings partners without EDI teams onto electronic documents, on either side of the relationship. Web EDI lets suppliers answer retailer orders online. The supplier portal lets retailer and CPG hubs trade with vendors that have no EDI.", "",
    "### Web EDI for suppliers", ...L(PV.web), "", "### Supplier portal for retailer and CPG hubs", ...L(PV.sp), "");
  out.push("## Comply: retail compliance for suppliers", "A separate product, not part of Command Center. Checks documents before delivery, alerts business users before a penalty, and scores compliance by retailer.", "",
    "### Pre-delivery document validation", ...L(PV.val), "", "### Order lifecycle and chargeback alerts", ...L(PV.alr), "", "### Fill rate and scorecard", ...L(PV.sc), "");
  out.push("## Optimize: Command Center", "Monitors each business process on the network and recommends the next action. Integration Monitor watches volume, timing and acknowledgments. Performance Monitor checks business rules across documents. ASN Intelligence monitors ship notice health by supplier.", "",
    "### Integration Monitor", ...L(PV.im), "", "### Performance Monitor rules", ...L(PV.pm), "", "### ASN Intelligence (in development)", ...L(PV.asn), "");
  out.push("## Extend: agents at decision points", "Agents predict a problem at a decision point, recommend an action and wait for a person to approve it.", "");
  OV.extend.dp.forEach((d, i) => { const a = PV.ag[i] || ["", ""]; out.push(`${i + 1}. **${d[0]}** (${d[1].join(", ")}; value at stake: ${band[d[2]] || d[2]}). ${d[3]} Where: ${d[4]}. Recommended action: ${a[0]}. Approved by: ${a[1]}.`); });
  out.push("", "## Strategy overlay", "How a hub grows its trading community, shown on the same documents.", "");
  for (const k of Object.keys(DEF)) if (OV[k]) out.push(`- **${OV[k].n}: ${DEF[k][0]}**. ${DEF[k][1]} Question: ${OV[k].q} Measure: ${OV[k].measure}`);
  out.push("");
  return join(out);
}

export function writeAgentDocs(html, root = ROOT) {
  const dataJs = fs.readFileSync(path.join(root, "tools/command-center/data.js"), "utf8");
  const COPYS = val(html, "var COPYS = "), PR = val(html, "var PR = "), PROC = val(html, "var PROCESSES = ");
  const GEN = {
    retail: { codeKey: "X12 set, or the EDIFACT or GDSN message where no X12 set exists", fam: val(html, "var PMFAM = "), el: val(html, "var PMEL = ") },
    automotive: val(html, "GENOME.automotive = "),
  };
  // the banking genome is the G literal whose label is Financial services
  { const a = html.indexOf('var G = {"label": "Financial services"'); if (a < 0) throw new Error("agent docs: banking genome not found"); const s = a + 8; GEN.banking = vm.runInNewContext("(" + html.slice(s, litEnd(html, s)) + ")", { ...STUBS }); if (!GEN.banking.fam) GEN.banking.fam = val(html.slice(a), "G.fam = "); }
  const pmck = /var PMCODEKEY = "([^"]+)"/.exec(html); if (pmck) GEN.retail.codeKey = pmck[1];
  const files = {};
  for (const [k, slug, name] of IND) {
    files[`agents/${slug}-solutions.txt`] = solutions(k, slug, name, COPYS[k], PR[k] || []);
    files[`agents/${slug}-documents.txt`] = documents(k, slug, name, GEN[k], PROC[k]);
    files[`agents/${slug}-processes.txt`] = processes(k, slug, name, PROC[k]);
  }
  files["agents/operations.txt"] = operations(val(html, "var AREAS = "), val(html, "var GROUPS = "), val(html, "var BREAKS = "), val(html, "var BREAK_TEXT = "), val(html, "var EXAMPLES = "), val(html, "var OMSTK = "));
  files["agents/retail-product-overlay.txt"] = overlay(val(dataJs, "var PMPV = ").retail, val(html, "var PMOV = "), val(html, "var PMDEF = "), COPYS.retail);

  const n = (k) => COPYS[k].processes.length, st = (k) => COPYS[k].index.stages.length;
  const idx = [
    "# Business Network Process Genome", "",
    "> A reference model of B2B operations by industry: the work, the business processes and the EDI documents that connect trading partners, with OpenText Trading Grid solutions for Retail and CPG, Automotive and Financial services.", "",
    "Built by Business Network Product Management, Data and Visibility. Internal reference. Human version: " + SITE, "",
    "Notes for agents:",
    "- " + COPYS.retail.footer_disclaimer + " Do not present capabilities as generally available.",
    "- " + GUIDE_DISC,
    "- Cite the file you used.", "",
    `Start with ${SITE}llms-full.txt: solutions, documents, product overlay and operations in one file. Open the process files below for step-by-step business processes.`, "",
    "## Solutions",
    ...IND.map(([k, slug, name]) => `- [${name} solutions](${SITE}agents/${slug}-solutions.txt): ${n(k)} solutions in ${st(k)} stages, with purpose, capabilities and parties`), "",
    "## Process Genome",
    ...IND.flatMap(([k, slug, name]) => [`- [${name} documents](${SITE}agents/${slug}-documents.txt): ${GEN[k].el.length} documents with sender, receiver, standards, definition and processes`,
      `- [${name} business processes](${SITE}agents/${slug}-processes.txt): ${PROC[k].length} processes, step by step, with rules, EDI team work and failure points`]),
    `- [Retail and CPG product overlay](${SITE}agents/retail-product-overlay.txt): product coverage by document across Connect, Comply, Optimize and Extend`, "",
    "## Operations",
    `- [Work areas and stakeholders](${SITE}agents/operations.txt): the work of a B2B operations team, where it breaks and who is involved, across industries`, "",
    "## Optional",
    `- [Everything in one file](${SITE}llms-full.txt): all sections above except the step-by-step processes, which are long; open those files for steps`, "",
  ].join("\n");
  const order = Object.keys(files);
  const full = idx + "\n" + order.filter((f) => !/-processes\.txt$/.test(f)).map((f) => `\n---\n\nFile: ${SITE}${f}\n\n${files[f]}`).join("\n");
  fs.rmSync(path.join(root, "site/agents"), { recursive: true, force: true });
  fs.mkdirSync(path.join(root, "site/agents"), { recursive: true });
  for (const [f, t] of Object.entries(files)) fs.writeFileSync(path.join(root, "site", f), t);
  fs.writeFileSync(path.join(root, "site/llms.txt"), idx);
  fs.writeFileSync(path.join(root, "site/llms-full.txt"), full);
  for (const t of [idx, full]) if (/—/.test(t)) throw new Error("agent docs: em dash in output");
  return { files: order.length + 2, fullKB: Math.round(full.length / 1024) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const page = process.argv[2] || path.join(ROOT, "site/index.html");
  console.log("agent docs", writeAgentDocs(fs.readFileSync(page, "utf8")));
}
