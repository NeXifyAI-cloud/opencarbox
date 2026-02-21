import prisma from './prisma';

export type AuditLogStatus = 'SUCCESS' | 'FAILURE' | 'WARNING';

interface AuditLogParams {
  action: string;
  resource: string;
  status: AuditLogStatus;
  user: string;
  details?: unknown;
  errorMessage?: string;
  stackTrace?: string;
  durationMs?: number;
}

/**
 * Erfasst ein Ereignis im Audit-Log für Rückverfolgbarkeit und Sicherheit.
 * Gemäß Sicherheitsvorgabe 4 werden Zeitstempel (via DB), Benutzer und Aktionsdetails geloggt.
 */
export async function logEvent({
  action,
  resource,
  status,
  user,
  details,
  errorMessage,
  stackTrace,
  durationMs,
}: AuditLogParams) {
  try {
    const logEntry = await prisma.auditLog.create({
      data: {
        action,
        resource,
        status,
        user,
        details: typeof details === 'string' ? details : JSON.stringify(details || ''),
        errorMessage,
        stackTrace,
        durationMs,
      },
    });

    // In der Entwicklung auch in die Konsole loggen
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[AuditLog] [${status}] ${user}: ${action} bei ${resource}`);
    }

    return logEntry;
  } catch (error) {
    console.error('Fehler beim Erstellen des Audit-Logs:', error);
    // Wir werfen den Fehler nicht weiter, um den Hauptfluss nicht zu unterbrechen,
    // loggen ihn aber kritisch.
    return null;
  }
}
