// Installs the adoption path block (C, A, O, E letters and the retail opportunity animation) in the Process Genome page.
// Called by tools/build-site.mjs on every master build; to apply to the current page without a master:
//   node tools/adoption-path/inject.mjs site/index.html
// The block sits between the markers below and is replaced, never duplicated, on each run. Source: adoption.css, adoption.js.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const START = "<!-- adoption-path:start (tools/adoption-path; do not hand-edit) -->", END = "<!-- adoption-path:end -->";

export function applyAdoption(html) {
  const css = fs.readFileSync(path.join(DIR, "adoption.css"), "utf8"), js = fs.readFileSync(path.join(DIR, "adoption.js"), "utf8");
  if (/<\/script/i.test(js) || /<\/style/i.test(css)) throw new Error("adoption block source must not close its own tag");
  if (!html.includes('id="mk-model"') || !html.includes("window.TGR_RENDER")) throw new Error("page has no adoption path (#mk-model) or solution renderer");
  const block = START + "\n<style>\n" + css + "</style>\n<script>\n" + js + "</script>\n" + END;
  const at = html.indexOf(START);
  if (at >= 0) {
    const end = html.indexOf(END, at);
    if (end < 0) throw new Error("adoption block start marker without an end marker");
    return html.slice(0, at) + block + html.slice(end + END.length);
  }
  const body = html.lastIndexOf("</body>");
  if (body < 0) throw new Error("page has no </body>");
  return html.slice(0, body) + block + "\n" + html.slice(body);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const file = process.argv[2];
  if (!file) { console.error("usage: node tools/adoption-path/inject.mjs site/index.html"); process.exit(2); }
  const before = fs.readFileSync(file, "utf8"), after = applyAdoption(before);
  if (after !== before) fs.writeFileSync(file, after);
  console.log((after === before ? "unchanged " : "updated ") + file);
  const site = path.resolve(DIR, "../../site");
  if (path.resolve(path.dirname(file)) === site) {
    const { run } = await import("../crawl-files.mjs");
    console.log("crawl files", run({ write: true }).files.length, "URLs");
  }
}
