import { Model, ModelType } from '@/types/models';
import modelsData from '@/data/models.json';

const models: Model[] = modelsData as Model[];

export function getAllModels(): Model[] {
  return models;
}

export function getModelById(id: string): Model | undefined {
  return models.find((m) => m.id === id);
}

export function filterModels(options: {
  type?: ModelType;
  limit?: number;
  offset?: number;
}): Model[] {
  let filtered = models;

  if (options.type) {
    filtered = filtered.filter((m) => m.type === options.type);
  }

  const offset = options.offset || 0;
  const limit = options.limit || filtered.length;

  return filtered.slice(offset, offset + limit);
}

export function getLiveModels(): Model[] {
  return models.filter((m) => m.type === 'live');
}

export function getStaticModels(): Model[] {
  return models.filter((m) => m.type === 'static');
}

export function validateModelIds(ids: string[]): {
  valid: string[];
  invalid: string[];
} {
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const id of ids) {
    if (getModelById(id)) {
      valid.push(id);
    } else {
      invalid.push(id);
    }
  }

  return { valid, invalid };
}
