import process from "node:process";

const token = process.env.GITLAB_TOKEN;
if (!token) throw new Error("GITLAB_TOKEN missing (Project Access Token with api scope).");

const api = process.env.CI_API_V4_URL;
const projectId = process.env.CI_PROJECT_ID;
const sourceBranch = `autofix/${process.env.CI_COMMIT_SHORT_SHA}`;
const targetBranch = process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME || process.env.CI_DEFAULT_BRANCH || "main";

async function gl(path, opts = {}) {
  const res = await fetch(`${api}/projects/${encodeURIComponent(projectId)}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": token,
      ...(opts.headers || {}),
    },
  });

  const txt = await res.text();
  if (!res.ok) throw new Error(`GitLab API ${res.status}: ${txt}`);
  return txt ? JSON.parse(txt) : null;
}

async function main() {
  const list = await gl(`/merge_requests?state=opened&source_branch=${encodeURIComponent(sourceBranch)}`);
  const title = `fix(ci): autofix ${process.env.CI_COMMIT_SHORT_SHA}`;
  const description = `Automated fix (NSCALE/DeepSeek only).\n\nSource: ${process.env.CI_PIPELINE_URL}\n`;

  if (Array.isArray(list) && list.length) {
    const mr = list[0];
    await gl(`/merge_requests/${mr.iid}`, {
      method: "PUT",
      body: JSON.stringify({ title, description }),
    });
    return;
  }

  await gl("/merge_requests", {
    method: "POST",
    body: JSON.stringify({
      source_branch: sourceBranch,
      target_branch: targetBranch,
      title,
      description,
      remove_source_branch: true,
      squash: true,
    }),
  });
}

main();
