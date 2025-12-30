import { Oracle } from './core/oracle';
import { Memory } from './core/memory';

async function testOracle() {
  console.log('--- Testing Oracle Thinking Process ---');
  try {
    const prompt = 'Analysiere das aktuelle Projekt-Setup und gib eine Empfehlung für die nächsten Schritte ab.';
    const context = 'NEXIFY UNIVERSAL AGENTIC OS BLUEPRINT (v5.0) ist die Grundlage.';
    
    const response = await Oracle.think(prompt, context);
    console.log('Oracle Response:', JSON.stringify(response, null, 2));

    console.log('\n--- Testing Memory Sync ---');
    await Memory.remember({
      type: 'KNOWLEDGE',
      category: 'SYSTEM',
      title: 'Oracle Test',
      content: 'Oracle Thinking Process erfolgreich initialisiert und getestet.',
      metadata: { test: true }
    });
    console.log('Memory Sync successful (remember).');

    await Memory.audit({
      action: 'INITIAL_ORACLE_TEST',
      resource: 'Oracle/Memory',
      status: 'SUCCESS',
      details: { response }
    });
    console.log('Audit Log successful.');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testOracle();