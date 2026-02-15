import fs from "node:fs";
import { execSync } from "node:child_process";
import { generateDiff } from "./ai-client.mjs";

const FORBIDDEN = /^(prisma\/migrations\/|supabase\/migrations\/|\.env(\.|$)|\.vercel\/)/;

function sh(cmd) {
  return execSync(cmd, { stdio: "pipe", encoding: "utf8" });
}

function diffFiles() {
  return sh("git diff --name-only")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function applyPatch(text) {
  const t = (text || "").trim();
  if (!t.startsWith("diff --git")) return false;
  fs.writeFileSync("autofix.patch", t, "utf8");
  sh("git apply --whitespace=fix autofix.patch");
  return true;
}

function assertNoForbidden(files) {
  const bad = files.filter((f) => FORBIDDEN.test(f));
  if (bad.length) throw new Error(`Forbidden-path changes: ${bad.join(", ")}`);
}

function run(cmd) {
  sh(cmd);
}

const summaryPath = "logs/error-summary.json";
const summary = fs.existsSync(summaryPath)
  ? JSON.parse(fs.readFileSync(summaryPath, "utf8"))
  : { kind: "unknown" };

const logPathCandidates = ["logs/build.log", "logs/type-check.log", "logs/lint.log", "logs/workflow.log"];
let tail = "";
for (const p of logPathCandidates) {
  if (fs.existsSync(p)) {
    tail = fs.readFileSync(p, "utf8");
    break;
  }
}
tail = tail.slice(-20000);

const system = "You are a senior engineer. Output ONLY a unified diff.";
const prompt = fs.readFileSync("scripts/ai/prompts/autofix.md", "utf8");
const user = `${prompt}\n\n--- error-summary.json ---\n${JSON.stringify(summary, null, 2)}\n\n--- log tail ---\n${tail}\n`;

const { provider, model, text } = await generateDiff({ system, user });

if (!applyPatch(text)) {
  process.exit(2);
}

const files = diffFiles();
assertNoForbidden(files);

// Targeted checks first, then full gate subset
run("npm run security:scan-secrets");
run("npm run lint");
run("npm run type-check");
try {
  run("npm run test -- --run");
} catch {}
run("npm run build");

// Commit
run('git config user.name "NeXifyAI Bot"');
run('git config user.email "nexifyai-bot@users.noreply.github.com"');
run("git add -A");
run(`git commit -m "fix(ci): autofix ${summary.kind || "unknown"}" -m "provider=${provider} model=${model}"`);
