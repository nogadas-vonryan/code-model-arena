# Test Suite Creation Prompt

## Context
Use this prompt when creating tests for the Code Model Arena project.

## Prompt Template

```
I need to create tests following our project conventions.

**Context Files:**
- Read `.agents/ARCHITECTURE.md` for testing strategy
- Read `.agents/STYLE_GUIDE.md` for test conventions
- Review the code being tested

**Requirements:**

Test Details:
- Type: [Unit / E2E]
- Target: [File or feature being tested]
- Location: tests/[unit|e2e]/[filename].test.ts

**Coverage:**
[What should be tested]

**Test Cases:**
[List specific test scenarios]

**Mocking:**
[What needs to be mocked, if anything]

Please implement tests following our conventions from STYLE_GUIDE.md.
```

## Unit Test Example

```
I need to create unit tests following our project conventions.

**Context Files:**
- Read `.agents/ARCHITECTURE.md` for testing strategy
- Read `.agents/STYLE_GUIDE.md` for test conventions
- Review `lib/rate-limiter.ts`

**Requirements:**

Test Details:
- Type: Unit test
- Target: Rate limiter class (lib/rate-limiter.ts)
- Location: tests/unit/rate-limiter.test.ts

**Coverage:**
- Rate limiter initialization
- Allowing requests within limit
- Blocking requests over limit
- Resetting after window expires
- Cleanup of expired entries

**Test Cases:**
1. Should allow first request
2. Should track remaining requests correctly
3. Should block 11th request (limit is 10)
4. Should reset after time window
5. Should handle multiple identifiers independently
6. Should cleanup expired entries

**Mocking:**
- Mock Date.now() for time-based tests
- No external dependencies to mock

Please implement tests following our conventions from STYLE_GUIDE.md.
```

## Unit Test Template

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { RateLimiter } from "@/lib/rate-limiter";

describe("RateLimiter", () => {
  let rateLimiter: RateLimiter;
  
  beforeEach(() => {
    rateLimiter = new RateLimiter(10, 600000); // 10 req per 10min
    vi.clearAllMocks();
  });
  
  describe("check", () => {
    it("should allow first request", () => {
      const result = rateLimiter.check("user1");
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9);
    });
    
    it("should block requests over limit", () => {
      // Make 10 requests
      for (let i = 0; i < 10; i++) {
        rateLimiter.check("user1");
      }
      
      // 11th request should be blocked
      const result = rateLimiter.check("user1");
      
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });
    
    it("should reset after time window", () => {
      vi.useFakeTimers();
      
      // Make 10 requests
      for (let i = 0; i < 10; i++) {
        rateLimiter.check("user1");
      }
      
      // Advance time past window
      vi.advanceTimersByTime(601000); // 10min + 1s
      
      // Should allow new request
      const result = rateLimiter.check("user1");
      expect(result.allowed).toBe(true);
      
      vi.useRealTimers();
    });
    
    it("should handle multiple identifiers independently", () => {
      // Max out user1
      for (let i = 0; i < 10; i++) {
        rateLimiter.check("user1");
      }
      
      // user2 should still be allowed
      const result = rateLimiter.check("user2");
      expect(result.allowed).toBe(true);
    });
  });
});
```

## E2E Test Example

```
I need to create E2E tests following our project conventions.

**Context Files:**
- Read `.agents/ARCHITECTURE.md` for testing strategy
- Read `.agents/STYLE_GUIDE.md` for test conventions
- Review the comparison flow

**Requirements:**

Test Details:
- Type: E2E test
- Target: Full comparison flow
- Location: tests/e2e/compare-flow.spec.ts

**Coverage:**
- User can enter prompt
- User can select models
- User can submit comparison
- Results display correctly
- Error states work
- Rate limiting is enforced

**Test Cases:**
1. Should display comparison form
2. Should validate prompt length
3. Should limit model selection to 3
4. Should submit and display results
5. Should show loading state
6. Should display error on rate limit
7. Should work on mobile viewport

**Mocking:**
- Mock HuggingFace API responses
- Mock rate limiter for consistent tests

Please implement tests following our conventions from STYLE_GUIDE.md.
```

## E2E Test Template

```typescript
import { test, expect } from "@playwright/test";

test.describe("Model Comparison Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
  
  test("should display comparison form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /code model arena/i })).toBeVisible();
    await expect(page.getByPlaceholder(/enter your code prompt/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /compare models/i })).toBeVisible();
  });
  
  test("should validate prompt length", async ({ page }) => {
    const promptInput = page.getByPlaceholder(/enter your code prompt/i);
    const submitButton = page.getByRole("button", { name: /compare models/i });
    
    // Enter short prompt (< 10 chars)
    await promptInput.fill("short");
    await submitButton.click();
    
    // Should show validation error
    await expect(page.getByText(/at least 10 characters/i)).toBeVisible();
  });
  
  test("should limit model selection to 3", async ({ page }) => {
    // Select 3 models
    await page.getByLabel("CodeLlama 7B").check();
    await page.getByLabel("DeepSeek Coder 6.7B").check();
    await page.getByLabel("StarCoder2 15B").check();
    
    // 4th checkbox should be disabled
    await expect(page.getByLabel("Mistral 7B")).toBeDisabled();
  });
  
  test("should submit and display results", async ({ page }) => {
    // Fill form
    await page.getByPlaceholder(/enter your code prompt/i).fill(
      "Write a Python function to reverse a string"
    );
    await page.getByLabel("CodeLlama 7B").check();
    await page.getByLabel("DeepSeek Coder 6.7B").check();
    
    // Submit
    await page.getByRole("button", { name: /compare models/i }).click();
    
    // Should show loading state
    await expect(page.getByText(/generating/i)).toBeVisible();
    
    // Should display results (wait for API response)
    await expect(page.getByText(/def reverse_string/i)).toBeVisible({ timeout: 10000 });
    
    // Should display metrics
    await expect(page.getByText(/tokens per second/i)).toBeVisible();
  });
  
  test("should work on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Form should be visible and usable
    await expect(page.getByPlaceholder(/enter your code prompt/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /compare models/i })).toBeVisible();
    
    // Results should stack vertically
    await page.getByPlaceholder(/enter your code prompt/i).fill(
      "Write a Python function to reverse a string"
    );
    await page.getByLabel("CodeLlama 7B").check();
    await page.getByRole("button", { name: /compare models/i }).click();
    
    // Check responsive layout (results should not overflow)
    const results = page.locator('[data-testid="result-card"]');
    await results.first().waitFor();
    
    const boundingBox = await results.first().boundingBox();
    expect(boundingBox?.width).toBeLessThanOrEqual(375);
  });
});
```

## Checklist

After AI generates tests, verify:

- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] Test names follow "should [behavior] when [condition]" pattern
- [ ] All critical paths are covered
- [ ] Edge cases are tested
- [ ] Error cases are tested
- [ ] Tests are independent (no shared state)
- [ ] Mocks are properly cleaned up
- [ ] Tests are deterministic (no flaky tests)
- [ ] TypeScript types are correct
- [ ] Tests run successfully

## Common Testing Patterns

### Testing Async Functions

```typescript
it("should handle async operation", async () => {
  const result = await asyncFunction();
  expect(result).toBe(expectedValue);
});
```

### Testing Error Handling

```typescript
it("should throw error on invalid input", () => {
  expect(() => {
    functionThatThrows();
  }).toThrow("Expected error message");
});

// For async
it("should reject promise on error", async () => {
  await expect(asyncFunctionThatRejects()).rejects.toThrow("Error message");
});
```

### Testing React Components

```typescript
import { render, screen, fireEvent } from "@testing-library/react";

it("should handle button click", () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByText("Click me"));
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Mocking API Calls

```typescript
import { vi } from "vitest";

vi.mock("@/lib/huggingface", () => ({
  queryModel: vi.fn().mockResolvedValue({
    output: "mocked output",
    metrics: { totalTime: 1.5, tokenCount: 10, tokensPerSecond: 6.67 },
  }),
}));
```

## Coverage Targets

- **Unit Tests:** 80%+ coverage
- **E2E Tests:** Cover critical user flows
- **Integration Tests:** Cover API contracts

## Notes

- Tests should be fast (unit tests < 100ms each)
- Tests should be isolated (no dependencies between tests)
- Tests should be deterministic (same input → same output)
- Mock external dependencies (APIs, time, random)
- Test behavior, not implementation
- Keep tests readable and maintainable
