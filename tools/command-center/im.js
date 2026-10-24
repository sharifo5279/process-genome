  /* Integration Monitor, generally available capabilities from the Innovation Guide: daily digest, transaction volume analysis,
     network graph, partner integration analysis (document types, processing errors, protocols), partner details, failed-transaction
     anomalies and Explain with Aviator. Every client gets these. Illustrative values. */
  var imBand = -1, imIa = "doc", imExplain = false, imVol = { per: "12", gr: "Day", dt: "All", pt: "All", ad: "All", st: "All", sol: "All" };
  /* Per partner, in cxPartners() order: protocol, 30-day volume, 30-day errors, top error, second address */
  var IMPT = [["AS2", 22400, 12, "Signature verification failed"], ["AS2", 18100, 41, "Signature verification failed"], ["SFTP", 9600, 6, "Invalid interchange receiver ID"],
    ["API", 7400, 3, "Duplicate control number"], ["AS2", 5200, 2, "Unknown trading partner"], ["VAN", 3100, 9, "Missing required segment"], ["AS2", 2400, 1, "Duplicate control number"],
    ["VAN", 0, 0, "None"], ["SFTP", 1800, 4, "Invalid date format"], ["AS2", 1200, 2, "Missing required segment"]];
  var IMBANDS = [["20K and above", 3, 20000], ["5K to 20K", 14, 5000], ["1K to 5K", 46, 1000], ["Under 1K", 100, 1], ["No traffic in 30 days", 45, 0]];
  function imPt(name) { var ps = cxPartners(); for (var k = 0; k < ps.length; k++) if (ps[k][0] === name) return k; return 0; }
  function imBandOf(v) { for (var b = 0; b < IMBANDS.length; b++) if (v >= IMBANDS[b][2]) return b; return IMBANDS.length - 1; }
  function imKind(k) { return k === 8 ? "carrier" : k === 9 ? "3pl" : "trade"; }
  /* Document types seen from the client: In is received, Out is sent */
  var IMDOCS = ["850", "855", "856", "810", "820", "846", "214", "940", "945"];
  function imDir(d) {
    var rcv = ccRole() === "retailer" ? ["855", "856", "810", "214", "945"] : ["850", "820", "214", "945"];
    return d === "997" ? "Both" : rcv.indexOf(d) >= 0 ? "In" : "Out";
  }
  function imCell(k, d) {
    var kind = imKind(k), inactive = cxPartners()[k][2] !== "Active";
    if (kind === "carrier") return d === "214" ? (inactive ? "i" : "a") : "";
    if (kind === "3pl") return ["940", "945", "846"].indexOf(d) >= 0 ? "a" : "";
    if (["214", "940", "945"].indexOf(d) >= 0) return "";
    if (inactive) return d === "846" ? "n" : "i";
    if (d === "846") return k % 3 === 0 ? "a" : k % 3 === 1 ? "n" : "i";
    if (d === "820") return k === 6 ? "i" : "a";
    return "a";
  }
  var IMCELL = { a: ["Active", "resolved"], i: ["Configured, no traffic in 180 days", "known"], n: ["Not configured", "new"] };

  /* Overview: daily digest card */
  CXDASH.push({ o: 5, mod: "IM", w: 6, t: "Daily digest · yesterday", h: function () {
    var ps = cxPartners();
    return '<div class="im-dg"><div class="cx-k4">' + cxKpi("Documents", "2,184", '<em class="up">↑ 4% vs prior day</em>') + cxKpi("Failed transactions", "37", "Across 9 partners") +
      cxKpi("Partners onboarded", "2", ps[6][0] + " and 1 more") + cxKpi("Anomalies detected", "3", "2 volume, 1 failed transactions") + '</div>' +
      '<table class="cx-tbl"><thead><tr><th>Top partners by volume</th><th class="n">Documents</th><th class="n">Errors</th><th>Most common error</th></tr></thead><tbody>' +
      [0, 1, 2, 3, 5].map(function (k) { return '<tr><td><button type="button" class="cx-lk" data-impt="' + cxe(ps[k][0]) + '">' + cxe(ps[k][0]) + '</button></td><td class="n">' + Math.round(IMPT[k][1] / 30).toLocaleString("en-US") + '</td><td class="n">' + Math.max(0, Math.round(IMPT[k][2] / 4)) + '</td><td>' + cxe(IMPT[k][3]) + '</td></tr>'; }).join("") + '</tbody></table>' +
      '<div class="cx-kpi cx-ka2 im-ka"><span>' + ci("spark") + 'Key analysis</span><small>Volume rose 4% on order traffic. Failed transactions doubled at ' + cxe(ps[1][0]) + ' after its signing certificate changed; the other partners stayed within their normal error range.</small></div></div>'; },
    f: function () { return '<span class="cx-note">Daily Summarizer and Explainer Agent · Generated 06:00</span>'; } });

  /* Overview: Network health. Network activity, document summary and transaction volume analysis with the refine panel */
  CXS["im-vol"] = function () {
    var ps = cxPartners(), v = imVol, seed = [v.dt, v.pt, v.ad, v.st, v.sol].filter(function (x) { return x !== "All"; }).length;
    var f = 1 / (1 + seed * 1.6), n = v.per === "1" ? 30 : v.per === "24" ? 24 : 12;
    var base = v.per === "1" ? [138, 142, 151, 147, 98, 76, 140, 149, 155, 152, 150, 101, 79, 146, 158, 161, 157, 153, 104, 81, 149, 160, 166, 163, 158, 107, 84, 155, 164, 169]
      : v.per === "24" ? [3410, 3480, 3520, 3600, 3550, 3490, 3620, 3700, 3760, 3740, 3800, 3790, 3820, 3960, 4100, 4120, 4010, 3890, 4240, 4380, 4510, 4460, 4620, 4590]
      : [3820, 3960, 4100, 4120, 4010, 3890, 4240, 4380, 4510, 4460, 4620, 4590];
    var wk = v.gr === "Week" ? 7 : 1, vals = base.map(function (x) { return Math.round(x * f * wk); }), mx = Math.max.apply(null, vals);
    var xl = v.per === "1" ? vals.map(function (_, i) { return i % 5 === 0 ? "Day " + (i + 1) : ""; })
      : v.per === "24" ? ["Nov", "", "Jan", "", "Mar", "", "May", "", "Jul", "", "Sep", "", "Nov", "", "Jan", "", "Mar", "", "May", "", "Jul", "", "Sep", ""] : ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
    function sel(key, label, opts) { return '<label class="ws-f"><span>' + label + '</span><select data-imvol="' + key + '">' + ["All"].concat(opts).map(function (o) { return '<option' + (o === v[key] ? " selected" : "") + '>' + cxe(o) + '</option>'; }).join("") + '</select></label>'; }
    function seg(key, opts) { return opts.map(function (o) { return '<button type="button" data-imseg="' + key + ':' + o[0] + '" aria-pressed="' + (v[key] === o[0]) + '">' + o[1] + '</button>'; }).join(""); }
    var addr = ps.slice(0, 6).map(function (p) { return "ZZ:" + p[1]; });
    var mix = [["Purchase order (850)", 34], ["Functional acknowledgment (997)", 27], ["Ship notice (856)", 14], ["Invoice (810)", 12], ["Order acknowledgment (855)", 8], ["Remittance advice (820)", 5]];
    var by = function (o) { return CXDASH.filter(function (c) { return c.o === o; })[0]; };
    return cxOvHead() + '<div class="cx-dg im-nh">' + cxDc(by(10), 3) + cxDc(by(70), 3) + '</div><div class="im-vol"><aside class="cx-card im-ref"><header><h3>Refine</h3></header>' +
      sel("dt", "Document type", ["850", "855", "856", "810", "820", "997"]) + sel("pt", "Trading partner", ps.map(function (p) { return p[0]; })) + sel("ad", "EDI address", addr) +
      sel("st", "Document standard", ["X12", "EDIFACT", "XML"]) + sel("sol", "Solution ID", ["SOL-RET-01", "SOL-RET-02", "SOL-LOG-01"]) +
      (seed ? '<button type="button" class="cx-btn" data-imclear>Clear refinements</button>' : "") + '</aside><div>' +
      cxCard("Transaction volume", '<nav class="ws-lens" aria-label="Period"><span>Period</span>' + seg("per", [["1", "1 month"], ["12", "12 months"], ["24", "24 months"]]) + '<span class="im-gap">By</span>' + seg("gr", [["Day", "Day"], ["Week", "Week"]]) + '</nav>' +
        cxLine([{ v: vals, area: true }], { w: 860, h: 240, min: 0, max: Math.ceil(mx * 1.2 / 100) * 100, xl: xl, label: "Transaction volume" }) +
        '<p class="cx-note">' + (seed ? seed + " refinement" + (seed > 1 ? "s" : "") + " applied · " : "All traffic · ") + "Documents per " + v.gr.toLowerCase() + ", " + (v.per === "1" ? "last 30 days" : "last " + v.per + " months") + '</p>') +
      cxCard("By document type", cxBars(mix.map(function (m) { return [m[0], m[1], "", "b"]; }), { max: 40, fmt: function (x) { return x + "%"; } })) + '</div></div>';
  };

  /* Partners: network graph and partner integration analysis */
  CXPTAB.push({ k: "graph", n: "Network graph", t: "im", h: function () {
    var ps = cxPartners(), X = 380, Y = 240, R = 175, svg = '<svg class="im-ng" viewBox="0 0 760 460" role="img" aria-label="Trading community by transaction volume band">';
    IMBANDS.forEach(function (b, i) {
      var a = (-90 + i * 72) * Math.PI / 180, x = X + R * Math.cos(a), y = Y + R * Math.sin(a), r = 14 + Math.sqrt(b[1]) * 3.4, on = imBand === i;
      var x0 = X + 56 * Math.cos(a), y0 = Y + 56 * Math.sin(a), x1 = x - r * Math.cos(a), y1 = y - r * Math.sin(a);
      svg += '<line x1="' + x0.toFixed(1) + '" y1="' + y0.toFixed(1) + '" x2="' + x1.toFixed(1) + '" y2="' + y1.toFixed(1) + '" class="im-sp' + (on ? " on" : "") + '"/>' +
        '<g class="im-bn' + (on ? " on" : "") + (i === 4 ? " idle" : "") + '" data-imband="' + i + '" role="button" tabindex="0" aria-label="' + b[0] + ', ' + b[1] + ' partners"><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(1) + '"/>' +
        '<text x="' + x.toFixed(1) + '" y="' + (y + 5).toFixed(1) + '" text-anchor="middle" class="im-bv">' + b[1] + '</text><text x="' + x.toFixed(1) + '" y="' + (i === 0 ? y - r - 8 : y + r + 16).toFixed(1) + '" text-anchor="middle" class="im-bl">' + b[0] + '</text></g>';
    });
    svg += '<circle cx="' + X + '" cy="' + Y + '" r="56" class="im-me"/><text x="' + X + '" y="' + (Y - 2) + '" text-anchor="middle" class="im-mt">' + cxe(ccCompany()) + '</text><text x="' + X + '" y="' + (Y + 14) + '" text-anchor="middle" class="im-ms">208 partners</text></svg>';
    var list = imBand < 0 ? "" : ps.map(function (p, k) { return [p, k]; }).filter(function (x) { return imBandOf(IMPT[x[1]][1]) === imBand; });
    var side = imBand < 0 ? '<p class="cx-sub">Partners grouped by documents exchanged in the last 30 days. Select a band to open its partners.</p><ul class="cx-lg">' + IMBANDS.map(function (b) { return '<li>' + b[0] + '<b>' + b[1] + '</b></li>'; }).join("") + '</ul>'
      : '<button type="button" class="cx-lk" data-imband="-1">' + ci("chev", "im-back") + 'All bands</button><h4 class="cx-sh">' + IMBANDS[imBand][0] + ' · ' + IMBANDS[imBand][1] + ' partners</h4><ul class="im-pl">' +
        list.map(function (x) { return '<li><button type="button" class="cx-lk" data-impt="' + cxe(x[0][0]) + '">' + cxe(x[0][0]) + '</button><small>' + IMPT[x[1]][1].toLocaleString("en-US") + ' documents · ' + IMPT[x[1]][0] + '</small></li>'; }).join("") + '</ul><p class="cx-note">Showing ' + list.length + ' of ' + IMBANDS[imBand][1] + '</p>';
    return '<div class="cx-g21">' + cxCard("Network graph", svg) + cxCard(imBand < 0 ? "Volume bands" : "Band partners", side) + '</div>';
  } });
  CXPTAB.push({ k: "int", n: "Integration analysis", t: "im", h: function () {
    var ps = cxPartners(), nav = '<nav class="ws-lens" aria-label="Analysis"><span>View</span>' + [["doc", "Document types"], ["err", "Processing errors"], ["pro", "Protocols"]].map(function (t) { return '<button type="button" data-imia="' + t[0] + '" aria-pressed="' + (imIa === t[0]) + '">' + t[1] + '</button>'; }).join("") + '</nav>';
    if (imIa === "err") {
      var rows = ps.map(function (p, k) { return [p, k]; }).filter(function (x) { return IMPT[x[1]][2] > 0; }).sort(function (a, b) { return IMPT[b[1]][2] - IMPT[a[1]][2]; });
      return nav + cxCard("Transaction processing errors, last 30 days", '<table class="cx-tbl"><thead><tr><th>Partner</th><th class="n">Errors</th><th class="n">Error rate</th><th>Most common error</th><th>Protocol</th></tr></thead><tbody>' + rows.map(function (x) {
        var e = IMPT[x[1]]; return '<tr><td><button type="button" class="cx-lk" data-impt="' + cxe(x[0][0]) + '">' + cxe(x[0][0]) + '</button></td><td class="n">' + e[2] + '</td><td class="n">' + (100 * e[2] / Math.max(1, e[1])).toFixed(2) + '%</td><td>' + cxe(e[3]) + '</td><td>' + e[0] + '</td></tr>'; }).join("") + '</tbody></table>');
    }
    if (imIa === "pro") {
      var pro = [["AS2", 96], ["VAN", 52], ["SFTP", 38], ["API", 14], ["Web forms", 8]];
      return nav + '<div class="cx-g2">' + cxCard("Partners by protocol", cxBars(pro.map(function (p) { return [p[0], p[1], "", "b"]; }), { max: 100 })) +
        cxCard("Partners shown", '<table class="cx-tbl"><thead><tr><th>Partner</th><th>Protocol</th><th>EDI address</th></tr></thead><tbody>' + ps.map(function (p, k) { return '<tr><td><button type="button" class="cx-lk" data-impt="' + cxe(p[0]) + '">' + cxe(p[0]) + '</button></td><td>' + IMPT[k][0] + '</td><td><code>ZZ:' + p[1] + '</code></td></tr>'; }).join("") + '</tbody></table>') + '</div>';
    }
    return nav + cxCard("Document type analysis", '<p class="cx-sub">Configuration status by partner, document type and direction.</p><div class="im-mx"><table class="cx-tbl"><thead><tr><th>Partner</th>' + IMDOCS.map(function (d) { return '<th class="c">' + d + '<small>' + imDir(d) + '</small></th>'; }).join("") + '</tr></thead><tbody>' +
      ps.map(function (p, k) { return '<tr><td><button type="button" class="cx-lk" data-impt="' + cxe(p[0]) + '">' + cxe(p[0]) + '</button></td>' + IMDOCS.map(function (d) { var c = imCell(k, d); return '<td class="c">' + (c ? '<i class="im-c ' + c + '" title="' + IMCELL[c][0] + '"></i>' : '<span class="im-na">·</span>') + '</td>'; }).join("") + '</tr>'; }).join("") +
      '</tbody></table></div><ul class="cx-lg row"><li><i class="im-c a"></i>Active</li><li><i class="im-c i"></i>Configured, no traffic in 180 days</li><li><i class="im-c n"></i>Not configured</li><li><span class="im-na">·</span> Not exchanged with this partner type</li></ul>');
  } });

  /* Partner details panel */
  var imBaseDrawer = cxDrawer;
  cxDrawer = function () {
    if (!ccDr || ccDr[0] !== "pt") return imBaseDrawer();
    var ps = cxPartners(), k = imPt(ccDr[1]), p = ps[k], e = IMPT[k], docs = IMDOCS.filter(function (d) { return imCell(k, d); });
    var a1 = "ZZ:" + p[1], a2 = "01:" + (100000000 + k * 7316451), split = e[1] ? [Math.round(e[1] * 0.78), e[1] - Math.round(e[1] * 0.78)] : [0, 0];
    var h = '<header><span><p>Partner details</p><h3>' + cxe(p[0]) + '</h3></span><button type="button" class="cx-ic" data-cxclose aria-label="Close">' + ci("x") + '</button></header><div class="cx-db">' +
      '<dl class="cx-dl"><div><dt>Status</dt><dd>' + p[2] + '</dd></div><div><dt>Alias</dt><dd><code>' + p[1] + '</code></dd></div><div><dt>Protocol</dt><dd>' + e[0] + '</dd></div><div><dt>Onboarded</dt><dd>' + p[4] + '</dd></div><div><dt>Last activity</dt><dd>' + p[5] + '</dd></div></dl>' +
      '<h4>EDI addresses</h4><table class="cx-tbl"><thead><tr><th>Address</th><th>Protocol</th><th class="n">Documents, 30 days</th></tr></thead><tbody><tr><td><code>' + a1 + '</code></td><td>' + e[0] + '</td><td class="n">' + split[0].toLocaleString("en-US") + '</td></tr><tr><td><code>' + a2 + '</code></td><td>' + e[0] + '</td><td class="n">' + split[1].toLocaleString("en-US") + '</td></tr></tbody></table>' +
      '<h4>Document relationships</h4><table class="cx-tbl"><thead><tr><th>Document</th><th>Direction</th><th>Status</th></tr></thead><tbody>' + docs.map(function (d) { var c = imCell(k, d); return '<tr><td><code>' + d + '</code></td><td>' + imDir(d) + '</td><td><span class="cx-st s-' + IMCELL[c][1] + '"><i></i>' + IMCELL[c][0] + '</span></td></tr>'; }).join("") + '</tbody></table>' +
      '<h4>Transaction processing errors, 30 days</h4>' + (e[2] ? '<p><b>' + e[2] + '</b> errors. Most common: ' + cxe(e[3]) + '.</p>' : '<p>No processing errors.</p>') +
      '<h4>Volume by EDI address, 6 months</h4>' + cxLine([{ v: [0.82, 0.88, 0.91, 0.95, 0.97, 1].map(function (x) { return Math.round(split[0] * x); }) }, { v: [0.9, 0.86, 0.95, 1.02, 0.98, 1].map(function (x) { return Math.round(split[1] * x); }), c: "b2" }], { w: 440, h: 160, xl: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"], label: "Volume by EDI address" }) +
      '<ul class="cx-lg row"><li><i style="background:var(--pa)"></i>' + a1 + '</li><li><i style="background:#001889"></i>' + a2 + '</li></ul></div>';
    return '<div class="cx-scrim" data-cxclose></div><aside class="cx-dr" role="dialog" aria-modal="true">' + h + '</aside>';
  };

  cx.addEventListener("click", function (e) {
    var b = e.target.closest("[data-impt],[data-imband],[data-imia],[data-imseg],[data-imclear],[data-imexplain]"); if (!b) return;
    if (b.hasAttribute("data-impt")) ccDr = ["pt", b.getAttribute("data-impt")];
    else if (b.hasAttribute("data-imband")) imBand = +b.getAttribute("data-imband");
    else if (b.hasAttribute("data-imia")) imIa = b.getAttribute("data-imia");
    else if (b.hasAttribute("data-imseg")) { var s = b.getAttribute("data-imseg").split(":"); imVol[s[0]] = s[1]; }
    else if (b.hasAttribute("data-imclear")) { ["dt", "pt", "ad", "st", "sol"].forEach(function (k) { imVol[k] = "All"; }); }
    else if (b.hasAttribute("data-imexplain")) imExplain = !imExplain;
    cxRender();
  });
  cx.addEventListener("keydown", function (e) { var g = e.target.closest && e.target.closest("[data-imband]"); if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); imBand = +g.getAttribute("data-imband"); cxRender(); } });
  cx.addEventListener("change", function (e) { if (e.target.matches("[data-imvol]")) { imVol[e.target.getAttribute("data-imvol")] = e.target.value; cxRender(); } });
