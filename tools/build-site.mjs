// Build the Render static site from the Process Genome master page (the claude.ai artifact build):
//   API_ORIGIN=https://process-genome-stats.onrender.com node tools/build-site.mjs /path/to/master.html
// Same model as the Trading Grid Innovation Guide's tools/build-site.mjs, so the Process Genome can join the guide (2027 H1)
// without changing how it is counted:
// 1. site/index.html = the master page with the favicon links, the footer stats link made relative, one small script that
//    reports an open to the stats service, and one that reports view events (skipped for automated browsers and non-https pages).
// 2. site/stats/index.html = the stats page (tools/stats-template.html), reading from the stats service.
// Views play the part of the guide's products: the same /api/event body {"p": id, "k": "view" | "act" | "link"}, the same
// [id, name, description, status, group] registry, ids prefixed "pg-" so they never collide with guide product ids.
import fs from "node:fs";
import path from "node:path";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const MASTER = process.argv[2] || "/home/claude/process-genome-site.html";
const API = (process.env.API_ORIGIN || "").replace(/\/$/, "");
if (!/^https:\/\//.test(API)) throw new Error("set API_ORIGIN to the stats service's https origin");
let html = fs.readFileSync(MASTER, "utf8");

// the footer link points at the live host's /stats/; on this site it is relative
const STATS = /https:\/\/[a-z0-9.-]+\/stats\//g;
if (!STATS.test(html)) throw new Error("footer stats link missing from the master");
html = html.replace(STATS, "/stats/");

// favicon files for browsers that do not use the inline SVG icon
const FAV = '<link rel="icon" href="img/favicon/favicon.ico" sizes="any"><link rel="apple-touch-icon" href="img/favicon/apple-touch-icon.png">\n';
if (!fs.existsSync(path.join(ROOT, "site/img/favicon/favicon.ico"))) throw new Error("site/img/favicon/favicon.ico missing");

// Views (owner, Oct 23). Each view reports, at most once per open of the page: "view" after 3 seconds on screen, "act" when a
// tile, chip, process, link or control inside it is used, and "link" when the page opens at it (a shared or direct link).
// Views are read from the URL hash the page keeps current (#<industry>/<view>). Group = industry, in tab order.
const GROUPS = [["all", "Overview"], ["retail", "Retail and CPG"], ["automotive", "Automotive"], ["banking", "Financial services"]];
const REG = [
  { id: "pg-overview", n: "Overview", d: "About, industries, standards and reference", s: "", g: "all", h: "all" },
  { id: "pg-opsmap", n: "Operations map", d: "Stakeholders across all industries", s: "", g: "all", h: "all/opsmap" },
  { id: "pg-retail-genome", n: "Process Genome", d: "Retail and CPG", s: "", g: "retail", h: "retail/map" },
  { id: "pg-retail-solutions", n: "Solution overview", d: "Retail and CPG", s: "", g: "retail", h: "retail/solution" },
  { id: "pg-automotive-genome", n: "Process Genome", d: "Automotive", s: "", g: "automotive", h: "automotive/map" },
  { id: "pg-automotive-solutions", n: "Solution overview", d: "Automotive", s: "", g: "automotive", h: "automotive/solution" },
  { id: "pg-fs-genome", n: "Process Genome", d: "Financial services", s: "", g: "banking", h: "banking/map" },
  { id: "pg-fs-solutions", n: "Solution overview", d: "Financial services", s: "", g: "banking", h: "banking/solution" },
];
const HASHES = Object.fromEntries(REG.map((r) => [r.h, r.id]));

// the hash the page was opened with, before the page rewrites it to its canonical form
const FIRST = `<script>window.PG_FIRST_HASH=location.hash;</script>`;
const BEACON = `<script>/* count one open of the Process Genome: no cookies, see /stats/ */(function(){try{if(navigator.webdriver||location.protocol!=="https:")return;var u=${JSON.stringify(API + "/api/hit")},b=new Blob(["{}"],{type:"text/plain"});if(!(navigator.sendBeacon&&navigator.sendBeacon(u,b)))fetch(u,{method:"POST",body:"{}",keepalive:true,mode:"no-cors"});}catch(e){}})();</script>`;
const TRACK = `<script>/* view events: no cookies, see /stats/ */(function(){try{if(navigator.webdriver||location.protocol!=="https:")return;
var U=${JSON.stringify(API + "/api/event")},H=${JSON.stringify(HASHES)},sent={},tm=null,cur=null;
function send(p,k){if(!p||sent[p+k])return;sent[p+k]=1;var d=JSON.stringify({p:p,k:k});try{if(!(navigator.sendBeacon&&navigator.sendBeacon(U,new Blob([d],{type:"text/plain"}))))fetch(U,{method:"POST",body:d,keepalive:true,mode:"no-cors"});}catch(e){}}
function viewOf(h){h=String(h||"").replace(/^#/,"");try{h=decodeURIComponent(h);}catch(e){}return H[h]||null;}
function arm(){clearTimeout(tm);if(!cur||sent[cur+"view"])return;var at=cur;tm=setTimeout(function(){if(cur!==at)return;if(document.visibilityState!=="visible")arm();else send(at,"view");},3000);}
function check(){var v=viewOf(location.hash);if(v===cur)return;cur=v;arm();}
var rs=history.replaceState,ps=history.pushState;
history.replaceState=function(){var r=rs.apply(this,arguments);check();return r;};history.pushState=function(){var r=ps.apply(this,arguments);check();return r;};
window.addEventListener("hashchange",check);window.addEventListener("popstate",check);document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible")arm();});
document.addEventListener("click",function(e){var t=e.target&&e.target.closest&&e.target.closest("a,button,summary,img,video,select,input,[role=button],[tabindex],[data-code],[data-tip],[data-a],.st,.om-s,.hitl,.rowlb");
if(!t||t.closest("#areas,.tabs,header,footer"))return;if(!t.closest("#v-ops,#v-proc,#v-map,#v-sol,#v-om,#pm-md"))return;check();send(cur,"act");},true);
var f=viewOf(window.PG_FIRST_HASH);if(f)send(f,"link");check();
}catch(e){}})();</script>`;

html = FAV + FIRST + html + BEACON + TRACK;
fs.mkdirSync(path.join(ROOT, "site/stats"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "site/index.html"), html);

let st = fs.readFileSync(path.join(ROOT, "tools/stats-template.html"), "utf8").split("__API__").join(API);
for (const k of ["__PRODUCTS__", "__GROUPS__"]) if (!st.includes(k)) throw new Error("stats template has no " + k + " placeholder");
st = st.split("__PRODUCTS__").join(JSON.stringify(REG.map(({ h, ...r }) => r)).replace(/</g, "\\u003c"));
st = st.split("__GROUPS__").join(JSON.stringify(GROUPS));
st = st.replace("<head>", "<head>" + FAV.replace(/href="img\//g, 'href="/img/'));
fs.writeFileSync(path.join(ROOT, "site/stats/index.html"), st);
fs.copyFileSync(path.join(ROOT, "site/img/favicon/favicon.ico"), path.join(ROOT, "site/favicon.ico"));
console.log("site/index.html", (html.length / 1024).toFixed(0) + " KB; stats page reads", API, ";", REG.length, "views");
