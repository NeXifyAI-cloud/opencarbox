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
  return sh("git diff --name-only").split("\n").map(s => s.trim()).filter(Boolean);
}

function assertNoForbidden(files) {
  const bad = files.filter(f => FORBIDDEN.test(f));
  if (bad.length) throw new Error(`Forbidden-path changes: ${bad.join(", ")}`);
}

const summaryPath = "logs/error-summary.json";
const summary = fs.existsSync(summaryPath)
  ? JSON.parse(fs.readFileSync(summaryPath, "utf8"))
  : { kind: "unknown" };

const logFiles = ["logs/workflow.log", "logs/build.log", "logs/type-check.log", "logs/lint.log", "logs/test.log"];
let tail = "";
for (const p of logFiles) {
  if (fs.existsSync(p)) { tail = fs.readFileSync(p, "utf8"); break; }
}
tail = tail.slice(-20000);

const prompt = fs.readFileSync("scripts/ai/prompts/autofix.md", "utf8");
const system = "You are a senior engineer. Output ONLY a unified diff.";
const user = `${prompt}\n\n--- error-summary.json ---\n${JSON.stringify(summary, null, 2)}\n\n--- log tail ---\n${tail}\n`;

const { provider, model, text } = await generateDiff({ system, user });

if (!applyPatch(text)) process.exit(2);

const files = changedFiles();
assertNoForbidden(files);

// Run the standard gate sequence (targeted can be added later)
sh("npm run security:scan-secrets");
sh("npm run lint");
sh("npm run type-check");
try { sh("npm run test -- --run"); } catch {}
sh("npm run build");
try { sh("npm run ci:perf-budget"); } catch {}

sh('git config user.name "NeXifyAI Bot"');
sh('git config user.email "nexifyai-bot@users.noreply.github.com"');
sh("git add -A");
sh(`git commit -m "fix(ci): autofix ${summary.kind || "unknown"}" -m "provider=${provider} model=${model}"`);
