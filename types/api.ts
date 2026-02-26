import { ModelType } from './models';

export interface CompareRequest {
  prompt: string;
  modelIds: string[];
  maxTokens?: number;
}

export interface CompareResponse {
  results: import('./models').ModelResult[];
  metadata: {
    timestamp: string;
    totalModels: number;
    successfulModels: number;
    failedModels: number;
  };
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
  uptime: number;
}

export interface RateLimitInfo {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}
