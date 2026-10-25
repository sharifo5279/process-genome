/* Exports the Command Center demo tenant (both perspectives) as JSON for Trading Grid Context Services,
 * so Aviator answers from the same partners, findings and numbers the screens show.
 * Run: node tools/command-center/export-tenant.cjs site/command-center/index.html <out.json>
 */
const fs = require('node:fs');
const vm = require('node:vm');
const [page, out] = process.argv.slice(2);
const html = fs.readFileSync(page, 'utf8');
const start = html.indexOf('(function () {\n  var PROCESSES');
const end = html.indexOf('  ccStart();\n})();', start);
if (start < 0 || end < 0) throw new Error('Command Center script block not found');

const EXPORT = String.raw`
  globalThis.__tenant = function (role) {
    rtRole = role; rtApplyRole(); ccPkg = "rt";
    var ps = cxPartners();
    function code(id) { return (/\((\d{3})\)/.exec(CXDOC[id] || "") || [0, ""])[1]; }
    function txRows(f) {
      var c = code(f.id) || "997", s = CCFLOW[ccRole()][f.p].steps[f.st] || ["In"], pre = { "850": "PO-", "855": "PO-", "856": "ASN-", "810": "INV-", "820": "REM-", "832": "CAT-", "997": "INV-" }[c] || "DOC-";
      var notSent = /not sent|No 856|no 855|No ship notices|not delivered|not received/i.test(f.ot), rows = [], none = s[0] === "In" ? "Not received" : "Not sent";
      for (var j = 0; j < Math.min(5, f.n || 1); j++) {
        var seed = f.id.charCodeAt(1) * 977 + j * 131 + 3301, t = 9 * 60 + 20 - j * 23 - seed % 9;
        rows.push({ isa13: notSent ? null : String(100000000 + seed * 17).slice(-9), st02: notSent ? null : ("000" + (j + 1)).slice(-4), reference: pre + (40000 + seed % 59999), time: fuT(t), document: c, direction: s[0], check: f.how, status: notSent ? none : "Observed" });
      }
      return rows;
    }
    var sol = ccSol();
    return {
      perspective: role, company: ccCompany(), industry: "Retail and CPG", snapshot: CCSNAP,
      user: { name: FUME, title: "EDI operations lead", email: FUME.toLowerCase().replace(/ /g, ".") + "@" + ccCompany().toLowerCase().replace(/[^a-z]+/g, "") + ".example" },
      processes: sol.map(function (i) { var F = ccFlow(i), P = ccProc(i); return { id: i, name: P.n, short: ccShort(i), owner: P.owner, documentsToday: F.n, onTrack: F.ok, atRisk: F.risk, breached: F.br, overdue997: F.ack, rejects824: F.rej,
        steps: ccSteps(i).map(function (p) { var st = F.steps[p[0]]; return { step: ccStepName(i, p[0]), documents: ccStepDoc(p[1]), direction: st[0], today: st[1] }; }) }; }),
      partners: ps.map(function (p, k) { var e = imE(k), rp = rtPartners().filter(function (x) { return x.names[role] === p[0]; })[0];
        return { name: p[0], alias: p[1], status: p[2], buid: p[3], onboarded: p[4], lastActivity: p[5], protocol: e[0], documents30d: e[1], errors30d: e[2], topError: e[3],
          ediAddresses: ["ZZ:" + p[1], "01:" + (100000000 + k * 7316451)],
          documentTypes: IMDOCS.filter(function (d) { return imCell(k, d); }).map(function (d) { return { document: d, direction: imDir(d, k), status: IMCELL[imCell(k, d)][0] }; }),
          requiredDocuments: rp ? rp.documents.map(function (d) { return { document: d.type, label: d.label, required: d.required, status: rtLabel(d.status), lastSeen: d.lastSeen || null, detail: d.detail }; }) : null,
          owner: rp ? rp.owner : null }; }),
      findings: cxAll().map(function (f) { var a = CXAF[f.id], P = ccProc(f.p);
        return { id: f.id, title: f.ot, partner: f.partner, module: f.mod, agent: a.n + ", " + a.r, check: CXRULE[f.id], document: CXDOC[f.id], process: P.n, step: ccStepName(f.p, f.st), severity: f.sev === "c" ? "High" : "Medium",
          detectedAt: f.at, transactions: f.n || 1, valueAtRisk: f.val || 0, observation: f.os, impact: f.bt + ". " + f.bs, rootCause: f.cause, suggestedNextStep: f.act, usuallyHandledBy: f.appr || fuW(f.id)[1],
          teams: f.who, nextDocumentOwedBy: fuW(f.id)[0] === "pt" ? "partner" : "us", internalTeam: fuW(f.id)[1], linkedFindings: FULINK[f.id] || [], events: f.ev.map(function (e) { return { time: e[0], event: e[1] }; }),
          recoveryCriteria: FUCHK[role][f.id] || [], sampleTransactions: txRows(f) }; }),
      networkEvents: FUSIG[role].map(function (s) { return { time: s[0], finding: s[1], detail: s[3] }; }),
      retailCases: RTDATA.cases.map(function (c) { var x = rtContext(c), rule = rtRule(c.ruleId);
        return { id: c.id, title: c.title, partner: x.partner, reference: c.reference, monitor: c.source === "IM" ? "Integration Monitor" : "Performance Monitor", agent: c.agent, workflow: rtWorkflow(c.workflow).title, process: ccProc(c.process).n,
          severity: c.severity === "critical" ? "High" : "Medium", owner: c.owner, summary: x.summary, impact: x.impact, explanation: c.explanation, nextAction: x.nextAction, policy: c.policy || (rule ? rule.condition : ""), evidenceGap: c.evidenceGap || null,
          amount: c.amount || null, documents: c.documents.map(function (d) { return { document: d.type, id: d.id, time: d.time, status: d.status, detail: d.detail || "" }; }), checks: c.checks, lines: c.lines || null, deductions: c.deductions || null }; }),
      rules: CXR.map(function (r) { var a = CXA.filter(function (x) { return x.id === r[0]; })[0]; return { name: r[1], agent: a.n + ", " + a.r, module: a.t === "im" ? "Integration Monitor" : "Performance Monitor", document: r[2], processes: cxProcNames(cxRuleP(r)), conformancePct: r[4], findings30d: r[5], lastRun: r[6], status: r[7] }; }),
      retailPolicies: RTDATA.rules.filter(function (r) { return !r.roles || r.roles.indexOf(role) >= 0; }).map(function (r) { return { id: r.id, name: r.name, agent: r.agent, scope: r.scope, condition: r.condition, threshold: r.threshold, unit: r.unit || "", evidence: r.evidence }; }),
      projections: cxProj().map(function (x) { return { watchlist: x[0], status: x[1], alerts: x[2], direction: x[3], document: x[4], standard: x[5], partner: x[6], finding: x[7] || null }; }),
      dailyDigest: { date: "2026-10-23", documents: 4612, documentsChangePct: 4, failedTransactions: 37, partnersWithFailures: 9, partnersOnboarding: 1, onboardingPartner: ps[6][0], anomaliesDetected: 3,
        topPartners: [[0, 4], [1, 3], [2, 4], [3, 2], [5, 5]].map(function (x) { return { partner: ps[x[0]][0], documents: Math.round(IMPT[x[0]][1] / 30), errors: x[1], topError: imE(x[0])[3] }; }),
        documentMix: CXDS.map(function (p) { return { period: p[0], dates: p[1], top: p[2].map(function (d) { return { document: d[0] + " " + d[1], count: d[2] }; }), other: p[3] }; }) },
      networkActivity: { documentsThisWeek: 27400, weekChangePct: 11, openAnomalies: 3, failedToday: 74, failedSince: "05:52", activePartners: 163, connectedPartners: 208 },
      kpis: CXCAT.concat([CXCATR]).map(function (c) { return { category: c[0], documents: c[1], avgScore: c[2], measures: c[3].map(function (m) { return { name: m[0], basis: m[1], value: m[2], target: m[3], score: m[4], weightPct: m[5], offTarget: cxOff(m) }; }) }; })
    };
  };
`;
const src = html.slice(start, end) + EXPORT + '})();';
const el = () => ({ addEventListener() {}, classList: { add() {}, toggle() {} }, setAttribute() {}, getAttribute() { return null; } });
const cx = { innerHTML: '', addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, classList: { add() {}, toggle() {} }, insertAdjacentHTML() {} };
const ctx = { document: { activeElement: null, documentElement: el(), getElementById(id) { return id === 'cx' ? cx : el(); }, addEventListener() {} },
  window: { addEventListener() {}, innerWidth: 1440, innerHeight: 900 }, localStorage: { getItem() { return null; }, setItem() {} }, setTimeout() { return 1; }, clearTimeout() {} };
ctx.window.document = ctx.document; ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(src, ctx);
const tenant = { generatedAt: new Date().toISOString(), source: 'Command Center prototype (process-genome)', perspectives: { retailer: ctx.__tenant('retailer'), supplier: ctx.__tenant('supplier') } };
fs.writeFileSync(out, JSON.stringify(tenant, null, 1));
console.log('wrote', out, Object.fromEntries(Object.entries(tenant.perspectives).map(([k, v]) => [k, { company: v.company, partners: v.partners.length, findings: v.findings.length, cases: v.retailCases.length }])));
