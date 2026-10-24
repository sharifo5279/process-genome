/* Run with: node --test tools/command-center/retail.test.cjs
 * Exercises the source modules without a browser. DOM layout, focus, and downloads
 * still need browser verification; these stubs test rendering and local behavior.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const CORE_SCREENS = ['dash', 'find', 'act', 'ws', 'cfg', 'im-tp', 'im-com', 'im-proj', 'pm-proc', 'an'];
const RETAIL_SCREENS = ['rt-partners', 'rt-orders', 'rt-shipments', 'rt-invoices'];
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
    classList: { add() {} },
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
  vm.runInContext(['data.js', 'cc.js', 'retail-data.js', 'retail.js'].map(source).join('\n'), app, { filename: 'command-center.js' });

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
  ['rt-rule-signature', 2, [false, false]],
  ['rt-rule-coverage', 4, [true, true]],
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
  const c = app.rtCase('rt-order-ack');
  assert.equal(app.rtProfile().company, 'Northfield Stores');
  assert.equal(app.rtProfile().label, 'Retailer');
  assert.equal(app.rtContext(c).partner, 'Meadowline Care');
  form('Retailer owner', 'Retailer-only note');
  app.rtSaveCase(c);
  app.rtBag().watches['pt-nuvori'] = true;
  app.rtBag().rules['rt-rule-ack'] = { active: true, threshold: 150 };
  const retailerState = app.rtCS(c);

  click({ 'data-rt-role': 'supplier' });
  assert.equal(app.rtProfile().company, 'Nuvori Beauty');
  assert.equal(app.rtProfile().label, 'CPG supplier');
  assert.equal(app.rtContext(c).partner, 'Harbor Grocers');
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
  const { app, form, screen } = loadApp(), c = app.rtCase('rt-order-ack');
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
  const { app, click, form, screen } = loadApp(), c = app.rtCase('rt-order-ack');
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

test('financial screens keep price variance and deductions separate in both perspectives', () => {
  const { click, screen } = loadApp();
  for (const role of ['retailer', 'supplier']) {
    click({ 'data-rt-role': role });
    const invoices = textOf(screen('rt-invoices'));
    assert.match(invoices, /Invoice price variance \$300/);
    assert.match(invoices, /Observed deductions \$750/);
    assert.match(invoices, /Validity and recovery are unconfirmed/);
    assert.doesNotMatch(invoices, /\$(?:1\.1k|1\.05k|1,?050)\b/i);
  }
});

test('case search finds secondary document IDs and combines other filters', () => {
  const { app } = loadApp();
  app.ccScr = 'rt-orders';
  for (const [query, id] of [
    ['FA-10482', 'rt-shipment-labels'], ['AA-10482', 'rt-shipment-labels'],
    ['CFG-855-021', 'rt-partner-coverage'], ['MDN-1024-0912', 'rt-partner-signature']
  ]) {
    app.rtFilter().query = query.toLowerCase();
    assert.deepEqual(Array.from(app.rtFiltered(app.RTDATA.cases), c => c.id), [id]);
  }
  app.rtFilter().query = '997';
  assert.ok(app.rtFiltered(app.RTDATA.cases).some(c => c.id === 'rt-order-ack'));
  app.rtFilter().query = 'FA-10482';
  app.rtFilter().source = 'IM';
  assert.equal(app.rtFiltered(app.RTDATA.cases).length, 0);
  app.rtFilter().source = 'PM';
  app.rtFilter().status = 'prepared';
  assert.equal(app.rtFiltered(app.RTDATA.cases).length, 0);
});

test('every retail screen and case tab renders for both perspectives', () => {
  const { app, click, screen } = loadApp();
  assert.deepEqual(Object.keys(app.CXS).filter(k => k.startsWith('rt-')).sort(), RETAIL_SCREENS.slice().sort());
  for (const role of ['retailer', 'supplier']) {
    click({ 'data-rt-role': role });
    for (const key of RETAIL_SCREENS) {
      const html = screen(key);
      assert.match(html, /<h2>/, `${role}/${key} needs its screen heading`);
      assert.doesNotMatch(html, /\b(?:undefined|NaN)\b/, `${role}/${key}`);
    }
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
    const dash = screen('dash');
    for (const mod of ['Integration Monitor', 'Performance Monitor', 'Retail add-on']) assert.ok(dash.includes(mod), `${role} dashboard names ${mod}`);
    const find = textOf(screen('find'));
    for (const i of items) assert.ok(find.includes(textOf(i.title)), `${role} findings list ${i.key}`);
    assert.ok(textOf(screen('dash')).includes(role === 'retailer' ? 'Northfield Stores' : 'Nuvori Beauty'));
  }
  for (const id of ['rt-home', 'rt-actions', 'rt-rules', 'im-dash', 'pm-dash', 'pm-find', 'pm-act', 'pm-agents', 'pm-rules', 'im-map', 'im-cfg']) assert.equal(app.CXS[id], undefined, `${id} is folded into the shared screens`);
});

test('module filter narrows the dashboard, findings and action queue', () => {
  const { app, screen } = loadApp();
  for (const mod of ['IM', 'PM', 'RT']) {
    app.ccModF = mod;
    const html = screen('find');
    const others = ['IM', 'PM', 'RT'].filter(m => m !== mod);
    for (const i of app.ccItems()) {
      if (i.mod === mod) assert.ok(html.includes(i.open), `${mod} keeps ${i.key}`);
      else assert.ok(!html.includes(i.open), `${mod} hides ${i.key}`);
    }
    assert.doesNotMatch(screen('dash'), new RegExp('data-mod="(' + others.join('|') + ')"'));
  }
});

test('demo findings stay inside the three processes of the client solution', () => {
  const { app, click, screen } = loadApp();
  for (const role of ['retailer', 'supplier']) {
    click({ 'data-rt-role': role });
    assert.deepEqual([...new Set(app.ccItems().map(i => i.proc))].sort(), [0, 1, 3]);
  }
  const cfg = screen('cfg');
  assert.ok(cfg.includes('Rules &amp; Policies') && cfg.includes('Retail policies'));
  for (const r of app.RTDATA.rules) assert.ok(cfg.includes(`data-rt-rule="${r.id}"`), `${r.id} sits in Configuration`);
  app.ccProcTab = 'sol';
  assert.match(screen('pm-proc'), /Business document/);
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
