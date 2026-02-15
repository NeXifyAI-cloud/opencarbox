// Baseline perf budget: always pass unless configured.
// Extend later: parse Next.js build output or bundle analyzer stats.

const maxMs = process.env.PERF_BUDGET_MAX_MS ? Number(process.env.PERF_BUDGET_MAX_MS) : null;

if (!maxMs) {
  console.log("Perf budget: not configured (PASS).");
  process.exit(0);
}

// Example hook point: measure build duration externally and pass it in env.
const actual = process.env.PERF_BUDGET_ACTUAL_MS ? Number(process.env.PERF_BUDGET_ACTUAL_MS) : null;
if (actual == null) {
  console.log("Perf budget configured but no actual measurement provided (PASS).");
  process.exit(0);
}

if (actual > maxMs) {
  console.error(`Perf budget failed: ${actual}ms > ${maxMs}ms`);
  process.exit(1);
}

console.log(`Perf budget OK: ${actual}ms <= ${maxMs}ms`);
