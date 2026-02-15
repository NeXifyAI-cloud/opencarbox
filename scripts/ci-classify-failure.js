import fs from "node:fs";

const inFile = process.argv[2] || "logs/workflow.log";
const outFile = "logs/error-summary.json";

let text = "";
try { text = fs.readFileSync(inFile, "utf8"); } catch { text = ""; }

const t = text.toLowerCase();
let kind = "unknown";
let infra = false;

const infraSignals = ["econnreset", "etimedout", "429", "rate limit", "network", "temporary failure", "registry.npmjs.org"];
if (infraSignals.some(s => t.includes(s))) { kind = "infra"; infra = true; }
else if (t.includes("eslint") || t.includes("lint")) kind = "lint";
else if (t.includes("tsc") || t.includes("type") || t.includes("typescript")) kind = "typecheck";
else if (t.includes("jest") || t.includes("vitest") || t.includes("test failed")) kind = "test";
else if (t.includes("next build") || t.includes("build failed") || t.includes("webpack")) kind = "build";
else if (t.includes("budget") || t.includes("bundle")) kind = "perf";

fs.mkdirSync("logs", { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ kind, infra }, null, 2));
console.log(`Classified failure: ${kind}`);
