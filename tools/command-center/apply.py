"""Generate the Retail and CPG Command Center additions from their source files.

Fresh Genome build: python3 tools/command-center/apply.py INPUT.html [OUTPUT.html]
Existing build:     python3 tools/command-center/apply.py --refresh INPUT.html [OUTPUT.html]

Refresh replaces only managed Command Center blocks. It can migrate the exact
unmarked blocks shipped before managed markers were introduced; unknown legacy
content is rejected rather than overwritten. All validation completes before write.
"""

import argparse
import hashlib
from pathlib import Path
import sys


SOURCE_DIR = Path(__file__).resolve().parent
MARKER_PREFIX = "process-genome:command-center:"
REGION_NAMES = ("styles", "shell", "model", "console")
MODULES = {
    "styles": ("cc.css", "retail.css"),
    "model": ("data.js", "pv.js"),
    "console": ("cc.js", "retail-data.js", "retail.js"),
}

CC_HTML = '''<div class="vmap" id="v-cc" hidden>
<div class="wrap map-areas" id="cc-areas"></div>
<div class="pm cc" id="cc" tabindex="-1" lang="en" role="region" aria-label="Command Center" hidden>
  <div class="pm-frame" id="cc-frame">
  <div class="pm-stage" id="cc-stage"><div class="cx" id="cx"></div></div>
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

AREAS_PATCHES = (
    ('<a href="#retail/solution" data-v="sol" data-sol hidden>',
     '<a href="#retail/command" data-v="cc" data-cc hidden><b>Command Center</b><span>Monitors, findings and agent actions. Desktop only.</span></a>\n      <a href="#retail/solution" data-v="sol" data-sol hidden>'),
    ('<span>Strategy overlay</span></button>',
     '<span>Strategy overlay</span></button>\n<button type="button" class="pm-btn pm-ov" id="pm-pvt" aria-pressed="false" hidden><span class="sw" aria-hidden="true"></span><span>Product overlay</span></button>'),
)

ROUTING_PATCHES = (
    ('{ proc: "/processes", sol: "/solution", map: "/map", om: "/opsmap" }',
     '{ proc: "/processes", sol: "/solution", map: "/map", om: "/opsmap", cc: "/command" }'),
    ('{ processes: "proc", solution: "sol", map: "map", opsmap: "om" }',
     '{ processes: "proc", solution: "sol", map: "map", opsmap: "om", command: "cc" }'),
    ('vOm = document.getElementById("v-om"), omAreas = document.getElementById("om-areas"),',
     'vOm = document.getElementById("v-om"), omAreas = document.getElementById("om-areas"), vCc = document.getElementById("v-cc"), ccAreas = document.getElementById("cc-areas"),'),
    ('|| (v === "map" && !GENOME[curK])) v = "ops";',
     '|| (v === "map" && !GENOME[curK]) || (v === "cc" && curK !== "retail")) v = "ops";'),
    ('full = v === "sol" || v === "map" || v === "om";',
     'full = v === "sol" || v === "map" || v === "om" || v === "cc";'),
    ('vOm.hidden = v !== "om"; gHero.hidden = full;',
     'vOm.hidden = v !== "om"; vCc.hidden = v !== "cc"; gHero.hidden = full;'),
    ('v === "om" ? omAreas : gContent;',
     'v === "om" ? omAreas : v === "cc" ? ccAreas : gContent;'),
    ('if (v === "om") omOpen(); else omClose();',
     'if (v === "om") omOpen(); else omClose();\n    if (v === "cc") ccOpen(); else ccClose();'),
    ('    var pl = areas.querySelector(\'a[data-v="proc"]\');',
     '    var cl = areas.querySelector("a[data-cc]"); if (cl) cl.hidden = k !== "retail";\n    var pl = areas.querySelector(\'a[data-v="proc"]\');'),
    ('    if (v === "proc" && GENOME[k]) v = "map";\n',
     '    if (v === "proc" && GENOME[k]) v = "map";\n    if (v === "cc") k = "retail";\n'),
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

MODES_ANCHOR = "  /* Modes, fit, open and close */"
ROUTER_ANCHOR = '  window.addEventListener("hashchange", function () { var h = fromHash();'
OPS_ANCHOR = '<div class="vmap" id="v-om" hidden>'

# Frozen fingerprints of the unmarked additions in the original checked-in build
# (commit b8e45684e99052c663aa9d69ef06ff48cda350e6). Do not derive these from
# current source files: refresh must still work after the source files change.
LEGACY = {
    "styles": (
        "\n  /* Command Center (Retail and CPG): prototype shell recreated in the stage, 1440 x 810 */",
        "</style>",
        "8732061b14ce6ade757b715c009f928e638c76fb53fc5624bf35823db86214c4",
    ),
    "shell": (
        '<div class="vmap" id="v-cc" hidden>', OPS_ANCHOR,
        "151eb9961348b069b64f2b1a543e0640e2a97c5261d51c02ab49a6bcb0b1db6f",
    ),
    "model": (
        "  /* Command Center data for Retail and CPG. Illustrative values for the concept preview. */",
        MODES_ANCHOR,
        "42b9bf2bdd1381adb8a8612637af998f424e8f9062f8af7cf651d8d5e2c549b5",
    ),
    "console": (
        "  /* Command Center for Retail and CPG (owner, Oct 24):", ROUTER_ANCHOR,
        "a041b832468a1ed9a232c322c6b5d766507ed5d5fb6416dd29c4b994eb94cc3d",
    ),
}


class GenerationError(ValueError):
    pass


def digest(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def read_text(path):
    # Preserve newline bytes in the non-CC page, including any CRLF content.
    return Path(path).read_bytes().decode("utf-8")


def unique_index(text, needle):
    count = text.count(needle)
    if count != 1:
        raise GenerationError(f"expected 1 match, found {count} for: {needle[:100]}")
    return text.index(needle)


def replace_once(text, before, after):
    unique_index(text, before)
    return text.replace(before, after, 1)


def marker(name, edge):
    value = f"{MARKER_PREFIX}{name}:{edge}:v1"
    return f"<!-- {value} -->\n" if name == "shell" else f"/* {value} */\n"


def managed_block(name, body):
    if MARKER_PREFIX in body:
        raise GenerationError(f"reserved managed marker in {name} source")
    return marker(name, "begin") + body.rstrip("\n") + "\n" + marker(name, "end")


def load_blocks(source_dir=SOURCE_DIR):
    blocks = {"shell": managed_block("shell", CC_HTML)}
    for name, filenames in MODULES.items():
        # Every source must exist before a page is written. Never silently omit
        # an additive module from a partial checkout or in-progress build.
        body = "".join(read_text(Path(source_dir) / f).rstrip("\n") + "\n" for f in filenames)
        blocks[name] = managed_block(name, body)
    return blocks


def validate_installed(text):
    for needle in ('id="v-cc"', 'id="cc"', 'id="cx"', 'id="pm-pvt"'):
        unique_index(text, needle)
    for _, after in AREAS_PATCHES + ROUTING_PATCHES + OVERLAY_PATCHES:
        unique_index(text, after)


def ordered_regions(regions):
    ordered = sorted(regions, key=lambda r: r[1])
    for previous, current in zip(ordered, ordered[1:]):
        if previous[2] > current[1]:
            raise GenerationError(f"overlapping blocks: {previous[0]} and {current[0]}")
    return ordered


def managed_regions(text):
    if text.count(MARKER_PREFIX) != len(REGION_NAMES) * 2:
        raise GenerationError("incomplete, duplicate, or unknown managed Command Center markers")
    regions = []
    for name in REGION_NAMES:
        start = unique_index(text, marker(name, "begin"))
        finish = unique_index(text, marker(name, "end"))
        if finish <= start:
            raise GenerationError(f"reversed markers for {name}")
        regions.append((name, start, finish + len(marker(name, "end"))))
    return ordered_regions(regions)


def legacy_regions(text):
    regions = []
    for name, (start_marker, end_marker, expected) in LEGACY.items():
        start = unique_index(text, start_marker)
        finish = unique_index(text, end_marker)
        if finish <= start or digest(text[start:finish]) != expected:
            raise GenerationError(
                f"unrecognized legacy {name} block; refusing to overwrite it. "
                "Use the original unpatched master or restore the known generated build."
            )
        regions.append((name, start, finish))
    return ordered_regions(regions)


def outside_regions(text, regions):
    """Comparable page with only each CC block replaced by a stable token."""
    pieces, position = [], 0
    for name, start, finish in ordered_regions(regions):
        pieces.extend((text[position:start], f"<managed-command-center:{name}>"))
        position = finish
    pieces.append(text[position:])
    return "".join(pieces)


def refresh(text, blocks):
    validate_installed(text)
    regions = managed_regions(text) if MARKER_PREFIX in text else legacy_regions(text)
    outside = outside_regions(text, regions)
    result = text
    for name, start, finish in reversed(regions):
        result = result[:start] + blocks[name] + result[finish:]
    validate_installed(result)
    if outside != outside_regions(result, managed_regions(result)):
        raise GenerationError("refresh changed content outside managed Command Center blocks")
    return result, digest(outside)


def initial_apply(text, blocks):
    if 'id="v-cc"' in text:
        raise GenerationError("Command Center is already installed; use --refresh")
    if MARKER_PREFIX in text:
        raise GenerationError("managed markers exist without the Command Center shell")
    result = replace_once(text, "</style>", blocks["styles"] + "</style>")
    for before, after in AREAS_PATCHES:
        result = replace_once(result, before, after)
    result = replace_once(result, OPS_ANCHOR, blocks["shell"] + OPS_ANCHOR)
    for before, after in ROUTING_PATCHES:
        result = replace_once(result, before, after)
    start = unique_index(result, "  function pmApplyOv() {")
    finish = unique_index(result, MODES_ANCHOR)
    if finish <= start:
        raise GenerationError("the original pmApplyOv function is not before the modes section")
    result = result[:start] + blocks["model"] + result[finish:]
    for before, after in OVERLAY_PATCHES:
        result = replace_once(result, before, after)
    result = replace_once(result, ROUTER_ANCHOR, blocks["console"] + ROUTER_ANCHOR)
    validate_installed(result)
    managed_regions(result)
    return result


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--refresh", action="store_true", help="update an already-generated Command Center")
    parser.add_argument("input", type=Path)
    parser.add_argument("output", nargs="?", type=Path, help="defaults to the input path")
    args = parser.parse_args(argv)
    try:
        original = read_text(args.input)
        blocks = load_blocks()
        if args.refresh:
            result, invariant = refresh(original, blocks)
        else:
            result, invariant = initial_apply(original, blocks), None
        output = args.output or args.input
        encoded = result.encode("utf-8")
        unchanged = output.exists() and output.read_bytes() == encoded
        if not unchanged:
            output.write_bytes(encoded)
        print(f"{'unchanged' if unchanged else 'generated'} {output}: {len(encoded)} bytes")
        if invariant:
            print(f"non-Command Center content preserved: sha256 {invariant}")
        return 0
    except (OSError, UnicodeError, GenerationError) as error:
        parser.exit(1, f"error: {error}\n")


if __name__ == "__main__":
    sys.exit(main())
