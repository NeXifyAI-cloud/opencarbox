#!/usr/bin/env tsx
/**
 * Pre-Code Change Hook - Automatische Prüfung vor jeder Code-Änderung
 * Erzwingt: Think → Recall vor Execute
 */

import * as fs from 'fs';
import { Memory } from '../core/memory';
import { Oracle } from '../core/oracle';

interface PreChangeContext {
  files: string[];
  description: string;
  estimatedImpact: 'low' | 'medium' | 'high';
}

/**
 * Analysiert geplante Änderungen und gibt Guidance
 */
export async function analyzeChange(context: PreChangeContext): Promise<void> {
  console.log('\n🔍 PRE-CHANGE ANALYSIS\n');

  // Lese File-Contents
  const fileContents = context.files
    .filter(f => fs.existsSync(f))
    .map(f => ({
      path: f,
      content: fs.readFileSync(f, 'utf-8').slice(0, 1000) // Ersten 1000 Zeichen
    }));

  const filesContext = fileContents
    .map(f => `File: ${f.path}\n${f.content}`)
    .join('\n\n---\n\n');

  // Oracle denken lassen
  const guidance = await Oracle.thinkWithMemory(
    `Ich plane folgende Änderungen: ${context.description}. Was muss ich beachten?`,
    filesContext
  );

  console.log('💡 ORACLE GUIDANCE:\n');
  console.log(guidance.recommendation);
  console.log(`\nConfidence: ${(guidance.confidence * 100).toFixed(0)}%\n`);

  // Prüfe Memories
  const relevantMemories = await Memory.recall(context.description);

  if (relevantMemories.length > 0) {
    console.log('📚 RELEVANT PAST EXPERIENCES:\n');
    relevantMemories.forEach(m => {
      console.log(`[${m.type}] ${m.title}`);
      console.log(`  ${m.content.slice(0, 200)}...\n`);
    });
  }

  // Warnung bei hohem Impact ohne ausreichender Confidence
  if (context.estimatedImpact === 'high' && guidance.confidence < 0.7) {
    console.warn('⚠️  WARNING: High-impact change with low confidence!');
    console.warn('⚠️  Consider breaking down into smaller changes or gathering more context.\n');
  }

  // Audit
  await Memory.audit({
    action: 'pre_change_analysis',
    resource: context.files.join(', '),
    status: 'SUCCESS',
    details: {
      description: context.description,
      confidence: guidance.confidence,
      impact: context.estimatedImpact
    }
  });

  console.log('✅ Pre-change analysis complete. Proceed with implementation.\n');
}

// CLI
if (require.main === module) {
  const description = process.argv[2];
  const files = process.argv.slice(3);

  if (!description || files.length === 0) {
    console.error('Usage: npx tsx scripts/cline-workflows/pre-change.ts "description" file1.ts file2.ts');
    process.exit(1);
  }

  analyzeChange({
    description,
    files,
    estimatedImpact: 'medium'
  }).catch(console.error);
}
