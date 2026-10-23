"""Apply the Command Center additions (console view and Product overlay, Retail and CPG) to a Process Genome page.

Usage: python3 tools/command-center/apply.py INPUT.html [OUTPUT.html]
Run it on a master build that does not already contain Command Center. OUTPUT defaults to INPUT.
"""
import sys, os
D = os.path.dirname(os.path.abspath(__file__))
SRC = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else SRC
base = open(SRC, encoding="utf-8").read()
if 'id="v-cc"' in base: sys.exit("Command Center is already in " + SRC)
s = base
def rd(n): return open(os.path.join(D, n), encoding="utf-8").read()
def rep(a, b, count=1):
    global s
    n = s.count(a)
    if n != count: sys.exit("expected %d match(es), found %d for: %s" % (count, n, a[:90]))
    s = s.replace(a, b)

# CSS
rep("</style>", rd("cc.css") + "</style>")

# Areas link and product overlay button
rep('<a href="#retail/solution" data-v="sol" data-sol hidden>',
    '<a href="#retail/command" data-v="cc" data-cc hidden><b>Command Center</b><span>Process health, findings and actions. Desktop only.</span></a>\n      <a href="#retail/solution" data-v="sol" data-sol hidden>')
rep('<span>Strategy overlay</span></button>',
    '<span>Strategy overlay</span></button>\n<button type="button" class="pm-btn pm-ov" id="pm-pvt" aria-pressed="false" hidden><span class="sw" aria-hidden="true"></span><span>Product overlay</span></button>')

# Console markup, after the operations map view
fs_svg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>'
cc_html = '''<div class="vmap" id="v-cc" hidden>
<div class="wrap map-areas" id="cc-areas"></div>
<div class="pm cc" id="cc" tabindex="-1" lang="en" role="region" aria-labelledby="cc-h" hidden>
  <div class="pm-frame" id="cc-frame">
  <div class="pm-stage" id="cc-stage">
    <div class="pm-top">
      <div class="pm-ttl"><p>Retail and CPG</p><h2 id="cc-h">Command Center</h2></div>
      <div class="pm-seg" role="group" aria-label="View for">
        <button type="button" data-per="ops" aria-pressed="true">Operations</button>
        <button type="button" data-per="biz" aria-pressed="false">Business</button>
      </div>
      <div class="pm-act">
        <span class="cc-mods">Integration Monitor · Performance Monitor</span>
        <button type="button" class="pm-btn" data-gv="map" data-gk="retail">Open Process Genome</button>
        <button type="button" class="pm-btn ic" id="cc-fs" aria-label="Full screen" title="Full screen">''' + fs_svg + '''</button>
      </div>
    </div>
    <div class="pm-chips" id="cc-chips" role="group" aria-label="Lifecycle stage"></div>
    <p class="cc-asof"><span class="cc-lgd"><span><b></b>Document flow</span><span><i></i>Healthy</span><span><i class="w"></i>Warning</span><span><i class="c"></i>Critical</span><span><i class="na"></i>Outside the network</span></span>Illustrative · 08:40</p>
    <div class="cc-main" id="cc-main"></div>
    <aside class="pm-panel" aria-live="polite"><div class="pp" id="cc-pp"></div></aside>
  </div>
  </div>
  <div class="pm-small">
    <div>
      <h2>Desktop screen required</h2>
      <p>Command Center is available on desktop and laptop screens. Open this page on a larger screen to use it.</p>
      <button type="button" class="pm-btn" id="cc-back">View overview</button>
    </div>
  </div>
</div>
</div>
'''
i = s.index('<div class="vmap" id="v-om" hidden>')
j = s.index('<div class="vmap"', i + 10) if s.find('<div class="vmap"', i + 10) > 0 else None
# insert directly before the operations map view to avoid guessing its end
s = s[:i] + cc_html + s[i:]

# Routing
rep('{ proc: "/processes", sol: "/solution", map: "/map", om: "/opsmap" }', '{ proc: "/processes", sol: "/solution", map: "/map", om: "/opsmap", cc: "/command" }')
rep('{ processes: "proc", solution: "sol", map: "map", opsmap: "om" }', '{ processes: "proc", solution: "sol", map: "map", opsmap: "om", command: "cc" }')
rep('vOm = document.getElementById("v-om"), omAreas = document.getElementById("om-areas"),',
    'vOm = document.getElementById("v-om"), omAreas = document.getElementById("om-areas"), vCc = document.getElementById("v-cc"), ccAreas = document.getElementById("cc-areas"),')
rep('|| (v === "map" && !GENOME[curK])) v = "ops";', '|| (v === "map" && !GENOME[curK]) || (v === "cc" && curK !== "retail")) v = "ops";')
rep('full = v === "sol" || v === "map" || v === "om";', 'full = v === "sol" || v === "map" || v === "om" || v === "cc";')
rep('vOm.hidden = v !== "om"; gHero.hidden = full;', 'vOm.hidden = v !== "om"; vCc.hidden = v !== "cc"; gHero.hidden = full;')
rep('v === "om" ? omAreas : gContent;', 'v === "om" ? omAreas : v === "cc" ? ccAreas : gContent;')
rep('if (v === "om") omOpen(); else omClose();', 'if (v === "om") omOpen(); else omClose();\n    if (v === "cc") ccOpen(); else ccClose();')
rep('    var pl = areas.querySelector(\'a[data-v="proc"]\');', '    var cl = areas.querySelector("a[data-cc]"); if (cl) cl.hidden = k !== "retail";\n    var pl = areas.querySelector(\'a[data-v="proc"]\');')
rep('    if (v === "proc" && GENOME[k]) v = "map";\n', '    if (v === "proc" && GENOME[k]) v = "map";\n    if (v === "cc") k = "retail";\n')

# Product overlay: replace pmApplyOv with the overlay-aware version and add the data
a = s.index("  function pmApplyOv() {")
b = s.index("  /* Modes, fit, open and close */")
s = s[:a] + rd("data.js") + rd("pv.js") + "\n" + s[b:]
rep('    } else if (pmOv !== "off" && pmMode === "pt") {\n      h = "";',
    '    } else if ((pmOv !== "off" || pmPvOn()) && pmMode === "pt") {\n      h = "";')
rep('pmPP.innerHTML = (pmOv !== "off" && pmMode === "pt" ? pmOvCard() : "") + h;',
    'pmPP.innerHTML = (pmPvOn() ? pmPvCard() : pmOv !== "off" && pmMode === "pt" ? pmOvCard() : "") + h;')
rep('pmP = null; pmE = null; pmOv = "off"; pmOvLast = "connect";', 'pmP = null; pmE = null; pmOv = "off"; pmOvLast = "connect"; pmPv = "off";')
rep('document.getElementById("pm-ovt").addEventListener("click", function () { pmOv = pmOv === "off" ? pmOvLast : "off"; pmApply(); pmPP.scrollTop = 0; });',
    'document.getElementById("pm-ovt").addEventListener("click", function () { pmOv = pmOv === "off" ? pmOvLast : "off"; if (pmOv !== "off") pmPv = "off"; pmApply(); pmPP.scrollTop = 0; });\n'
    '  document.getElementById("pm-pvt").addEventListener("click", function () { pmPv = pmPv === "off" ? pmPvLast : "off"; if (pmPv !== "off") { pmOv = "off"; if (pmMode !== "pt") pmSetMode("pt"); } pmApply(); pmPP.scrollTop = 0; });')
rep('    if (b.hasAttribute("data-ovp")) { pmOv = pmOvLast = b.getAttribute("data-ovp"); pmApply(); return; }',
    '    if (b.hasAttribute("data-ovp")) { pmOv = pmOvLast = b.getAttribute("data-ovp"); pmApply(); return; }\n    if (b.hasAttribute("data-pvp")) { pmPv = pmPvLast = b.getAttribute("data-pvp"); pmApply(); return; }')

# Console code, before the router starts
rep('  window.addEventListener("hashchange", function () { var h = fromHash();', rd("cc.js") + '  window.addEventListener("hashchange", function () { var h = fromHash();')

open(OUT, "w", encoding="utf-8").write(s)
print("ok", len(base), "->", len(s))
