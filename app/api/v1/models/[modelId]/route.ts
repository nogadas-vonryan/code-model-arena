import { NextRequest, NextResponse } from 'next/server';
import { getModelById } from '@/lib/models';
import { checkRateLimit } from '@/lib/rate-limiter';
import { ErrorResponse } from '@/types/api';
import { Model } from '@/types/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ modelId: string }> }
): Promise<NextResponse<Model | ErrorResponse>> {
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

    const { modelId } = await params;
    const model = getModelById(modelId);

    if (!model) {
      const response: ErrorResponse = {
        error: 'Model not found',
        message: `No model found with ID: ${modelId}`,
        code: 'MODEL_NOT_FOUND',
      };
      return NextResponse.json(response, { status: 404 });
    }

    return NextResponse.json(model);
  } catch (error) {
    console.error('Model API Error:', error);
    const response: ErrorResponse = {
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
