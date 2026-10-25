  /* Overview ring in WebGL (three.js, served next to this page). The SVG keeps the labels, process strands and ribbons;
     three.js draws the state ring and the document particles behind them. Without WebGL the SVG ring stays. */
  var GL = { on: false, cv: null, T: null, r: null, s: null, cam: null, ring: null, pts: null, sp: null, seg: [], t0: 0, raf: 0, key: "", mode: "ring", X: null, gs: null, gcam: null, gg: null, gkey: "", gp: [], beads: [], comp: null, host: null };
  var GLX = 548, GLY = 270, GLR = 128, GLW = 820, GLH = 560;
  function glDark() { var t = document.documentElement.getAttribute("data-theme"); return t === "dark" || (!t && window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches); }
  function glState() {
    var tot = 0, ok = 0, rk = 0, br = 0; ccSol().forEach(function (i) { var F = ccFlow(i); tot += F.n; ok += F.ok; rk += F.risk; br += F.br; });
    return [[ok, 0x2F6BFF], [rk, 0xF4B740], [br, 0xE5484D]].map(function (x) { return [Math.max(360 * x[0] / tot, 7), x[1]]; });
  }
  function glBuild() {
    var THREE = GL.T, S = glState(), key = S.map(function (x) { return x[0].toFixed(1); }).join("|") + (glDark() ? "d" : "l");
    if (GL.key === key && GL.ring) return;
    GL.key = key;
    if (GL.ring) { GL.s.remove(GL.ring); GL.s.remove(GL.pts); }
    var ring = new THREE.Group(), at = -96, gap = 2.6;
    GL.seg = [];
    S.forEach(function (sg, k) {
      var span = sg[0], a0 = at + gap / 2, len = span - gap, col = new THREE.Color(sg[1]);
      var m = new THREE.Mesh(new THREE.TorusGeometry(GLR, [5, 8, 9][k] * 0.62, 20, Math.max(24, Math.round(len * 1.4)), len * Math.PI / 180),
        new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: glDark() ? 0.75 : 0.35, metalness: 0.35, roughness: 0.28 }));
      m.rotation.z = -(a0 + len) * Math.PI / 180;     /* SVG angles run clockwise with y down */
      ring.add(m); GL.seg.push([a0, a0 + len, col]); at += span;
    });
    var glass = new THREE.Mesh(new THREE.TorusGeometry(GLR + 18, 1.1, 8, 160), new THREE.MeshBasicMaterial({ color: glDark() ? 0x8FB2FF : 0x7FA3E8, transparent: true, opacity: glDark() ? 0.35 : 0.45 }));
    ring.add(glass);
    ring.position.set(GLX, -GLY, 0);
    /* documents in flight: points on a band around the ring, coloured by the state segment they pass */
    var n = 1400, pos = new Float32Array(n * 3), colr = new Float32Array(n * 3), meta = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) {
      var a = Math.random() * 360, r = GLR - 6 + Math.pow(Math.random(), 1.6) * 44, z = (Math.random() - 0.5) * 30;
      meta[i * 3] = a; meta[i * 3 + 1] = r; meta[i * 3 + 2] = 0.12 + Math.random() * 0.35;
      pos[i * 3 + 2] = z;
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("color", new THREE.BufferAttribute(colr, 3));
    var pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 2.4, vertexColors: true, transparent: true, opacity: glDark() ? 0.9 : 0.75, depthWrite: false,
      blending: glDark() ? THREE.AdditiveBlending : THREE.NormalBlending }));
    pts.position.set(GLX, -GLY, 0); pts.userData.meta = meta;
    GL.s.add(ring); GL.s.add(pts); GL.ring = ring; GL.pts = pts;
  }
  function glColor(a) {
    var d = ((a % 360) + 360) % 360;
    for (var k = 0; k < GL.seg.length; k++) { var s = GL.seg[k], lo = ((s[0] % 360) + 360) % 360, hi = lo + (s[1] - s[0]); if ((d >= lo && d <= hi) || (d + 360 >= lo && d + 360 <= hi)) return s[2]; }
    return GL.seg[0][2];
  }
  function glFrame(t) {
    if (!GL.cv || !GL.cv.isConnected) { GL.raf = 0; return; }
    var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches, k = still ? 0 : (t - GL.t0) / 1000;
    glSize();
    if (GL.mode === "globe") { glGlobeFrame(k); GL.raf = still ? 0 : requestAnimationFrame(glFrame); return; }
    GL.ring.rotation.x = 0.16 + Math.sin(k * 0.5) * 0.05; GL.ring.rotation.y = Math.sin(k * 0.37) * 0.09;
    GL.pts.rotation.x = GL.ring.rotation.x; GL.pts.rotation.y = GL.ring.rotation.y;
    GL.sp.position.set(GLX + Math.cos(k * 0.8) * 220, -GLY + Math.sin(k * 0.8) * 220, 160);
    var m = GL.pts.userData.meta, p = GL.pts.geometry.attributes.position.array, c = GL.pts.geometry.attributes.color.array;
    for (var i = 0; i < m.length / 3; i++) {
      var a = m[i * 3] + k * 60 * m[i * 3 + 2], r = m[i * 3 + 1], rd = -a * Math.PI / 180, col = glColor(a);
      p[i * 3] = r * Math.cos(rd); p[i * 3 + 1] = r * Math.sin(rd); c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b;
    }
    GL.pts.geometry.attributes.position.needsUpdate = true; GL.pts.geometry.attributes.color.needsUpdate = true;
    GL.r.render(GL.s, GL.cam);
    GL.raf = still ? 0 : requestAnimationFrame(glFrame);
  }
  function glSize() {
    var w = GL.cv.clientWidth, h = GL.cv.clientHeight;
    if (!w || !h) return;
    if (GL.cv.width !== Math.round(w * GL.r.getPixelRatio()) || GL.cv.height !== Math.round(h * GL.r.getPixelRatio())) {
      GL.r.setSize(w, h, false);
      if (GL.gcam) { GL.gcam.aspect = w / h; GL.gcam.updateProjectionMatrix(); }
      if (GL.comp) GL.comp.setSize(w, h);
    }
  }
  function glInit(mods) {
    var THREE = mods[0]; GL.T = THREE; GL.X = mods.length > 1 ? { EffectComposer: mods[1].EffectComposer, RenderPass: mods[2].RenderPass, UnrealBloomPass: mods[3].UnrealBloomPass, OutputPass: mods[4].OutputPass } : null;
    GL.cv = document.createElement("canvas"); GL.cv.className = "cx-gl"; GL.cv.setAttribute("aria-hidden", "true");
    try { GL.r = new THREE.WebGLRenderer({ canvas: GL.cv, antialias: true, alpha: true }); } catch (e) { GL.cv = null; return; }
    GL.r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); GL.r.setClearColor(0x000000, 0);
    GL.s = new THREE.Scene();
    GL.cam = new THREE.OrthographicCamera(0, GLW, 0, -GLH, -1000, 1000);
    GL.s.add(new THREE.AmbientLight(0xffffff, 0.55));
    var d = new THREE.DirectionalLight(0xffffff, 1.1); d.position.set(GLX - 200, 120, 400); GL.s.add(d);
    GL.sp = new THREE.PointLight(0xffffff, 2.2, 0, 0); GL.s.add(GL.sp);
    GL.on = true; GL.t0 = performance.now();
    glAttach();
  }
  function glAttach() {
    if (!GL.on) return;
    var g = cx.querySelector(".cx-globe"), host = g || cx.querySelector(".cx-hvb");
    if (!host) return;
    GL.mode = g ? "globe" : "ring"; GL.host = host;
    if (g) { glGlobeBuild(); g.classList.add("on"); g.insertBefore(GL.cv, g.firstChild); glLabels(g); }
    else { glBuild(); host.classList.add("gl"); host.insertBefore(GL.cv, host.firstChild); }
    GL.r.setClearColor(0x000000, 0); GL.cv.width = 0; glSize();
    if (!GL.raf) GL.raf = requestAnimationFrame(glFrame);
  }
  /* Network globe: the client at the hub, one arc per trading partner, arc color from the partner's open findings */
  var GLLL = [[-18, 15], [50, 20], [58, 120], [-10, 135], [20, 160], [-38, 80], [35, -20]], GLRG = 260;
  function glLL(la, lo) { var T = GL.T; la *= Math.PI / 180; lo *= Math.PI / 180; return new T.Vector3(Math.cos(la) * Math.cos(lo), Math.sin(la), Math.cos(la) * Math.sin(lo)).multiplyScalar(GLRG); }
  function glPartners() {
    var it = ccItems();
    return cxPartners().filter(function (p) { return p[2] === "Active"; }).slice(0, 7).map(function (p) {
      var mine = it.filter(function (i) { return i.partner === p[0] && fuBucket(i) !== "off"; }), need = mine.filter(function (i) { return fuBucket(i) === "need"; }), wait = mine.filter(function (i) { return fuBucket(i) === "wait"; });
      var rec = wait.filter(function (i) { return i.key.indexOf("f:") === 0 && cxFu(i.key.slice(2)).st === "Recovering"; });
      var sev = need.length ? "r" : wait.length > rec.length ? "a" : rec.length ? "c" : "b", top = need[0] || wait[0];
      var st = top ? (top.key.indexOf("f:") === 0 ? cxFu(top.key.slice(2)).st : top.status) : "", t = top ? st + " · " + top.title : "Documents flowing";
      return { n: p[0], sev: sev, sub: t.length > 44 ? t.slice(0, 43).replace(/\s+\S*$/, "") + "…" : t };
    });
  }
  function glGlobeBuild() {
    var T = GL.T, dark = glDark(), P = glPartners(), key = ccRole() + (dark ? "d" : "l") + P.map(function (p) { return p.sev + p.sub; }).join("");
    if (GL.gkey === key && GL.gs) return;
    GL.gkey = key;
    var S = new T.Scene(), g = new T.Group(), col = { r: 0xFF4D5A, a: 0xF4B740, b: dark ? 0x6E9BFF : 0x2F6BFF, c: dark ? 0x39D98A : 0x15803D };
    GL.gcam = new T.PerspectiveCamera(38, 820 / 560, 1, 5000); GL.gcam.position.set(-120, 140, 1120); GL.gcam.lookAt(-120, 0, 0);
    S.add(new T.AmbientLight(0xffffff, dark ? 0.35 : 1.1)); var dl = new T.DirectionalLight(0xffffff, dark ? 0.8 : 1.6); dl.position.set(-400, 500, 600); S.add(dl);
    g.add(new T.Mesh(new T.SphereGeometry(GLRG - 2, 96, 96), new T.MeshStandardMaterial(dark ? { color: 0x10267A, roughness: 0.7, metalness: 0.1, emissive: 0x0A1A5C, emissiveIntensity: 1 } : { color: 0xF2F6FF, roughness: 0.9, metalness: 0, emissive: 0x2F6BFF, emissiveIntensity: 0.06 })));
    var n = 9000, pos = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) {
      var y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), t = i * 2.39996, vx = Math.cos(t) * r, vz = Math.sin(t) * r;
      var land = Math.sin(vx * 4.1 + 1.3) * Math.cos(y * 3.3) + Math.sin(vz * 5.2) * 0.6 > 0.25;
      pos.set(land ? [vx * GLRG * 1.003, y * GLRG * 1.003, vz * GLRG * 1.003] : [0, 0, 0], i * 3);
    }
    var dg = new T.BufferGeometry(); dg.setAttribute("position", new T.BufferAttribute(pos, 3));
    g.add(new T.Points(dg, new T.PointsMaterial({ size: 2.6, color: dark ? 0x7FA8FF : 0x2F6BFF, transparent: true, opacity: dark ? 0.9 : 0.7 })));
    if (dark) S.add(new T.Mesh(new T.SphereGeometry(GLRG * 1.12, 64, 64), new T.MeshBasicMaterial({ color: 0x2F6BFF, transparent: true, opacity: 0.05, side: T.BackSide })));
    var hub = glLL(22, 75), em = function (c, k) { return new T.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: dark ? k : k * 0.35, roughness: 0.3 }); };
    var hm = new T.Mesh(new T.SphereGeometry(10, 24, 24), em(dark ? 0xffffff : 0x0066FF, 3)); hm.position.copy(hub); g.add(hm);
    GL.beads = []; GL.gp = [{ n: ccCompany(), sev: "h", sub: "Your company", v: hub }];
    P.forEach(function (p, k) {
      var e = glLL(GLLL[k][0], GLLL[k][1]), mid = hub.clone().add(e).multiplyScalar(0.5).normalize().multiplyScalar(GLRG * 1.45), c = col[p.sev];
      var cv = new T.QuadraticBezierCurve3(hub, mid, e);
      g.add(new T.Mesh(new T.TubeGeometry(cv, 80, p.sev === "r" ? 2.6 : 1.7, 8), em(c, p.sev === "r" ? 3.2 : 1.8)));
      for (var q = 0; q < 6; q++) { var b = new T.Mesh(new T.SphereGeometry(p.sev === "r" ? 4.5 : 3.4, 12, 12), em(p.sev === "r" ? c : dark ? 0xBFD3FF : 0x0066FF, 3)); g.add(b); GL.beads.push([b, cv, q / 6, p.sev === "r" ? 0.05 : 0.12]); }
      var m = new T.Mesh(new T.SphereGeometry(7, 20, 20), em(c, 2.6)); m.position.copy(e); g.add(m);
      GL.gp.push({ n: p.n, sev: p.sev, sub: p.sub, v: e });
    });
    g.rotation.set(0.25, -1.9, 0); S.add(g); GL.gs = S; GL.gg = g;
    GL.comp = null;
    if (dark && GL.X) {
      var w = GL.cv.clientWidth || 820, h = GL.cv.clientHeight || 560, c2 = new GL.X.EffectComposer(GL.r);
      c2.addPass(new GL.X.RenderPass(S, GL.gcam)); c2.addPass(new GL.X.UnrealBloomPass(new T.Vector2(w, h), 0.75, 0.4, 0.35)); c2.addPass(new GL.X.OutputPass());
      GL.comp = c2;
    }
  }
  function glLabels(g) {
    var l = g.querySelector(".cx-gll"); if (!l) return;
    l.innerHTML = GL.gp.map(function (p, k) { var on = ccOvF && ccOvF.k === "pt" && ccOvF.v === p.n; return '<button type="button" class="' + (k ? p.sev : "h") + (on ? " sel" : "") + '" data-cxov="' + (k ? "pt:" + cxe(p.n) : "clear") + '" title="' + (k ? "Filter follow-ups to " + cxe(p.n) : "Show all follow-ups") + '">' + cxe(p.n) + '<small>' + cxe(k ? p.sub : (ccOvF ? "Show all follow-ups" : "Your company")) + '</small></button>'; }).join("");
  }
  function glGlobeFrame(k) {
    var T = GL.T, g = GL.gg; if (!g) return;
    g.rotation.y = -1.9 + Math.sin(k * 0.12) * 0.22;
    GL.beads.forEach(function (b) { b[0].position.copy(b[1].getPoint((b[2] + k * b[3]) % 1)); });
    g.updateMatrixWorld(); GL.gcam.updateMatrixWorld();
    if (GL.comp) GL.comp.render(); else GL.r.render(GL.gs, GL.gcam);
    var host = cx.querySelector(".cx-gll"), bs = host ? host.children : [], w = GL.cv.clientWidth, h = GL.cv.clientHeight, cp = GL.gcam.position;
    var placed = [];
    for (var i = 0; i < bs.length && i < GL.gp.length; i++) {
      var v = GL.gp[i].v.clone().applyMatrix4(g.matrixWorld), n = v.clone().normalize(), front = n.dot(cp.clone().sub(v).normalize()) > 0.15;
      var p = v.clone().multiplyScalar(1.1).project(GL.gcam), x = (p.x + 1) / 2 * w, y = (1 - p.y) / 2 * h;
      /* keep labels from stacking: push down until clear of labels already placed */
      if (front) { for (var q = 0; q < 6; q++) { var hit = placed.some(function (o) { return Math.abs(o[0] - x) < 190 && Math.abs(o[1] - y) < 40; }); if (!hit) break; y += 42; } placed.push([x, y]); }
      bs[i].style.left = x.toFixed(1) + "px"; bs[i].style.top = y.toFixed(1) + "px";
      bs[i].classList.toggle("off", !front);
    }
  }
  var glBaseRender = cxRender;
  cxRender = function () { glBaseRender(); glAttach(); };
  if (window.WebGLRenderingContext) {
    Promise.all(["./three.module.min.js", "./jsm/postprocessing/EffectComposer.js", "./jsm/postprocessing/RenderPass.js", "./jsm/postprocessing/UnrealBloomPass.js", "./jsm/postprocessing/OutputPass.js"].map(function (u) { return import(u); }))
      .then(glInit).catch(function () { import("./three.module.min.js").then(function (m) { glInit([m]); }).catch(function () {}); });
  }
