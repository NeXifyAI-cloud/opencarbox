import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ALLOWLIST = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build"
]);

const PATTERNS = [
  { name: "JWT-like", re: /\beyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\b/ },
  { name: "OpenAI key", re: /\bsk-[A-Za-z0-9]{20,}\b/ },
  { name: "Generic token assignment", re: /\b(API_KEY|ACCESS_TOKEN|SECRET|SERVICE_ROLE_KEY)\s*=\s*[^ \n#]{12,}/i },
  { name: "Supabase service role hint", re: /\bSUPABASE_SERVICE_ROLE_KEY\b/i }
];

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ALLOWLIST.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(ROOT).filter(f => {
  const rel = path.relative(ROOT, f);
  if (rel.startsWith(".git")) return false;
  return !/\.(png|jpg|jpeg|gif|webp|pdf|zip|gz|tar|lock)$/i.test(rel);
});

const hits = [];
for (const f of files) {
  const rel = path.relative(ROOT, f);
  let txt;
  try { txt = fs.readFileSync(f, "utf8"); } catch { continue; }

  for (const p of PATTERNS) {
    const m = txt.match(p.re);
    if (m) hits.push({ file: rel, pattern: p.name });
  }
}

if (hits.length) {
  console.error("Secret scan failed. Potential secrets detected:");
  for (const h of hits) console.error(`- ${h.pattern} in ${h.file}`);
  process.exit(1);
}

console.log("Secret scan OK.");
