export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(message: string, statusCode: number, code: string, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class FeatureDisabledError extends ApiError {
  constructor(message = 'AI chat is disabled by FEATURE_AI_CHAT flag.') {
    super(message, 503, 'FEATURE_DISABLED');
  }
}

export class InvalidJsonError extends ApiError {
  constructor() {
    super('Invalid JSON body.', 400, 'INVALID_JSON');
  }
}

export class ValidationError extends ApiError {
  constructor(details: unknown) {
    super('Validation failed.', 400, 'VALIDATION_ERROR', details);
  }
}

export class RateLimitExceededError extends ApiError {
  constructor(retryAfterSeconds: number) {
    super('Rate limit exceeded.', 429, 'RATE_LIMIT_EXCEEDED', { retryAfterSeconds });
  }
}

export class UpstreamAiError extends ApiError {
  constructor(details?: unknown) {
    super('AI provider request failed.', 502, 'AI_UPSTREAM_ERROR', details);
  }
}
