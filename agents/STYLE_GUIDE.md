# Style Guide

## Overview

This style guide ensures consistency across the codebase and helps AI assistants write code that matches the project's conventions.

**Core Principle:** Write code that is clean, readable, and maintainable.

## TypeScript Conventions

### Type Definitions

**DO:** Use interfaces for object shapes

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}
```

**DO:** Use type aliases for unions and complex types

```typescript
type Status = 'success' | 'error' | 'pending';
type ModelType = 'open' | 'closed';
```

**DO:** Export types alongside implementation

```typescript
// lib/models.ts
export interface Model {
  /* ... */
}
export function getModel(id: string): Model {
  /* ... */
}
```

**DON'T:** Use `any` type

```typescript
// Bad
function process(data: any) {}

// Good
function process(data: unknown) {
  // Type guard here
}
```

### Naming Conventions

**Files:**

- Components: `PascalCase.tsx` (e.g., `PromptInput.tsx`)
- Utilities: `camelCase.ts` (e.g., `rate-limiter.ts`)
- Types: `camelCase.ts` (e.g., `models.ts`)
- Constants: `UPPER_SNAKE_CASE.ts` (e.g., `API_CONSTANTS.ts`)

**Variables:**

- `camelCase` for variables and functions
- `PascalCase` for components and classes
- `UPPER_SNAKE_CASE` for constants

```typescript
// Variables
const userName = 'John';
const isValid = true;

// Functions
function getUserById(id: string) {}

// Components
function UserProfile() {}

// Classes
class RateLimiter {}

// Constants
const MAX_REQUESTS = 10;
const API_TIMEOUT = 30000;
```

**Booleans:** Use `is`, `has`, `should` prefixes

```typescript
const isLoading = true;
const hasError = false;
const shouldRetry = true;
```

**Arrays:** Use plural nouns

```typescript
const users = ['Alice', 'Bob'];
const modelIds = ['gpt-4', 'claude-3'];
```

### Functions

**DO:** Use arrow functions for inline callbacks

```typescript
models.map((model) => model.id);
models.filter((model) => model.type === 'open');
```

**DO:** Use function declarations for named exports

```typescript
export function calculateMetrics(data: ModelResult) {
  // Implementation
}
```

**DO:** Use async/await over promises

```typescript
// Good
async function fetchData() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Bad
function fetchData() {
  return fetch(url)
    .then((res) => res.json())
    .then((data) => data);
}
```

**DO:** Early returns for guard clauses

```typescript
// Good
function processUser(user: User | null) {
  if (!user) return null;
  if (!user.isActive) return null;

  return user.name;
}

// Bad
function processUser(user: User | null) {
  if (user) {
    if (user.isActive) {
      return user.name;
    }
  }
  return null;
}
```

### Imports

**Order:** External → Internal → Types → Styles

```typescript
// 1. External libraries
import { useState, useEffect } from 'react';
import { z } from 'zod';

// 2. Internal modules (absolute paths)
import { getModels } from '@/lib/models';
import { CompareRequest } from '@/types';

// 3. Components
import Button from '@/components/ui/Button';

// 4. Styles (if any)
import styles from './Component.module.css';
```

**DO:** Use absolute paths with `@/` alias

```typescript
// Good
import { queryModel } from '@/lib/huggingface';

// Bad
import { queryModel } from '../../../lib/huggingface';
```

**DO:** Use named imports

```typescript
// Good
import { getModels, filterModels } from '@/lib/models';

// Bad (unless default export)
import * as models from '@/lib/models';
```

## React Conventions

### Component Structure

**Standard component template:**

```typescript
"use client"; // Only if using hooks or browser APIs

import { useState } from "react";

/**
 * ComponentName - Brief description
 *
 * @example
 * <ComponentName value="test" onChange={handleChange} />
 */
interface ComponentNameProps {
  /** Prop description */
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function ComponentName({
  value,
  onChange,
  disabled = false,
}: ComponentNameProps) {
  // 1. Hooks
  const [localState, setLocalState] = useState("");

  // 2. Derived state
  const isValid = value.length > 0;

  // 3. Effects
  useEffect(() => {
    // Side effects
  }, [dependency]);

  // 4. Event handlers
  const handleClick = () => {
    onChange(value);
  };

  // 5. Render helpers (if needed)
  const renderStatus = () => {
    return <span>{isValid ? "Valid" : "Invalid"}</span>;
  };

  // 6. Early returns (loading, error states)
  if (disabled) {
    return <div>Component disabled</div>;
  }

  // 7. Main render
  return (
    <div className="...">
      {/* Component JSX */}
    </div>
  );
}
```

### Hooks

**DO:** Custom hooks for reusable logic

```typescript
// hooks/useRateLimit.ts
export function useRateLimit(limit: number) {
  const [remaining, setRemaining] = useState(limit);
  // Logic
  return { remaining, checkLimit };
}
```

**DO:** Destructure hook returns

```typescript
const { data, error, isLoading } = useFetch(url);
```

**DON'T:** Call hooks conditionally

```typescript
// Bad
if (condition) {
  const [state, setState] = useState();
}

// Good
const [state, setState] = useState();
if (condition) {
  setState(newValue);
}
```

### Props

**DO:** Destructure props in function signature

```typescript
// Good
function Component({ name, age }: Props) {}

// Bad
function Component(props: Props) {
  const { name, age } = props;
}
```

**DO:** Provide default values for optional props

```typescript
function Component({ variant = 'primary', disabled = false }: Props) {}
```

**DON'T:** Pass entire objects as props (spread carefully)

```typescript
// Bad (prop drilling)
<Child {...everything} />

// Good (explicit props)
<Child name={user.name} age={user.age} />
```

### Conditional Rendering

**DO:** Use ternary for simple conditions

```typescript
{isLoading ? <Spinner /> : <Content />}
```

**DO:** Use `&&` for single conditions

```typescript
{error && <ErrorMessage error={error} />}
```

**DO:** Use early returns for complex conditions

```typescript
if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
return <Content />;
```

## CSS / Tailwind Conventions

### Class Names

**DO:** Use Tailwind utility classes

```typescript
<div className="flex items-center justify-between p-4 bg-white rounded-lg">
```

**DO:** Group related utilities (layout → spacing → colors → effects)

```typescript
// Good - Grouped logically
<div className="flex flex-col gap-4 p-6 bg-white border rounded-lg shadow-sm">

// Bad - Random order
<div className="rounded-lg flex p-6 border gap-4 shadow-sm bg-white flex-col">
```

**DO:** Use `cn()` helper for conditional classes

```typescript
import { cn } from "@/lib/utils";

<button
  className={cn(
    "px-4 py-2 rounded-lg",
    variant === "primary" && "bg-blue-600 text-white",
    variant === "secondary" && "bg-gray-200 text-gray-900",
    disabled && "opacity-50 cursor-not-allowed"
  )}
>
```

**DON'T:** Mix Tailwind with inline styles

```typescript
// Bad
<div className="p-4" style={{ padding: "16px" }}>

// Good
<div className="p-4">
```

### Responsive Design

**DO:** Use mobile-first responsive utilities

```typescript
<div className="w-full md:w-1/2 lg:w-1/3">
```

**DO:** Stack layouts on mobile

```typescript
<div className="flex flex-col md:flex-row gap-4">
```

## API Route Conventions

### Route Structure

**Standard API route template:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limiter';
import { ValidationSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    // 1. Get client identifier
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // 2. Rate limiting
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Maximum 10 requests per 10 minutes',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    // 3. Parse & validate
    const body = await request.json();
    const validated = ValidationSchema.parse(body);

    // 4. Business logic
    const result = await processRequest(validated);

    // 5. Success response
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // 6. Error handling
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          message: error.errors[0].message,
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
```

### Error Responses

**DO:** Use consistent error format

```typescript
{
  "error": "Error type",
  "message": "Human-readable message",
  "code": "MACHINE_READABLE_CODE",
  "details": {}  // Optional
}
```

**Error Status Codes:**

- `400` - Bad request (validation errors)
- `429` - Rate limit exceeded
- `500` - Internal server error
- `503` - Service unavailable (external API down)

## Comments & Documentation

### When to Comment

**DO:** Comment complex logic

```typescript
// Calculate tokens per second, handling edge case where totalTime is 0
const tokensPerSecond = totalTime > 0 ? tokenCount / totalTime : 0;
```

**DO:** Comment non-obvious decisions

```typescript
// Retry once on 503 (cold start) with 60s delay
if (response.status === 503) {
  await new Promise((resolve) => setTimeout(resolve, 60000));
  // Retry logic...
}
```

**DO:** Use JSDoc for exported functions

```typescript
/**
 * Query a HuggingFace model with the given prompt
 *
 * @param modelId - HuggingFace model identifier
 * @param prompt - Code generation prompt
 * @returns Model output and performance metrics
 * @throws Error if model is unavailable or times out
 */
export async function queryModel(modelId: string, prompt: string) {
  // Implementation
}
```

**DON'T:** Comment obvious code

```typescript
// Bad
// Set user name to John
const userName = 'John';

// Bad
// Loop through models
models.forEach((model) => {});
```

### TODO Comments

**DO:** Use TODO for future work

```typescript
// TODO: Implement streaming response
// TODO: Add retry logic with exponential backoff
```

**DO:** Include context in TODOs

```typescript
// TODO: Replace with Redis when scaling (in-memory resets on cold start)
```

## Testing Conventions

### Unit Tests

**Structure:** Arrange, Act, Assert

```typescript
import { describe, it, expect } from 'vitest';

describe('calculateMetrics', () => {
  it('calculates tokens per second correctly', () => {
    // Arrange
    const tokenCount = 100;
    const totalTime = 10;

    // Act
    const result = calculateMetrics(tokenCount, totalTime);

    // Assert
    expect(result.tokensPerSecond).toBe(10);
  });
});
```

### Test Naming

**Pattern:** `should [expected behavior] when [condition]`

```typescript
it('should return error when prompt is too short', () => {});
it('should retry once when model returns 503', () => {});
it('should calculate metrics correctly when time is non-zero', () => {});
```

## Error Handling

### Try-Catch Blocks

**DO:** Catch specific errors

```typescript
try {
  const validated = schema.parse(data);
} catch (error) {
  if (error instanceof z.ZodError) {
    // Handle validation error
  }
  throw error; // Re-throw if unknown
}
```

**DO:** Log errors appropriately

```typescript
catch (error) {
  console.error("Failed to fetch model:", error);
  // Handle error
}
```

**DON'T:** Swallow errors silently

```typescript
// Bad
try {
  riskyOperation();
} catch (error) {
  // Empty catch
}
```

## Git Conventions

### Commit Messages

**Format:** `type(scope): message`

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructure
- `test` - Tests
- `chore` - Build/tooling

**Examples:**

```
feat(api): add rate limiting to compare endpoint
fix(ui): resolve mobile layout overflow issue
docs(readme): update setup instructions
refactor(lib): extract validation logic to separate file
```

### Branch Naming

**Pattern:** `type/description`

```
feature/streaming-responses
fix/rate-limit-reset
docs/api-documentation
refactor/validation-layer
```

## File Organization

### Barrel Exports

**DO:** Use index.ts for cleaner imports

```typescript
// types/index.ts
export * from './models';
export * from './api';

// Usage
import { Model, CompareRequest } from '@/types';
```

### Co-location

**DO:** Keep related files together

```
components/
  PromptInput/
    PromptInput.tsx
    PromptInput.test.tsx
    PromptInput.stories.tsx
```

## Performance

### React Performance

**DO:** Use React.memo for expensive components

```typescript
export default React.memo(ExpensiveComponent);
```

**DO:** Memoize expensive calculations

```typescript
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);
```

**DO:** Debounce user input

```typescript
const debouncedSearch = useMemo(
  () => debounce((value) => search(value), 300),
  []
);
```

## Accessibility

**DO:** Use semantic HTML

```typescript
<button> instead of <div onClick>
<nav> for navigation
<main> for main content
```

**DO:** Add ARIA labels where needed

```typescript
<button aria-label="Close dialog" onClick={onClose}>
  <XIcon />
</button>
```

**DO:** Support keyboard navigation

```typescript
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === "Enter" && onClick()}
>
```

---

## Quick Reference

### Common Patterns

**Loading State:**

```typescript
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
return <Content data={data} />;
```

**Form Handling:**

```typescript
const [value, setValue] = useState('');
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Handle submit
};
```

**API Call:**

```typescript
const [data, setData] = useState(null);
const [error, setError] = useState(null);
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  setIsLoading(true);
  fetch('/api/endpoint')
    .then((res) => res.json())
    .then(setData)
    .catch(setError)
    .finally(() => setIsLoading(false));
}, []);
```
