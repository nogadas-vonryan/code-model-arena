export type ModelType = 'live' | 'static';

export interface LiveModel {
  id: string;
  name: string;
  type: 'live';
  provider: 'huggingface';
  modelId: string;
  description: string;
  contextWindow: number;
  tags: string[];
}

export interface StaticBenchmark {
  id: string;
  name: string;
  type: 'static';
  provider: string;
  benchmarkUrl?: string;
  description: string;
  benchmarks: {
    humanEval?: number;
    mbpp?: number;
    'multipl-e'?: number;
    apps?: number;
    gsm8k?: number;
  };
  contextWindow: number;
  tags: string[];
}

export type Model = LiveModel | StaticBenchmark;

export interface ModelMetrics {
  totalTime: number;
  tokenCount: number;
  tokensPerSecond: number;
}

export interface ModelResult {
  modelId: string;
  modelName: string;
  output: string;
  metrics: ModelMetrics;
  error?: string;
  status: 'success' | 'error' | 'loading';
}
