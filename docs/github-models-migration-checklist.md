# GitHub Models Migration Checklist

This checklist helps you migrate from DeepSeek-only to GitHub Models with DeepSeek fallback.

## Pre-Migration

- [ ] Review the [AI Provider System Documentation](ai-provider-system.md)
- [ ] Review the [GitHub Models Setup Guide](github-models-setup.md)
- [ ] Backup current `.env` files
- [ ] Document current AI provider usage and costs

## GitHub Repository Configuration

### Secrets (Settings → Secrets and variables → Actions → Secrets)

- [ ] `GITHUB_TOKEN` - ✅ Automatically provided by GitHub Actions
- [ ] `DEEPSEEK_API_KEY` - Keep for fallback
- [ ] `NSCALE_API_KEY` - Keep if using NScale with DeepSeek

**Optional Secrets:**
- [ ] `GITHUB_MODELS_API_KEY` - If not using `GITHUB_TOKEN`
- [ ] `GITHUB_MODELS_BASE_URL` - If using custom endpoint

### Repository Variables (Settings → Secrets and variables → Actions → Variables)

**Recommended:**
- [ ] `AI_PROVIDER` = `github-models`
- [ ] `AI_AUTO_SELECT` = `true`

**Optional:**
- [ ] `GITHUB_MODELS_MODEL` = `gpt-4o` (or `gpt-4o-mini` for cost savings)

## Local Development Setup

### 1. Update Environment File

```bash
# Backup current .env
cp .env .env.backup

# Update .env with new variables
cat >> .env << 'EOF'

# AI Provider Configuration (GitHub Models + DeepSeek Fallback)
AI_PROVIDER=github-models
AI_AUTO_SELECT=true

# GitHub Models (Primary)
GITHUB_TOKEN=ghp_your_github_token_here
GITHUB_MODELS_MODEL=gpt-4o

# DeepSeek (Fallback) - Keep existing values
# DEEPSEEK_API_KEY=your_existing_key
# NSCALE_API_KEY=your_existing_key
EOF
```

### 2. Get GitHub Token for Local Development

- [ ] Go to https://github.com/settings/tokens
- [ ] Create new token (classic) with scopes: `repo`, `workflow`
- [ ] Copy token to `GITHUB_TOKEN` in `.env`

### 3. Test Local Setup

```bash
# Install dependencies
npm install

# Run preflight check
npm tsx tools/preflight.ts ai
# Expected: Preflight(ai): OK (provider: github-models, fallback: enabled)

# Run type check
npm run typecheck
# Expected: No errors in src/lib/ai

# Run tests
npm run test -- --run
# Expected: All tests passing

# Test AI request (optional)
npm tsx -e "
import { aiChatCompletion } from './src/lib/ai/client';
const response = await aiChatCompletion({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Say hello!' }],
});
console.log('Response:', response.choices[0].message.content);
"
# Expected: AI response
```

## Code Migration

### 1. Update Import Statements (Optional)

Old code (still works):
```typescript
import { deepseekChatCompletion } from '@/lib/ai/deepseekClient';
const response = await deepseekChatCompletion({ ... });
```

New recommended code:
```typescript
import { aiChatCompletion } from '@/lib/ai/client';
const response = await aiChatCompletion({ ... });
```

**Action Items:**
- [ ] Identify files using `deepseekChatCompletion`
- [ ] Plan migration to `aiChatCompletion` (optional, but recommended)
- [ ] Update imports gradually or keep legacy for now

### 2. Review AI Usage Patterns

Files to review:
- [ ] `src/app/api/ai/chat/route.ts`
- [ ] `src/app/api/webhooks/codex-controller/route.ts`
- [ ] `tools/auto_improve.ts`
- [ ] `tools/ai_merge_conflicts.ts`

**Action:** Verify they work with both providers (they should, as the API is compatible)

## Testing

### Unit Tests

- [ ] Run all tests: `npm run test -- --run`
- [ ] Verify AI-related tests pass:
  - [ ] `tests/api/ai-chat.test.ts`
  - [ ] `tests/api/codex-controller-webhook.test.ts`

### Integration Tests

Test with GitHub Models:
```bash
# Set GitHub Models as provider
export AI_PROVIDER=github-models
export GITHUB_TOKEN=your_token

# Run AI tools
npm tsx tools/auto_improve.ts
# Expected: Should generate suggestions using GitHub Models
```

Test fallback to DeepSeek:
```bash
# Temporarily disable GitHub Models
unset GITHUB_TOKEN
export AI_PROVIDER=github-models
export AI_AUTO_SELECT=true

# Run AI tools
npm tsx tools/auto_improve.ts
# Expected: Should fall back to DeepSeek and work
```

### Workflow Tests

- [ ] Trigger `auto-improve` workflow manually
- [ ] Check workflow logs for provider selection:
  ```
  [AIAutoSelector] Using primary provider: GitHub Models
  ```
- [ ] Trigger `auto-reply` workflow (create a test issue)
- [ ] Verify AI responses work

## Monitoring

### First Week

Monitor for issues:
- [ ] Check workflow logs daily
- [ ] Look for provider selection messages
- [ ] Monitor for fallback usage
- [ ] Track API usage/costs

### Key Metrics to Watch

- [ ] Workflow success rate
- [ ] Provider selection distribution (primary vs fallback)
- [ ] Response latency
- [ ] API costs
- [ ] Error rates

### Log Patterns to Look For

**Success:**
```
[AIAutoSelector] Using primary provider: GitHub Models
Preflight(ai): OK (provider: github-models, fallback: enabled)
```

**Fallback (expected occasionally):**
```
[AIAutoSelector] Using fallback provider: DeepSeek (reason: primary unavailable)
[AIAutoSelector] Fallback succeeded: DeepSeek (attempt 2)
```

**Issues (need attention):**
```
[AIAutoSelector] Attempt 3 failed: timeout error
Error: No available AI providers found
```

## Rollback Plan

If issues occur, you can quickly roll back:

### Quick Rollback to DeepSeek

**In Repository Variables:**
```
AI_PROVIDER=deepseek
```

**In Local `.env`:**
```bash
AI_PROVIDER=deepseek
```

**Immediate Effect:**
- All new requests use DeepSeek only
- No code changes needed
- Workflows pick up change automatically

### Full Rollback

If needed to completely revert:

1. Update repository variables:
   ```
   AI_PROVIDER=deepseek
   AI_AUTO_SELECT=false
   ```

2. Update `.env`:
   ```bash
   AI_PROVIDER=deepseek
   AI_AUTO_SELECT=false
   ```

3. (Optional) Revert the PR if needed

## Success Criteria

After migration is complete, verify:

- [ ] ✅ All tests passing
- [ ] ✅ Workflows using GitHub Models successfully
- [ ] ✅ Fallback to DeepSeek works when tested
- [ ] ✅ No increase in error rates
- [ ] ✅ Response times acceptable
- [ ] ✅ Costs within budget
- [ ] ✅ Team comfortable with new system

## Post-Migration

- [ ] Update team documentation
- [ ] Train team on new provider system
- [ ] Set up cost monitoring/alerts
- [ ] Schedule weekly check-ins for first month
- [ ] Document any issues and resolutions
- [ ] Optimize provider selection based on usage patterns

## Troubleshooting

### Common Issues

**Issue:** `No valid AI providers configured`
- **Fix:** Check `GITHUB_TOKEN` is set and valid

**Issue:** `GITHUB_TOKEN required for github-models provider`
- **Fix:** Add `GITHUB_TOKEN` to secrets/env

**Issue:** High costs
- **Fix:** Consider using `gpt-4o-mini` or fallback to DeepSeek more

**Issue:** Slow responses
- **Fix:** Check `AI_TIMEOUT_MS` setting, consider model change

**Issue:** Workflows failing
- **Fix:** Check secrets are set, review workflow logs

## Support

- **Documentation:** `docs/ai-provider-system.md`
- **Setup Guide:** `docs/github-models-setup.md`
- **Code:** `src/lib/ai/`
- **Issues:** Open GitHub issue with sanitized logs

## Timeline

Suggested migration timeline:

- **Week 1:** Setup and local testing
- **Week 2:** Deploy to staging/preview environments
- **Week 3:** Monitor and optimize
- **Week 4:** Deploy to production, full monitoring

---

**Status Tracking:**

- [ ] Pre-Migration Complete
- [ ] GitHub Configuration Complete
- [ ] Local Setup Complete
- [ ] Code Migration Complete (if applicable)
- [ ] Testing Complete
- [ ] Monitoring Setup Complete
- [ ] Migration Complete ✅
