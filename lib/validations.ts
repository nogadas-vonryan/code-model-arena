import { z } from 'zod';

export const CompareRequestSchema = z.object({
  prompt: z
    .string()
    .min(1, 'Prompt cannot be empty')
    .max(10000, 'Prompt cannot exceed 10000 characters'),
  modelIds: z
    .array(z.string())
    .min(1, 'At least one model must be selected')
    .max(3, 'Maximum 3 models can be selected'),
  maxTokens: z.number().int().min(1).max(4096).optional().default(256),
});

export type CompareRequestInput = z.infer<typeof CompareRequestSchema>;

export const ModelFilterSchema = z.object({
  type: z.enum(['live', 'static']).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export type ModelFilterInput = z.infer<typeof ModelFilterSchema>;

export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  code: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
  retryAfter: z.number().optional(),
  resetTime: z.string().optional(),
});

export type ErrorResponseInput = z.infer<typeof ErrorResponseSchema>;
