import { writeFile } from 'node:fs/promises'

/**
 * Branch Hygiene Autopilot (debt-free edition)
 *
 * Safety model:
 * - default dry-run
 * - optional apply mode
 * - safe-only deletion: only stale branches with merged PR history and no open PR
 */

type Branch = {
  name: string
  protected: boolean
  commit?: { sha: string }
}

type Pull = {
  state?: 'open' | 'closed'
  merged_at?: string | null
  head?: { ref?: string }
}

type CommitResponse = {
  commit?: { committer?: { date?: string } }
}

type BranchDecision = {
  branch: string
  ageDays: number
  hasOpenPr: boolean
  hasMergedPr: boolean
  action: 'deleted' | 'would-delete' | 'skip'
  reason: string
}

type CliOptions = {
  repo: string
  thresholdDays: number
  apply: boolean
  safeOnly: boolean
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2)
  const map = new Map<string, string>()

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (!arg.startsWith('--')) continue

    const key = arg.replace(/^--/, '')
    const next = args[i + 1]
    if (next && !next.startsWith('--')) {
      map.set(key, next)
      i += 1
    } else {
      map.set(key, 'true')
    }
  }

  const repo = map.get('repo') || process.env.GITHUB_REPOSITORY || ''
  if (!repo) throw new Error('Missing repo. Provide --repo owner/name or GITHUB_REPOSITORY env.')

  return {
    repo,
    thresholdDays: Number(map.get('thresholdDays') || '30'),
    apply: (map.get('apply') || 'false') === 'true',
    safeOnly: (map.get('safeOnly') || 'true') === 'true',
  }
}

async function ghApi(path: string, method: 'GET' | 'DELETE' = 'GET') {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN
  if (!token) throw new Error('Missing GH_TOKEN/GITHUB_TOKEN for GitHub API access.')

  const response = await fetch(`https://api.github.com/${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`GitHub API ${method} ${path} failed (${response.status}): ${text}`)
  }

  if (response.status === 204) return null
  return response.json()
}

async function ghPaginate<T>(path: string): Promise<T[]> {
  const items: T[] = []
  let page = 1

  while (true) {
    const chunk = (await ghApi(
      `${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`
    )) as T[]
    if (!Array.isArray(chunk) || chunk.length === 0) break
    items.push(...chunk)
    if (chunk.length < 100) break
    page += 1
  }

  return items
}

function daysSince(dateIso: string): number {
  return Math.floor((Date.now() - new Date(dateIso).getTime()) / (1000 * 60 * 60 * 24))
}

function isProtectedName(branch: string): boolean {
  const reserved = ['main', 'master', 'develop', 'development', 'production', 'staging']
  return reserved.includes(branch)
}

async function main() {
  const { repo, thresholdDays, apply, safeOnly } = parseArgs()
  const [owner, name] = repo.split('/')

  const branches = await ghPaginate<Branch>(`repos/${owner}/${name}/branches`)
  const pulls = await ghPaginate<Pull>(`repos/${owner}/${name}/pulls?state=all`)

  const openHeads = new Set(
    pulls
      .filter((pull) => pull.state === 'open')
      .map((pull) => pull.head?.ref)
      .filter((ref): ref is string => typeof ref === 'string' && ref.length > 0)
  )

  const mergedHeads = new Set(
    pulls
      .filter((pull) => pull.state === 'closed' && Boolean(pull.merged_at))
      .map((pull) => pull.head?.ref)
      .filter((ref): ref is string => typeof ref === 'string' && ref.length > 0)
  )

  const decisions: BranchDecision[] = []

  for (const branch of branches) {
    const branchName = branch.name
    if (!branchName || branch.protected || isProtectedName(branchName)) continue

    const sha = branch.commit?.sha
    if (!sha) continue

    const commit = (await ghApi(`repos/${owner}/${name}/commits/${sha}`)) as CommitResponse
    const commitDate = commit.commit?.committer?.date
    if (!commitDate) continue

    const ageDays = daysSince(commitDate)
    const hasOpenPr = openHeads.has(branchName)
    const hasMergedPr = mergedHeads.has(branchName)

    if (ageDays < thresholdDays) {
      decisions.push({
        branch: branchName,
        ageDays,
        hasOpenPr,
        hasMergedPr,
        action: 'skip',
        reason: 'active-recent',
      })
      continue
    }

    if (hasOpenPr) {
      decisions.push({
        branch: branchName,
        ageDays,
        hasOpenPr,
        hasMergedPr,
        action: 'skip',
        reason: 'open-pr-exists',
      })
      continue
    }

    if (safeOnly && !hasMergedPr) {
      decisions.push({
        branch: branchName,
        ageDays,
        hasOpenPr,
        hasMergedPr,
        action: 'skip',
        reason: 'safe-only-no-merged-pr',
      })
      continue
    }

    if (apply) {
      await ghApi(
        `repos/${owner}/${name}/git/refs/heads/${encodeURIComponent(branchName)}`,
        'DELETE'
      )
      decisions.push({
        branch: branchName,
        ageDays,
        hasOpenPr,
        hasMergedPr,
        action: 'deleted',
        reason: safeOnly ? 'deleted-safe' : 'deleted',
      })
    } else {
      decisions.push({
        branch: branchName,
        ageDays,
        hasOpenPr,
        hasMergedPr,
        action: 'would-delete',
        reason: safeOnly ? 'candidate-safe' : 'candidate',
      })
    }
  }

  const generatedAt = new Date().toISOString()
  const mode = apply ? 'APPLY' : 'DRY-RUN'

  const deleted = decisions.filter((item) => item.action === 'deleted')
  const candidates = decisions.filter((item) => item.action === 'would-delete')
  const skipped = decisions.filter((item) => item.action === 'skip')

  const lines: string[] = []
  lines.push('# Branch Hygiene Report')
  lines.push('')
  lines.push(`- Repository: \`${repo}\``)
  lines.push(`- Generated: \`${generatedAt}\``)
  lines.push(`- Mode: **${mode}**`)
  lines.push(`- Inactive threshold: **${thresholdDays} days**`)
  lines.push(`- Safety mode: **${safeOnly ? 'safe-only (merged-PR required)' : 'aggressive'}**`)
  lines.push(
    `- Deleted: **${deleted.length}** | Candidates: **${candidates.length}** | Skipped: **${skipped.length}**`
  )
  lines.push('')

  lines.push('## Deletion candidates / deleted')
  lines.push('')
  lines.push('| Branch | Age (days) | Open PR | Merged PR | Action | Reason |')
  lines.push('|---|---:|---:|---:|---|---|')
  const actionable = [...deleted, ...candidates].sort((a, b) => b.ageDays - a.ageDays)
  if (actionable.length === 0) {
    lines.push('| _none_ | - | - | - | - | - |')
  } else {
    for (const item of actionable) {
      lines.push(
        `| ${item.branch} | ${item.ageDays} | ${item.hasOpenPr ? 'yes' : 'no'} | ${item.hasMergedPr ? 'yes' : 'no'} | ${item.action} | ${item.reason} |`
      )
    }
  }
  lines.push('')

  lines.push('## Skipped branches')
  lines.push('')
  lines.push('| Branch | Age (days) | Open PR | Merged PR | Reason |')
  lines.push('|---|---:|---:|---:|---|')
  if (skipped.length === 0) {
    lines.push('| _none_ | - | - | - | - |')
  } else {
    for (const item of skipped.sort((a, b) => b.ageDays - a.ageDays).slice(0, 100)) {
      lines.push(
        `| ${item.branch} | ${item.ageDays} | ${item.hasOpenPr ? 'yes' : 'no'} | ${item.hasMergedPr ? 'yes' : 'no'} | ${item.reason} |`
      )
    }
  }

  await writeFile('docs/branch-hygiene.md', `${lines.join('\n')}\n`, 'utf8')

  // eslint-disable-next-line no-console
  console.log(
    `Branch hygiene completed (${mode}, ${safeOnly ? 'safe-only' : 'aggressive'}). deleted=${deleted.length} candidates=${candidates.length} skipped=${skipped.length}`
  )
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
