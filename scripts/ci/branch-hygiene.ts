import { writeFile } from 'node:fs/promises'

/**
 * Branch Hygiene Autopilot
 *
 * - Detect inactive branches
 * - Generate markdown report
 * - Optional safe deletion (apply mode)
 */

type Branch = {
  name: string
  protected: boolean
  commit?: { sha: string }
}

type Pull = {
  head?: { ref?: string }
  state?: string
}

type CommitResponse = {
  commit?: { committer?: { date?: string } }
}

type CliOptions = {
  repo: string
  thresholdDays: number
  apply: boolean
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2)
  const map = new Map<string, string>()

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (arg.startsWith('--')) {
      const key = arg.replace(/^--/, '')
      const next = args[i + 1]
      if (next && !next.startsWith('--')) {
        map.set(key, next)
        i += 1
      } else {
        map.set(key, 'true')
      }
    }
  }

  const repo = map.get('repo') || process.env.GITHUB_REPOSITORY || ''
  if (!repo) {
    throw new Error('Missing repo. Provide --repo owner/name or GITHUB_REPOSITORY env.')
  }

  return {
    repo,
    thresholdDays: Number(map.get('thresholdDays') || '21'),
    apply: (map.get('apply') || 'false') === 'true',
  }
}

async function ghApi(path: string, method: 'GET' | 'DELETE' = 'GET') {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN
  if (!token) {
    throw new Error('Missing GH_TOKEN/GITHUB_TOKEN for GitHub API access.')
  }

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

  if (response.status === 204) {
    return null
  }

  return response.json()
}

function daysSince(dateIso: string): number {
  const then = new Date(dateIso).getTime()
  const now = Date.now()
  return Math.floor((now - then) / (1000 * 60 * 60 * 24))
}

async function main() {
  const { repo, thresholdDays, apply } = parseArgs()
  const [owner, name] = repo.split('/')

  const protectedNames = new Set(['main', 'master', 'develop', 'development'])

  const branches = (await ghApi(`repos/${owner}/${name}/branches?per_page=100`)) as Branch[]
  const pulls = (await ghApi(`repos/${owner}/${name}/pulls?state=open&per_page=100`)) as Pull[]
  const openPrHeads = new Set(
    pulls
      .map((pull) => pull.head?.ref)
      .filter((ref): ref is string => typeof ref === 'string' && ref.length > 0)
  )

  const stale: Array<{ branch: string; days: number; hasOpenPr: boolean; action: string }> = []
  const healthy: Array<{ branch: string; days: number; hasOpenPr: boolean }> = []

  for (const branch of branches) {
    if (!branch.name || branch.protected || protectedNames.has(branch.name)) {
      continue
    }

    const commitSha = branch.commit?.sha
    if (!commitSha) {
      continue
    }

    const commit = (await ghApi(`repos/${owner}/${name}/commits/${commitSha}`)) as CommitResponse
    const date = commit.commit?.committer?.date
    if (!date) {
      continue
    }

    const ageDays = daysSince(date)
    const hasOpenPr = openPrHeads.has(branch.name)

    if (ageDays >= thresholdDays && !hasOpenPr) {
      let action = 'would-delete'
      if (apply) {
        await ghApi(
          `repos/${owner}/${name}/git/refs/heads/${encodeURIComponent(branch.name)}`,
          'DELETE'
        )
        action = 'deleted'
      }
      stale.push({ branch: branch.name, days: ageDays, hasOpenPr, action })
    } else {
      healthy.push({ branch: branch.name, days: ageDays, hasOpenPr })
    }
  }

  const generatedAt = new Date().toISOString()
  const mode = apply ? 'APPLY (delete enabled)' : 'DRY-RUN'

  const lines: string[] = []
  lines.push('# Branch Hygiene Report')
  lines.push('')
  lines.push(`- Repository: \`${repo}\``)
  lines.push(`- Generated: \`${generatedAt}\``)
  lines.push(`- Mode: **${mode}**`)
  lines.push(`- Inactive threshold: **${thresholdDays} days**`)
  lines.push('')

  lines.push('## Inactive branches')
  lines.push('')
  lines.push('| Branch | Age (days) | Open PR | Action |')
  lines.push('|---|---:|---:|---|')
  if (stale.length === 0) {
    lines.push('| _none_ | - | - | - |')
  } else {
    for (const item of stale.sort((a, b) => b.days - a.days)) {
      lines.push(
        `| ${item.branch} | ${item.days} | ${item.hasOpenPr ? 'yes' : 'no'} | ${item.action} |`
      )
    }
  }
  lines.push('')

  lines.push('## Active or exempt branches')
  lines.push('')
  lines.push('| Branch | Age (days) | Open PR |')
  lines.push('|---|---:|---:|')
  if (healthy.length === 0) {
    lines.push('| _none_ | - | - |')
  } else {
    for (const item of healthy.sort((a, b) => a.days - b.days).slice(0, 50)) {
      lines.push(`| ${item.branch} | ${item.days} | ${item.hasOpenPr ? 'yes' : 'no'} |`)
    }
  }

  await writeFile('docs/branch-hygiene.md', `${lines.join('\n')}\n`, 'utf8')

  // eslint-disable-next-line no-console
  console.log(`Branch hygiene completed (${mode}). Stale branches: ${stale.length}`)
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
