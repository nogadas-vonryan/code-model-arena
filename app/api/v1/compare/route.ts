import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { queryModel } from '@/lib/huggingface';
import { getModelById, validateModelIds } from '@/lib/models';
import { checkRateLimit } from '@/lib/rate-limiter';
import { CompareRequestSchema } from '@/lib/validations';
import { CompareResponse, ErrorResponse } from '@/types/api';
import { ModelResult, StaticBenchmark } from '@/types/models';

export async function POST(
  request: NextRequest
): Promise<NextResponse<CompareResponse | ErrorResponse>> {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
      const response: ErrorResponse = {
        error: 'Rate limit exceeded',
        message: 'Maximum 10 requests per 10 minutes',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        resetTime: new Date(rateLimit.resetTime).toISOString(),
      };
      return NextResponse.json(response, { status: 429 });
    }

    const body = await request.json();
    const validated = CompareRequestSchema.parse(body);

    const { valid, invalid } = validateModelIds(validated.modelIds);
    if (invalid.length > 0) {
      const response: ErrorResponse = {
        error: 'Validation error',
        message: `Invalid model IDs: ${invalid.join(', ')}`,
        code: 'VALIDATION_ERROR',
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (valid.length === 0) {
      const response: ErrorResponse = {
        error: 'Validation error',
        message: 'At least one valid model must be selected',
        code: 'VALIDATION_ERROR',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const modelPromises = valid.map(async (modelId): Promise<ModelResult> => {
      const model = getModelById(modelId);

      if (!model) {
        return {
          modelId,
          modelName: modelId,
          output: '',
          metrics: { totalTime: 0, tokenCount: 0, tokensPerSecond: 0 },
          error: 'Model not found',
          status: 'error',
        };
      }

      if (model.type === 'static') {
        const benchmark = model as StaticBenchmark;
        return {
          modelId: benchmark.id,
          modelName: benchmark.name,
          output: '',
          metrics: { totalTime: 0, tokenCount: 0, tokensPerSecond: 0 },
          error:
            'Static benchmarks cannot be queried live. They display benchmark scores only.',
          status: 'error',
        };
      }

      return queryModel({
        modelId: model.modelId,
        prompt: validated.prompt,
        maxTokens: validated.maxTokens,
      });
    });

    const results = await Promise.all(modelPromises);

    const successfulModels = results.filter(
      (r) => r.status === 'success'
    ).length;
    const failedModels = results.filter((r) => r.status === 'error').length;

    const response: CompareResponse = {
      results,
      metadata: {
        timestamp: new Date().toISOString(),
        totalModels: results.length,
        successfulModels,
        failedModels,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response: ErrorResponse = {
        error: 'Validation error',
        message: error.issues[0].message,
        code: 'VALIDATION_ERROR',
      };
      return NextResponse.json(response, { status: 400 });
    }

    console.error('Compare API Error:', error);
    const response: ErrorResponse = {
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
