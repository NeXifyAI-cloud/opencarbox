import fs from "node:fs";
import { execSync } from "node:child_process";
import { generateDiff } from "./ai-client.mjs";

const FORBIDDEN = /^(prisma\/migrations\/|supabase\/migrations\/|\.env(\.|$)|\.vercel\/)/;

function sh(cmd) {
  return execSync(cmd, { stdio: "pipe", encoding: "utf8" });
}

function changedFiles() {
  const out = sh("git diff --name-only");
  return out
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function assertNoForbiddenChanges(files) {
  const bad = files.filter((f) => FORBIDDEN.test(f));
  if (bad.length) throw new Error(`Forbidden-path changes detected: ${bad.join(", ")}`);
}

function applyPatch(patchText) {
  if (!patchText.startsWith("diff --git")) return false;
  fs.writeFileSync("autofix.patch", patchText, "utf8");
  sh("git apply --whitespace=fix autofix.patch");
  return true;
}

function runChecks(target) {
  const checks = [];
  checks.push("npm run security:scan-secrets");
  if (target === "lint") checks.push("npm run lint");
  if (target === "type") checks.push("npm run type-check");
  if (target === "test") checks.push("npm run test -- --run");
  if (target === "build") checks.push("npm run build");
  if (target === "full") checks.push("npm run lint", "npm run type-check", "npm run test -- --run", "npm run build");
  for (const c of checks) sh(c);
}

const summary = fs.existsSync("logs/error-summary.json")
  ? JSON.parse(fs.readFileSync("logs/error-summary.json", "utf8"))
  : { kind: "unknown" };

const target =
  summary.kind === "lint"
    ? "lint"
    : summary.kind === "typecheck"
      ? "type"
      : summary.kind === "test"
        ? "test"
        : summary.kind === "build"
          ? "build"
          : "full";

const logsText = fs.existsSync("logs/workflow.log")
  ? fs.readFileSync("logs/workflow.log", "utf8").slice(-20000)
  : "(no logs/workflow.log found)";

const system = "You are a senior engineer. Output ONLY a unified diff.";
const user = [
  fs.readFileSync("scripts/ai/prompts/autofix.md", "utf8"),
  "\n\n--- error-summary.json ---\n",
  JSON.stringify(summary, null, 2),
  "\n\n--- tail logs/workflow.log ---\n",
  logsText,
].join("");

const { provider, model, text } = await generateDiff({ system, user });

if (!applyPatch(text)) {
  console.log(`No patch produced by ${provider}:${model}`);
  process.exit(2);
}

const files = changedFiles();
assertNoForbiddenChanges(files);

runChecks(target);
runChecks("full");

sh('git config user.name "NeXifyAI Bot"');
sh('git config user.email "nexifyai-bot@users.noreply.github.com"');
sh("git add -A");
sh(`git commit -m "fix(ci): autofix ${summary.kind || "unknown"}" -m "provider=${provider} model=${model}"`);
console.log("Autofix committed successfully.");
