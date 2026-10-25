  /* Overlays. One right sheet for object detail, below the top bar. Opening a related object from a sheet stacks it:
     Back and Escape return one level, X closes the stack, and focus returns to the control that opened the first sheet.
     Confirmations use a small centered dialog. */
  var ovStack = [], ovLast = null, ovPop = false, ovInv = null, ovClick = null, ovTitle = "", ovState = {};
  function ovKey(d) { return d ? d.join("|") : ""; }
  function ovEl() { return cx.querySelector(".cx-dlg") || cx.querySelector(".cx-dr"); }
  function ovSel(a) { return '[' + a.attr + '="' + String(a.val).replace(/"/g, '\\"') + '"]'; }
  function ovFocus(el) { if (el && el.focus) el.focus({ preventScroll: true }); }
  /* Small centered dialog for confirmations: [title, text, keep label, confirm label, confirm attribute] */
  var ovConfirmArgs = null;
  function ovConfirm(title, text, keep, ok, attr) { ovConfirmArgs = [title, text, keep, ok, attr]; ccDr = ["ov-confirm"]; cxRender(); }
  var ovBaseDrawer = cxDrawer;
  cxDrawer = function () {
    if (!ccDr || ccDr[0] !== "ov-confirm" || !ovConfirmArgs) return ovBaseDrawer();
    var a = ovConfirmArgs;
    return '<div class="cx-scrim" data-ovesc></div><section class="cx-dlg" role="alertdialog" aria-modal="true"><header><h3>' + cxe(a[0]) + '</h3></header><p>' + cxe(a[1]) + '</p>' +
      '<div class="cx-ft"><button type="button" class="cx-btn" data-ovback>' + cxe(a[2]) + '</button><button type="button" class="cx-btn p" ' + a[4] + '>' + cxe(a[3]) + '</button></div></section>';
  };
  function ovBack() {
    var p = ovStack.pop();
    if (p) { ccDr = p.dr; if (typeof rtCaseTab !== "undefined") { rtCaseTab = p.st.tab; rtDoc = p.st.doc; rtRuleDraft = p.st.rule; } ccPtSheet = p.st.pt || ccPtSheet; ovPop = true; }
    else ccDr = null;
    ccFuForm = null; cxRender();
  }
  function ovCloseAll() { ovStack = []; ccDr = null; ccFuForm = null; if (typeof ccRw !== "undefined") ccRw = null; cxRender(); }
  /* Escape and scrim: the rule wizard asks before it discards a draft */
  function ovEsc() {
    if (ccDr && ccDr[0] === "rule" && ccRw && ccRw.step > 0) { ovConfirm("Discard this rule?", "The draft rule is not saved.", "Keep editing", "Discard", "data-ovdiscard"); return; }
    if (ccDr && ccDr[0] === "rule") { ccRw = null; }
    ovBack();
  }
  var ovBaseRender = cxRender;
  cxRender = function () {
    var k = ovKey(ccDr), lk = ovKey(ovLast), changed = k !== lk, scroll = 0, old = cx.querySelector(".cx-dr .cx-db");
    if (old) scroll = old.scrollTop;
    if (changed && ovLast && ccDr && !ovPop) ovStack.push({ dr: ovLast, title: ovTitle, st: ovState });
    if (!ccDr) ovStack = [];
    if (changed && !ovLast && ccDr) ovInv = ovClick;
    var popped = ovPop; ovPop = false;
    ovBaseRender();
    ovLast = ccDr ? ccDr.slice() : null;
    ovState = { tab: typeof rtCaseTab !== "undefined" ? rtCaseTab : "", doc: typeof rtDoc !== "undefined" ? rtDoc : "", rule: typeof rtRuleDraft !== "undefined" ? rtRuleDraft : null, pt: ccPtSheet };
    var el = ovEl(), body = cx.querySelector(".cx-body"), top = cx.querySelector(".cx-top");
    if (body) body.inert = !!el; if (top) top.inert = !!el;
    if (!el) {
      if (changed && lk) { var b = ovInv && cx.querySelector(ovSel(ovInv)); ovFocus(b || cx.querySelector(".cx-main h2")); ovInv = null; }
      return;
    }
    var t = el.querySelector("h2, h3");
    if (t) { t.id = "ov-title"; t.setAttribute("tabindex", "-1"); el.setAttribute("aria-labelledby", "ov-title"); el.removeAttribute("aria-label"); ovTitle = t.textContent; }
    if (ovStack.length && el.classList.contains("cx-dr")) {
      var prev = ovStack[ovStack.length - 1], eb = el.querySelector("header p");
      if (eb) eb.outerHTML = '<button type="button" class="ov-back" data-ovback>' + ci("chev", "ov-bi") + '<span>Back to ' + cxe(prev.title) + '</span></button>';
    }
    var db = el.querySelector(".cx-db");
    if (!changed && db) db.scrollTop = scroll;
    if (changed || popped) { ovFocus(cx.querySelector(".cx-dlg [data-ovback]") || t); return; }
    var a = document.activeElement;
    if (!a || a === document.body || !el.contains(a)) { var m = ovClick && el.querySelector(ovSel(ovClick)); ovFocus(m || t); }
  };
  /* The control that opened a sheet, so focus can return to it */
  cx.addEventListener("click", function (e) {
    var n = e.target.closest ? e.target.closest("button, a, [role=button], [tabindex]") : null; if (!n || !n.getAttributeNames) return;
    var at = n.getAttributeNames().filter(function (x) { return x.indexOf("data-") === 0; })[0];
    ovClick = at ? { attr: at, val: n.getAttribute(at) } : null;
  }, true);
  cx.addEventListener("click", function (e) {
    var b = e.target.closest("[data-ovback],[data-ovesc],[data-ovdiscard]"); if (!b) return;
    if (b.hasAttribute("data-ovback")) ovBack();
    else if (b.hasAttribute("data-ovesc")) ovEsc();
    else if (b.hasAttribute("data-ovdiscard")) { ccRw = null; ovCloseAll(); }
  });
  document.addEventListener("keydown", function (e) {
    var el = ovEl(); if (!el) return;
    if (e.key === "Escape") {
      e.preventDefault();
      var m = el.querySelector("details[open]"); if (m) { m.open = false; ovFocus(m.querySelector("summary")); return; }
      if (ccFuForm && ccFuForm.k) { ccFuForm = null; cxRender(); return; }
      ovEsc(); return;
    }
    if (e.key !== "Tab") return;
    var items = [].filter.call(el.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex="0"]'), function (x) { return x.offsetParent !== null; });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1], a = document.activeElement;
    if (e.shiftKey && (a === first || !el.contains(a) || a.id === "ov-title")) { e.preventDefault(); ovFocus(last); }
    else if (!e.shiftKey && (a === last || !el.contains(a))) { e.preventDefault(); ovFocus(first); }
  });
