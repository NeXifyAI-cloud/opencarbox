# AI Provider System Documentation

## Overview

OpenCarBox uses an intelligent AI provider system with automatic selection and fallback capabilities. The system supports multiple AI providers with priority-based selection to ensure optimal reliability and cost-effectiveness.

## Supported Providers

### GitHub Models (Primary - Recommended)

GitHub Models provides access to Azure OpenAI and other premium AI models through GitHub's infrastructure.

**Advantages:**
- Native GitHub integration
- High reliability and performance
- Support for multiple models (GPT-4o, Claude, etc.)
- Excellent rate limits for GitHub Actions

**Models Available:**
- `gpt-4o` (recommended) - Latest GPT-4 optimized model
- `gpt-4o-mini` - Faster, cost-effective variant
- `gpt-4` - Standard GPT-4
- `gpt-3.5-turbo` - Legacy model
- `claude-3-5-sonnet` - Anthropic Claude
- `claude-3-opus` - Advanced Claude model
- `claude-3-haiku` - Fast Claude variant

### DeepSeek (Fallback)

DeepSeek provides cost-effective AI models with good performance.

**Advantages:**
- Very cost-effective ($0.14 per million tokens)
- Good performance for coding tasks
- Fast response times

**Models Available:**
- `deepseek-chat` - General purpose chat model
- `deepseek-coder` - Specialized coding model

## Configuration

### Environment Variables

#### Required (at least one provider must be configured)

**For GitHub Models:**
```bash
GITHUB_TOKEN=ghp_your_github_token
# or
GITHUB_MODELS_API_KEY=your_api_key
```

**For DeepSeek:**
```bash
DEEPSEEK_API_KEY=your_deepseek_api_key
NSCALE_API_KEY=your_nscale_key  # Optional, depending on setup
```

#### Optional Configuration

```bash
# Provider Selection
AI_PROVIDER=github-models  # 'github-models' or 'deepseek'
AI_AUTO_SELECT=true         # Enable automatic fallback (default: true)

# GitHub Models Configuration
GITHUB_MODELS_BASE_URL=https://models.inference.ai.azure.com
GITHUB_MODELS_MODEL=gpt-4o

# DeepSeek Configuration
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
NSCALE_HEADER_NAME=X-NSCALE-API-KEY

# General AI Configuration
AI_TIMEOUT_MS=30000                    # Request timeout (default: 30 seconds)
AI_HEALTH_CHECK_INTERVAL_MS=300000     # Health check interval (default: 5 minutes)
AI_DEBUG=false                          # Enable debug logging
```

### GitHub Actions Configuration

The workflows automatically configure the AI provider system using repository secrets and variables:

**Required Secrets:**
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions (for GitHub Models)
- `DEEPSEEK_API_KEY` - DeepSeek API key (for fallback)
- `NSCALE_API_KEY` - NScale API key (if using DeepSeek with NScale)

**Optional Repository Variables:**
- `AI_PROVIDER` - Set to override the default provider ('github-models' or 'deepseek')
- `AI_AUTO_SELECT` - Set to 'false' to disable automatic fallback

## Usage

### Using the New Provider System

```typescript
import { aiChatCompletion } from '@/lib/ai/client';

// Make a chat completion request
const response = await aiChatCompletion({
  model: 'gpt-4o', // or 'deepseek-chat'
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' }
  ],
  temperature: 0.7,
  max_tokens: 1000,
});

console.log(response.choices[0].message.content);
```

### Backward Compatibility

The legacy `deepseekChatCompletion` function is still available but deprecated:

```typescript
import { deepseekChatCompletion } from '@/lib/ai/deepseekClient';

// This still works, but will use the new provider system internally
const response = await deepseekChatCompletion({
  model: 'deepseek-chat',
  messages: [
    { role: 'user', content: 'Hello!' }
  ],
});
```

### Using the Auto-Selector Directly

For advanced use cases, you can use the auto-selector directly:

```typescript
import { getAutoSelector } from '@/lib/ai/auto-selector';

const selector = getAutoSelector();

// Get information about available providers
const providers = selector.getAllProviders();
console.log('Available providers:', providers.map(p => p.getName()));

// Force a health check
await selector.forceHealthCheck();

// Make a request with custom selection strategy
const response = await selector.chatCompletion(
  {
    model: 'gpt-4o',
    messages: [{ role: 'user', content: 'Hello!' }],
  },
  {
    preferCost: true,        // Prefer lower-cost providers
    preferLatency: false,    // Don't prioritize latency
    requireHealthCheck: true,
    maxLatency: 5000,        // Maximum 5 seconds latency
  }
);
```

## Auto-Selection Strategy

The system uses an intelligent selection strategy:

1. **Priority-Based Selection**: Primary provider (GitHub Models) is tried first
2. **Health Checks**: Providers are health-checked periodically (default: 5 minutes)
3. **Automatic Fallback**: If primary fails, falls back to secondary providers
4. **Retry Logic**: Up to 3 retry attempts with exponential backoff
5. **Cost Optimization**: Can prefer cost-effective providers when specified

### Selection Flow

```
┌─────────────────────────────────────────────────┐
│  Auto-Selector receives request                 │
└───────────────┬─────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────┐
│  Check if health check is needed                │
│  (based on last check time)                     │
└───────────────┬─────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────┐
│  Try Primary Provider (GitHub Models)           │
│  - Check health status                          │
│  - Check latency requirements                   │
└───────────────┬─────────────────────────────────┘
                │
       ┌────────┴────────┐
       │                 │
    Success            Failed
       │                 │
       ▼                 ▼
    Return      ┌──────────────────────────┐
    Response    │ Try Fallback Providers   │
                │ (DeepSeek)               │
                └──────────┬───────────────┘
                           │
                  ┌────────┴────────┐
                  │                 │
               Success            Failed
                  │                 │
                  ▼                 ▼
              Return          Use Primary
              Response        Despite Health
                             Check Failure
```

## Monitoring and Observability

### Logging

The system logs provider selection decisions:

```
[AIAutoSelector] Using primary provider: GitHub Models
[AIAutoSelector] Using fallback provider: DeepSeek (reason: primary unavailable)
[AIAutoSelector] Attempt 1 failed: timeout error
[AIAutoSelector] Fallback succeeded: DeepSeek (attempt 2)
```

Enable debug logging:
```bash
AI_DEBUG=true
NODE_ENV=development
```

### Health Checks

Health checks are performed automatically:
- On first request after health check interval expires
- After provider failures
- Can be forced via `forceHealthCheck()` method

### Metrics

Each provider tracks:
- Total API calls
- Successful/failed calls
- Average latency
- Total cost (if applicable)

## Troubleshooting

### Provider Always Failing

1. Check API keys are valid
2. Verify network connectivity
3. Check API rate limits
4. Review health check logs
5. Try forcing a health check manually

### Fallback Not Working

1. Ensure `AI_AUTO_SELECT=true` (or not set, as true is default)
2. Verify fallback provider is configured with valid credentials
3. Check logs for selection decisions
4. Verify both providers are not failing simultaneously

### High Latency

1. Check network connectivity
2. Consider using a closer geographic region
3. Enable latency-based selection strategy
4. Reduce model complexity if possible

### Cost Concerns

1. Enable cost optimization in selection strategy
2. Prefer DeepSeek for non-critical tasks
3. Monitor usage via provider metrics
4. Set appropriate rate limits

## Best Practices

1. **Always configure both providers** for maximum reliability
2. **Use GitHub Models as primary** for GitHub Actions workflows
3. **Enable auto-select** for automatic fallback
4. **Set appropriate timeouts** based on your use case
5. **Monitor health checks** to catch issues early
6. **Use cost optimization** for high-volume tasks
7. **Log selection decisions** for debugging
8. **Test fallback scenarios** before production

## Migration Guide

### Migrating from DeepSeek-only Setup

1. Add GitHub Models configuration:
   ```bash
   # .env
   GITHUB_TOKEN=ghp_your_token
   AI_PROVIDER=github-models  # Change from 'deepseek'
   ```

2. Code changes are **not required** - the existing `deepseekChatCompletion` function will automatically use the new system

3. Update workflows (already done if using the latest workflow files)

4. Test the new setup:
   ```bash
   pnpm test
   ```

### Migrating to New Client API

Replace:
```typescript
import { deepseekChatCompletion } from '@/lib/ai/deepseekClient';
const response = await deepseekChatCompletion({ ... });
```

With:
```typescript
import { aiChatCompletion } from '@/lib/ai/client';
const response = await aiChatCompletion({ ... });
```

## Security Considerations

1. **Never commit API keys** to the repository
2. **Use GitHub Secrets** for sensitive credentials
3. **Rotate keys regularly** following security best practices
4. **Monitor API usage** for anomalies
5. **Set rate limits** to prevent abuse
6. **Use separate keys** for development and production

## Performance Optimization

1. **Cache health check results** (done automatically)
2. **Reuse provider instances** (done automatically via factory)
3. **Set appropriate timeouts** based on expected response times
4. **Use streaming** for long-form responses (if supported)
5. **Batch requests** when possible
6. **Monitor latency** and adjust strategy accordingly

## Support

For issues or questions:
1. Check this documentation
2. Review the implementation in `src/lib/ai/`
3. Check workflow logs for selection decisions
4. Create an issue with provider logs and configuration (sanitized)
