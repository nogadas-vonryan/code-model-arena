import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getLiveModels, getStaticModels } from '@/lib/models';
import { checkRateLimit } from '@/lib/rate-limiter';
import { ModelFilterSchema } from '@/lib/validations';
import { ErrorResponse } from '@/types/api';

export async function GET(request: NextRequest): Promise<NextResponse> {
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

    const { searchParams } = new URL(request.url);
    const params = {
      type: searchParams.get('type') as 'live' | 'static' | null,
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
    };

    const validated = ModelFilterSchema.parse(params);

    const liveModels = getLiveModels();
    const staticModels = getStaticModels();

    let filteredLive = liveModels;
    let filteredStatic = staticModels;

    if (validated.type === 'live') {
      filteredStatic = [];
    } else if (validated.type === 'static') {
      filteredLive = [];
    }

    const offset = validated.offset || 0;
    const limit = validated.limit || 20;

    return NextResponse.json({
      liveModels: filteredLive.slice(offset, offset + limit),
      staticBenchmarks: filteredStatic.slice(offset, offset + limit),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response: ErrorResponse = {
        error: 'Validation error',
        message: error.issues[0].message,
        code: 'VALIDATION_ERROR',
      };
      return NextResponse.json(response, { status: 400 });
    }

    console.error('Models API Error:', error);
    const response: ErrorResponse = {
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
