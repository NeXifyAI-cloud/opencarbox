#!/usr/bin/env tsx

/**
 * Sync-Docs-to-Rules Script
 * 
 * Dieses Script extrahiert Kernregeln und Architektur-Entscheidungen
 * aus den /docs Markdown-Dateien und aktualisiert die .cursorrules Datei.
 * 
 * Ausführung: npm run sync-rules
 * Trigger: pre-commit Hook (Husky)
 * 
 * @see project_specs.md - Abschnitt 7.3
 */

import * as fs from 'fs';
import * as path from 'path';

// Konfiguration
const DOCS_DIR = path.join(process.cwd(), 'docs');
const CURSORRULES_PATH = path.join(process.cwd(), '.cursorrules');
const PROJECT_SPECS_PATH = path.join(process.cwd(), 'project_specs.md');

interface ExtractedRule {
  source: string;
  category: string;
  rules: string[];
}

/**
 * Liest alle Markdown-Dateien aus einem Verzeichnis rekursiv.
 */
function getMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Verzeichnis nicht gefunden: ${dir}`);
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Extrahiert Regeln aus einer Markdown-Datei.
 * Sucht nach speziellen Markierungen wie: <!-- RULE: ... -->
 * oder Abschnitten mit bestimmten Überschriften.
 */
function extractRulesFromMarkdown(filePath: string): ExtractedRule | null {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(process.cwd(), filePath);
  const rules: string[] = [];
  
  // Extrahiere explizite Regeln mit <!-- RULE: ... --> Kommentaren
  const ruleComments = content.match(/<!--\s*RULE:\s*(.+?)\s*-->/g);
  if (ruleComments) {
    for (const comment of ruleComments) {
      const match = comment.match(/<!--\s*RULE:\s*(.+?)\s*-->/);
      if (match) {
        rules.push(match[1].trim());
      }
    }
  }
  
  // Extrahiere Regeln aus "## Regeln" oder "### Vorgaben" Abschnitten
  const rulesSectionMatch = content.match(/##\s*(Regeln|Vorgaben|Rules|Standards|Verboten)\s*\n([\s\S]*?)(?=\n##|\n---|\$)/i);
  if (rulesSectionMatch) {
    const sectionContent = rulesSectionMatch[2];
    const bulletPoints = sectionContent.match(/^[-*]\s+(.+)$/gm);
    if (bulletPoints) {
      for (const point of bulletPoints) {
        const cleanedPoint = point.replace(/^[-*]\s+/, '').trim();
        if (cleanedPoint && !cleanedPoint.startsWith('[') && cleanedPoint.length > 10) {
          rules.push(cleanedPoint);
        }
      }
    }
  }
  
  if (rules.length === 0) {
    return null;
  }
  
  // Bestimme Kategorie basierend auf Dateipfad
  let category = 'general';
  if (filePath.includes('design-system')) category = 'design';
  if (filePath.includes('architecture')) category = 'architecture';
  if (filePath.includes('api')) category = 'api';
  if (filePath.includes('components')) category = 'components';
  if (filePath.includes('tasks')) category = 'tasks';
  
  return {
    source: relativePath,
    category,
    rules,
  };
}

/**
 * Aktualisiert die .cursorrules Datei mit extrahierten Regeln.
 */
function updateCursorRules(extractedRules: ExtractedRule[]): void {
  if (!fs.existsSync(CURSORRULES_PATH)) {
    console.error('❌ .cursorrules nicht gefunden!');
    return;
  }
  
  const currentRules = JSON.parse(fs.readFileSync(CURSORRULES_PATH, 'utf-8'));
  
  // Füge extrahierte Regeln hinzu
  const syncedRules: Record<string, string[]> = {};
  
  for (const extracted of extractedRules) {
    if (!syncedRules[extracted.category]) {
      syncedRules[extracted.category] = [];
    }
    syncedRules[extracted.category].push(...extracted.rules);
  }
  
  // Aktualisiere die .cursorrules
  currentRules.synced_from_docs = {
    last_sync: new Date().toISOString(),
    rules_by_category: syncedRules,
    sources: extractedRules.map(r => r.source),
  };
  
  // Schreibe aktualisierte Regeln
  fs.writeFileSync(
    CURSORRULES_PATH,
    JSON.stringify(currentRules, null, 2),
    'utf-8'
  );
  
  console.log('✅ .cursorrules erfolgreich aktualisiert');
}

/**
 * Hauptfunktion
 */
function main(): void {
  console.log('🔄 Starte Sync: Docs → .cursorrules\n');
  
  // 1. Sammle alle Markdown-Dateien
  const mdFiles = getMarkdownFiles(DOCS_DIR);
  
  // Füge project_specs.md hinzu
  if (fs.existsSync(PROJECT_SPECS_PATH)) {
    mdFiles.push(PROJECT_SPECS_PATH);
  }
  
  console.log(`📄 Gefundene Markdown-Dateien: ${mdFiles.length}`);
  
  // 2. Extrahiere Regeln
  const extractedRules: ExtractedRule[] = [];
  
  for (const file of mdFiles) {
    const rules = extractRulesFromMarkdown(file);
    if (rules) {
      extractedRules.push(rules);
      console.log(`  ✓ ${path.relative(process.cwd(), file)}: ${rules.rules.length} Regeln`);
    }
  }
  
  console.log(`\n📋 Extrahierte Regeln gesamt: ${extractedRules.reduce((sum, r) => sum + r.rules.length, 0)}`);
  
  // 3. Aktualisiere .cursorrules
  if (extractedRules.length > 0) {
    updateCursorRules(extractedRules);
  } else {
    console.log('ℹ️  Keine Regeln zum Synchronisieren gefunden.');
  }
  
  console.log('\n✨ Sync abgeschlossen!\n');
}

// Ausführen
main();

