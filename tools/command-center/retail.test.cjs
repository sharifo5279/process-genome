/* Run with: node --test tools/command-center/retail.test.cjs
 * Exercises the source modules without a browser. DOM layout, focus, and downloads
 * still need browser verification; these stubs test rendering and local behavior.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const CORE_SCREENS = ['dash', 'find', 'act', 'im-tp', 'im-proj', 'ws-proc', 'ws-dash', 'ws-rep', 'ws-not', 'ws-task', 'ws-agents', 'cfg'];

const source = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
const textOf = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const PROCESS_STUB = Array.from({ length: 11 }, (_, i) => ({
  n: `Reference process ${i}`, owner: 'Process owner', outcome: 'Reference outcome', measures: ['Measure A', 'Measure B', 'Measure C'],
  steps: Array.from({ length: 6 }, (_, k) => [`Reference step ${k}`, '850, 856'])
}));

// Loads the four console modules in page order against a minimal DOM.
function loadApp(storage = new Map()) {
  const listeners = {}, controls = new Map();
  const el = () => ({ addEventListener() {}, classList: { add() {}, toggle() {} }, setAttribute() {}, getAttribute() { return null; } });
  const cx = {
    innerHTML: '',
    addEventListener(type, handler) { (listeners[type] ||= []).push(handler); },
    querySelector(selector) { return controls.get(selector) || null; },
    querySelectorAll() { return []; },
    classList: { add() {}, toggle() {} },
    insertAdjacentHTML() {}
  };
  const app = {
    document: {
      activeElement: null, documentElement: el(), fullscreenElement: null,
      getElementById(id) { return id === 'cx' ? cx : el(); }, addEventListener() {}
    },
    window: { addEventListener() {}, innerWidth: 1440, innerHeight: 900 },
    localStorage: {
      getItem(key) { return storage.get(key) || null; },
      setItem(key, value) { storage.set(key, value); }
    },
    setTimeout() { return 1; }, clearTimeout() {},
    esc: s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'),
    PROCESSES: { retail: PROCESS_STUB },
    GENOME: { retail: { short: PROCESS_STUB.map((p, i) => `Process ${i}`) } }
  };
  app.window.document = app.document;
  vm.createContext(app);
  vm.runInContext(['data.js', 'cc.js', 'im.js', 'workspace.js', 'retail-data.js', 'retail.js'].map(source).join('\n'), app, { filename: 'command-center.js' });

  function click(attributes) {
    const target = {
      outerHTML: '<button></button>', textContent: '',
      attributes: Object.entries(attributes).map(([name, value]) => ({ name, value })),
      hasAttribute(name) { return Object.hasOwn(attributes, name); },
      getAttribute(name) { return attributes[name] ?? null; },
      closest() { return this; }, focus() {}
    };
    app.document.activeElement = target;
    for (const handler of listeners.click || []) handler({ target });
  }
  function form(owner, note) {
    controls.set('[data-rt-owner]', { value: owner });
    controls.set('[data-rt-note]', { value: note });
  }
  function screen(key) { app.ccScr = key; return app.CXS[key](); }
  return { app, click, form, screen, storage };
}

// Explicit expected outcomes catch reversed comparisons and ignored thresholds.
const ruleChanges = [
  ['rt-rule-ack', 150, [true, true]],
  ['rt-rule-order-change', 200, [true, true]],
  ['rt-rule-sscc', 2, [true, true]],
  ['rt-rule-routing', 50, [true, true]],
  ['rt-rule-price', 0.5, [true, true]],
  ['rt-rule-deduction', 1, [false, false]]
];
for (const [id, threshold, expected] of ruleChanges) {
  test(`${id}: defaults and edited threshold evaluate the fixtures`, () => {
    const { app } = loadApp(), rule = app.rtRule(id);
    const outcomes = value => Array.from(app.rtEvaluateRule(rule, value), r => r.pass);
    assert.deepEqual(outcomes(rule.threshold), [true, false]);
    assert.deepEqual(outcomes(threshold), expected);
  });
}

test('a relaxed deduction deadline cannot waive missing evidence', () => {
  const { app } = loadApp(), rule = app.rtRule('rt-rule-deduction');
  assert.deepEqual(Array.from(app.rtEvaluateRule(rule, 999), r => r.pass), [true, false]);
  const complete = { ...rule, test: { ...rule.test, failEvidenceComplete: true } };
  assert.deepEqual(Array.from(app.rtEvaluateRule(complete, 999), r => r.pass), [true, true]);
});

test('perspectives switch labels and case context while isolating saved work', () => {
  const { app, click, form, storage } = loadApp();
  const c = app.rtCase('rt-order-change');
  assert.equal(app.rtProfile().company, 'Northfield Stores');
  assert.equal(app.rtProfile().label, 'Retailer');
  assert.equal(app.rtContext(c).partner, 'Tidewell Home');
  form('Retailer owner', 'Retailer-only note');
  app.rtSaveCase(c);
  app.rtBag().watches['pt-nuvori'] = true;
  app.rtBag().rules['rt-rule-ack'] = { active: true, threshold: 150 };
  const retailerState = app.rtCS(c);

  click({ 'data-rt-role': 'supplier' });
  assert.equal(app.rtProfile().company, 'Nuvori Beauty');
  assert.equal(app.rtProfile().label, 'CPG supplier');
  assert.equal(app.rtContext(c).partner, 'Brightway Marketplace');
  for (const item of app.RTDATA.cases) assert.equal(app.rtContext(item), item.roles.supplier);
  assert.notEqual(app.rtCS(c), retailerState);
  assert.equal(app.rtCS(c).status, 'open');
  assert.equal(app.rtCS(c).note, undefined);
  assert.equal(app.rtBag().watches['pt-nuvori'], undefined);
  assert.equal(app.rtBag().rules['rt-rule-ack'], undefined);
  form('Supplier owner', 'Supplier-only note');
  app.rtSaveCase(c);

  click({ 'data-rt-role': 'retailer' });
  for (const item of app.RTDATA.cases) assert.equal(app.rtContext(item), item.roles.retailer);
  assert.equal(app.rtCS(c).owner, 'Retailer owner');
  assert.equal(app.rtCS(c).note, 'Retailer-only note');
  assert.equal(app.rtBag().watches['pt-nuvori'], true);
  assert.equal(app.rtBag().rules['rt-rule-ack'].threshold, 150);
  const restored = loadApp(storage).app;
  assert.equal(restored.rtRole, 'retailer');
  assert.equal(restored.rtCS(restored.rtCase(c.id)).note, 'Retailer-only note');
});

test('assignment preserves Prepare and does not claim a prepared handoff', () => {
  const { app, form, screen } = loadApp(), c = app.rtCase('rt-order-change');
  form('Order management lead', 'Awaiting the current acknowledgment.');
  app.rtSaveCase(c);
  assert.equal(app.rtCS(c).status, 'assigned');
  app.rtCaseTab = 'action';
  const detail = app.rtCaseDialog(c), queue = screen('act');
  assert.ok(detail.includes(`data-rt-prepare="${c.id}"`));
  assert.ok(queue.includes(`data-rt-prepare="${c.id}"`), 'an assigned case still awaits its prepared action');
  assert.ok(textOf(screen('find')).includes('Assigned'));
  for (const html of [detail, queue]) {
    assert.ok(!html.includes(c.action.completedLabel));
    assert.ok(!html.includes(c.action.completionNote));
  }
  assert.match(textOf(queue), /Completed 0/);
});

test('preparing records a distinct local action while the business exception stays open', () => {
  const { app, click, form, screen } = loadApp(), c = app.rtCase('rt-order-change');
  form('Order management lead', 'Prepare the evidence for review.');
  click({ 'data-rt-prepare': c.id });
  assert.equal(app.rtCS(c).status, 'prepared');
  assert.equal(app.rtCS(c).note, 'Prepare the evidence for review.');
  const detail = app.rtCaseDialog(c);
  assert.ok(!detail.includes(`data-rt-prepare="${c.id}"`));
  assert.ok(detail.includes('business exception remains open'));
  app.ccActTab = 'done';
  const done = screen('act');
  assert.ok(done.includes(c.action.completedLabel));
  assert.ok(done.includes(c.action.completionNote));
  assert.match(textOf(done), /Completed 1/);
  app.ccActTab = 'open';
  assert.ok(textOf(screen('find')).includes('Action prepared'), 'the finding stays open after preparation');
});

test('deductions keep observed amounts separate from validity in both perspectives', () => {
  const { app, click } = loadApp(), c = app.rtCase('rt-invoice-deduction');
  for (const role of ['retailer', 'supplier']) {
    click({ 'data-rt-role': role });
    app.rtCaseTab = 'evidence';
    const html = textOf(app.rtCaseDialog(c));
    assert.match(html, /Deduction breakdown/);
    assert.match(html, /Unconfirmed/);
    assert.match(html, /\$450/);
  }
});

test('case search finds secondary document IDs and combines other filters', () => {
  const { app } = loadApp();
  app.ccScr = 'find';
  for (const [query, id] of [['FA-10482', 'rt-shipment-labels'], ['AA-10482', 'rt-shipment-labels']]) {
    app.rtFilter().query = query.toLowerCase();
    assert.deepEqual(Array.from(app.rtFiltered(app.RTDATA.cases), c => c.id), [id]);
  }
  app.rtFilter().source = 'IM';
  assert.equal(app.rtFiltered(app.RTDATA.cases).length, 0);
  app.rtFilter().source = 'PM';
  app.rtFilter().status = 'prepared';
  assert.equal(app.rtFiltered(app.RTDATA.cases).length, 0);
});

test('the Retail pack adds content, not screens; every case tab renders in both perspectives', () => {
  const { app, click, screen } = loadApp();
  assert.deepEqual(Object.keys(app.CXS).filter(k => k.startsWith('rt-')), []);
  for (const role of ['retailer', 'supplier']) {
    click({ 'data-rt-role': role });
    app.ccPtTab = 'req';
    assert.match(screen('im-tp'), /Participation matrix/);
    app.ccPtTab = 'all';
    for (const c of app.RTDATA.cases) {
      for (const tab of ['overview', 'evidence', 'activity', 'action']) {
        app.rtCaseTab = tab;
        const html = app.rtCaseDialog(c);
        assert.ok(html.includes('role="dialog"'), `${role}/${c.id}/${tab}`);
        assert.doesNotMatch(html, /\b(?:undefined|NaN)\b/, `${role}/${c.id}/${tab}`);
      }
    }
  }
});

test('one dashboard, findings list and action queue attribute every record to its module', () => {
  const { app, click, screen } = loadApp();
  for (const role of ['retailer', 'supplier']) {
    click({ 'data-rt-role': role });
    for (const key of CORE_SCREENS) {
      const html = screen(key);
      assert.match(html, /<h2>/, `${role}/${key} needs its screen heading`);
      assert.doesNotMatch(html, /\b(?:undefined|NaN)\b/, `${role}/${key}`);
    }
    const items = app.ccItems();
    assert.equal(items.length, app.CCF.length + app.RTDATA.cases.length);
    assert.deepEqual([...new Set(items.map(i => i.mod))].sort(), ['IM', 'PM', 'RT']);
    const findHtml = screen('find');
    for (const mod of ['Integration Monitor', 'Performance Monitor', 'Retail pack']) assert.ok(findHtml.includes(mod), `${role} findings name ${mod}`);
    const find = textOf(findHtml);
    for (const i of items) assert.ok(find.includes(textOf(i.title)), `${role} findings list ${i.key}`);
    assert.ok(textOf(screen('dash')).includes(role === 'retailer' ? 'Northfield Stores' : 'Nuvori Beauty'));
  }
  for (const id of ['rt-home', 'rt-actions', 'rt-rules', 'im-dash', 'pm-dash', 'pm-find', 'pm-act', 'pm-agents', 'pm-rules', 'im-map', 'im-cfg', 'pm-proc', 'an', 'im-com', 'rt-partners', 'rt-orders', 'rt-shipments', 'rt-invoices']) assert.equal(app.CXS[id], undefined, `${id} is folded into the shared screens`);
});

test('module filter narrows findings and the action queue', () => {
  const { app, screen } = loadApp();
  for (const mod of ['IM', 'PM', 'RT']) {
    app.ccModF = mod;
    const html = screen('find');
    for (const i of app.ccItems()) {
      if (i.mod === mod) assert.ok(html.includes(i.open), `${mod} keeps ${i.key}`);
      else assert.ok(!html.includes(i.open), `${mod} hides ${i.key}`);
    }
    const act = screen('act');
    for (const i of app.ccItems()) if (i.mod !== mod) assert.ok(!act.includes(i.open), `${mod} queue hides ${i.key}`);
  }
});

test('demo findings stay inside the three processes of the client solution', () => {
  const { app, click, screen } = loadApp();
  for (const role of ['retailer', 'supplier']) {
    click({ 'data-rt-role': role });
    assert.deepEqual([...new Set(app.ccItems().map(i => i.proc))].sort(), [0, 1, 3]);
  }
  const cfg = screen('cfg');
  assert.ok(cfg.includes('Rules &amp; Policies') && cfg.includes('Retail policy templates'));
  for (const r of app.RTDATA.rules) assert.ok(cfg.includes(`data-rt-rule="${r.id}"`), `${r.id} sits in Configuration`);
  app.ccWsProc = 'sol';
  assert.match(screen('ws-proc'), /Business document/);
  for (const p of ['0', '1', '3']) { app.ccWsProc = p; assert.match(screen('ws-proc'), /Process flow/); }
});

test('approving a core finding closes it and moves its action to Completed', () => {
  const { app, click, screen } = loadApp();
  click({ 'data-cxapp': 'f1' });
  const item = app.ccItems().find(i => i.key === 'f:f1');
  assert.equal(item.done, true);
  assert.equal(item.actDone, true);
  app.ccActTab = 'done';
  assert.ok(screen('act').includes('Action approved'));
});

test('rule wizard walks eight steps and deploys a Performance Monitor rule', () => {
  const { app, click } = loadApp();
  const before = app.CXR.length;
  click({ 'data-rwnew': '' });
  assert.equal(app.ccRw.step, 0);
  click({ 'data-rwagent': 'lex' });
  for (let k = 0; k < 6; k++) click({ 'data-rwgo': '1' });
  assert.equal(app.ccRw.step, 6);
  click({ 'data-rwtest': '' });
  assert.ok(app.ccRw.test.d > 0);
  click({ 'data-rwgo': '1' });
  assert.match(app.cxDrawer(), /Deploy rule/);
  click({ 'data-rwdeploy': '' });
  assert.equal(app.CXR.length, before + 1);
  assert.equal(app.CXR[app.CXR.length - 1][0], 'lex');
});

test('workspace saves dashboards, reports, notifications, tasks and reminders', () => {
  const { app, click, screen, storage } = loadApp();
  const W = app.wsLoad();
  assert.ok(screen('ws-dash').includes('Order to cash daily'));
  click({ 'data-wstog': '1' });
  assert.equal(W.notifs[1].on, true);
  click({ 'data-wsdone': '0' });
  assert.equal(W.tasks[0].done, true);
  assert.ok(JSON.parse(storage.get('process-genome-cc-workspace-v2')).tasks[0].done);
  assert.match(screen('ws-agents'), /Build your own agent/);
});

test('packages: Integration Monitor alone, plus Performance Monitor, plus the Retail pack', () => {
  const { app, screen } = loadApp();
  const leak = /Retail|retail|chargeback|OTIF|Northfield Stores · Retail/;
  app.ccSetPkg('im');
  assert.deepEqual([...new Set(app.ccItems().map(i => i.mod))], ['IM']);
  assert.equal(app.cxNavOk('ws-proc'), false);
  assert.equal(app.cxAgents().map(a => a.id).join(), 'ivy');
  for (const key of ['dash', 'find', 'act', 'im-tp', 'im-proj', 'ws-dash', 'ws-rep', 'ws-not', 'ws-task', 'ws-agents', 'cfg']) {
    const t = textOf(screen(key));
    assert.doesNotMatch(t, leak, `im/${key} shows retail content`);
    assert.doesNotMatch(t, /Performance Monitor|Business process|\bLex\b|\bNora\b|\bLiz\b|\bReese\b/, `im/${key} shows Performance Monitor content`);
  }
  assert.doesNotMatch(screen('cfg'), /data-rwnew/);

  app.ccSetPkg('pm');
  assert.deepEqual([...new Set(app.ccItems().map(i => i.mod))].sort(), ['IM', 'PM']);
  assert.equal(app.ccProc(3).n, 'Claims and disputes');
  for (const key of ['dash', 'find', 'act', 'im-tp', 'ws-proc', 'ws-dash', 'ws-rep', 'ws-not', 'ws-task', 'ws-agents', 'cfg']) assert.doesNotMatch(textOf(screen(key)), leak, `pm/${key} shows retail content`);
  assert.match(screen('cfg'), /data-rwnew/);

  app.ccSetPkg('rt');
  assert.deepEqual([...new Set(app.ccItems().map(i => i.mod))].sort(), ['IM', 'PM', 'RT']);
  assert.equal(app.ccProc(3).n, app.PROCESSES.retail[3].n);
});
