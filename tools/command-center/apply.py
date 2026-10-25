"""Install the Command Center model in the Process Genome page and build the Command Center prototype page.

    python3 tools/command-center/apply.py site/index.html [OUTPUT.html]

1. The Process Genome page (site/index.html) gets one managed block: the shared Command Center data
   (data.js) and the Product overlay on the retail genome (pv.js), plus the overlay switch. A fresh
   master build is installed; an already-installed page has only its managed block replaced.
2. The Command Center prototype is a page of its own, site/command-center/index.html, built from
   cc.css, retail.css, data.js, cc.js, retail-data.js and retail.js. The Process Genome links to it
   as a clickable prototype that opens in a new tab, the way the Trading Grid Innovation Guide links
   its prototypes. Retail process names and steps are read from the Process Genome page.

All validation completes before anything is written.
"""

import argparse
import json
import re
from pathlib import Path
import sys


SOURCE_DIR = Path(__file__).resolve().parent
MARKER_PREFIX = "process-genome:command-center:"
MODEL = ("data.js", "pv.js")
PAGE_STYLES = ("cc.css", "retail.css")
PAGE_SCRIPTS = ("data.js", "cc.js", "fu.js", "im.js", "workspace.js", "retail-data.js", "retail.js", "gl.js", "av.js", "ov.js")

MODES_ANCHOR = "  /* Modes, fit, open and close */"
PV_BUTTON = (
    '<span>Strategy overlay</span></button>',
    '<span>Strategy overlay</span></button>\n<button type="button" class="pm-btn pm-ov" id="pm-pvt" aria-pressed="false" hidden><span class="sw" aria-hidden="true"></span><span>Product overlay</span></button>',
)
OVERLAY_PATCHES = (
    ('    } else if (pmOv !== "off" && pmMode === "pt") {\n      h = "";',
     '    } else if ((pmOv !== "off" || pmPvOn()) && pmMode === "pt") {\n      h = "";'),
    ('pmPP.innerHTML = (pmOv !== "off" && pmMode === "pt" ? pmOvCard() : "") + h;',
     'pmPP.innerHTML = (pmPvOn() ? pmPvCard() : pmOv !== "off" && pmMode === "pt" ? pmOvCard() : "") + h;'),
    ('pmP = null; pmE = null; pmOv = "off"; pmOvLast = "connect";',
     'pmP = null; pmE = null; pmOv = "off"; pmOvLast = "connect"; pmPv = "off";'),
    ('document.getElementById("pm-ovt").addEventListener("click", function () { pmOv = pmOv === "off" ? pmOvLast : "off"; pmApply(); pmPP.scrollTop = 0; });',
     'document.getElementById("pm-ovt").addEventListener("click", function () { pmOv = pmOv === "off" ? pmOvLast : "off"; if (pmOv !== "off") pmPv = "off"; pmApply(); pmPP.scrollTop = 0; });\n'
     '  document.getElementById("pm-pvt").addEventListener("click", function () { pmPv = pmPv === "off" ? pmPvLast : "off"; if (pmPv !== "off") { pmOv = "off"; if (pmMode !== "pt") pmSetMode("pt"); } pmApply(); pmPP.scrollTop = 0; });'),
    ('    if (b.hasAttribute("data-ovp")) { pmOv = pmOvLast = b.getAttribute("data-ovp"); pmApply(); return; }',
     '    if (b.hasAttribute("data-ovp")) { pmOv = pmOvLast = b.getAttribute("data-ovp"); pmApply(); return; }\n    if (b.hasAttribute("data-pvp")) { pmPv = pmPvLast = b.getAttribute("data-pvp"); pmApply(); return; }'),
)

PAGE = '''<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Command Center prototype for Retail and CPG</title>
<meta name="description" content="Clickable prototype: one dashboard, findings list and action queue across Integration Monitor, Performance Monitor and the Retail add-on. Illustrative data.">
<link rel="icon" href="../img/favicon/favicon.ico" sizes="any"><link rel="apple-touch-icon" href="../img/favicon/apple-touch-icon.png">
<script>try { if (localStorage.getItem("edi-guide-theme") === "dark") document.documentElement.setAttribute("data-theme", "dark"); } catch (e) {}</script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
<style>
  :root { --font: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; color-scheme: light; }
  :root[data-theme="dark"] { color-scheme: dark; }
  .pm { --pc: #FFFFFF; --pf: #101C2F; --pmu: #3F4D62; --pl: #E7EAEF; --pl2: #C9D0DA; --pcl: #F6F7F7; --pa: #0066FF; --pai: #0033CF; --pfa: #6B7689; --psel: #F2F7FF; --prf: rgba(16, 28, 47, 0.05); --prf2: rgba(16, 28, 47, 0.08); }
  :root[data-theme="dark"] .pm { --pc: #0E1726; --pf: #F5F8FF; --pmu: #C0CCDF; --pl: #293A53; --pl2: #3A4D6B; --pcl: #19263A; --pa: #72A7FF; --pai: #A9C9FF; --pfa: #8A9BB5; --psel: #16294A; --prf: rgba(245, 248, 255, 0.06); --prf2: rgba(245, 248, 255, 0.10); }
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; background: #F6F7F7; }
  :root[data-theme="dark"] body { background: #19263A; }
  .pm.cc { position: fixed; inset: 0; overflow: hidden; background: var(--pcl); color: var(--pf); font-family: var(--font); -webkit-font-smoothing: antialiased; }
  .cc-app { position: absolute; inset: 0; }
  .cc-small { display: none; position: absolute; inset: 0; place-items: center; padding: 24px; }
  .cc-small > div { max-width: 420px; padding: 24px; border: 2px solid var(--pa); border-radius: 14px; background: var(--pc); }
  .cc-small h1 { margin: 0; font-size: 20px; line-height: 26px; font-weight: 800; }
  .cc-small p { margin: 8px 0 20px; font-size: 15px; line-height: 22px; color: var(--pmu); }
  .cc-small a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 16px; border: 2px solid var(--pa); border-radius: 8px; color: var(--pai); font-weight: 700; text-decoration: none; }
  .pm.cc.small .cc-app { display: none; }
  .pm.cc.small .cc-small { display: grid; }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
__STYLES__
</style>
</head>
<body>
<div class="pm cc" id="cc">
  <div class="cc-app"><div class="cx" id="cx"></div></div>
  <div class="cc-small"><div><h1>Desktop screen required</h1><p>The Command Center prototype needs a screen at least 1024 pixels wide. Open this page on a desktop or laptop.</p><a href="../#retail/map">Open Process Genome</a></div></div>
</div>
<script>
(function () {
  var PROCESSES = { retail: __PROCESSES__ };
  var GENOME = { retail: { short: __SHORT__ } };
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
__SCRIPTS__
  ccStart();
})();
</script>
</body>
</html>
'''


class GenerationError(ValueError):
    pass


def read_text(path):
    return Path(path).read_bytes().decode("utf-8")


def unique_index(text, needle):
    count = text.count(needle)
    if count != 1:
        raise GenerationError(f"expected 1 match, found {count} for: {needle[:100]}")
    return text.index(needle)


def replace_once(text, before, after):
    unique_index(text, before)
    return text.replace(before, after, 1)


def marker(edge):
    return f"/* {MARKER_PREFIX}model:{edge}:v2 */\n"


def sources(names, source_dir=SOURCE_DIR):
    # Every source must exist before a page is written.
    return "".join(read_text(Path(source_dir) / n).rstrip("\n") + "\n" for n in names)


def model_block(source_dir=SOURCE_DIR):
    body = sources(MODEL, source_dir)
    if MARKER_PREFIX in body:
        raise GenerationError("reserved managed marker in a model source")
    return marker("begin") + body + marker("end")


def install(text, block):
    """Fresh master build: add the overlay switch, swap the master's overlay function for the model, patch the overlay hooks."""
    if MARKER_PREFIX in text:
        raise GenerationError("managed markers already present")
    result = replace_once(text, *PV_BUTTON)
    start = unique_index(result, "  function pmApplyOv() {")
    finish = unique_index(result, MODES_ANCHOR)
    if finish <= start:
        raise GenerationError("the original pmApplyOv function is not before the modes section")
    result = result[:start] + block + result[finish:]
    for before, after in OVERLAY_PATCHES:
        result = replace_once(result, before, after)
    return result


def refresh(text, block):
    start = unique_index(text, marker("begin"))
    finish = unique_index(text, marker("end")) + len(marker("end"))
    if text.count(MARKER_PREFIX) != 2:
        raise GenerationError("unknown or duplicate managed Command Center markers")
    return text[:start] + block + text[finish:]


def validate(text):
    for needle in ('id="pm-pvt"', marker("begin"), marker("end"), "function pmPvOn()"):
        unique_index(text, needle)
    for _, after in OVERLAY_PATCHES:
        unique_index(text, after)
    for needle in ('id="v-cc"', 'id="cx"'):
        if needle in text:
            raise GenerationError(f"the Process Genome page still carries the embedded console ({needle}); rebuild from the master")


def genome_data(text):
    m = re.search(r"^var PROCESSES = (\{.*\});\s*$", text, re.M)
    if not m:
        raise GenerationError("PROCESSES not found in the Process Genome page")
    retail = json.loads(m.group(1))["retail"]
    s = re.search(r"var PMSHORT = (\[[^\]]*\]);", text)
    if not s:
        raise GenerationError("PMSHORT not found in the Process Genome page")
    short = json.loads(s.group(1))
    if len(short) != len(retail):
        raise GenerationError("retail process names and short names differ in length")
    return retail, short


def prototype_page(text, source_dir=SOURCE_DIR):
    retail, short = genome_data(text)
    keep = ("n", "owner", "outcome", "measures", "steps")
    procs = [{k: p[k] for k in keep if k in p} for p in retail]
    js = lambda v: json.dumps(v, ensure_ascii=False).replace("</", "<\\/")
    page = PAGE.replace("__STYLES__", sources(PAGE_STYLES, source_dir))
    page = page.replace("__PROCESSES__", js(procs)).replace("__SHORT__", js(short))
    return page.replace("__SCRIPTS__", sources(PAGE_SCRIPTS, source_dir))


def write(path, text):
    encoded = text.encode("utf-8")
    path.parent.mkdir(parents=True, exist_ok=True)
    unchanged = path.exists() and path.read_bytes() == encoded
    if not unchanged:
        path.write_bytes(encoded)
    print(f"{'unchanged' if unchanged else 'generated'} {path}: {len(encoded)} bytes")


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--refresh", action="store_true", help="accepted for compatibility; an installed page is always refreshed")
    parser.add_argument("input", type=Path)
    parser.add_argument("output", nargs="?", type=Path, help="defaults to the input path")
    args = parser.parse_args(argv)
    try:
        original = read_text(args.input)
        block = model_block()
        result = refresh(original, block) if MARKER_PREFIX in original else install(original, block)
        validate(result)
        page = prototype_page(result)
        output = args.output or args.input
        write(output, result)
        write(output.parent / "command-center" / "index.html", page)
        return 0
    except (OSError, UnicodeError, ValueError, GenerationError) as error:
        parser.exit(1, f"error: {error}\n")


if __name__ == "__main__":
    sys.exit(main())
