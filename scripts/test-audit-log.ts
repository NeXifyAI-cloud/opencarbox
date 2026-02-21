import * as dotenv from "dotenv";
dotenv.config();
import { logEvent } from '../src/lib/audit-logger';

async function test() {
  console.log('--- Teste Audit-Logger ---');

  const result = await logEvent({
    action: 'test_action',
    resource: 'scripts/test-audit-log.ts',
    status: 'SUCCESS',
    user: 'jules-test-agent',
    details: { message: 'Dies ist ein Test-Log-Eintrag' }
  });

  if (result) {
    console.log('✅ Test-Log erfolgreich erstellt:', result.id);
  } else {
    console.log('❌ Test-Log Erstellung fehlgeschlagen (evtl. DB-Verbindung?).');
    console.log('Hinweis: Der Logger fängt DB-Fehler ab und gibt null zurück.');
  }
}

test();
