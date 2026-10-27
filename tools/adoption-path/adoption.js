/* Adoption path: C, A, O, E letters on the steps, and the retail opportunity animation after them.
   Runs after the solution page renders (wraps window.TGR_RENDER); retail only, where the adoption path exists. */
(function () {
  var NS = "http://www.w3.org/2000/svg";
  // each stage: letter, name, and the lever that lifts client value at that stage (two lines)
  // letter, name, lever (two lines), today's client value, retail opportunity on top, growth over time above that
  // (illustrative units). Today's value is highest at Connect and falls through Extend. The opportunity is small at
  // Connect, largest at Activate, smaller at Optimize and smaller again at Extend. Growth over time is least at Connect,
  // medium at Activate and Optimize, and largest at Extend, with AI.
  var LEVERS = [
    ["C", "Connect", "Faster onboarding,", "better partner processes", 100, 10, 8, "Opportunity"],
    ["A", "Activate", "More business processes", "running per partner", 45, 120, 40, "Largest opportunity"],
    ["O", "Optimize", "Exceptions caught", "before chargebacks", 20, 55, 45, "Grows over time"],
    ["E", "Extend", "Agents that predict", "and recommend actions", 6, 30, 92, "Most growth, with AI"]
  ];
  var X0 = 70, X1 = 980, YB = 350, ZW = (X1 - X0) / 4, K = 1.4, CW = 112;
  function cx(i) { return X0 + ZW * i + ZW / 2; }

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
      '<p class="opx-sub">Today most client value comes from Connect. A retail focus adds value at every stage, the most at Activate. Over time, Extend grows the most, with AI.</p>' +
      '<div class="opx-box"><div class="opx-bar"><ul class="opx-lg"><li><i class="b"></i>Today&#39;s client value</li><li><i class="g b"></i>Retail opportunity</li><li><i class="f b"></i>Growth over time</li></ul>' +
      '<div class="opx-acts"><span class="opx-ill">Illustrative</span><button type="button" class="opx-play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg><span>Replay animation</span></button></div></div>' +
      '<div class="opx-cw"></div></div><p class="opx-nt">Shape is illustrative, not measured data. Some capabilities shown are in development or planned.</p></div>';
    var svg = el("svg", { "class": "opx-c", viewBox: "0 0 1000 470", role: "img",
      "aria-label": "Client value by stage. Today's value is highest at Connect and lower at Activate, Optimize and Extend. A retail focus adds value at every stage: a little at Connect, the most at Activate, less at Optimize and less again at Extend, and value grows over time at every stage, the most at Extend with AI." });
    // zones and axis
    for (var i = 1; i < 4; i++) svg.appendChild(el("line", { "class": "zl", x1: X0 + i * ZW, y1: 30, x2: X0 + i * ZW, y2: YB + 112 }));
    svg.appendChild(el("path", { "class": "ax", d: "M" + X0 + " 24V" + YB + "H" + X1 }));
    svg.appendChild(el("path", { "class": "ax", d: "M" + (X0 - 6) + " 32L" + X0 + " 22L" + (X0 + 6) + " 32" }));
    svg.appendChild(el("text", { "class": "yl", x: "0", y: "0", transform: "translate(40 " + (YB - 4) + ") rotate(-90)" }, "Client value"));
    // columns: today below, opportunity stacked on top
    var cols = LEVERS.map(function (L, i) {
      var x = cx(i) - CW / 2, t = el("rect", { "class": "ct", x: x, y: YB, width: CW, height: "0" }),
        g = el("rect", { "class": "cg", x: x, y: YB - L[4] * K, width: CW, height: "0" }),
        top = YB - (L[4] + L[5] + L[6]) * K,
        f = L[6] ? el("rect", { "class": "cf fd", x: x + 1, y: top, width: CW - 2, height: (L[6] * K).toFixed(1) }) : null,
        lab = el("text", { "class": (L[6] ? "cfl" : "cgl") + " fd", x: cx(i), y: top - 10, "text-anchor": "middle" }, L[7]);
      svg.appendChild(t); svg.appendChild(g); if (f) svg.appendChild(f); svg.appendChild(lab);
      return { t: t, g: g, f: f, lab: lab, L: L };
    });
    // stage labels under the axis: big letter, name, and the lever (revealed with its column)
    var levs = LEVERS.map(function (L, i) {
      var zl = X0 + ZW * i;
      svg.appendChild(el("text", { "class": "zL", x: zl + 14, y: YB + 74, "text-anchor": "start" }, L[0]));
      svg.appendChild(el("text", { "class": "zn", x: zl + 74, y: YB + 34, "text-anchor": "start" }, L[1]));
      var g = el("g", { "class": "lv" });
      g.appendChild(el("text", { "class": "k", x: zl + 74, y: YB + 56 }, "Opportunity"));
      g.appendChild(el("rect", { "class": "ob", x: zl + 156, y: YB + 47, width: Math.max(10, 64 * L[5] / 120).toFixed(1), height: "10", rx: "5" }));
      g.appendChild(el("text", { "class": "d", x: zl + 74, y: YB + 78 }, L[2]));
      g.appendChild(el("text", { "class": "d", x: zl + 74, y: YB + 96 }, L[3]));
      svg.appendChild(g);
      return g;
    });
    // closing callout, top right above Optimize and Extend
    var cl = el("g", { "class": "cl fd" });
    cl.appendChild(el("rect", { x: "84", y: "26", width: "330", height: "58", rx: "12" }));
    cl.appendChild(el("text", { "class": "h", x: "102", y: "50", "data-dx": 18 }, "Retail opportunity"));
    cl.appendChild(el("text", { "class": "s", x: "102", y: "71", "data-dx": 18 }, "Largest at Activate today. Extend grows the most over time, with AI."));
    svg.appendChild(cl);
    sec.querySelector(".opx-cw").appendChild(svg);
    return { sec: sec, svg: svg, cols: cols, levs: levs, cl: cl };
  }

  var V = null, timers = [], raf = 0, played = false;
  function stop() { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); }
  function setT(c, f) { var h = c.L[4] * K * f; c.t.setAttribute("y", (YB - h).toFixed(1)); c.t.setAttribute("height", h.toFixed(1)); }
  function setG(c, f) { var b = YB - c.L[4] * K, h = c.L[5] * K * f; c.g.setAttribute("y", (b - h).toFixed(1)); c.g.setAttribute("height", h.toFixed(1)); }
  function fitCallout() {
    var ts = V.cl.querySelectorAll("text"), r = V.cl.querySelector("rect"), w = 0;
    ts.forEach(function (t) { var l = 0; try { l = t.getComputedTextLength(); } catch (e) {} w = Math.max(w, l || t.textContent.length * 7.1); });
    w = Math.ceil(w + 36); var x = X1 - 4 - w; r.setAttribute("width", w); r.setAttribute("x", x);
    ts.forEach(function (t) { t.setAttribute("x", x + (+t.getAttribute("data-dx"))); });
  }
  function tween(ms, f, done) {
    var t0 = null;
    (function step(ts) { if (t0 == null) t0 = ts; var p = Math.max(0, Math.min(1, (ts - t0) / ms)), e = 1 - Math.pow(1 - p, 3);
      f(e); if (p < 1) raf = requestAnimationFrame(step); else if (done) done(); })(performance.now());
  }
  function all() { return V.levs.concat(V.cols.map(function (c) { return c.lab; }), V.cols.filter(function (c) { return c.f; }).map(function (c) { return c.f; }), [V.cl]); }
  function finalState() {
    stop(); fitCallout();
    V.cols.forEach(function (c) { setT(c, 1); setG(c, 1); });
    all().forEach(function (g) { g.classList.add("on"); });
  }
  function play() {
    stop(); fitCallout();
    V.cols.forEach(function (c) { setT(c, 0); setG(c, 0); });
    all().forEach(function (g) { g.classList.remove("on"); });
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) { finalState(); return; }
    // 1. today's columns rise together; Connect's label and lever show
    tween(1100, function (e) { V.cols.forEach(function (c) { setT(c, e); }); }, function () {
      // 2. the opportunity stacks on each stage in turn; 3. growth over time on Optimize and Extend; 4. the callout
      var i = 0;
      (function next() {
        if (i > 3) {
          timers.push(setTimeout(function () {
            V.cols.forEach(function (c) { if (c.f) { c.f.classList.add("on"); c.lab.classList.add("on"); } });
            timers.push(setTimeout(function () { V.cl.classList.add("on"); }, 500));
          }, 300));
          return;
        }
        var c = V.cols[i], lv = V.levs[i];
        timers.push(setTimeout(function () {
          tween(i ? 800 : 500, function (e) { setG(c, e); }, function () { if (!c.f) c.lab.classList.add("on"); lv.classList.add("on"); i++; next(); });
        }, 220));
      })();
    });
  }

  function opportunity(k) {
    var model = document.getElementById("mk-model");
    if (!model) return;
    if (!V) {
      V = build();
      model.parentNode.insertBefore(V.sec, model.nextSibling);
      V.sec.querySelector(".opx-play").addEventListener("click", function () { played = true; play(); });
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (es, ob) {
          es.forEach(function (e) { if (e.isIntersecting && !played && !V.sec.hidden) { played = true; ob.disconnect(); play(); } });
        }, { threshold: 0.45 }).observe(V.sec.querySelector(".opx-box"));
      } else { played = true; finalState(); }
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
