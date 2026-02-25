import { ModelType } from './models';

export interface CompareRequest {
  prompt: string;
  modelIds: string[];
  maxTokens?: number;
}

export interface CompareResponse {
  results: import('./models').ModelResult[];
  comparisonId: string;
  timestamp: string;
}

export interface ModelFilterParams {
  type?: ModelType;
  limit?: number;
  offset?: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  code: string;
  details?: Record<string, unknown>;
  retryAfter?: number;
  resetTime?: string;
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  timestamp: string;
  version: string;
}

export interface RateLimitInfo {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}
