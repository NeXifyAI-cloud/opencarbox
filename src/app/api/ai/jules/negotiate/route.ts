import { NextResponse } from 'next/server';
import { z } from 'zod';

import { deepseekChatCompletion } from '@/lib/ai/deepseekClient';
import { sendJulesEvent } from '@/lib/jules/client';

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const messageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().min(1).max(8_000),
});

const constraintsSchema = z
  .object({
    tone: z.string().max(200).optional(),
    language: z.string().max(50).optional(),
    timeLimit: z.string().max(100).optional(),
    privacy: z.string().max(500).optional(),
  })
  .optional();

const negotiateRequestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(50),
  language: z.enum(['de', 'en']).default('de'),
  constraints: constraintsSchema,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ApiErrorCode =
  | 'INVALID_JSON'
  | 'VALIDATION_ERROR'
  | 'FEATURE_DISABLED'
  | 'UPSTREAM_ERROR'
  | 'INTERNAL_ERROR';

const errorStatusByCode: Record<ApiErrorCode, number> = {
  INVALID_JSON: 400,
  VALIDATION_ERROR: 422,
  FEATURE_DISABLED: 503,
  UPSTREAM_ERROR: 502,
  INTERNAL_ERROR: 500,
};

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT_DE = `Du bist ein mehrsprachiger KI-Assistent, der auf strukturierte Verhandlungen und Gespräche spezialisiert ist.
JULES ist das interne Ereignis- und Automatisierungssystem dieser Plattform (OpenCarBox).
Es empfängt Ereignisse aus dem Backend, koordiniert Automatisierungs-Workflows und stellt Audit-Trails bereit.

Führe das Gespräch in diesen Phasen:

**Phase 1 – Klärungsplan** (erste Antwort, wenn noch kein Ziel genannt wurde):
- Bestätige kurz: Was ist JULES, was ist das Gesprächsziel?
- Schlage eine strukturierte Agenda vor (Themen + Rollenzuweisungen).
- Frage nach Rahmenbedingungen: Ton, Sprache, Zeitlimit, Datenschutz.
- Biete an, den Plan auf Wunsch auf Deutsch oder Englisch bereitzustellen.

**Phase 2 – Agenda & Rollen** (wenn der Nutzer Kontext geliefert hat):
- Präsentiere eine nummerierte Agenda.
- Weise Rollen zu: Nutzer = Verhandlungsführer, JULES = System-Stakeholder.
- Bitte um Bestätigung oder Anpassung.

**Phase 3 – Gesprächsbeginn** (wenn Agenda bestätigt):
- Kurze Einleitung + Grundregeln.
- Gehe Agendapunkt für Agendapunkt vor.
- Fasse nach jedem Abschnitt die wichtigsten Erkenntnisse zusammen.

**Phase 4 – Abschluss & Follow-up**:
- Biete ein vollständiges Gesprächsprotokoll an.
- Schlage konkrete Folgeaktionen vor.
- Frage, ob eine Übersetzung gewünscht wird.

Antworte immer in der Sprache des Nutzers (Deutsch oder Englisch), es sei denn, der Nutzer wünscht etwas anderes.`;

const SYSTEM_PROMPT_EN = `You are a multilingual AI assistant specialising in structured negotiations and conversations.
JULES is the internal event and automation system of this platform (OpenCarBox).
It receives events from the backend, coordinates automation workflows, and provides audit trails.

Conduct the conversation in these phases:

**Phase 1 – Clarifying Plan** (first response when no goal has been stated yet):
- Briefly confirm: what is JULES, what is the conversation goal?
- Propose a structured agenda (topics + role assignments).
- Ask about constraints: tone, language, time limit, privacy.
- Offer to provide the plan in German or English on request.

**Phase 2 – Agenda & Roles** (when the user has provided context):
- Present a numbered agenda.
- Assign roles: User = lead negotiator, JULES = system stakeholder.
- Request confirmation or adjustments.

**Phase 3 – Conversation Start** (when agenda is confirmed):
- Brief introduction + ground rules.
- Work through agenda items one by one.
- Summarise key takeaways after each section.

**Phase 4 – Close & Follow-up**:
- Offer a full conversation transcript.
- Suggest concrete follow-up actions.
- Ask whether a translation is desired.

Always respond in the user's language (German or English) unless they request otherwise.`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isEnabled() {
  const flag = process.env.FEATURE_AI_CHAT;
  return flag === undefined || flag === 'true';
}

function errorResponse(code: ApiErrorCode, message: string, details?: Record<string, unknown>): NextResponse {
  return NextResponse.json(
    { success: false, error: { code, message, details } },
    { status: errorStatusByCode[code] }
  );
}

function buildSystemMessage(language: 'de' | 'en', constraints?: z.infer<typeof constraintsSchema>): string {
  const base = language === 'en' ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_DE;

  if (!constraints) {
    return base;
  }

  const parts: string[] = [base, ''];
  if (language === 'de') {
    parts.push('**Aktive Rahmenbedingungen:**');
    if (constraints.tone) parts.push(`- Ton: ${constraints.tone}`);
    if (constraints.language) parts.push(`- Bevorzugte Sprache: ${constraints.language}`);
    if (constraints.timeLimit) parts.push(`- Zeitlimit: ${constraints.timeLimit}`);
    if (constraints.privacy) parts.push(`- Datenschutz: ${constraints.privacy}`);
  } else {
    parts.push('**Active Constraints:**');
    if (constraints.tone) parts.push(`- Tone: ${constraints.tone}`);
    if (constraints.language) parts.push(`- Preferred language: ${constraints.language}`);
    if (constraints.timeLimit) parts.push(`- Time limit: ${constraints.timeLimit}`);
    if (constraints.privacy) parts.push(`- Privacy: ${constraints.privacy}`);
  }

  return parts.join('\n');
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  await sendJulesEvent({
    source: 'api.ai.jules.negotiate',
    kind: 'request',
    name: 'negotiate.post.received',
  });

  if (!isEnabled()) {
    await sendJulesEvent({
      source: 'api.ai.jules.negotiate',
      kind: 'error',
      name: 'negotiate.feature_disabled',
    });
    return errorResponse('FEATURE_DISABLED', 'AI chat is disabled by FEATURE_AI_CHAT flag.');
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    await sendJulesEvent({
      source: 'api.ai.jules.negotiate',
      kind: 'error',
      name: 'negotiate.invalid_json',
    });
    return errorResponse('INVALID_JSON', 'Invalid JSON body.');
  }

  const parsed = negotiateRequestSchema.safeParse(body);
  if (!parsed.success) {
    await sendJulesEvent({
      source: 'api.ai.jules.negotiate',
      kind: 'error',
      name: 'negotiate.validation_failed',
    });
    return errorResponse('VALIDATION_ERROR', 'Validation failed.', parsed.error.flatten());
  }

  const { messages, language, constraints } = parsed.data;
  const systemContent = buildSystemMessage(language, constraints);

  const aiMessages = [{ role: 'system' as const, content: systemContent }, ...messages];

  try {
    const response = (await deepseekChatCompletion({
      model: 'deepseek-chat',
      temperature: 0.7,
      messages: aiMessages,
    })) as { choices?: Array<{ message?: { role: string; content?: string }; index: number }> };

    const assistantContent = response.choices?.[0]?.message?.content ?? '';

    await sendJulesEvent({
      source: 'api.ai.jules.negotiate',
      kind: 'event',
      name: 'negotiate.completed',
      metadata: { language, hasConstraints: !!constraints },
    });

    return NextResponse.json({
      success: true,
      data: {
        provider: 'deepseek',
        message: {
          role: 'assistant',
          content: assistantContent,
        },
        language,
      },
    });
  } catch (error) {
    await sendJulesEvent({
      source: 'api.ai.jules.negotiate',
      kind: 'error',
      name: 'negotiate.upstream_error',
    });
    return errorResponse('UPSTREAM_ERROR', 'AI provider request failed.', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
