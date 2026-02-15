import { execSync } from "node:child_process";

function sh(cmd) {
  return execSync(cmd, { stdio: "pipe", encoding: "utf8" }).trim();
}

const base = process.env.CI_DEFAULT_BRANCH || "main";
const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, "");
const exclude = [/^main$/, /^master$/, /^autofix\//, /^repair\//, /^dependabot\//];

const branches = sh("git for-each-ref --format='%(refname:short)' refs/remotes/origin")
  .split("\n")
  .map((s) => s.replace(/^origin\//, ""))
  .filter(Boolean);

for (const br of branches) {
  if (exclude.some((re) => re.test(br))) continue;

  const repair = `repair/${br.replaceAll("/", "-")}/${dateTag}`;
  sh(`git checkout -B "${repair}" "origin/${br}"`);

  try {
    sh(`git merge --no-edit "origin/${base}"`);
  } catch {
    sh("git merge --abort || true");
    sh(`git push -u origin "${repair}"`);
    continue;
  }

  sh(`git push -u origin "${repair}"`);
}
