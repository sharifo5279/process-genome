  /* Aviator in Command Center: questions go to the Trading Grid Agent on Trading Grid Context Services
     (Trading Grid Agent Connectors, MCP over HTTP). The request carries the screen and the follow-up state of this
     session; the answer comes back with the sub-agents used and the evidence trail. Read only. */
  var AVCS = "https://tg-context-services-prototype.onrender.com/cc/mcp";
  var AVTOK = { retailer: "tgcs_commandcenter_retailer_193977d9ac9c1238", supplier: "tgcs_commandcenter_supplier_3b68094cb7129b6b" };
  var ccAvConv = {}, ccAvBusy = false, ccAvDraft = "", ccAvSeq = 0, ccAvT0 = 0, ccAvTick = 0;
  CXI.copy = '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>';

  /* What the user sees, so answers refer to the same screen */
  function avScreen() {
    var nav = CXNAV.filter(function (g) { return g[0] === cxNavKey(ccScr); })[0], lines = [];
    lines.push("Company: " + ccCompany() + " (" + (ccRole() === "retailer" ? "retailer" : "CPG supplier") + ")");
    lines.push("Licensed modules: " + cxMods().map(function (m) { return CCMOD[m][0]; }).join(", ") + ". Use only data from these modules.");
    lines.push("Screen: " + (nav ? nav[1] : "Overview") + (ccScr !== cxNavKey(ccScr) ? " > " + ccScr : ""));
    if (ccOvF) lines.push("Overview filter: " + ccOvF.l);
    if (ccDr && ccDr[0] === "f") { var f = cxById(ccDr[1]); if (f) lines.push("Open follow-up: " + f.id + ", " + f.ot + " (" + f.partner + ")"); }
    if (ccDr && ccDr[0] === "rt-case") lines.push("Open retail case: " + ccDr[1]);
    if (ccDr && ccDr[0] === "pt") lines.push("Open partner: " + ccDr[1]);
    if (ccDr && ccDr[0] === "rl") lines.push("Open rule: " + ccDr[1]);
    lines.push("Network time: " + fuT(ccNow) + " ET");
    return lines.join("\n");
  }
  function avFollowUps() {
    return ccItems().map(function (i) {
      if (i.key.indexOf("f:") === 0) { var id = i.key.slice(2), u = cxFu(id), f = cxById(id);
        return { id: id, state: u.st, owner: u.owner || "Unassigned", waitingOn: fuWaitTxt(u, f), expectBy: u.exp ? fuT(u.exp) : null, since: u.since || null, activity: u.log.slice(0, 6).map(function (e) { return e[0] + " " + e[2]; }) }; }
      return { id: i.key.slice(3), state: i.status, owner: i.owner, waitingOn: i.wait || null };
    });
  }

  /* Answer text: paragraphs, bullets, tables and the agent's visual blocks */
  function avInline(s) { return cxe(s).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/`([^`]+)`/g, "<code>$1</code>"); }
  var AVOK = /complete|active|live|delivered|received|confirmed|verified|on target|ok|pass/i, AVBAD = /fail|blocked|expired|missing|rejected|overdue|breach|high|off target|not received|not sent/i;
  function avDot(st) { return '<i class="av-d ' + (AVBAD.test(st) ? "r" : AVOK.test(st) ? "g" : "a") + '"></i>'; }
  function avBlock(type, body) {
    var rows = body.split("\n").filter(function (l) { return l.trim(); }), title = "", status = "", extra = "";
    rows = rows.filter(function (l) { var m = /^(title|status|series|cols):\s*(.*)$/i.exec(l.trim()); if (!m) return true; if (/title/i.test(m[1])) title = m[2]; else if (/status/i.test(m[1])) status = m[2]; else extra = m[2]; return false; });
    var C = rows.map(function (l) { return l.split(" | ").map(function (x) { return x.trim(); }); }), t = type.toLowerCase(), h = title ? '<b class="av-bt">' + avInline(title) + '</b>' : "";
    if (/^(email|message|note|text)$/.test(t)) return '<div class="av-copy">' + h + '<pre>' + cxe(body.replace(/^title:.*\n/i, "")) + '</pre><button type="button" class="cx-btn av-cp" data-avcopy>' + ci("copy") + 'Copy</button></div>';
    if (t === "kpi") return h + '<div class="av-kpi">' + C.map(function (c) { return '<div><span>' + avInline(c[0]) + '</span><b>' + avInline(c[1] || "") + '</b>' + (c[2] ? '<small>' + avInline(c[2]) + '</small>' : "") + '</div>'; }).join("") + '</div>';
    if (t === "gauge") return h + C.map(function (c) { var v = parseFloat(c[1]) || 0, g = parseFloat(c[2]) || 0; return '<div class="av-g"><span>' + avInline(c[0]) + '<b>' + cxe(c[1]) + '</b>' + (c[2] ? '<small>Target ' + cxe(c[2]) + '</small>' : "") + '</span><i><u style="width:' + Math.min(100, v) + '%"></u>' + (g ? '<em style="left:' + Math.min(100, g) + '%"></em>' : "") + '</i></div>'; }).join("");
    if (/^(status|steps|timeline|flow)$/.test(t)) return h + '<ul class="av-st">' + C.map(function (c) { var st = t === "timeline" ? c[2] || "" : c[1] || ""; return '<li>' + avDot(st) + '<span><b>' + avInline(c[0]) + '</b>' + (t === "timeline" ? " " + avInline(c[1] || "") : ' <em>' + avInline(c[1] || "") + '</em>') + (c[2] && t !== "timeline" ? '<small>' + avInline(c[2]) + '</small>' : "") + '</span></li>'; }).join("") + '</ul>';
    if (t === "record") return '<div class="av-rec">' + (title ? '<b class="av-bt">' + avInline(title) + (status ? ' <span class="av-rs">' + avDot(status) + cxe(status) + '</span>' : "") + '</b>' : "") + '<dl>' + C.map(function (c) { return '<div><dt>' + avInline(c[0]) + '</dt><dd>' + avInline(c.slice(1).join(" | ")) + '</dd></div>'; }).join("") + '</dl></div>';
    if (t === "alert") return C.map(function (c) { return '<div class="av-al">' + ci("warn") + '<span><b>' + avInline(c[1] || c[0]) + '</b>' + avInline(c[2] || "") + '</span></div>'; }).join("");
    if (t === "actions") return '<div class="av-act">' + C.map(function (c) { return '<button type="button" class="av-chip" data-avq="' + cxe(c[1] || c[0]) + '">' + avInline(c[0]) + '</button>'; }).join("") + '</div>';
    if (t === "contact") return h + '<ul class="av-st">' + C.map(function (c) { return '<li>' + ci("users") + '<span><b>' + avInline(c[0]) + '</b> ' + avInline(c[1] || "") + '<small>' + avInline([c[2], c[3]].filter(Boolean).join(" · ")) + '</small></span></li>'; }).join("") + '</ul>';
    if (t === "cards") return h + '<div class="av-cards">' + C.map(function (c) { return '<div><b>' + avInline(c[0]) + '</b><span>' + avInline(c[1] || "") + '</span></div>'; }).join("") + '</div>';
    if (t === "chart bar" || t === "donut") { var mx = Math.max.apply(null, C.map(function (c) { return parseFloat(String(c[1]).replace(/[^\d.]/g, "")) || 0; })) || 1;
      return h + '<ul class="av-bars">' + C.map(function (c) { var v = parseFloat(String(c[1]).replace(/[^\d.]/g, "")) || 0; return '<li><span>' + avInline(c[0]) + '</span><i><u style="width:' + Math.round(100 * v / mx) + '%"></u></i><b>' + cxe(c[1]) + '</b></li>'; }).join("") + '</ul>'; }
    if (t === "chart line") { var vs = C.map(function (c) { return parseFloat(String(c[1]).replace(/[^\d.-]/g, "")) || 0; }); return h + cxLine([{ v: vs, area: true }], { w: 360, h: 150, xl: C.map(function (c) { return c[0]; }), label: title || "Trend" }); }
    var head = t === "compare" && extra ? '<tr><th></th>' + extra.split(",").map(function (x) { return '<th>' + cxe(x.trim()) + '</th>'; }).join("") + '</tr>' : "";
    return h + '<table class="av-tb">' + (head ? '<thead>' + head + '</thead>' : "") + '<tbody>' + C.map(function (c) { return '<tr>' + c.map(function (x) { return '<td>' + avInline(x) + '</td>'; }).join("") + '</tr>'; }).join("") + '</tbody></table>';
  }
  function avRender(text) {
    var out = [], lines = String(text || "").replace(/\r/g, "").split("\n"), i = 0, para = [], list = [];
    function flush() { if (para.length) out.push('<p>' + avInline(para.join(" ")) + '</p>'); if (list.length) out.push('<ul class="av-ul">' + list.map(function (l) { return '<li>' + avInline(l) + '</li>'; }).join("") + '</ul>'); para = []; list = []; }
    while (i < lines.length) {
      var l = lines[i], m = /^```\s*([\w ]*)\s*$/.exec(l.trim());
      if (m) { flush(); var body = []; i++; while (i < lines.length && !/^```\s*$/.test(lines[i].trim())) body.push(lines[i++]); i++; out.push(avBlock(m[1] || "text", body.join("\n"))); continue; }
      if (/^\s*\|.*\|\s*$/.test(l)) { flush(); var tb = []; while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) tb.push(lines[i++]);
        var rows = tb.filter(function (r) { return !/^\s*\|[\s:|-]+\|\s*$/.test(r); }).map(function (r) { return r.trim().replace(/^\||\|$/g, "").split("|").map(function (x) { return x.trim(); }); });
        out.push('<table class="av-tb"><thead><tr>' + rows[0].map(function (x) { return '<th>' + avInline(x) + '</th>'; }).join("") + '</tr></thead><tbody>' + rows.slice(1).map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + avInline(x) + '</td>'; }).join("") + '</tr>'; }).join("") + '</tbody></table>'); continue; }
      if (/^\s*[-*]\s+/.test(l)) { if (para.length) { out.push('<p>' + avInline(para.join(" ")) + '</p>'); para = []; } list.push(l.replace(/^\s*[-*]\s+/, "")); i++; continue; }
      if (/^#{1,4}\s/.test(l)) { flush(); out.push('<p><b>' + avInline(l.replace(/^#+\s*/, "")) + '</b></p>'); i++; continue; }
      if (/^Next step:/i.test(l.trim())) { flush(); out.push('<p class="av-nx">' + avInline(l.trim()) + '</p>'); i++; continue; }
      if (/^Sources:/i.test(l.trim())) { flush(); out.push('<p class="av-src">' + avInline(l.trim()) + '</p>'); i++; continue; }
      if (!l.trim()) { flush(); i++; continue; }
      if (list.length) flush();
      para.push(l.trim()); i++;
    }
    flush();
    return out.join("");
  }
  function avTrail(r) {
    var calls = (r.steps || []).filter(function (s) { return s.tool !== "engage_subagent"; });
    return '<details class="av-tr"><summary>' + ci("spark") + 'Trading Grid Agent' + (r.subagents && r.subagents.length ? ' · ' + cxe(r.subagents.join(", ")) : "") + ' · ' + calls.length + (calls.length === 1 ? " call" : " calls") + ' · ' + Math.max(1, Math.round((r.ms || 0) / 1000)) + ' s</summary>' +
      '<p>' + cxe((r.route || []).join(" › ")) + '</p><ol>' + calls.map(function (s) { return '<li>' + avDot(s.status === "OK" ? "Complete" : "Failed") + '<span><b>' + cxe(s.title || s.tool) + '</b>' + (s.subagent ? ' <em>' + cxe(s.subagent) + '</em>' : "") + '<small>' + cxe([s.product, s.summary, s.completeness && s.completeness !== "COMPLETE" ? "Partial evidence" : ""].filter(Boolean).join(" · ")) + '</small></span></li>'; }).join("") + '</ol>' +
      '<p>' + cxe((r.company || ccCompany()) + " grant " + (r.grantId || "") + ". Read only.") + '</p></details>';
  }

  /* The call */
  function avAsk(q) {
    q = String(q || "").trim(); if (!q || ccAvBusy) return;
    ccAvBusy = true; ccAvDraft = ""; ccAvT0 = Date.now(); var role = ccRole(), seq = ++ccAvSeq;
    ccAvLog.push(["q", cxe(q)]); cxRender(); avScroll();
    clearInterval(ccAvTick); ccAvTick = setInterval(function () { var p = cx.querySelector(".av-pend span"); if (p) p.textContent = avPendText(); }, 1000);
    var ctl = typeof AbortController !== "undefined" ? new AbortController() : null, to = setTimeout(function () { if (ctl) ctl.abort(); }, 150000);
    fetch(AVCS, { method: "POST", signal: ctl ? ctl.signal : undefined, headers: { "Authorization": "Bearer " + AVTOK[role], "Content-Type": "application/json", "Accept": "application/json, text/event-stream" },
      body: JSON.stringify({ jsonrpc: "2.0", id: seq, method: "tools/call", params: { name: "trading_grid_agent", arguments: { request: q, conversation_id: ccAvConv[role] || undefined, screen_context: avScreen(), network_time: fuT(ccNow), follow_ups: avFollowUps() } } }) })
      .then(function (res) { return res.json().catch(function () { return { error: { message: "Trading Grid Context Services returned " + res.status + "." } }; }); })
      .then(function (j) {
        if (seq !== ccAvSeq) return;
        var r = j && j.result, sc = r && r.structuredContent;
        if (j.error || !r) throw new Error((j.error && j.error.message) || "No response.");
        if (r.isError || !sc) throw new Error(((r.content || [])[0] || {}).text || "The agent returned no answer.");
        ccAvConv[role] = sc.conversationId;
        ccAvLog.push(["a", avRender(sc.answer) + avTrail(sc)]);
      })
      .catch(function (e) { if (seq !== ccAvSeq) return; ccAvLog.push(["err", ci("warn") + '<span><b>Trading Grid Context Services did not answer.</b>' + cxe(e && e.name === "AbortError" ? "The request timed out after 150 seconds." : String(e && e.message || e).replace(/^Aviator AKS gateway: /, "Gateway: ")) + '</span><button type="button" class="cx-btn" data-avq="' + cxe(q) + '" data-avretry>Retry</button>']); })
      .then(function () { clearTimeout(to); clearInterval(ccAvTick); if (seq !== ccAvSeq) return; ccAvBusy = false; cxRender(); avScroll(); var t = cx.querySelector("[data-avin]"); if (t) t.focus({ preventScroll: true }); });
  }
  function avPendText() { var s = Math.round((Date.now() - ccAvT0) / 1000); return s < 8 ? "Trading Grid Agent is working" : s < 25 ? "Checking Trading Grid services · " + s + " s" : "Starting Trading Grid Context Services. The first request can take up to a minute · " + s + " s"; }
  function avScroll() { var l = cx.querySelector(".cx-avb"); if (l) l.scrollTop = l.scrollHeight; }

  cxAviator = function () {
    if (!ccAv) return "";
    var qs = CXQ.filter(function (q) { return !q.t || ccOn(q.t); });
    var log = ccAvLog.map(function (m) { return '<li class="' + m[0] + '">' + m[1] + '</li>'; }).join("") + (ccAvBusy ? '<li class="a av-pend"><i class="av-sp"></i><span>' + avPendText() + '</span></li>' : "");
    return '<aside class="cx-av" aria-label="Aviator"><header>' + ci("spark") + '<b>Aviator</b>' + (ccAvLog.length ? '<button type="button" class="cx-lk av-new" data-avnew>New conversation</button>' : "") + '<button type="button" class="cx-ic" data-cxav aria-label="Close Aviator">' + ci("x") + '</button></header>' +
      '<div class="cx-avb" aria-live="polite">' + (ccAvLog.length ? "" : '<p class="cx-av-intro">Ask about partners, findings, follow-ups and anomalies for ' + cxe(ccCompany()) + '.</p><ul class="cx-avq">' + qs.map(function (q) { return '<li><button type="button" data-avq="' + cxe(q.q()) + '">' + cxe(q.q()) + '</button></li>'; }).join("") + '</ul>') +
      '<ul class="cx-avl">' + log + '</ul></div>' +
      '<div class="cx-ft av-ft"><div class="av-in"><textarea data-avin rows="2" placeholder="Ask Aviator" aria-label="Ask Aviator"' + (ccAvBusy ? " disabled" : "") + '>' + cxe(ccAvDraft) + '</textarea><button type="button" class="cx-ic av-send" data-avsend aria-label="Send"' + (ccAvBusy ? " disabled" : "") + '>' + ci("send") + '</button></div>' +
      '<small>Trading Grid Agent via Trading Grid Context Services, read only. AI can make mistakes. Check important information.</small></div></aside>';
  };
  cxAsk = function (k) { var q = CXQ[k]; if (q) avAsk(q.q()); };
  cx.addEventListener("click", function (e) {
    var b = e.target.closest("[data-avq],[data-avsend],[data-avnew],[data-avcopy]"); if (!b) return;
    if (b.hasAttribute("data-avq")) avAsk(b.getAttribute("data-avq"));
    else if (b.hasAttribute("data-avsend")) { var t = cx.querySelector("[data-avin]"); avAsk(t ? t.value : ccAvDraft); }
    else if (b.hasAttribute("data-avnew")) { ccAvLog = []; delete ccAvConv[ccRole()]; ccAvSeq++; ccAvBusy = false; clearInterval(ccAvTick); cxRender(); }
    else if (b.hasAttribute("data-avcopy")) { var pre = b.parentNode.querySelector("pre"); try { navigator.clipboard.writeText(pre.textContent); cxToast("Copied."); } catch (err) { cxToast("Copy is not available in this browser."); } cxRender(); }
  });
  cx.addEventListener("input", function (e) { if (e.target.hasAttribute && e.target.hasAttribute("data-avin")) ccAvDraft = e.target.value; });
  cx.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey && e.target.hasAttribute && e.target.hasAttribute("data-avin")) { e.preventDefault(); avAsk(e.target.value); } });
  /* Keep the draft and focus across re-renders */
  var avBaseRender = cxRender;
  cxRender = function () {
    var a = document.activeElement, had = a && a.hasAttribute && a.hasAttribute("data-avin"), pos = had ? a.selectionStart : 0, sc = cx.querySelector(".cx-avb"), st = sc ? sc.scrollTop : 0;
    avBaseRender();
    var n = cx.querySelector(".cx-avb"); if (n) n.scrollTop = st;
    if (had) { var t = cx.querySelector("[data-avin]"); if (t) { t.focus({ preventScroll: true }); try { t.setSelectionRange(pos, pos); } catch (err) {} } }
  };
