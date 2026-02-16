import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const reportFiles = ['eslint-report.txt', 'tsc-report.txt', 'test-report.txt']
const backlogPath = 'NOTES/backlog.md'

function summarizeReport(content: string): string[] {
  return content
    .split('\n')
    .filter((line) => line.toLowerCase().includes('error') || line.toLowerCase().includes('failed'))
    .slice(0, 10)
}

function run(): void {
  const findings: string[] = []

  for (const file of reportFiles) {
    if (!existsSync(file)) {
      continue
    }

    const content = readFileSync(file, 'utf-8')
    const summary = summarizeReport(content)
    if (summary.length > 0) {
      findings.push(`### Findings from ${file}`, ...summary.map((line) => `- ${line}`))
    }
  }

  if (findings.length === 0) {
    return
  }

  const current = existsSync(backlogPath) ? readFileSync(backlogPath, 'utf-8') : '# Backlog\n'
  const updated = `${current}\n\n## Auto Improve Update (${new Date().toISOString()})\n${findings.join('\n')}\n`
  writeFileSync(backlogPath, updated, 'utf-8')
}

run()
