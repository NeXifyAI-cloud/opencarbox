import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const WF_DIR = path.join(process.cwd(), ".github", "workflows");
const USES_RE = /^(\s*-\s*uses:\s*)([^\s#]+)(\s*(#.*)?)$/;
const PINNED_RE = /^[^@\s]+@[0-9a-f]{40}$/;

function sh(cmd) {
  return execSync(cmd, { stdio: "pipe", encoding: "utf8" }).trim();
}

function resolveRef(ownerRepo, ref) {
  const url = `https://github.com/${ownerRepo}.git`;
  const tagRef = `refs/tags/${ref}`;
  const headRef = `refs/heads/${ref}`;

  let out = "";
  try { out = sh(`git ls-remote ${url} ${tagRef}`); if (out) return out.split(/\s+/)[0]; } catch {}
  try { out = sh(`git ls-remote ${url} ${tagRef}^{} `); if (out) return out.split(/\s+/)[0]; } catch {}
  try { out = sh(`git ls-remote ${url} ${headRef}`); if (out) return out.split(/\s+/)[0]; } catch {}
  throw new Error(`Could not resolve ${ownerRepo}@${ref}`);
}

function pinLine(line) {
  const m = line.match(USES_RE);
  if (!m) return { changed: false, line };
  const prefix = m[1], usesVal = m[2], suffix = m[3] || "";

  if (usesVal.startsWith("./") || usesVal.startsWith("docker://")) return { changed: false, line };
  if (PINNED_RE.test(usesVal)) return { changed: false, line };

  const [ownerRepo, ref] = usesVal.split("@");
  if (!ownerRepo || !ref) return { changed: false, line };

  const sha = resolveRef(ownerRepo, ref);
  const comment = suffix.includes("#") ? suffix : `${suffix} # ${ref}`;
  return { changed: true, line: `${prefix}${ownerRepo}@${sha}${comment}` };
}

const files = fs.readdirSync(WF_DIR).filter(f => f.endsWith(".yml") || f.endsWith(".yaml"));
let changedCount = 0;

for (const f of files) {
  const p = path.join(WF_DIR, f);
  const src = fs.readFileSync(p, "utf8").split("\n");
  let changed = false;
  const out = src.map(l => {
    const r = pinLine(l);
    if (r.changed) { changed = true; changedCount++; }
    return r.line;
  });
  if (changed) fs.writeFileSync(p, out.join("\n"), "utf8");
}

console.log(`Pinned updates: ${changedCount}`);
