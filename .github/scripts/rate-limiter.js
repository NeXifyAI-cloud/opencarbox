// Rate Limiter for DeepSeek & GitHub Models
class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  async checkLimit() {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      throw new Error(`Rate limit exceeded: ${this.requests.length}/${this.maxRequests} in last ${this.windowMs}ms`);
    }
    
    this.requests.push(now);
  }

  getRemainingRequests() {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < this.windowMs);
    return this.maxRequests - this.requests.length;
  }
}

// Circuit Breaker Pattern
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
    this.lastFailure = null;
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error(`Circuit breaker is OPEN. Retry after ${new Date(this.nextAttempt).toISOString()}`);
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    this.lastFailure = new Date();
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
      console.error(`Circuit breaker opened after ${this.failureCount} failures. Will retry at ${new Date(this.nextAttempt).toISOString()}`);
    }
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      nextAttempt: this.nextAttempt,
      lastFailure: this.lastFailure
    };
  }
}

module.exports = { RateLimiter, CircuitBreaker };
