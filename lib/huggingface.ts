import { ModelResult, ModelMetrics } from '@/types/models';
import { estimateTokens, sleep } from '@/lib/utils';

const HF_API_BASE = 'https://api-inference.huggingface.co/models';

interface HFResponse {
  generated_text: string;
}

interface HFError {
  error: string;
}

export interface HFQueryOptions {
  modelId: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

async function queryHF(
  modelId: string,
  prompt: string,
  maxTokens: number,
  temperature: number
): Promise<{ output: string; totalTime: number }> {
  const startTime = Date.now();
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY is not configured');
  }

  const response = await fetch(`${HF_API_BASE}/${modelId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: maxTokens,
        temperature: temperature || 0.7,
      },
    }),
  });

  if (response.status === 503) {
    await sleep(60000);
    const retryResponse = await fetch(`${HF_API_BASE}/${modelId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: maxTokens,
          temperature: temperature || 0.7,
        },
      }),
    });

    if (!retryResponse.ok) {
      const errorData = (await retryResponse.json()) as HFError;
      throw new Error(errorData.error || 'Model unavailable after retry');
    }

    const data = (await retryResponse.json()) as HFResponse[];
    const totalTime = (Date.now() - startTime) / 1000;
    return { output: data[0]?.generated_text || '', totalTime };
  }

  if (!response.ok) {
    const errorData = (await response.json()) as HFError;
    throw new Error(errorData.error || `HF API error: ${response.status}`);
  }

  const data = (await response.json()) as HFResponse[];
  const totalTime = (Date.now() - startTime) / 1000;
  return { output: data[0]?.generated_text || '', totalTime };
}

export async function queryModel(
  options: HFQueryOptions
): Promise<ModelResult> {
  const { modelId, prompt, maxTokens = 256, temperature } = options;
  const modelName = modelId.split('/').pop() || modelId;

  try {
    const { output, totalTime } = await queryHF(
      modelId,
      prompt,
      maxTokens,
      temperature ?? 0.7
    );

    const tokenCount = estimateTokens(output);
    const tokensPerSecond = totalTime > 0 ? tokenCount / totalTime : 0;

    const metrics: ModelMetrics = {
      totalTime,
      tokenCount,
      tokensPerSecond,
    };

    return {
      modelId,
      modelName,
      output,
      metrics,
      status: 'success',
    };
  } catch (error) {
    return {
      modelId,
      modelName,
      output: '',
      metrics: {
        totalTime: 0,
        tokenCount: 0,
        tokensPerSecond: 0,
      },
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error',
    };
  }
}
