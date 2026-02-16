# Backlog

## P0
1. **Provider settings persistence API**
   - Acceptance:
     - `/api/config` supports GET/PUT with schema validation.
     - Sensitive fields are masked in API responses.

2. **Circuit breaker + retry strategy**
   - Acceptance:
     - Provider calls implement bounded retries + timeout.
     - Circuit opens after consecutive failures and reports status.

3. **Latency + error telemetry endpoint**
   - Acceptance:
     - `/api/status` returns request count, error rate, and provider p95 latency.

## P1
4. **OpenAI-compatible provider implementation**
   - Acceptance:
     - Uses configurable `OPENAI_COMPAT_BASE_URL` and model.
     - Tests verify request mapping and error translation.

5. **DeepSeek provider implementation**
   - Acceptance:
     - Uses `DEEPSEEK_API_KEY` and configurable base URL.
     - Tests verify model listing and chat completion behavior.

## P2
6. **auto_improve script enhancement**
   - Acceptance:
     - Parses CI logs and appends actionable tasks to this file.
     - Categorizes by lint/type/test/build failures.
