#!/usr/bin/env tsx
/**
 * Error Learning Workflow - Automatisches Lernen aus Fehlern
 */

import { Memory } from '../core/memory';
import { Oracle } from '../core/oracle';

interface ErrorContext {
  error: Error;
  file?: string;
  line?: number;
  context?: string;
}

/**
 * Analysiert einen Fehler und speichert die Lösung
 */
export async function learnFromError(
  errorContext: ErrorContext,
  solution?: string
): Promise<void> {
  console.log('\n🔴 ERROR LEARNING WORKFLOW\n');

  const errorInfo = `
    Error: ${errorContext.error.message}
    File: ${errorContext.file || 'unknown'}
    Line: ${errorContext.line || 'unknown'}
    Stack: ${errorContext.error.stack || 'no stack trace'}
    Context: ${errorContext.context || 'no context'}
  `;

  console.log('Analyzing error...');

  // Oracle analysieren lassen
  const analysis = await Oracle.think(
    'Analysiere diesen Fehler und erkläre die Root Cause und wie man ihn global verhindert',
    errorInfo + (solution ? `\n\nLÖSUNG:\n${solution}` : '')
  );

  console.log('\n💡 ROOT CAUSE ANALYSIS:\n');
  console.log(analysis.analysis);

  if (analysis.recommendation) {
    console.log('\n🛡️ PREVENTION STRATEGY:\n');
    console.log(analysis.recommendation);
  }

  // Als Antipattern speichern
  await Memory.remember({
    type: 'ANTIPATTERN',
    category: 'error',
    title: `Error: ${errorContext.error.message}`,
    content: `
      ${analysis.analysis}

      PREVENTION:
      ${analysis.recommendation}

      ${solution ? `SOLUTION:\n${solution}` : 'No solution provided yet'}
    `,
    metadata: {
      file: errorContext.file,
      line: errorContext.line,
      confidence: analysis.confidence
    },
    tags: ['error', 'antipattern', 'learned']
  });

  // Audit
  await Memory.audit({
    action: 'error_learning',
    resource: errorContext.file || 'unknown',
    status: solution ? 'SUCCESS' : 'WARNING',
    error_message: errorContext.error.message,
    stack_trace: errorContext.error.stack,
    details: { hasSolution: !!solution }
  });

  console.log('\n✅ Error learned and stored in Memory\n');

  if (!solution) {
    console.log('⚠️  Remember to add the solution once you fix this error!\n');
  }
}

/**
 * Sucht nach ähnlichen bekannten Fehlern
 */
export async function findSimilarErrors(errorMessage: string): Promise<void> {
  console.log('\n🔍 Searching for similar known errors...\n');

  const memories = await Memory.recall(errorMessage, { type: 'ANTIPATTERN' });

  if (memories.length === 0) {
    console.log('No similar errors found in Memory.');
    return;
  }

  console.log(`Found ${memories.length} similar error(s):\n`);

  memories.forEach((m, i) => {
    console.log(`${i + 1}. ${m.title}`);
    console.log(`   ${m.content.slice(0, 200)}...`);
    console.log(`   Tags: ${m.tags?.join(', ') || 'none'}\n`);
  });
}

// CLI
if (require.main === module) {
  const command = process.argv[2];

  if (command === 'search') {
    const query = process.argv[3];
    if (!query) {
      console.error('Usage: npm run error:search "error message"');
      process.exit(1);
    }
    findSimilarErrors(query).catch(console.error);
  } else if (command === 'learn') {
    console.log('Usage: Call learnFromError() programmatically with error context');
  } else {
    console.log('Commands:');
    console.log('  npm run error:search "message" - Find similar known errors');
    console.log('  learnFromError()               - Learn from error (programmatic)');
  }
}
