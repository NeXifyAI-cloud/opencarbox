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
        details: details || {},
        errorMessage,
        stackTrace,
        durationMs,
      },
    });

    return logEntry;
  } catch (error) {
    // Fehler beim Logging werden absichtlich ignoriert, um den Hauptfluss nicht zu unterbrechen.
    // In einer produktiven Umgebung sollte hier ein externes Monitoring informiert werden.
    return null;
  }
}
