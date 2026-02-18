# GitHub Models Setup Guide

Quick guide to set up GitHub Models as your primary AI provider.

## Quick Start (5 minutes)

### 1. Get a GitHub Token

The easiest way is to use GitHub Actions' built-in `GITHUB_TOKEN`:

**For GitHub Actions:**
- No setup needed! `GITHUB_TOKEN` is automatically available
- Already configured in all AI workflows

**For Local Development:**

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Select scopes:
   - `repo` (for private repos)
   - `workflow` (for Actions)
4. Generate and copy the token
5. Add to your `.env`:
   ```bash
   GITHUB_TOKEN=ghp_your_token_here
   ```

### 2. Configure Environment

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env`:
```bash
# AI Provider Configuration
AI_PROVIDER=github-models
AI_AUTO_SELECT=true

# GitHub Models (Primary)
GITHUB_TOKEN=ghp_your_token_here
GITHUB_MODELS_MODEL=gpt-4o

# DeepSeek (Fallback) - Optional but recommended
DEEPSEEK_API_KEY=your_deepseek_key  # If you have one
NSCALE_API_KEY=your_nscale_key      # If using NScale
```

### 3. Test the Setup

```bash
# Run preflight check
pnpm tsx tools/preflight.ts ai

# Should output:
# Preflight(ai): OK (provider: github-models, fallback: enabled)

# Run tests
pnpm test

# Try a simple AI request
pnpm tsx -e "
import { aiChatCompletion } from './src/lib/ai/client';
const response = await aiChatCompletion({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello!' }],
});
console.log(response.choices[0].message.content);
"
```

## GitHub Actions Setup

### Repository Secrets

Your repository should have these secrets configured:

1. `GITHUB_TOKEN` - Automatically provided by GitHub Actions ✅
2. `DEEPSEEK_API_KEY` - (Optional) For fallback
3. `NSCALE_API_KEY` - (Optional) For DeepSeek with NScale

### Repository Variables (Optional)

Customize provider behavior:

1. Go to: Settings → Secrets and variables → Actions → Variables
2. Add variables:
   - `AI_PROVIDER`: `github-models` (default)
   - `AI_AUTO_SELECT`: `true` (default)
   - `GITHUB_MODELS_MODEL`: `gpt-4o` (default)

## Verify Installation

### Check Workflows

All AI workflows should now show:

```yaml
env:
  AI_PROVIDER: ${{ vars.AI_PROVIDER || 'github-models' }}
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Check Code

The new provider system is backward compatible:

```typescript
// Old way (still works)
import { deepseekChatCompletion } from '@/lib/ai/deepseekClient';

// New way (recommended)
import { aiChatCompletion } from '@/lib/ai/client';
```

### Monitor Logs

When running AI workflows, you should see:

```
[AIAutoSelector] Using primary provider: GitHub Models
```

Or if fallback is used:

```
[AIAutoSelector] Using fallback provider: DeepSeek (reason: primary unavailable)
```

## Troubleshooting

### "No valid AI providers configured"

**Solution:** Ensure you have at least one provider configured:
```bash
# Check environment
echo $GITHUB_TOKEN
echo $DEEPSEEK_API_KEY

# Run preflight
pnpm tsx tools/preflight.ts ai
```

### "GITHUB_TOKEN or GITHUB_MODELS_API_KEY required"

**Solution:** Add the token to your environment:
```bash
# For local dev
echo "GITHUB_TOKEN=ghp_your_token" >> .env

# For GitHub Actions
# → Already configured automatically
```

### "403 Forbidden" or "Rate Limited"

**Solution:**
1. Check if your token has required scopes
2. Wait for rate limit to reset (usually 1 hour)
3. Consider using a different provider temporarily:
   ```bash
   AI_PROVIDER=deepseek
   ```

### Tests Failing

**Solution:**
```bash
# Regenerate Prisma client
pnpm db:generate

# Run type check
pnpm typecheck

# Run tests with verbose output
pnpm test -- --reporter=verbose
```

## Advanced Configuration

### Use Different Models

```bash
# In .env or workflow
GITHUB_MODELS_MODEL=gpt-4o-mini  # Faster, cheaper
# or
GITHUB_MODELS_MODEL=claude-3-5-sonnet  # Anthropic Claude
```

### Disable Auto-Selection

Force a specific provider without fallback:

```bash
AI_PROVIDER=github-models
AI_AUTO_SELECT=false
```

### Custom Base URL

For enterprise or custom endpoints:

```bash
GITHUB_MODELS_BASE_URL=https://your-custom-endpoint.com
```

### Adjust Timeouts

```bash
AI_TIMEOUT_MS=60000  # 60 seconds for complex requests
```

## Next Steps

1. **Read Full Documentation**: See `docs/ai-provider-system.md`
2. **Configure Monitoring**: Set up logging and metrics
3. **Test Fallback**: Temporarily disable primary to test fallback
4. **Optimize Costs**: Review usage and adjust provider selection
5. **Update Deployment**: Ensure production has correct configuration

## Cost Comparison

| Provider | Model | Cost per 1M tokens | Use Case |
|----------|-------|-------------------|----------|
| GitHub Models | gpt-4o | ~$2.50 | Production, high quality |
| GitHub Models | gpt-4o-mini | ~$0.15 | Development, speed |
| DeepSeek | deepseek-chat | $0.14 | Cost-sensitive, coding |

## Support

- **Documentation**: `docs/ai-provider-system.md`
- **Code**: `src/lib/ai/`
- **Issues**: Create a GitHub issue with logs (sanitized)
- **Community**: Check existing issues and discussions

---

**Congratulations! 🎉** Your GitHub Models setup is complete.
