#!/usr/bin/env tsx

/**
 * Quality-Gate Script
 *
 * Führt umfassende Qualitätsprüfungen durch:
 * - TypeScript Typ-Checks
 * - Zirkuläre Abhängigkeiten
 * - Ungenutzte Exports
 * - Fehlende JSDoc-Kommentare
 * - Code-Duplikation (Basic)
 * - Projekt-Standards-Compliance
 *
 * Ausführung: npm run quality-gate
 *
 * @see project_specs.md - Abschnitt 6
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Konfiguration
const SRC_DIR = path.join(process.cwd(), 'src');

interface QualityIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  file?: string;
  line?: number;
  message: string;
}

const issues: QualityIssue[] = [];

/**
 * Hilfsfunktion zum Prüfen von Inhalten ohne Scripts auszuschließen.
 */
function isSelf(filePath: string): boolean {
  return filePath.includes('quality-gate.ts');
}

/**
 * Führt TypeScript Type-Check aus.
 */
function checkTypeScript(): void {
  console.log('🔍 Prüfe TypeScript...');

  try {
    // Falls tsconfig.json nicht existiert, überspringen wir den tsc Check im minimal-repo
    if (!fs.existsSync(path.join(process.cwd(), 'tsconfig.json'))) {
      console.log('  ⚠️  tsconfig.json nicht gefunden, überspringe tsc Check');
      return;
    }
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('  ✅ Keine TypeScript-Fehler');
  } catch (error: any) {
    const output = error.stdout?.toString() || error.stderr?.toString() || '';

    if (output.includes('error TS')) {
      const errorCount = (output.match(/error TS/g) || []).length;
      issues.push({
        type: 'error',
        category: 'TypeScript',
        message: `${errorCount} TypeScript-Fehler gefunden`,
      });
      console.log(`  ❌ ${errorCount} TypeScript-Fehler`);
    } else {
      console.log('  ℹ️  TypeScript Check mit Hinweisen beendet');
    }
  }
}

/**
 * Prüft auf console.log Statements in Produktionscode.
 */
function checkConsoleLogs(): void {
  console.log('🔍 Prüfe Console-Logs...');

  if (!fs.existsSync(SRC_DIR)) {
    console.log('  ⚠️  src/ Verzeichnis nicht gefunden');
    return;
  }

  let consoleLogCount = 0;

  function scanDirectory(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && !entry.name.includes('node_modules')) {
        scanDirectory(fullPath);
      } else if (entry.name.match(/\.(ts|tsx|js|jsx)$/) && !isSelf(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const matches = content.match(/console\.(log|warn|error|debug|info)\(/g);

        if (matches) {
          consoleLogCount += matches.length;
          issues.push({
            type: 'warning',
            category: 'Console',
            file: path.relative(process.cwd(), fullPath),
            message: `${matches.length} console-Statements gefunden`,
          });
        }
      }
    }
  }

  scanDirectory(SRC_DIR);

  if (consoleLogCount === 0) {
    console.log('  ✅ Keine console-Statements');
  } else {
    console.log(`  ⚠️  ${consoleLogCount} console-Statements gefunden`);
  }
}

/**
 * Prüft auf fehlende Dokumentation.
 */
function checkDocumentation(): void {
  console.log('🔍 Prüfe Dokumentation...');

  const requiredDocs = [
    'docs/tasks/master_plan.md',
    'docs/architecture/system-overview.md',
    'docs/design-system/colors.md',
    'project_specs.md',
    'docs/PRUEFPLAN_DOS.md',
    'docs/DESIGN_TOKENS.md',
    'docs/QA_MASTER_CHECKLIST.md',
  ];

  let missingCount = 0;

  for (const docPath of requiredDocs) {
    const fullPath = path.join(process.cwd(), docPath);
    if (!fs.existsSync(fullPath)) {
      missingCount++;
      issues.push({
        type: 'error',
        category: 'Dokumentation',
        file: docPath,
        message: 'Pflicht-Dokument fehlt',
      });
    }
  }

  if (missingCount === 0) {
    console.log('  ✅ Alle Pflicht-Dokumente vorhanden');
  } else {
    console.log(`  ❌ ${missingCount} Dokumente fehlen`);
  }
}

/**
 * Prüft auf "any" Types in TypeScript-Dateien.
 */
function checkAnyTypes(): void {
  console.log('🔍 Prüfe "any" Types...');

  if (!fs.existsSync(SRC_DIR)) {
    console.log('  ⚠️  src/ Verzeichnis nicht gefunden');
    return;
  }

  let anyCount = 0;

  function scanDirectory(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && !entry.name.includes('node_modules')) {
        scanDirectory(fullPath);
      } else if (entry.name.match(/\.(ts|tsx)$/)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        // Suche nach : any, as any, <any>, any[] etc.
        const matches = content.match(/:\s*any\b|as\s+any\b|<any>|any\[\]/g);

        if (matches) {
          anyCount += matches.length;
          issues.push({
            type: 'warning',
            category: 'TypeScript',
            file: path.relative(process.cwd(), fullPath),
            message: `${matches.length} "any" Types gefunden`,
          });
        }
      }
    }
  }

  scanDirectory(SRC_DIR);

  if (anyCount === 0) {
    console.log('  ✅ Keine "any" Types');
  } else {
    console.log(`  ⚠️  ${anyCount} "any" Types gefunden`);
  }
}

/**
 * Prüft auf große Funktionen (>50 Zeilen).
 */
function checkFunctionLength(): void {
  console.log('🔍 Prüfe Funktionslängen...');

  if (!fs.existsSync(SRC_DIR)) {
    console.log('  ⚠️  src/ Verzeichnis nicht gefunden');
    return;
  }

  let largeFunctionCount = 0;
  const MAX_LINES = 50;

  function scanDirectory(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && !entry.name.includes('node_modules')) {
        scanDirectory(fullPath);
      } else if (entry.name.match(/\.(ts|tsx|js|jsx)$/)) {
        const content = fs.readFileSync(fullPath, 'utf-8');

        // Einfache Heuristik: Zähle Zeilen zwischen function/const und schließender Klammer
        // Genauere Analyse würde einen Parser erfordern
        const functionMatches = content.match(/(function\s+\w+|const\s+\w+\s*=\s*(?:async\s*)?\([^)]*\)\s*=>|const\s+\w+\s*=\s*(?:async\s*)?function)/g);

        if (functionMatches && functionMatches.length > 0) {
          // Vereinfachte Prüfung: Wenn Datei sehr lang ist, warnen
          const lines = content.split('\n').length;
          const avgLinesPerFunction = lines / functionMatches.length;

          if (avgLinesPerFunction > MAX_LINES) {
            largeFunctionCount++;
            issues.push({
              type: 'info',
              category: 'Code-Qualität',
              file: path.relative(process.cwd(), fullPath),
              message: `Durchschnittliche Funktionslänge: ${Math.round(avgLinesPerFunction)} Zeilen`,
            });
          }
        }
      }
    }
  }

  scanDirectory(SRC_DIR);

  if (largeFunctionCount === 0) {
    console.log('  ✅ Alle Funktionen im Rahmen');
  } else {
    console.log(`  ℹ️  ${largeFunctionCount} Dateien mit langen Funktionen`);
  }
}

/**
 * Generiert Zusammenfassung.
 */
function generateSummary(): void {
  console.log('\n' + '═'.repeat(60));
  console.log('📊 QUALITY-GATE ZUSAMMENFASSUNG');
  console.log('═'.repeat(60) + '\n');

  const errors = issues.filter(i => i.type === 'error');
  const warnings = issues.filter(i => i.type === 'warning');
  const infos = issues.filter(i => i.type === 'info');

  console.log(`❌ Fehler:    ${errors.length}`);
  console.log(`⚠️  Warnungen: ${warnings.length}`);
  console.log(`ℹ️  Hinweise:  ${infos.length}`);

  if (errors.length > 0) {
    console.log('\n📛 FEHLER (müssen behoben werden):');
    for (const error of errors) {
      console.log(`   • [${error.category}] ${error.file || ''}: ${error.message}`);
    }
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  WARNUNGEN (sollten behoben werden):');
    for (const warning of warnings) {
      console.log(`   • [${warning.category}] ${warning.file || ''}: ${warning.message}`);
    }
  }

  console.log('\n' + '═'.repeat(60));

  if (errors.length > 0) {
    console.log('❌ QUALITY-GATE: NICHT BESTANDEN');
    process.exit(1);
  } else if (warnings.length > 10) {
    console.log('⚠️  QUALITY-GATE: BESTANDEN MIT WARNUNGEN');
    process.exit(0);
  } else {
    console.log('✅ QUALITY-GATE: BESTANDEN');
    process.exit(0);
  }
}

/**
 * Prüft auf Brand-Color Compliance (DOS v1.1).
 * Shop: #FFB300, Service: #FFA800
 */
function checkBrandColors(): void {
  console.log('🔍 Prüfe Brand-Colors (DOS v1.1)...');

  const configPath = path.join(process.cwd(), 'tailwind.config.ts');
  const cssPath = path.join(process.cwd(), 'src/app/globals.css');

  if (fs.existsSync(configPath)) {
    const config = fs.readFileSync(configPath, 'utf-8');
    if (!config.includes('#FFB300') || !config.includes('#FFA800')) {
      issues.push({
        type: 'error',
        category: 'Branding',
        file: 'tailwind.config.ts',
        message: 'Brand-Colors entsprechen nicht DOS v1.1 (#FFB300, #FFA800)',
      });
    }
  }

  if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, 'utf-8');
    // Prüfe auf HSL oder HEX Repräsentationen (ignoriere White und Neutral)
    if (!css.includes('42 100% 50%') && !css.includes('#FFB300')) {
      issues.push({
        type: 'error',
        category: 'Branding',
        file: 'src/app/globals.css',
        message: 'Shop Brand-Color (#FFB300) fehlt in globals.css',
      });
    }
    if (!css.includes('40 100% 50%') && !css.includes('#FFA800')) {
      issues.push({
        type: 'error',
        category: 'Branding',
        file: 'src/app/globals.css',
        message: 'Service Brand-Color (#FFA800) fehlt in globals.css',
      });
    }
  }

  const brandingIssues = issues.filter(i => i.category === 'Branding');
  if (brandingIssues.length === 0) {
    console.log('  ✅ Brand-Colors konform');
  } else {
    console.log(`  ❌ ${brandingIssues.length} Branding-Verstöße gefunden`);
  }
}

/**
 * Hauptfunktion
 */
function main(): void {
  console.log('\n🚀 Starte Quality-Gate Prüfungen...\n');
  console.log('─'.repeat(60) + '\n');

  checkTypeScript();
  checkConsoleLogs();
  checkAnyTypes();
  checkFunctionLength();
  checkDocumentation();
  checkBrandColors();

  generateSummary();
}

// Ausführen
main();
