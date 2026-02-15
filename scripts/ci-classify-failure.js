#!/usr/bin/env node
const fs = require("fs");

const inputPath = process.argv[2] || "logs/workflow.log";
const outPath = "logs/error-summary.json";

function classify(log) {
  const text = (log || "").toLowerCase();

  if (!text.trim()) return { kind: "unknown", reason: "empty-log" };
  if (/(econnreset|timed out|network error|502 bad gateway|503 service unavailable|enotfound)/.test(text)) {
    return { kind: "infra", reason: "network-or-service" };
  }
  if (/secret|credential|token/.test(text) && /scan|leak|detected|forbidden/.test(text)) {
    return { kind: "security", reason: "secret-scan" };
  }
  if (/eslint|lint/.test(text) && /(error|failed)/.test(text)) {
    return { kind: "lint", reason: "lint-errors" };
  }
  if (/tsc|typescript|type-check/.test(text) && /(error|failed)/.test(text)) {
    return { kind: "type", reason: "type-errors" };
  }
  if (/(vitest|jest|test\s+failed|failing test)/.test(text)) {
    return { kind: "test", reason: "test-failures" };
  }
  if (/(next build|build failed|compile error|failed to compile)/.test(text)) {
    return { kind: "build", reason: "build-failure" };
  }

  return { kind: "unknown", reason: "unmatched" };
}

const log = fs.existsSync(inputPath) ? fs.readFileSync(inputPath, "utf8") : "";
const summary = classify(log);
summary.source = inputPath;
summary.generatedAt = new Date().toISOString();

fs.mkdirSync("logs", { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
console.log(`Wrote ${outPath}: ${summary.kind}`);
