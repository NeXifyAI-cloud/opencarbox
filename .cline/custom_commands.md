# Cline Custom Commands
# Diese Commands können in Cline via Slash-Commands verwendet werden
# Setup: Cline Settings → Custom Commands → Import this file

---
command: /think
description: Oracle Thinking Process aufrufen
script: |
  import { Oracle } from '@/scripts/core/oracle';
  const prompt = "${input}";
  const response = await Oracle.thinkWithMemory(prompt);
  console.log("💡 ORACLE GUIDANCE:");
  console.log(response.recommendation);
  console.log(`\nConfidence: ${(response.confidence * 100).toFixed(0)}%`);
  return response;

---
command: /recall
description: Memory durchsuchen
script: |
  import { Memory } from '@/scripts/core/memory';
  const query = "${input}";
  const memories = await Memory.recall(query);
  console.log(`📚 Found ${memories.length} relevant memories:`);
  memories.forEach(m => {
    console.log(`\n[${m.type}] ${m.title}`);
    console.log(m.content.slice(0, 200) + '...');
  });
  return memories;

---
command: /verify
description: Workflow Verification ausführen
script: |
  const { execSync } = require('child_process');
  try {
    execSync('npm run workflow:verify', { stdio: 'inherit' });
    console.log('✅ Verification successful!');
  } catch (error) {
    console.error('❌ Verification failed!');
    throw error;
  }

---
command: /learn
description: Erkenntnis im Memory speichern
script: |
  import { Memory } from '@/scripts/core/memory';
  const input = "${input}";
  const [type, category, title, ...contentParts] = input.split('|');
  const content = contentParts.join('|');

  await Memory.remember({
    type: type.trim() as any,
    category: category.trim(),
    title: title.trim(),
    content: content.trim(),
    tags: ['manual', 'cline']
  });

  console.log('✅ Learning saved to Memory!');

---
command: /sync
description: Vollständige Oracle & Memory Synchronisation
script: |
  const { execSync } = require('child_process');
  console.log('🔄 Starting full synchronization...');
  execSync('npm run oracle:sync', { stdio: 'inherit' });
  console.log('✅ Sync complete!');

---
command: /error-search
description: Ähnliche Fehler im Memory suchen
script: |
  import { Memory } from '@/scripts/core/memory';
  const query = "${input}";
  const memories = await Memory.recall(query, { type: 'ANTIPATTERN' });

  console.log(`🔍 Found ${memories.length} similar errors:`);
  memories.forEach((m, i) => {
    console.log(`\n${i + 1}. ${m.title}`);
    console.log(`   ${m.content.slice(0, 150)}...`);
  });

  return memories;

---
command: /pre-change
description: Pre-Change Analysis starten
script: |
  const { execSync } = require('child_process');
  const input = "${input}";
  const [description, ...files] = input.split('|');

  const command = `npm run pre-change "${description.trim()}" ${files.map(f => f.trim()).join(' ')}`;
  execSync(command, { stdio: 'inherit' });

---
command: /audit
description: Aktion im Audit Log speichern
script: |
  import { Memory } from '@/scripts/core/memory';
  const input = "${input}";
  const [action, resource, status] = input.split('|');

  await Memory.audit({
    action: action.trim(),
    resource: resource.trim(),
    status: status.trim() as any
  });

  console.log('✅ Audit entry created!');

---
command: /context
description: Wichtigste Projektkontext-Dateien auflisten
script: |
  console.log('📋 CRITICAL PROJECT CONTEXT FILES:');
  console.log('');
  console.log('1. project_specs.md - Das Gesetzbuch');
  console.log('2. .clinerules - Deine Verhaltensregeln');
  console.log('3. .github/copilot-instructions.md - AI Agent Guidance');
  console.log('4. prisma/schema.prisma - Datenbankschema');
  console.log('5. docs/architecture/system-overview.md - System-Architektur');
  console.log('6. docs/ORACLE_MEMORY_SYSTEM.md - Oracle & Memory Docs');
  console.log('7. CLINE_CONFIGURATION.md - Deine vollständige Config');
  console.log('8. CLINE_QUICK_REFERENCE.md - Quick Reference');
  console.log('');
  console.log('💡 Lies diese Dateien BEVOR du größere Änderungen machst!');

---
command: /quality
description: Quality Gate ausführen
script: |
  const { execSync } = require('child_process');
  console.log('🔍 Running quality gate...');
  execSync('npm run quality-gate', { stdio: 'inherit' });
  console.log('✅ Quality gate passed!');

---
command: /help-nexify
description: NeXify Recursive Intelligence Protocol Hilfe
script: |
  console.log('🧬 NEXIFY RECURSIVE INTELLIGENCE PROTOCOL');
  console.log('');
  console.log('6-SCHRITTE ZYKLUS:');
  console.log('1. THINK    → /think "Was soll ich tun?"');
  console.log('2. RECALL   → /recall "relevante begriffe"');
  console.log('3. EXECUTE  → Code implementieren');
  console.log('4. VERIFY   → /verify');
  console.log('5. LEARN    → /learn "TYPE|category|title|content"');
  console.log('6. UPDATE   → /sync');
  console.log('');
  console.log('QUICK COMMANDS:');
  console.log('/pre-change "desc"|file1.ts|file2.ts - Pre-Change Analysis');
  console.log('/error-search "error msg" - Ähnliche Fehler finden');
  console.log('/quality - Quality Gate ausführen');
  console.log('/context - Wichtigste Dateien anzeigen');
  console.log('/health - System Health Check');
  console.log('/recover - Manuelles Recovery');
  console.log('');
  console.log('📖 Mehr: CLINE_QUICK_REFERENCE.md');

---
command: /health
description: System Health Check ausführen
script: |
  const { execSync } = require('child_process');
  console.log('🏥 Running health check...');
  execSync('npm run cline:health', { stdio: 'inherit' });

---
command: /recover
description: Manuelles Recovery starten
script: |
  const { execSync } = require('child_process');
  console.log('🔧 Starting recovery...');
  execSync('npm run cline:recover', { stdio: 'inherit' });

---
command: /watchdog
description: Dev Server mit Auto-Restart starten
script: |
  const { execSync } = require('child_process');
  console.log('🐕 Starting watchdog for dev server...');
  execSync('npm run watch:dev', { stdio: 'inherit' });

---
command: /auto-restart
description: Auto-Restart Service starten
script: |
  const { execSync } = require('child_process');
  console.log('🔄 Starting auto-restart service...');
  execSync('npm run cline:auto-restart', { stdio: 'inherit' });
