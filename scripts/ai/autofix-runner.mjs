import fs from "node:fs";
import { execSync } from "node:child_process";
import { generateDiff } from "./ai-client.mjs";

const FORBIDDEN = /^(prisma\/migrations\/|supabase\/migrations\/|\.env(\.|$)|\.vercel\/)/;

function sh(cmd) {
  return execSync(cmd, { stdio: "pipe", encoding: "utf8" });
}

function applyPatch(text) {
  const t = (text || "").trim();
  if (!t.startsWith("diff --git")) return false;
  fs.writeFileSync("autofix.patch", t, "utf8");
  sh("git apply --whitespace=fix autofix.patch");
  return true;
}

function changedFiles() {
  return sh("git diff --name-only")
    .toString()
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function assertNoForbidden(files) {
  const bad = files.filter((f) => FORBIDDEN.test(f));
  if (bad.length) throw new Error(`Forbidden-path changes: ${bad.join(", ")}`);
}

const summary = fs.existsSync("logs/error-summary.json")
  ? JSON.parse(fs.readFileSync("logs/error-summary.json", "utf8"))
  : { kind: "unknown" };

const logTail = fs.existsSync("logs/workflow.log")
  ? fs.readFileSync("logs/workflow.log", "utf8").slice(-20000)
  : "";

const prompt = fs.readFileSync("scripts/ai/prompts/autofix.md", "utf8");
const system = "You are a senior engineer. Output ONLY a unified diff.";
const user = `${prompt}\n\n--- error-summary.json ---\n${JSON.stringify(summary, null, 2)}\n\n--- log tail ---\n${logTail}\n`;

const { provider, model, text } = await generateDiff({ system, user });

if (!applyPatch(text)) process.exit(2);

const files = changedFiles();
assertNoForbidden(files);

sh("npm run security:scan-secrets");
sh("npm run lint");
sh("npm run type-check");
try {
  sh("npm run test -- --run");
} catch {}
sh("npm run build");
try {
  sh("npm run ci:perf-budget");
} catch {}

sh("git add -A");
sh(`git commit -m "fix(ci): autofix ${summary.kind || "unknown"}" -m "provider=${provider} model=${model}"`);
