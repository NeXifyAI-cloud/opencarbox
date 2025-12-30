import * as fs from 'fs';
import { glob } from 'glob';
import * as path from 'path';
import { Memory } from './memory';
import { Oracle } from './oracle';

/**
 * Sync Core - Watcher für automatische Wiki-Updates und Oracle-Synchronisation
 */

/**
 * Synchronisiert Wiki/Docs zu project_memory
 */
export async function syncWiki() {
  const docsDir = path.join(process.cwd(), 'docs');
  console.log(`📚 Syncing Wiki from ${docsDir}...`);

  // Finde alle Markdown-Dateien
  const mdFiles = await glob('**/*.md', { cwd: docsDir });

  let syncCount = 0;

  for (const file of mdFiles) {
    const filePath = path.join(docsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extrahiere Titel (erste H1 oder Dateiname)
    const titleMatch = content.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : path.basename(file, '.md');

    // Kategorie aus Pfad ableiten
    const category = path.dirname(file).split(path.sep)[0] || 'general';

    // Prüfe, ob bereits im Memory (basierend auf Titel)
    const existing = await Memory.recall(title);

    if (existing.length === 0) {
      // Neu - ins Memory aufnehmen
      await Memory.remember({
        type: 'KNOWLEDGE',
        category: category,
        title: title,
        content: content,
        metadata: { source: file, syncedAt: new Date().toISOString() },
        tags: ['docs', 'wiki', category]
      });
      syncCount++;
    }
  }

  console.log(`✅ Wiki Sync complete: ${syncCount} neue Dokumente hinzugefügt`);
}

/**
 * Synchronisiert .clinerules mit der Dokumentation
 */
export async function syncRulesToDocs() {
  const clinerules = path.join(process.cwd(), '.clinerules');
  const docsPath = path.join(process.cwd(), 'docs', 'CLINE_RULES.md');

  if (!fs.existsSync(clinerules)) {
    console.warn('⚠️ .clinerules nicht gefunden');
    return;
  }

  const content = fs.readFileSync(clinerules, 'utf-8');

  // Erstelle formatierte Docs-Version
  const docsContent = `# Cline AI Agent Rules

> **Auto-generiert aus .clinerules**
> **Zuletzt synchronisiert:** ${new Date().toISOString()}

${content}
`;

  fs.writeFileSync(docsPath, docsContent, 'utf-8');
  console.log('✅ .clinerules -> docs/CLINE_RULES.md synchronisiert');
}

/**
 * Synchronisiert Docs zu Oracle Kontext
 */
export async function syncDocsToOracle() {
  console.log('🧠 Synchronizing docs to Oracle context...');

  // Hole wichtigste Dokumente
  const criticalDocs = [
    'docs/architecture/system-overview.md',
    'docs/architecture/data-flow.md',
    'project_specs.md',
    '.github/copilot-instructions.md'
  ];

  for (const docPath of criticalDocs) {
    const fullPath = path.join(process.cwd(), docPath);

    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      // Verarbeite Dokument mit quickThink statt nicht existierender optimizeContext-Methode
      await Oracle.quickThink(`Memoriere folgendes Dokument:\nDocument: ${docPath}\n\n${content.slice(0, 2000)}`);
      console.log(`  ✅ ${docPath} -> Oracle`);
    }
  }

  console.log('✅ Docs successfully synced to Oracle');
}

/**
 * Führt alle Sync-Operationen aus
 */
export async function syncAll() {
  console.log('🔄 Starting full synchronization...\n');

  await syncWiki();
  console.log('');

  await syncRulesToDocs();
  console.log('');

  await syncDocsToOracle();
  console.log('');

  console.log('🎉 Full synchronization complete!');
}

if (require.main === module) {
  syncAll().catch(console.error);
}
