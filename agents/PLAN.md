# Code Model Arena - Implementation Roadmap

## Project Overview

A Next.js 14 application for comparing code generation models side-by-side. Features live testing for open-source models (via HuggingFace API) and static benchmarks for closed-source models.

**Current Status:** Documentation & planning complete. Implementation pending.

---

## MVP Scope

The goal is a working, shippable product. Features are included only if they are core to the comparison value proposition. Anything that can be added after users exist has been deferred.

**In scope:** Model selection, prompt input, side-by-side results with metrics, rate limiting, static benchmarks, mobile layout.

**Explicitly deferred:** Cost calculator, E2E test automation, benchmark runner scripts, data updater scripts.

---

## Phase 1: Foundation & Core Infrastructure

**Goal:** Establish utilities, types, static data, and UI primitives.

### 1.1 Project Structure

- [x] `lib/` — utility modules
- [x] `types/` — TypeScript definitions
- [x] `data/` — static JSON data
- [x] `components/ui/` — UI primitives
- [x] `app/api/` — API route structure

### 1.2 Core Utilities (`lib/`)

- [x] `utils.ts` — helper functions (`cn()`, formatters)
- [x] `validations.ts` — Zod schemas
  - `CompareRequestSchema` — prompt string, modelIds array (max 3, enforced here), optional maxTokens
  - `ModelFilterSchema` — type, limit, offset query params
  - Error response schemas
- [x] `rate-limiter.ts` — in-memory rate limiting
  - 10 requests per 10 minutes per IP
  - Automatic cleanup of expired entries
  - Note: state resets on serverless cold starts; acceptable for MVP
- [x] `huggingface.ts` — HuggingFace API client
  - `queryModel()` with retry logic
  - Cold start handling: 503 → 60s wait → single retry
  - Metrics: token count, elapsed time, tokens/second
- [x] `models.ts` — model data helpers
  - Load and filter from `data/models.json`
  - Metadata accessors

### 1.3 Type Definitions (`types/`)

- [x] `models.ts` — `LiveModel`, `StaticBenchmark`, `ModelMetrics` interfaces
- [x] `api.ts` — `CompareRequest`, `CompareResponse`, `ErrorResponse`
- [x] `index.ts` — barrel exports

### 1.4 Static Data (`data/`)

- [x] `models.json` — 8 models
  - 5 live: CodeLlama, StarCoder, Mistral, DeepSeek Coder, Phi-2
  - 3 static: GPT-4, Claude 3, Gemini Pro — benchmark data only, no live calls

### 1.5 UI Primitives (`components/ui/`)

- [x] `Button.tsx` — variants: default, outline, ghost
- [x] `Card.tsx` — container with optional padding/border
- [x] `Badge.tsx` — live/static status labels
- [x] `LoadingSpinner.tsx` — loading state indicator

**Deliverables:**

- Utilities implemented and typed
- Rate limiter manually verified
- HuggingFace client tested with real API call
- UI primitives rendering in isolation

**Dependencies:**

- `HUGGINGFACE_API_KEY` in `.env.local`

---

## Phase 2: Backend API

**Goal:** All API routes working and validated.

### 2.1 Health Check

- [ ] `app/api/v1/health/route.ts`
  - GET — returns server status
  - No rate limiting

### 2.2 Models API

- [ ] `app/api/v1/models/route.ts`
  - GET `/api/v1/models` — list all models
  - Query params: `type` (live|static), `limit`, `offset`
  - Filtered from `data/models.json`
  - Rate limited

### 2.3 Compare API

- [ ] `app/api/v1/compare/route.ts`
  - POST `/api/v1/compare` — core comparison endpoint
  - Request: `{ prompt: string, modelIds: string[], maxTokens?: number }`
  - Zod validation (max 3 modelIds enforced here as well as client-side)
  - Rate limiting: 10 req/10min
  - Parallel `Promise.all()` calls to HuggingFace — one per model
  - Per-model error isolation: one failed model does not fail the whole request
  - Metrics calculated per response
  - Response: `{ results: ModelResult[], comparisonId: string }`

### 2.4 Error Handling

- [ ] Consistent error shape across all routes: `{ error: string, code: string }`
- [ ] Correct status codes: 400 validation, 429 rate limit, 503 upstream, 500 internal
- [ ] Manual verification via curl for all error paths

**Deliverables:**

- All endpoints working via curl/Postman
- Error responses consistent
- Rate limiting enforced

---

## Phase 3: Frontend Components

**Goal:** All UI components built, typed, and handling loading/error states.

### 3.1 Input Components

- [ ] `components/PromptInput.tsx`
  - Textarea for code prompts
  - Character counter
  - Min/max length validation
  - Disabled state during submission
- [ ] `components/ModelSelector.tsx`
  - Checkbox selection, max 3 enforced with clear feedback
  - Model cards showing name, type badge, and key metadata
  - Filter toggle: live / static / all
  - Loading skeleton while fetching models

### 3.2 Display Components

- [ ] `components/ResponseGrid.tsx`
  - Side-by-side code output panels
  - Syntax highlighting
  - Copy-to-clipboard per panel
  - Per-model error state (e.g. cold start timeout)
  - Loading state per panel
- [ ] `components/MetricsChart.tsx`
  - Recharts bar chart: latency, tokens, tokens/second
  - Toggle between metrics
  - Responsive

### 3.3 Layout Components

- [ ] `components/Header.tsx`
- [ ] `components/Footer.tsx`
- [ ] `components/ErrorBoundary.tsx`

**Not in scope for MVP:** `CostCalculator` — pricing for open-source HuggingFace models is unclear, and static numbers for closed-source models add little value. Defer until there is a clear pricing data source.

**Deliverables:**

- All components render without errors
- Props fully typed, no `any`
- Responsive on mobile and desktop
- Loading and error states implemented

---

## Phase 4: Page Integration

**Goal:** Wire everything together into a working end-to-end flow.

### 4.1 Main Page (`app/page.tsx`)

- [ ] State management:
  - Selected prompt
  - Selected models (array, max 3)
  - Comparison results
  - Loading and error states per model
- [ ] API integration:
  - Fetch models on mount
  - Submit comparison via POST `/api/compare` (synchronous, no streaming)
  - Handle per-model errors in response
- [ ] Layout:
  - Hero/description section
  - Input section: `PromptInput` + `ModelSelector`
  - Results section: `ResponseGrid` + `MetricsChart`

### 4.2 Layout (`app/layout.tsx`)

- [ ] Page metadata: title, description, Open Graph
- [ ] Error boundary wrapper
- [ ] Global font

### 4.3 Global Styles (`app/globals.css`)

- [ ] Tailwind base
- [ ] Code block styles (background, font, padding)
- [ ] Custom scrollbar
- [ ] Transition/animation keyframes

**Note on streaming:** The API is designed as a synchronous POST returning all results at once. Streaming is deferred — it adds meaningful complexity and the synchronous approach is sufficient for MVP given typical HuggingFace response times.

**Deliverables:**

- Full user flow working end-to-end
- No console errors
- Responsive layout

---

## Phase 5: Targeted Tests

**Goal:** Test the logic that is hardest to debug manually. Skip automation that will break as the UI evolves.

### 5.1 Unit Tests (`tests/unit/`)

- [ ] `lib/validations.test.ts` — valid and invalid inputs for all Zod schemas
- [ ] `lib/rate-limiter.test.ts` — limit calculation, cleanup, edge cases
- [ ] `lib/models.test.ts` — filter logic, data loading
- [ ] `lib/huggingface.test.ts` — mocked: API call structure, retry on 503, error handling

### 5.2 Manual Testing Checklist

- [ ] Live comparison works for 1, 2, and 3 models
- [ ] Max 3 model limit enforced client-side and server-side
- [ ] Rate limiting triggers and recovers correctly
- [ ] Cold start handling shows appropriate loading message
- [ ] Static benchmarks display correctly
- [ ] Charts render and metric toggle works
- [ ] All error states visible (validation, rate limit, model failure, network)
- [ ] Mobile layout at 375px and 768px

**Not in scope for MVP:** Playwright E2E tests. The UI will change too much before stabilizing, making E2E tests an ongoing maintenance burden. Add after Phase 7 when the UI is settled.

**Deliverables:**

- Unit tests passing for all lib modules
- Manual checklist signed off

---

## Phase 6: Polish & Documentation

**Goal:** Production-ready code and complete documentation.

### 6.1 Documentation

- [ ] `README.md` — setup, env vars, usage, screenshots
- [ ] Inline JSDoc for public utility functions
- [ ] API routes documented with example curl commands

### 6.2 Performance

- [ ] Bundle size < 300KB
- [ ] Lighthouse scores target: 90+ across all metrics
- [ ] Loading skeletons in place of layout shift
- [ ] No unnecessary re-renders (check with React DevTools)

### 6.3 Final Review

- [ ] TypeScript strict mode — zero `any` types
- [ ] ESLint passing with no suppressions
- [ ] No secrets or API keys in source
- [ ] Keyboard navigation works throughout
- [ ] ARIA labels on interactive elements
- [ ] All TODOs resolved or documented as future work

**Deliverables:**

- Production-ready codebase
- README sufficient for a new developer to set up and run
- Portfolio-ready project

---

## Deferred (Post-MVP)

These are worth building once real users exist and requirements are clearer:

- **Cost Calculator** — add after identifying a reliable pricing data source
- **Streaming results** — add if users find synchronous wait times frustrating
- **E2E test suite** — add after UI stabilizes post-launch
- **Benchmark runner script** — automate metric collection for live models
- **Data updater script** — sync model availability from HuggingFace
- **Persistent rate limiting** — Redis-backed, for multi-instance deployments
- **Additional models** — expand `models.json` based on user requests

---

## Implementation Order Summary

```
Phase 1 (Foundation)
├── lib/utils.ts
├── lib/validations.ts
├── lib/rate-limiter.ts
├── lib/huggingface.ts
├── lib/models.ts
├── types/models.ts
├── types/api.ts
├── types/index.ts
├── data/models.json
└── components/ui/*.tsx

Phase 2 (Backend)
├── app/api/v1/health/route.ts
├── app/api/v1/models/route.ts
└── app/api/v1/compare/route.ts

Phase 3 (Frontend)
├── components/PromptInput.tsx
├── components/ModelSelector.tsx
├── components/ResponseGrid.tsx
├── components/MetricsChart.tsx
└── components/Header.tsx, Footer.tsx, ErrorBoundary.tsx

Phase 4 (Integration)
├── app/page.tsx
├── app/layout.tsx
└── app/globals.css

Phase 5 (Tests)
└── tests/unit/*.test.ts + manual checklist

Phase 6 (Polish)
├── README.md
├── Performance audit
└── Final review
```

---

## Dependencies & Environment

### Required

```bash
HUGGINGFACE_API_KEY=hf_...  # https://huggingface.co/settings/tokens
```

### Already installed (via package.json)

- Next.js 14, TypeScript 5+, Tailwind CSS 3+, Zod 3+, Recharts 2+

### Add for testing

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

---

## MVP Success Criteria

- [ ] User can select 1–3 live models (enforced client and server)
- [ ] User can enter a code generation prompt
- [ ] System queries HuggingFace in parallel for each selected model
- [ ] Results displayed side-by-side with latency/token metrics
- [ ] Per-model errors shown without failing the whole comparison
- [ ] Rate limiting works: 10 req/10min, clear error message on limit
- [ ] Static benchmarks visible alongside live results
- [ ] Mobile responsive at 375px+
- [ ] TypeScript strict, ESLint clean, no console errors in production
