# Architecture Documentation

## Overview

Code Model Arena is a Next.js 14 application that compares code generation models side-by-side. It features live testing for open-source models and static benchmarks for closed-source models.

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5+ (strict mode)
- **Styling:** Tailwind CSS 3+
- **Charts:** Recharts 2+
- **State:** React hooks (useState, useEffect)
- **UI Libraries:** clsx, tailwind-merge

### Backend
- **Runtime:** Next.js API Routes (serverless)
- **Validation:** Zod 3+ (runtime + compile-time types)
- **External APIs:** HuggingFace Inference API
- **Rate Limiting:** In-memory Map-based (MVP), Redis/Upstash (future)

### Code Quality
- **Linting:** ESLint (Next.js config + Prettier)
- **Formatting:** Prettier 3+
- **Git Hooks:** Husky + lint-staged
- **Type Checking:** TypeScript strict mode
- **API Contract:** OpenAPI 3.0

### Testing (Phase 3+)
- **Unit Tests:** Vitest
- **E2E Tests:** Playwright
- **Coverage:** 80%+ target

## Project Structure

```
model-arena/
├── app/                        # Next.js App Router
│   ├── api/                    # API Routes (serverless functions)
│   │   ├── compare/route.ts    # POST /api/compare
│   │   ├── models/route.ts     # GET /api/models
│   │   └── health/route.ts     # GET /api/health
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   └── globals.css             # Global styles
│
├── components/                    # React components
│   ├── PromptInput.tsx           # Textarea for code prompt
│   ├── ModelSelector.tsx         # Checkbox selector (max 3)
│   ├── ResponseGrid.tsx          # Side-by-side result display
│   ├── MetricsChart.tsx          # Recharts visualization
│   └── ui/                       # Reusable UI primitives
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       └── LoadingSpinner.tsx
│
├── lib/                        # Business logic & utilities
│   ├── huggingface.ts          # HF API client
│   ├── models.ts               # Model data utilities
│   ├── validations.ts          # Zod schemas
│   ├── rate-limiter.ts         # In-memory rate limiting
│   └── utils.ts                # Helper functions
│
├── types/                      # TypeScript definitions
│   ├── models.ts               # Model interfaces
│   ├── api.ts                  # API request/response types
│   └── index.ts                # Barrel exports
│
├── data/                       # Static data
│   └── models.json             # Model metadata (live + static)
│
├── openapi/                    # API documentation
│   └── spec.yaml               # OpenAPI 3.0 specification
│
├── tests/                        # Test suites
│   └── unit/                     # Unit tests (Vitest)
│
└── agents/                       # AI assistant context
    ├── README.md
    ├── ARCHITECTURE.md         # This file
    ├── STYLE_GUIDE.md
    └── PROMPTS/
```

## Data Flow

### Live Model Comparison Flow

```
User Input (prompt + model selection)
    ↓
[PromptInput] + [ModelSelector]
    ↓
POST /api/compare
    ↓
[Zod Validation] → Reject if invalid (400)
    ↓
[Rate Limiter] → Reject if exceeded (429)
    ↓
[HF API Client] → Query each model (parallel)
    ↓
    ├─→ Model 1 (success) → Calculate metrics
    ├─→ Model 2 (cold start) → Retry once
    └─→ Model 3 (timeout) → Mark as error
    ↓
[Response Builder] → Normalize results
    ↓
JSON Response
    ↓
[ResponseGrid] → Display results
```

### Static Benchmark Flow

```
User selects "View All Models"
    ↓
GET /api/models
    ↓
[Load models.json]
    ↓
Filter by type (live/static)
    ↓
Return JSON
    ↓
[BenchmarkTable] + [MetricsChart] → Display
```

## Core Patterns

### 1. API Route Pattern

**All API routes follow this structure:**

```typescript
// app/api/[endpoint]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ValidationSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function POST(request: NextRequest) {
  try {
    // 1. Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    
    // 2. Check rate limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Maximum 10 requests per 10 minutes",
          code: "RATE_LIMIT_EXCEEDED",
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
          resetTime: new Date(rateLimit.resetTime).toISOString(),
        },
        { status: 429 }
      );
    }
    
    // 3. Parse and validate request body
    const body = await request.json();
    const validated = ValidationSchema.parse(body);
    
    // 4. Business logic
    const result = await processRequest(validated);
    
    // 5. Return success response
    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    // 6. Handle errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: error.errors[0].message,
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }
    
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An unexpected error occurred",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
```

### 2. Component Pattern

**React components follow this structure:**

```typescript
"use client"; // Only if using hooks/event handlers

import { useState } from "react";
import { ComponentProps } from "@/types";

interface MyComponentProps {
  // Props with JSDoc descriptions
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function MyComponent({
  value,
  onChange,
  disabled = false,
}: MyComponentProps) {
  // 1. Hooks at top
  const [localState, setLocalState] = useState("");
  
  // 2. Derived state
  const isValid = value.length > 0;
  
  // 3. Event handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  // 4. Render
  return (
    <div className="...">
      {/* Component JSX */}
    </div>
  );
}
```

### 3. Validation Pattern

**All user input is validated with Zod:**

```typescript
// lib/validations.ts
import { z } from "zod";

export const MySchema = z.object({
  field: z.string().min(1).max(100),
});

export type MyType = z.infer<typeof MySchema>;

// Usage in API route
const validated = MySchema.parse(body);
```

### 4. Error Handling Pattern

**Consistent error responses:**

```typescript
{
  "error": "Error type",          // Human-readable category
  "message": "Detailed message",  // Specific error description
  "code": "ERROR_CODE",           // Machine-readable code
  "details": {}                   // Optional additional context
}
```

**Error codes:**
- `VALIDATION_ERROR` - Bad input (400)
- `RATE_LIMIT_EXCEEDED` - Too many requests (429)
- `MODEL_UNAVAILABLE` - HF model down (503)
- `INTERNAL_ERROR` - Unexpected error (500)

### 5. Rate Limiting Pattern

**In-memory rate limiter (MVP):**

```typescript
// lib/rate-limiter.ts
class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  
  check(identifier: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    // Implementation
  }
}
```

**Usage:**
- 10 requests per 10 minutes per IP
- Automatic cleanup of expired entries
- Returns `retryAfter` in error response

### 6. HuggingFace API Pattern

**Standardized HF API calls:**

```typescript
// lib/huggingface.ts
export async function queryModel(options: HFQueryOptions) {
  const startTime = Date.now();
  
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${options.modelId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: options.prompt,
        parameters: {
          max_new_tokens: options.maxTokens || 256,
          temperature: options.temperature || 0.7,
        },
      }),
    }
  );
  
  // Handle cold starts (retry once with longer timeout)
  if (response.status === 503) {
    await new Promise(resolve => setTimeout(resolve, 60000));
    // Retry logic...
  }
  
  const data = await response.json();
  const totalTime = (Date.now() - startTime) / 1000;
  
  return {
    output: data[0].generated_text,
    metrics: {
      totalTime,
      tokenCount: estimateTokens(data[0].generated_text),
      tokensPerSecond: estimateTokens(data[0].generated_text) / totalTime,
    },
  };
}
```

## Design Decisions

### Why Next.js App Router?
- Built-in API routes (no separate backend needed)
- Server components for better performance
- Easy Vercel deployment
- Excellent TypeScript support

### Why Zod for Validation?
- Single source of truth for types and validation
- Better error messages than manual checks
- Industry standard in Next.js ecosystem
- Compile-time + runtime safety

### Why In-Memory Rate Limiting?
- Zero external dependencies (free)
- Fast implementation
- Good enough for portfolio demo
- Easy to upgrade to Redis/Upstash later

**Known Limitation:** Resets on serverless cold starts. Acceptable for MVP.

### Why HuggingFace Over OpenRouter?
- Free tier available (no cost barrier)
- More control over model selection
- Learning opportunity (handling cold starts, retries)
- Shows resourcefulness in interviews

### Why Static Benchmarks?
- Provides context (compare with GPT-4, Claude)
- No API costs for closed models
- Shows data modeling skills
- Easy to update with skills/agents

## Environment Variables

```bash
# Required
HUGGINGFACE_API_KEY=hf_...              # Free tier key

# Optional (future)
OPENAI_API_KEY=sk-...                   # For benchmark runner
ANTHROPIC_API_KEY=sk-ant-...            # For benchmark runner
REDIS_URL=redis://...                   # For persistent rate limiting
```

## Performance Targets

- **API Response Time:** < 5s (excluding HF cold starts)
- **Cold Start Handling:** 60s timeout, 1 retry
- **Bundle Size:** < 300KB initial load
- **Lighthouse Score:** 90+ on all metrics
- **Rate Limit:** 10 requests / 10 minutes per IP

## Deployment

**Platform:** Vercel (recommended)

**Build Command:** `npm run build`

**Environment:**
- Node.js 18+
- Serverless functions (default)
- Edge runtime (future optimization)

**Monitoring:**
- Vercel Analytics (default)
- Error tracking: Sentry (optional)
- API usage: HuggingFace dashboard

## Security

- Rate limiting prevents abuse
- Input validation with Zod
- No user data stored (stateless)
- API keys in environment variables only
- CORS handled by Next.js

## Scalability

### MVP (Current)
- In-memory rate limiting
- Serverless functions
- Static models.json

### Phase 2 (Future)
- Redis rate limiting (persistent)
- Database for comparison history
- CDN for static assets

### Phase 3 (Future)
- Streaming responses (SSE)
- WebSocket for real-time updates
- Caching layer for repeated prompts

## Testing Strategy

### Unit Tests (Vitest)
- Validation schemas
- Utility functions
- Rate limiter logic
- Model data helpers

### E2E Tests (Playwright)
- Full comparison flow
- Rate limiting enforcement
- Error states
- Mobile responsive

### Manual Testing Checklist
- [ ] Live comparison works for 3 models
- [ ] Rate limiting triggers after 10 requests
- [ ] Cold start handled gracefully
- [ ] Static benchmarks display correctly
- [ ] Charts render properly
- [ ] Mobile layout works

## Known Issues & Limitations

1. **Cold Starts:** HF models can take 30-60s to wake up
   - **Mitigation:** Loading messages, retry logic, user education
   
2. **Rate Limiting Resets:** In-memory state lost on serverless cold starts
   - **Mitigation:** Acceptable for MVP, document limitation
   
3. **Static Data Staleness:** Benchmarks become outdated
   - **Mitigation:** Clear date labels, benchmark runner agent
   
4. **No Streaming:** Users wait for full response
   - **Mitigation:** Progress indicators, Phase 3 feature

## Future Architecture

### Streaming Implementation (Phase 3)
```
Client (EventSource)
    ↓
API Route (SSE)
    ↓
HF Streaming API
    ↓
Token-by-token updates
```

### Database Integration (Phase 4)
```
PostgreSQL (via Supabase)
├── users (future auth)
├── comparisons (history)
└── feedback (ratings)
```
