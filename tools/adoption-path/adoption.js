/* Adoption path: C, A, O, E letters on the steps, and the retail opportunity animation after them.
   Runs after the solution page renders (wraps window.TGR_RENDER); retail only, where the adoption path exists. */
(function () {
  var NS = "http://www.w3.org/2000/svg";
  var LEVERS = [
    ["C", "Connect", "Faster onboarding, better partner processes"],
    ["A", "Activate", "More processes running per partner"],
    ["O", "Optimize", "Exceptions caught before chargebacks"],
    ["E", "Extend", "Agents that predict and recommend actions"]
  ];
  var X0 = 70, X1 = 980, YB = 350, ZW = (X1 - X0) / 4;
  var TODAY = "M70 96 C150 100 230 112 282 140 C312 156 330 230 348 268 C366 300 420 300 520 304 C580 306 610 322 650 326 C700 330 740 334 780 336 C860 340 920 342 980 344";
  var RETAIL = "M70 76 C200 90 300 112 420 140 C520 162 620 190 720 210 C820 228 900 236 980 240";
  // lever label boxes: x, y, width; the dot sits on the retail line at the zone centre
  var BOX = [[84, 18, 236], [352, 196, 236], [540, 252, 236], [664, 148, 236]];

  function letters() {
    var sec = document.getElementById("mk-model");
    if (!sec) return;
    sec.classList.add("mdl-x");
    sec.querySelectorAll(".mdl-h b").forEach(function (b) {
      var sp = b.querySelector("span"), t = b.textContent.replace(sp ? sp.textContent : "", "").trim();
      if (sp && t) { sp.textContent = t.charAt(0).toUpperCase(); sp.setAttribute("aria-hidden", "true"); }
    });
  }

  function el(tag, attrs, text) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }

  function build() {
    var sec = document.createElement("section");
    sec.className = "opx"; sec.id = "mk-opp"; sec.setAttribute("aria-labelledby", "mk-h-opp");
    sec.innerHTML = '<div class="wrap"><p class="mk-eb">Retail opportunity</p><h2 id="mk-h-opp">Retail adoption opportunity</h2>' +
      '<p class="opx-sub">Today most clients stop after Connect. A retail focus moves more of them through Activate, Optimize and Extend, where client value grows.</p>' +
      '<div class="opx-box"><div class="opx-bar"><ul class="opx-lg"><li><i></i>Today&#39;s go-to-market motion</li><li><i class="g"></i>Retail-focused motion</li><li><i class="a"></i>Opportunity</li></ul>' +
      '<div class="opx-acts"><span class="opx-ill">Illustrative</span><button type="button" class="opx-play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg><span>Replay animation</span></button></div></div>' +
      '<div class="opx-cw"></div></div><p class="opx-nt">Shape is illustrative, not measured data. Some capabilities shown are in development or planned.</p></div>';
    var svg = el("svg", { "class": "opx-c", viewBox: "0 0 1000 432", role: "img",
      "aria-label": "Today's go-to-market motion falls steeply after Connect. A retail-focused motion keeps more clients moving through Activate, Optimize and Extend; the gap between the two lines is the opportunity." });
    var defs = el("defs", {});
    var pat = el("pattern", { id: "opx-hatch", width: "8", height: "8", patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" });
    pat.appendChild(el("rect", { width: "8", height: "8", style: "fill: var(--opp); opacity: .10" }));
    pat.appendChild(el("line", { x1: "0", y1: "0", x2: "0", y2: "8", style: "stroke: var(--opp); stroke-width: 2.5; opacity: .45" }));
    defs.appendChild(pat);
    var clip = el("clipPath", { id: "opx-clip" }), crect = el("rect", { x: X0, y: "0", width: "0", height: "432" });
    clip.appendChild(crect); defs.appendChild(clip); svg.appendChild(defs);
    // zones and axis
    for (var i = 1; i < 4; i++) svg.appendChild(el("line", { "class": "zl", x1: X0 + i * ZW, y1: 30, x2: X0 + i * ZW, y2: YB }));
    svg.appendChild(el("path", { "class": "ax", d: "M" + X0 + " 24V" + YB + "H" + X1 }));
    var yl = el("text", { "class": "yl", x: "0", y: "0", transform: "translate(40 " + (YB - 4) + ") rotate(-90)" }, "Clients reaching each stage");
    svg.appendChild(yl);
    LEVERS.forEach(function (L, i) {
      var cx = X0 + ZW * i + ZW / 2;
      svg.appendChild(el("text", { "class": "zL", x: cx - 40, y: YB + 72 }, L[0]));
      svg.appendChild(el("text", { "class": "zn", x: cx + 20, y: YB + 50 }, L[1]));
    });
    // gap, then lines on top
    var gap = el("polygon", { "class": "gap", "clip-path": "url(#opx-clip)" });
    svg.appendChild(gap);
    var lt = el("path", { "class": "ln t", d: TODAY }), lg = el("path", { "class": "ln g", d: RETAIL });
    svg.appendChild(lt); svg.appendChild(lg);
    var tt = el("text", { "class": "tag t fd", x: "92", y: "136" }, "Today");
    var tg = el("text", { "class": "tag g fd", x: X1, y: "226", "text-anchor": "end" }, "Retail focus");
    svg.appendChild(tt); svg.appendChild(tg);
    // levers
    var levs = LEVERS.map(function (L, i) {
      var b = BOX[i], g = el("g", { "class": "lv" });
      g.appendChild(el("rect", { x: b[0], y: b[1], width: b[2], height: "46", rx: "10" }));
      g.appendChild(el("text", { "class": "k", x: b[0] + 14, y: b[1] + 19, "data-dx": 14 }, L[0] + " · " + L[1]));
      g.appendChild(el("text", { "class": "d", x: b[0] + 14, y: b[1] + 36, "data-dx": 14 }, L[2]));
      svg.appendChild(g);
      return g;
    });
    // closing callout
    var cl = el("g", { "class": "cl fd" });
    cl.appendChild(el("rect", { x: "590", y: "36", width: "380", height: "62", rx: "12" }));
    cl.appendChild(el("text", { "class": "h", x: "608", y: "62", "data-dx": 18 }, "Retail opportunity"));
    cl.appendChild(el("text", { "class": "s", x: "608", y: "84", "data-dx": 18 }, "More clients reach Optimize and Extend, where value compounds."));
    svg.appendChild(cl);
    sec.querySelector(".opx-cw").appendChild(svg);
    return { sec: sec, svg: svg, gap: gap, crect: crect, lt: lt, lg: lg, tt: tt, tg: tg, levs: levs, cl: cl };
  }

  var V = null, timers = [], raf = 0, played = false;
  function stop() { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); }
  function draw(path, ms, done) {
    var L = path.getTotalLength(), t0 = null;
    path.style.strokeDasharray = L; path.style.strokeDashoffset = L;
    (function step(ts) { if (t0 == null) t0 = ts; var p = Math.min(1, (ts - t0) / ms), e = 1 - Math.pow(1 - p, 3);
      path.style.strokeDashoffset = L * (1 - e); if (p < 1) raf = requestAnimationFrame(step); else if (done) done(); })(performance.now());
  }
  function geometry() {
    function pts(p, n) { var L = p.getTotalLength(), a = []; for (var i = 0; i <= n; i++) { var q = p.getPointAtLength(L * i / n); a.push(q.x.toFixed(1) + "," + q.y.toFixed(1)); } return a; }
    V.gap.setAttribute("points", pts(V.lg, 120).concat(pts(V.lt, 160).reverse()).join(" "));
    // size each label box to its text; the Extend box and the callout keep their right edge at the plot edge
    function fit(g, right) {
      var ts = g.querySelectorAll("text"), r = g.querySelector("rect"), w = 0;
      ts.forEach(function (t) { var l = 0; try { l = t.getComputedTextLength(); } catch (e) {} w = Math.max(w, l || t.textContent.length * 7.1); });
      w = Math.ceil(w + 28); r.setAttribute("width", w);
      if (right) { var x = right - w; r.setAttribute("x", x); ts.forEach(function (t) { t.setAttribute("x", x + (+t.getAttribute("data-dx"))); }); }
    }
    V.levs.forEach(function (g, i) { fit(g, i === 3 ? X1 - 4 : 0); });
    fit(V.cl, X1 - 4);
    // pin a dot from each lever box to the retail line at its zone centre
    V.levs.forEach(function (g, i) {
      if (g.querySelector("circle")) return;
      var cx = X0 + ZW * i + ZW / 2, L = V.lg.getTotalLength(), lo = 0, hi = L;
      for (var k = 0; k < 30; k++) { var m = (lo + hi) / 2; if (V.lg.getPointAtLength(m).x < cx) lo = m; else hi = m; }
      var q = V.lg.getPointAtLength(lo), b = BOX[i], by = q.y < b[1] ? b[1] : b[1] + 46;
      g.insertBefore(el("line", { x1: cx, y1: q.y, x2: cx, y2: by, style: "stroke: var(--opp); stroke-width: 1.5" }), g.firstChild);
      g.appendChild(el("circle", { cx: cx, cy: q.y, r: "5" }));
    });
  }
  function finalState() {
    stop();
    [V.lt, V.lg].forEach(function (p) { p.style.strokeDasharray = ""; p.style.strokeDashoffset = ""; });
    V.crect.setAttribute("width", X1 - X0);
    V.levs.concat([V.tt, V.tg, V.cl]).forEach(function (g) { g.classList.add("on"); });
  }
  function play() {
    stop(); geometry();
    V.crect.setAttribute("width", "0");
    V.levs.concat([V.tt, V.tg, V.cl]).forEach(function (g) { g.classList.remove("on"); });
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) { finalState(); return; }
    draw(V.lt, 1300, function () {
      V.tt.classList.add("on");
      timers.push(setTimeout(function () {
        draw(V.lg, 1300, function () {
          V.tg.classList.add("on");
          var t0 = null, ms = 3200, shown = 0;
          (function sweep(ts) {
            if (t0 == null) t0 = ts;
            var p = Math.min(1, (ts - t0) / ms), w = (X1 - X0) * p;
            V.crect.setAttribute("width", w.toFixed(1));
            while (shown < 4 && w >= ZW * shown + ZW * 0.35) V.levs[shown++].classList.add("on");
            if (p < 1) raf = requestAnimationFrame(sweep);
            else timers.push(setTimeout(function () { V.cl.classList.add("on"); }, 300));
          })(performance.now());
        });
      }, 350));
    });
  }

  function opportunity(k) {
    var model = document.getElementById("mk-model");
    if (!model) return;
    if (!V) {
      V = build();
      model.parentNode.insertBefore(V.sec, model.nextSibling);
      geometry();
      [V.lt, V.lg].forEach(function (p) { var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
      V.sec.querySelector(".opx-play").addEventListener("click", function () { played = true; play(); });
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (es, ob) {
          es.forEach(function (e) { if (e.isIntersecting && !played && !V.sec.hidden) { played = true; ob.disconnect(); play(); } });
        }, { threshold: 0.45 }).observe(V.sec.querySelector(".opx-box"));
      } else { played = true; geometry(); finalState(); }
    }
    V.sec.hidden = k !== "retail" || model.hidden;
  }

  function enhance(k) { try { letters(); opportunity(k); } catch (e) { if (window.console) console.error("adoption path", e); } }
  var orig = window.TGR_RENDER;
  if (typeof orig === "function") {
    window.TGR_RENDER = function (k) { var r = orig.apply(this, arguments); enhance(k); return r; };
    if (window.TGR_K) enhance(window.TGR_K);
  }
})();
