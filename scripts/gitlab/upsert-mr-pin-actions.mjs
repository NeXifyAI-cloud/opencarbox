import { execSync } from "node:child_process";

function sh(cmd) {
  return execSync(cmd, { stdio: "pipe", encoding: "utf8" }).trim();
}

const hasChanges = sh("git status --porcelain");
if (!hasChanges) {
  console.log("No action pinning changes detected.");
  process.exit(0);
}

const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, "");
const branch = `maintenance/pin-actions/${dateTag}`;

sh('git config user.name "NeXifyAI Bot"');
sh('git config user.email "nexifyai-bot@gitlab.com"');
sh(`git checkout -B "${branch}"`);
sh("git add -A");
sh('git commit -m "chore(ci): pin GitHub actions"');
sh(`git push -u origin "${branch}"`);

console.log(`Prepared maintenance branch: ${branch}`);
console.log("Create or upsert MR via your preferred GitLab API workflow.");
