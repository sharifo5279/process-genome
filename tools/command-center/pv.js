  /* Product overlay on the genome. Connect: partner connectivity. Comply: retail compliance for suppliers (separate product).
     Optimize: Command Center monitors and findings now. Extend: agents at decision points. */
  var pmPv = "off", pmPvLast = "optimize";
  function pmPvOn() { return pmPv !== "off" && pmMode === "pt" && !!PMPV[pmK]; }
  function pmPvMods(c) {
    var P = PMPV[pmK], m = [];
    function has(rows) { return rows && rows.some(function (x) { return x[1].indexOf(c) >= 0; }); }
    if (pmPv === "connect") {
      if (has(P.web)) m.push("WEB");
      if (has(P.sp)) m.push("SP");
      if (has(P.pv)) m.push("PV");
      return m;
    }
    if (pmPv === "comply") {
      if (has(P.val)) m.push("VAL");
      if (has(P.alr)) m.push("ALR");
      if (has(P.sc)) m.push("SC");
      return m;
    }
    if (P.im.some(function (x) { return x[1].indexOf(c) >= 0; })) m.push("IM");
    if (P.pm.some(function (x) { return x[1].indexOf(c) >= 0; })) m.push("PM");
    if (P.asn && P.asn.some(function (x) { return x[1].indexOf(c) >= 0; })) m.push("ASN");
    return m;
  }
  function pmPvSev(c) {
    var s = "";
    CCF.forEach(function (f) { if (ccDone[f.id]) return; var st = PROCESSES.retail[f.p].steps[f.st]; if (ccToks(st[1]).indexOf(c) >= 0) s = f.sev === "c" || s === "c" ? "c" : "w"; });
    return s;
  }
  function pmPvBand(c) {
    if (!PMELC[c]) return "";
    if (pmPv === "connect" || pmPv === "comply") { var n = pmPvMods(c).length; return n >= 2 ? "h" : n ? "m" : ""; }
    if (pmPv === "extend") { var o = PMOV.extend; for (var i = 0; i < o.dp.length; i++) if (o.dp[i][1].indexOf(c) >= 0) return o.dp[i][2]; return ""; }
    var s = pmPvSev(c);
    return s === "c" ? "h" : s === "w" ? "m" : pmPvMods(c).length ? "l" : "";
  }
  function pmPvCard() {
    var P = PMPV[pmK], ex = pmPv === "extend", cn = pmPv === "connect", cp = pmPv === "comply";
    function list(rows, tag) {
      return '<ul class="pp-list pv-list">' + rows.map(function (r) { return '<li><button type="button" data-pe="' + esc(r[1][0]) + '"><span class="pv-t">' + tag + '</span><span>' + esc(r[0]) + '<small>' + esc(r[1].join(", ")) + '</small></span></button></li>'; }).join("") + '</ul>';
    }
    var h = '<div class="oc pv"><div class="oc-h"><p class="pp-e">Product overlay</p><span class="oc-ill">Illustrative</span></div>' +
      (cn ? '<p class="oc-q">Partner connectivity</p><p class="oc-def">Brings partners without EDI teams onto electronic documents, on either side of the relationship.</p>'
        : cp ? '<p class="oc-q">Retail compliance for suppliers</p><p class="oc-def">Checks documents before delivery, alerts business users before a penalty, and scores compliance by retailer.</p>'
        : '<p class="oc-q">Command Center</p><p class="oc-def">Monitors each business process on the network and recommends the next action.</p>') +
      '<ol class="oc-lad pv-lad"><li><button type="button" data-pvp="connect" aria-pressed="' + cn + '"><b>Connect</b><span>Web EDI, portal and partner view</span></button></li>' +
      '<li><button type="button" data-pvp="comply" aria-pressed="' + cp + '"><b>Comply</b><span>Validation, alerts and scorecards</span></button></li>' +
      '<li><button type="button" data-pvp="optimize" aria-pressed="' + (!ex && !cn && !cp) + '"><b>Optimize</b><span>Monitors, rules and ASN checks</span></button></li>' +
      '<li><button type="button" data-pvp="extend" aria-pressed="' + ex + '"><b>Extend</b><span>Agents that act</span></button></li></ol>' +
      '<p class="oc-def pv-def">' + (cn ? "Web EDI lets suppliers answer retailer orders online. The supplier portal lets retailer and CPG hubs trade with vendors that have no EDI. Partner visibility lets a retailer or a supplier show each partner the documents they exchange."
        : cp ? "Validation holds ship notices and invoices that break a retailer rule. Alerts reach the order owner while the window is open. Scorecards track fill rate and document accuracy." : ex ? "Agents predict a problem at a decision point, recommend an action and wait for a person to approve it."
        : "Integration Monitor watches volume, timing and acknowledgments. Performance Monitor checks business rules across documents. ASN Intelligence monitors ship notice health by supplier.") + '</p>' +
      '<div class="oc-k"><b>' + (cn || cp ? "Shading: coverage" : ex ? "Shading: value at stake" : "Shading: findings now") + '</b>' +
      (cn ? '<span>' + pmBars("h") + '<span class="obw">Two or more</span></span><span>' + pmBars("m") + '<span class="obw">One</span></span>'
        : cp ? '<span>' + pmBars("h") + '<span class="obw">Two or more</span></span><span>' + pmBars("m") + '<span class="obw">One</span></span>' : ex ? '<span>' + pmBars("h", true) + '</span><span>' + pmBars("m", true) + '</span><span>' + pmBars("l", true) + '</span>'
        : '<span>' + pmBars("h") + '<span class="obw">Critical</span></span><span>' + pmBars("m") + '<span class="obw">Warning</span></span><span>' + pmBars("l") + '<span class="obw">Monitored</span></span>') + '</div>' +
      '<p class="pp-key pv-key">' + (cn ? "<b>WEB</b> Web EDI for suppliers · <b>SP</b> Supplier portal · <b>PV</b> Partner visibility" : cp ? "<b>VAL</b> Validation · <b>ALR</b> Alerts · <b>SC</b> Scorecard" : ex ? "Numbers on tiles mark agent decision points." : "<b>IM</b> Integration Monitor · <b>PM</b> Performance Monitor rule · <b>ASN</b> ASN Intelligence") + '</p>' +
      (cn || cp ? "" : '<button type="button" class="pm-btn pm-more" data-ccwip aria-label="Command Center prototype, work in progress">Try the Command Center prototype</button>') + '</div>';
    if (ex) {
      h += '<h4>Performance Monitor agents</h4><ul class="pp-list pv-list">' + PMOV.extend.dp.map(function (d, i) {
        var a = P.ag[i] || ["", ""];
        return '<li><button type="button" data-pe="' + esc(d[1][0]) + '"><span class="pv-t pv-n">' + (i + 1) + '</span><span>' + esc(d[0]) + '<small>' + esc(a[0]) + '. Approved by ' + esc(lc(a[1])) + '.</small></span></button></li>';
      }).join("") + '</ul>';
    } else if (cn) h += '<h4>Web EDI for suppliers</h4>' + list(P.web, "WEB") + '<h4>Supplier portal for retailer and CPG hubs</h4>' + list(P.sp, "SP") + (P.pv ? '<h4>Trading partner visibility (planned)</h4>' + list(P.pv, "PV") : "");
    else if (cp) h += '<h4>Pre-delivery document validation</h4>' + list(P.val, "VAL") + '<h4>Order lifecycle and chargeback alerts</h4>' + list(P.alr, "ALR") + '<h4>Fill rate and scorecard</h4>' + list(P.sc, "SC");
    else h += '<h4>Integration Monitor</h4>' + list(P.im, "IM") + '<h4>Performance Monitor rules</h4>' + list(P.pm, "PM") + (P.asn ? '<h4>ASN Intelligence (in development)</h4>' + list(P.asn, "ASN") : "");
    return h;
  }
  function pmApplyOv() {
    var pv = pmPvOn(), on = (pmOv !== "off" && pmMode === "pt") || pv;
    pmEl.classList.toggle("ov", on);
    pmEl.classList.toggle("pv", pv);
    document.getElementById("pm-ill").hidden = !on;
    document.getElementById("pm-ovt").setAttribute("aria-pressed", pmOv !== "off" ? "true" : "false");
    var pvt = document.getElementById("pm-pvt");
    pvt.hidden = !PMPV[pmK]; pvt.setAttribute("aria-pressed", pmPv !== "off" ? "true" : "false");
    document.querySelectorAll("#pm-pt .pt[data-code]").forEach(function (t) {
      var c = t.getAttribute("data-code"), b = "", d = "";
      if (pv) { b = pmPvBand(c); d = pmPv === "extend" ? pmDPs([c]).join(" · ") : pmPvMods(c).join(" "); }
      else if (on) { b = pmBand(c); d = pmOv === "extend" ? pmDPs([c]).join(" · ") : ""; }
      if (b === "x") b = "";
      t.setAttribute("data-ob", b);
      t.querySelector(".ob").innerHTML = b ? pmBars(b) : "";
      t.querySelector(".odp").textContent = d;
    });
  }
