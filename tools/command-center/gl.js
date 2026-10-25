  /* Overview ring in WebGL (three.js, served next to this page). The SVG keeps the labels, process strands and ribbons;
     three.js draws the state ring and the document particles behind them. Without WebGL the SVG ring stays. */
  var GL = { on: false, cv: null, T: null, r: null, s: null, cam: null, ring: null, pts: null, sp: null, seg: [], t0: 0, raf: 0, key: "" };
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
    if (GL.cv.width !== Math.round(w * GL.r.getPixelRatio()) || GL.cv.height !== Math.round(h * GL.r.getPixelRatio())) GL.r.setSize(w, h, false);
  }
  function glInit(THREE) {
    GL.T = THREE;
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
    var host = cx.querySelector(".cx-hv");
    if (!GL.on || !host) return;
    glBuild();
    host.classList.add("gl"); host.insertBefore(GL.cv, host.firstChild);
    if (!GL.raf) GL.raf = requestAnimationFrame(glFrame);
  }
  var glBaseRender = cxRender;
  cxRender = function () { glBaseRender(); glAttach(); };
  if (window.WebGLRenderingContext) {
    import("./three.module.min.js").then(glInit).catch(function () {});
  }
