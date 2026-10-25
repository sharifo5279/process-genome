  /* Follow-ups. Command Center sits on the network between two parties: it notices, packages evidence, routes it to whoever can act,
     tracks who is waiting on whom, and confirms the outcome from the next documents it sees. It does not create, change or redeliver documents.
     One follow-up per finding; the network is the reply. Illustrative. */
  var FUME = "Alex Morgan";
  if (!CXI.doc) CXI.doc = '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>';
  if (!CXI.refresh) CXI.refresh = '<path d="M21 12a9 9 0 1 1-2.6-6.4L21 8"/><path d="M21 3v5h-5"/>';
  if (!CXI.clock) CXI.clock = '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>';
  var FUTEAMS = ["ERP team", "Shipping", "Billing and pricing", "Accounts receivable", "Accounts payable", "Order management", "Merchandising", "Integration team", "Trading Grid administrator", "DC receiving"];
  /* Who owes the next document, the internal team that usually acts, and linked findings with the same partner and cause */
  var FUW = {
    supplier: { f1: ["us", "Shipping"], f2: ["pt", "Trading Grid administrator"], f3: ["us", "Order management"], f4: ["us", "Billing and pricing"], f7: ["pt", "Accounts receivable"], f9: ["us", "Billing and pricing"], f10: ["pt", "Accounts receivable"] },
    retailer: { f1: ["pt", "DC receiving"], f2: ["pt", "Trading Grid administrator"], f3: ["pt", "Merchandising"], f4: ["us", "Merchandising"], f7: ["us", "Accounts payable"], f9: ["us", "Merchandising"], f10: ["us", "Integration team"] }
  };
  var FULINK = { f2: ["f7"], f4: ["f9"] };
  /* Recovery criteria, ticked only by documents seen on the network */
  var FUCHK = {
    supplier: { f1: ["856 sent for each of 14 loads", "997 received for each (AK9 A)", "No 824 within 30 minutes"], f2: ["Signature check passing for Harbor Grocers", "Resent purchase orders received: 74 of 74", "850 volume within projected band for 1 hour"],
      f3: ["855 sent for each of 37 orders", "997 received for each (AK9 A)"], f4: ["Rebilled 810 sent for each of 112 invoices", "997 received for each (AK9 A)", "No 824 on the rebills within 2 hours"],
      f7: ["Weekly 820 received from Harbor Grocers"], f9: ["860 received with the new cost for each of 61 orders"], f10: ["997 received for each of 52 invoices", "No AK9 R or E"] },
    retailer: { f1: ["856 received for each of 14 loads", "997 sent for each (AK9 A)", "No 824 sent within 30 minutes"], f2: ["Test delivery to the new endpoint returns a positive MDN", "Held purchase orders delivered: 74 of 74", "997 received for each (AK9 A)"],
      f3: ["855 received for each of 37 orders"], f4: ["Rebilled invoices received for the 112 rejections", "No 824 sent on the rebills"], f7: ["820 delivered to Meadowline Care"],
      f9: ["860 sent with the new cost for each of 61 orders"], f10: ["997 sent for each of 52 invoices"] }
  };
  /* Scripted network events for the demo clock: [time, finding, criteria ticked, what the network showed]. Applied only after someone acted. */
  var FUSIG = {
    supplier: [["10:21", "f2", [0], "AS2 test message from Harbor Grocers passed the signature check; positive MDN"], ["10:35", "f3", [0, 1], "37 acknowledgments sent to Westline Home; 997s received (AK9 A)"],
      ["10:52", "f1", [], "First 856 sent to Northfield Stores: 3 of 14"], ["10:55", "f7", [0], "Weekly 820 received from Harbor Grocers"], ["11:08", "f1", [0, 1], "14 of 14 ship notices sent; 997s received (AK9 A)"],
      ["11:18", "f10", [], "46 of 52 invoices acknowledged (AK9 A)"], ["11:20", "f2", [1], "74 resent purchase orders received; 997s sent"], ["11:40", "f1", [2], "No 824 for the 14 ship notices in 30 minutes"],
      ["11:40", "f2", [2], "850 volume within the projected band since 10:45"], ["11:44", "f10", [0, 1], "6 invoices redelivered from TG Insights; 6 997s received (AK9 A)"],
      ["12:20", "f4", [0, 1], "112 rebilled invoices sent at the PO cost; 997s received (AK9 A)"], ["14:20", "f4", [2], "No 824 on the rebills in 2 hours"], ["15:10", "f9", [], "860s received for 58 of 61 open orders"]],
    retailer: [["10:15", "f10", [], "997s leaving for Tidewell Home: 20 of 52"], ["10:20", "f2", [0], "Test delivery to the new Meadowline Care endpoint returned a positive MDN"], ["10:22", "f10", [0], "52 of 52 997s sent to Tidewell Home"],
      ["10:31", "f2", [1], "74 held purchase orders delivered from TG Insights; positive MDNs"], ["10:33", "f7", [0], "820 delivered to Meadowline Care; positive MDN"], ["10:40", "f3", [0], "37 acknowledgments received from Copperleaf Living"],
      ["10:52", "f1", [], "First ship notices received from Nuvori Beauty: 3 of 14"], ["10:58", "f2", [2], "74 997s received from Meadowline Care (AK9 A)"], ["11:08", "f1", [0, 1], "14 of 14 ship notices received; 997s sent"],
      ["11:30", "f9", [0], "61 860 cost changes sent to Solara Personal Care"], ["11:40", "f1", [2], "No 824 sent for the 14 ship notices in 30 minutes"], ["12:20", "f4", [0], "112 rebilled invoices received from Solara Personal Care"], ["12:50", "f4", [1], "Rebills passed the price check; no 824 sent"]]
  };
  /* Ring segment each finding counts in */
  var FUSEG = { f1: "br", f2: "br", f3: "br", f4: "br", f7: "br", f9: "rk", f10: "rk" };
  var FUST = ["New", "Assigned", "Waiting on partner", "Waiting on us", "Recovering", "Verified", "Closed", "Known issue"];
  var ccFS = { supplier: {}, retailer: {} }, ccSig = { supplier: {}, retailer: {} }, ccNow = 570, ccFuForm = null, ccOvTab = "need", ccOvF = null;
  function fuT(m) { m = Math.round(m); return ("0" + Math.floor(m / 60)).slice(-2) + ":" + ("0" + m % 60).slice(-2); }
  function fuM(t) { var p = String(t).split(":"); return +p[0] * 60 + +p[1]; }
  function fuTick() { ccNow += 2; return fuT(ccNow); }
  function fuW(id) { return (FUW[ccRole()] || {})[id] || ["us", "ERP team"]; }
  function cxFu(id) {
    var S = ccFS[ccRole()];
    if (!S[id]) {
      var seed = { f3: 1, f4: 1 }[id] && ccRole() === "supplier";
      S[id] = { st: seed ? "Assigned" : "New", owner: seed ? "Dana Ortiz" : "", wait: fuW(id)[0], exp: 0, ticket: "", log: [], chk: [], since: seed ? "07:55" : "", to: "" };
    }
    return S[id];
  }
  function fuDoneSync(id, st) { if (st === "Verified" || st === "Closed") ccDone[id] = 1; else if (st === "Known issue") ccDone[id] = 2; else delete ccDone[id]; }
  function fuSet(id, st, note, kind) {
    [id].concat(FULINK[id] || []).forEach(function (k, j) {
      if (j && !cxById(k)) return;
      var u = cxFu(k); if (j && (u.st === "Verified" || u.st === "Closed")) return;
      if (st) { u.st = st; u.since = fuT(ccNow); fuDoneSync(k, st); }
      if (note) u.log.unshift([fuT(ccNow), kind || "me", j ? note + " (linked to " + cxById(id).ot.toLowerCase() + ")" : note]);
    });
  }
  function fuOverdue(u) { return (u.st === "Waiting on partner" || u.st === "Waiting on us") && u.exp && ccNow > u.exp; }
  /* Bucket for the side panel and the Action queue: need (no owner, or overdue), wait, ver (verified or closed today), off (known issue) */
  function fuBucket(i) {
    if (i.key.indexOf("f:") === 0) {
      var u = cxFu(i.key.slice(2));
      if (u.st === "Known issue") return "off";
      if (u.st === "Verified" || u.st === "Closed") return "ver";
      if (u.st === "New" || u.st === "Assigned" || fuOverdue(u)) return "need";
      return "wait";
    }
    return i.bucket || (i.actDone ? "wait" : "need");
  }
  function fuSegOf(i) { return i.key.indexOf("f:") === 0 ? FUSEG[i.key.slice(2)] || "rk" : i.sev === "h" ? "br" : "rk"; }
  function fuChip(st, u) { return '<span class="cx-st s-' + st.replace(/ /g, "").toLowerCase() + '"><i></i>' + st + (u && fuOverdue(u) ? ' · overdue ' + Math.round(ccNow - u.exp) + ' m' : "") + '</span>'; }
  function fuWaitTxt(u, f) { return u.st === "Waiting on partner" ? f.partner : u.st === "Waiting on us" ? (u.to || fuW(f.id)[1]) : u.st === "New" || u.st === "Assigned" ? "Not notified" : "Nobody"; }
  function fuFact(i) {
    if (i.key.indexOf("f:") !== 0) return i.wait ? "Waiting on " + i.wait : i.check || "";
    var id = i.key.slice(2), u = cxFu(id), f = cxById(id), c = FUCHK[ccRole()][id] || [], n = u.chk.filter(Boolean).length;
    if (u.st === "Recovering") return n + " of " + c.length + " checks met · " + (u.log[0] ? u.log[0][2] : "");
    if (u.st === "Verified" || u.st === "Closed") return "Verified " + u.since + " from network documents";
    if (u.exp) return (fuOverdue(u) ? "Overdue " + Math.round(ccNow - u.exp) + " m · " : "Expect by " + fuT(u.exp) + " · ") + "waiting on " + fuWaitTxt(u, f);
    return f.bs;
  }
  /* Next demo-clock event whose follow-up someone has acted on */
  function fuNextSig() {
    var L = FUSIG[ccRole()], D = ccSig[ccRole()], first = null;
    for (var k = 0; k < L.length; k++) {
      if (D[k]) continue;
      var u = cxFu(L[k][1]);
      if (u.st === "Waiting on partner" || u.st === "Waiting on us" || u.st === "Recovering") return k;
      if (first === null && u.st !== "Verified" && u.st !== "Closed") first = -k - 1;
    }
    return first;
  }
  function fuClockBtn() {
    var k = fuNextSig(), off = k === null || k < 0;
    return '<button type="button" class="cx-btn fu-clk" data-cxclk' + (off ? ' aria-disabled="true" title="' + (k === null ? "All network events have played" : "Notify a partner or team first") + '"' : ' title="Plays the next scripted network event"') + '>' + ci("clock") + (k === null ? "No more events" : k < 0 ? "Play next event" : "Play next event (" + FUSIG[ccRole()][k][0] + ")") + '</button>';
  }
  function fuAdvance() {
    var k = fuNextSig();
    if (k === null) { cxToast("All network events have played. Reset follow-ups from Help."); return; }
    if (k < 0) { var w = FUSIG[ccRole()][-k - 1]; cxToast("Notify the partner or team on " + cxById(w[1]).ot.toLowerCase() + " first."); return; }
    var s = FUSIG[ccRole()][k], id = s[1], u = cxFu(id), C = FUCHK[ccRole()][id] || [];
    ccNow = Math.max(ccNow, fuM(s[0])); ccSig[ccRole()][k] = 1;
    s[2].forEach(function (c) { u.chk[c] = fuT(ccNow); });
    var all = C.length && C.every(function (_, c) { return u.chk[c]; });
    u.log.unshift([fuT(ccNow), "net", s[3]]);
    u.st = all ? "Verified" : "Recovering"; u.since = fuT(ccNow); fuDoneSync(id, u.st);
    cxToast(all ? "Verified from the network: " + cxById(id).ot + "." : "Network: " + s[3] + ".");
  }

  /* Side panel on the Overview: follow-ups, filtered by what was clicked on the ring or globe */
  function fuItems() { return ccItems(); }
  function fuSide() {
    var it = fuItems(), f = ccOvF, by = function (b) { return it.filter(function (i) { return fuBucket(i) === b && (!f || (f.k === "proc" ? i.proc === +f.v : f.k === "pt" ? i.partner === f.v : f.k === "seg" ? (f.v === "ok" ? fuBucket(i) === "ver" : fuSegOf(i) === f.v) : true)); }); };
    var B = { need: by("need"), wait: by("wait"), ver: by("ver") }, tabs = [["need", "Need action"], ["wait", "Waiting"], ["ver", "Verified today"]];
    var list = cxSort(B[ccOvTab]), more = list.length > 5;
    var strip = f && f.k === "pt" ? '<p class="fu-strip"><b>' + cxe(f.v) + '</b> · ' + cxe(fuPartnerLine(f.v)) + ' <button type="button" class="cx-lk" data-impt="' + cxe(f.v) + '">Partner details</button></p>' : "";
    return '<div class="cx-hs fu-side"><h3 class="cx-hh"><span class="cx-hi ' + (B.need.length ? 'r">' + ci("warn") : 'b">' + ci("ok")) + '</span>Follow-ups</h3>' +
      '<span class="cx-seg fu-tabs" role="group" aria-label="Follow-ups">' + tabs.map(function (t) { return '<button type="button" data-cxovt="' + t[0] + '" aria-pressed="' + (ccOvTab === t[0]) + '">' + t[1] + ' <em>' + B[t[0]].length + '</em></button>'; }).join("") + '</span>' +
      (f ? '<p class="fu-fl"><button type="button" class="fu-fc" data-cxov="clear" aria-label="Clear filter ' + cxe(f.l) + '">' + cxe(f.l) + ' ' + ci("x") + '</button>' + (f.k === "proc" ? '<button type="button" class="cx-lk" data-cxproc="' + f.v + '">Open board</button>' : "") + '</p>' : "") + strip +
      '<ul class="fu-list">' + list.slice(0, 5).map(function (i) {
        var st = i.key.indexOf("f:") === 0 ? cxFu(i.key.slice(2)) : null;
        return '<li><button type="button" class="fu-row' + (i.sev === "h" && fuBucket(i) === "need" ? " crit" : "") + '" ' + i.open + '><span class="fu-r1"><b>' + cxe(i.title) + '</b>' + (st ? fuChip(st.st, st) : cxStPill(i.status)) + '</span>' +
          '<small>' + cxe(i.partner) + (i.doc ? ' · ' + cxe(i.doc) : "") + ' · ' + CCMOD[i.mod][0] + '</small><span class="fu-r3">' + cxe(fuFact(i)) + '</span></button></li>';
      }).join("") + (list.length ? "" : '<li class="cx-empty">' + { need: "Nothing needs an owner.", wait: "Nothing is waiting.", ver: "Nothing verified since 09:30." }[ccOvTab] + '</li>') + '</ul>' +
      (more ? '<button type="button" class="cx-lk" data-cxgo="find" data-cxat="' + ccOvTab + '">View all ' + list.length + ' in Findings' + ci("chev", "cx-lki") + '</button>' : "") + '</div>';
  }
  function fuMatch() {
    var f = ccOvF, r = { need: 0, wait: 0, ver: 0 };
    fuItems().forEach(function (i) { var b = fuBucket(i); if (r[b] === undefined) return; if (!f || (f.k === "proc" ? i.proc === +f.v : f.k === "pt" ? i.partner === f.v : f.k === "seg" ? fuSegOf(i) === f.v : true)) r[b]++; });
    return r;
  }
  function fuPartnerLine(n) {
    var it = fuItems().filter(function (i) { return i.partner === n && fuBucket(i) !== "ver"; });
    return it.length ? it.length + " open · " + (it[0].doc || "") : "Documents flowing";
  }

  /* Follow-up drawer: status, network evidence, recovery check, activity. Notices compose inline. */
  var FUDUR = [["30 minutes", 30], ["1 hour", 60], ["2 hours", 120], ["End of day", 0]];
  function fuMsg(f, k) {
    var me = FUME + ", " + ccCompany() + " EDI operations";
    if (k === "pt") return "Hi " + f.partner + " EDI team. " + f.os + " Control numbers and times are attached. Please reply with what you see on your side. " + me;
    return f.os + " Evidence attached. Please look at this and reply with a time. " + me;
  }
  /* Compose forms render as the last body section; Send and Cancel move into the footer */
  function fuForm(f, u) {
    var k = ccFuForm && ccFuForm.id === f.id ? ccFuForm.k : "", w = fuW(f.id);
    function fl(l, c) { return '<label class="ws-f"><span>' + l + '</span>' + c + '</label>'; }
    function dur() { return fl("Expect reply by", '<select data-fuf="exp">' + FUDUR.map(function (d) { return '<option value="' + d[1] + '">' + d[0] + '</option>'; }).join("") + '</select>'); }
    function box(t, body) { return '<section class="fu-cmp" aria-label="' + t + '"><h4>' + t + '</h4>' + body + '</section>'; }
    if (k === "pt") return box("Notify " + cxe(f.partner), fl("To", '<input data-fuf="to" value="edi-support@' + f.partner.toLowerCase().replace(/[^a-z]+/g, "") + '.example">') +
      fl("Subject", '<input data-fuf="subj" value="' + cxe(f.ot) + ' since ' + cxe((f.ev[0] || [""])[0]) + ' ET">') + fl("Message", '<textarea data-fuf="msg" rows="5">' + cxe(fuMsg(f, "pt")) + '</textarea>') +
      '<label class="fu-ck"><input type="checkbox" checked data-fuf="att"> Attach evidence (CSV, ' + (f.n || 1) + ' rows)</label>' + dur());
    if (k === "us") return box("Notify team", fl("Team", '<select data-fuf="team">' + FUTEAMS.map(function (t) { return '<option' + (t === w[1] ? " selected" : "") + '>' + t + '</option>'; }).join("") + '</select>') +
      fl("Channel", '<select data-fuf="chan"><option>Email</option><option>Microsoft Teams</option></select>') + fl("Ticket reference (optional)", '<input data-fuf="ticket" placeholder="INC0048211">') +
      fl("Message", '<textarea data-fuf="msg" rows="4">' + cxe(fuMsg(f, "us")) + '</textarea>') + dur());
    if (k === "reply") return box("Log reply", fl("From", '<select data-fuf="from"><option>' + cxe(f.partner) + '</option>' + FUTEAMS.map(function (t) { return '<option>' + t + '</option>'; }).join("") + '</select>') +
      fl("Note", '<textarea data-fuf="note" rows="3" placeholder="What they said, and when they expect to send"></textarea>') + fl("New expect-by time", '<select data-fuf="exp"><option value="">Keep ' + (u.exp ? fuT(u.exp) : "none") + '</option>' + FUDUR.map(function (d) { return '<option value="' + d[1] + '">' + d[0] + '</option>'; }).join("") + '</select>'));
    if (k === "known") return box("Mark as known issue", fl("Reason", '<select data-fuf="reason"><option>Planned partner maintenance</option><option>Known partner outage</option><option>Expected volume change</option><option>False alarm</option></select>') +
      fl("Until", '<select data-fuf="until"><option value="120">2 hours</option><option value="270">14:00</option><option value="0">End of day</option></select>'));
    if (k === "close") return box("Close follow-up", fl("Outcome", '<select data-fuf="outcome"><option>Recovered on network</option><option>Resolved outside the network</option><option>No action needed</option></select>'));
    return "";
  }
  function fuFormFoot(f) {
    var k = ccFuForm.k, L = { pt: ["send-pt", "Send notice"], us: ["send-us", "Send to team"], reply: ["save-reply", "Save reply"], known: ["save-known", "Mark as known issue"], close: ["save-close", "Close follow-up"] }[k];
    return '<button type="button" class="cx-btn" data-cxfu="cancel:' + f.id + '">Cancel</button><button type="button" class="cx-btn p" data-cxfu="' + L[0] + ':' + f.id + '">' + L[1] + '</button>';
  }
  /* Footer by state: More actions, then secondary, then the one primary action on the right */
  function fuFoot(f, u) {
    var w = u.wait, pn = w === "pt" ? ["pt", "Notify partner"] : ["us", "Notify team"], on = w === "pt" ? ["us", "Notify team"] : ["pt", "Notify partner"], id = f.id;
    function B(a, l, p) { return '<button type="button" class="cx-btn' + (p ? " p" : "") + '" data-cxfu="' + a + ':' + id + '">' + l + '</button>'; }
    function more(list) { return list.length ? '<details class="fu-more"><summary class="cx-btn">More actions</summary><div>' + list.map(function (x) { return B(x[0], x[1]); }).join("") + '</div></details>' : ""; }
    var st = u.st, csv = ["csv", "Download evidence (CSV)"];
    if (st === "New") return more([["form-" + on[0], on[1]], ["tgi", "Open in TG Insights"], ["form-known", "Mark as known issue"], csv]) + B("form-" + pn[0], pn[1]) + B("assign", "Assign to me", 1);
    if (st === "Assigned") return more([["form-" + on[0], on[1]], ["form-known", "Mark as known issue"], csv]) + B("tgi", "Open in TG Insights") + B("form-" + pn[0], pn[1], 1);
    if (st === "Waiting on partner" || st === "Waiting on us") return more([["form-" + on[0], on[1]], ["tgi", "Open in TG Insights"], ["form-known", "Mark as known issue"], csv]) + B("remind", "Send reminder") + B("form-reply", "Log reply", 1);
    if (st === "Recovering") return '<span class="fu-chk">' + ci("refresh") + 'Checking the next documents</span>' + more([["remind", "Send reminder"], ["tgi", "Open in TG Insights"], csv]) + B("form-reply", "Log reply", 1);
    if (st === "Verified") return B("reopen", "Reopen") + B("form-close", "Close follow-up", 1);
    return B("reopen", "Reopen", 1);
  }
  function fuDrawer() {
    var f = cxById(ccDr[1]); if (!f) { ccDr = null; return ""; }
    var u = cxFu(f.id), P = ccProc(f.p), pm = ccOn("pm"), C = FUCHK[ccRole()][f.id] || [], a = CXAF[f.id], mod = f.mod === "Integration Monitor" ? "IM" : "PM", link = (FULINK[f.id] || []).map(cxById).filter(Boolean);
    var act = u.log.concat(f.ev.slice().reverse().map(function (e, j) { return [e[0], j === 0 ? "ag" : "net", e[1]]; })), allAct = ccFuForm && ccFuForm.all === f.id, form = ccFuForm && ccFuForm.id === f.id && ccFuForm.k;
    var ico = { net: ci("doc"), ag: ci("spark"), me: '<b>' + FUME.split(" ").map(function (x) { return x[0]; }).join("") + '</b>' };
    var h = '<header><span><p>Follow-up · ' + CCMOD[mod][0] + ' · ' + cxe(a.n) + '</p><h3>' + cxe(f.ot) + '</h3></span><button type="button" class="cx-ic" data-cxclose aria-label="Close">' + ci("x") + '</button></header>' +
      '<p class="cx-chipsr">' + cxSevChip(f.sev) + fuChip(u.st, u) + (u.since ? '<span class="cx-tg">since ' + u.since + '</span>' : "") + cxTag(mod) + '</p><div class="cx-db">' +
      '<dl class="cx-dl fu-dl"><div><dt>Partner</dt><dd><button type="button" class="cx-lk" data-impt="' + cxe(f.partner) + '">' + cxe(f.partner) + '</button></dd></div><div><dt>Owner</dt><dd>' + (u.owner || "Unassigned") + '</dd></div>' +
      '<div><dt>Waiting on</dt><dd>' + cxe(fuWaitTxt(u, f)) + '</dd></div><div><dt>Expect by</dt><dd>' + (u.exp ? (fuOverdue(u) ? '<span class="fu-od">Overdue ' + Math.round(ccNow - u.exp) + ' m</span>' : fuT(u.exp)) : "Not set") + '</dd></div>' +
      (u.ticket ? '<div><dt>Ticket</dt><dd>' + cxe(u.ticket) + '</dd></div>' : "") + '</dl>' +
      '<h4>What the network shows</h4><p>' + cxe(f.os) + '</p><div class="cx-imp"><b>' + cxe(f.bt) + '</b><span>' + cxe(f.bs) + '</span></div>' +
      '<h4>Evidence</h4>' + cxAffected(f) +
      '<h4>Recovery check</h4><ul class="fu-ck-l">' + C.map(function (c, j) { return '<li class="' + (u.chk[j] ? "on" : "") + '">' + ci(u.chk[j] ? "ok" : "clock") + '<span>' + cxe(c) + (u.chk[j] ? '<small>Seen ' + u.chk[j] + '</small>' : "") + '</span></li>'; }).join("") + '</ul>' +
      '<p class="cx-note">Checked against documents on the network. A reply by email does not close a follow-up.' + (/810|820|824/.test(CXDOC[f.id] || "") ? " Payment status is not visible to Command Center." : "") + '</p>' +
      '<h4>Activity</h4><ol class="fu-act">' + (allAct ? act : act.slice(0, 8)).map(function (e) { return '<li><span class="fu-ai ' + e[1] + '">' + ico[e[1]] + '</span><b>' + cxe(e[0]) + '</b><span>' + cxe(e[2]) + '</span></li>'; }).join("") + '</ol>' +
      (act.length > 8 && !allAct ? '<button type="button" class="cx-lk" data-cxfu="all:' + f.id + '">Show all ' + act.length + '</button>' : "") +
      '<details class="fu-det"><summary>Details</summary><dl class="cx-dl">' + (pm ? '<div><dt>Process</dt><dd><button type="button" class="cx-lk" data-cxproc="' + f.p + '">' + cxe(P.n) + '</button>, step ' + ccStepNo(f.p, f.st) + ': ' + cxe(ccStepName(f.p, f.st)) + '</dd></div>' : "") +
      '<div><dt>' + (mod === "IM" ? "Check" : "Rule") + '</dt><dd><button type="button" class="cx-lk" data-cxrule="' + cxe(CXRULE[f.id]) + '">' + cxe(CXRULE[f.id]) + '</button></dd></div><div><dt>Transactions</dt><dd>' + cxe(CXDOC[f.id]) + '</dd></div>' +
      '<div><dt>Root cause</dt><dd>' + cxe(f.cause) + '</dd></div><div><dt>Suggested next step</dt><dd>' + cxe(f.act) + '<small> Usually handled by ' + cxe(f.appr || fuW(f.id)[1]) + '</small></dd></div>' +
      '<div><dt>Teams involved</dt><dd>' + f.who.map(cxe).join(", ") + '</dd></div>' + (link.length ? '<div><dt>Linked findings</dt><dd>' + link.map(function (l) { return '<button type="button" class="cx-lk" data-cxf="' + l.id + '">' + cxe(l.ot) + '</button>'; }).join("") + '</dd></div>' : "") + '</dl></details>' +
      fuForm(f, u) + '</div><div class="cx-ft fu-ft">' + (form ? fuFormFoot(f) : fuFoot(f, u)) + '</div>';
    return '<div class="cx-scrim" data-ovesc></div><aside class="cx-dr fu-dr" role="dialog" aria-modal="true">' + h + '</aside>';
  }
  /* One TG Insights handoff everywhere. TG Insights is not part of this preview. */
  function fuTgi(n) { cxToast("Handed off " + n + (n === 1 ? " transaction" : " transactions") + " to TG Insights. TG Insights is not connected in this preview."); }
  function fuCsv(f) {
    var code = (/\((\d{3})\)/.exec(CXDOC[f.id] || "") || [0, "997"])[1], rows = [["Finding", "Partner", "Document", "Reference", "Time", "Check"]];
    for (var j = 0; j < Math.min(5, f.n || 1); j++) { var seed = f.id.charCodeAt(1) * 977 + j * 131 + 3301, t = 9 * 60 + 20 - j * 23 - seed % 9; rows.push([f.ot, f.partner, code, String(40000 + seed % 59999), fuT(t), f.how]); }
    rtDownload("evidence-" + f.id + ".csv", '﻿' + rtCSV(rows), "text/csv;charset=utf-8");
  }
  var fuBaseDrawer = cxDrawer;
  cxDrawer = function () { return ccDr && ccDr[0] === "f" ? fuDrawer() : fuBaseDrawer(); };

  function fuVal(k) { var el = cx.querySelector('.fu-cmp [data-fuf="' + k + '"]'); return el ? (el.type === "checkbox" ? el.checked : String(el.value || "").trim()) : ""; }
  function fuExp(v) { v = +v; return v ? ccNow + v : 17 * 60; }
  cx.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cxfu],[data-cxov],[data-cxovt],[data-cxclk],[data-cxfureset]"); if (!b) return;
    if (b.hasAttribute("data-cxovt")) { ccOvTab = b.getAttribute("data-cxovt"); cxRender(); return; }
    if (b.hasAttribute("data-cxclk")) { fuAdvance(); cxRender(); var cb = cx.querySelector("[data-cxclk]"); if (cb) cb.focus({ preventScroll: true }); return; }
    if (b.hasAttribute("data-cxfureset")) { ccFS = { supplier: {}, retailer: {} }; ccSig = { supplier: {}, retailer: {} }; ccNow = 570; ccDone = {}; ccOvF = null; ccDr = null; cxToast("Follow-ups reset to 09:30."); cxRender(); return; }
    if (b.hasAttribute("data-cxov")) {
      var v = b.getAttribute("data-cxov").split(":"), lab = { br: "Breached", rk: "At risk", ok: "On track" };
      if (v[0] === "clear") ccOvF = null;
      else if (v[0] === "tab") { ccOvF = null; ccOvTab = v[1]; }
      else {
        ccOvF = { k: v[0], v: v.slice(1).join(":"), l: v[0] === "seg" ? lab[v[1]] : v[0] === "proc" ? ccShort(+v[1]) : v.slice(1).join(":") };
        if (v[0] === "seg" && v[1] === "ok") ccOvTab = "ver";
        else { var m = fuMatch(); ccOvTab = ["need", "wait", "ver"].filter(function (t) { return m[t]; })[0] || "need"; }
      }
      cxRender(); return;
    }
    if (!b.hasAttribute("data-cxfu")) return;
    var p = b.getAttribute("data-cxfu").split(":"), a = p[0], id = p[1], f = cxById(id), u = cxFu(id), msg = "";
    if (a === "cancel") { ccFuForm = null; }
    else if (a === "all") { ccFuForm = { id: id, all: id }; }
    else if (a.indexOf("form-") === 0) { ccFuForm = { id: id, k: a.slice(5) }; cxRender(); var fc = cx.querySelector(".fu-cmp"), fe = cx.querySelector(".fu-cmp input, .fu-cmp select, .fu-cmp textarea"); if (fc && fc.scrollIntoView) fc.scrollIntoView({ block: "start", behavior: "smooth" }); if (fe) fe.focus({ preventScroll: true }); return; }
    else if (a === "assign") { fuTick(); u.owner = FUME; fuSet(id, "Assigned", "Assigned to " + FUME); (FULINK[id] || []).forEach(function (k) { if (cxById(k)) cxFu(k).owner = FUME; }); msg = "Assigned to you. Notify " + (u.wait === "pt" ? f.partner : fuW(id)[1]) + " next."; }
    else if (a === "send-pt") { var to = fuVal("to"), ex = fuExp(fuVal("exp")); if (!to) return; fuTick(); u.owner = u.owner || FUME; u.exp = ex; u.wait = "pt";
      fuSet(id, u.st === "Recovering" ? "" : "Waiting on partner", "Notified " + f.partner + " (" + to + ")" + (fuVal("att") ? " with evidence attached" : "") + ". Expect by " + fuT(ex)); ccFuForm = null;
      msg = "Notice sent to " + f.partner + ". Expect reply by " + fuT(ex) + "."; }
    else if (a === "send-us") { var tm = fuVal("team"), ex2 = fuExp(fuVal("exp")); fuTick(); u.owner = u.owner || FUME; u.exp = ex2; u.to = tm; u.ticket = fuVal("ticket") || u.ticket; u.wait = "us";
      fuSet(id, u.st === "Recovering" ? "" : "Waiting on us", "Sent to " + tm + " by " + fuVal("chan") + (u.ticket ? ", ticket " + u.ticket : "") + ". Expect by " + fuT(ex2)); ccFuForm = null;
      msg = "Sent to " + tm + ". Expect reply by " + fuT(ex2) + "."; }
    else if (a === "save-reply") { var nt = fuVal("note"), fr = fuVal("from"), ne = fuVal("exp"); if (!nt) { var ta = cx.querySelector('.fu-cmp [data-fuf="note"]'); if (ta) { ta.setCustomValidity("Enter the reply."); ta.reportValidity(); ta.setCustomValidity(""); } return; }
      fuTick(); if (ne !== "") u.exp = fuExp(ne); if (FUTEAMS.indexOf(fr) >= 0 && u.st === "Waiting on partner") { u.wait = "us"; u.to = fr; fuSet(id, "Waiting on us", ""); }
      fuSet(id, "", "Reply from " + fr + ": " + nt); ccFuForm = null; msg = "Reply logged."; }
    else if (a === "remind") { fuTick(); u.exp = ccNow + 60; fuSet(id, "", "Reminder sent to " + fuWaitTxt(u, f) + ". Expect by " + fuT(u.exp)); msg = "Reminder sent. New expect-by time " + fuT(u.exp) + "."; }
    else if (a === "save-known") { var un = +fuVal("until"), ut = un ? (un === 270 ? 14 * 60 : ccNow + un) : 17 * 60; fuTick(); fuSet(id, "Known issue", "Marked as known issue: " + fuVal("reason") + ", until " + fuT(ut)); ccFuForm = null;
      msg = "Marked as known issue until " + fuT(ut) + "."; }
    else if (a === "save-close") { fuTick(); fuSet(id, "Closed", "Closed: " + fuVal("outcome")); ccFuForm = null; msg = "Follow-up closed."; }
    else if (a === "reopen") { fuTick(); fuSet(id, "Assigned", "Reopened by " + FUME); msg = "Follow-up reopened."; }
    else if (a === "tgi") { fuTick(); fuSet(id, "", "Handed off " + (f.n || 1) + " transactions to TG Insights"); fuTgi(f.n || 1); }
    else if (a === "csv") { fuCsv(f); msg = "Evidence downloaded."; }
    if (msg) cxToast(msg);
    cxRender();
  });
