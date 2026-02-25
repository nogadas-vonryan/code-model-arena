# API Endpoint Creation Prompt

## Context
Use this prompt when creating new API routes in the Code Model Arena project.

## Prompt Template

```
I need to create a new API endpoint following our project conventions.

**Context Files:**
- Read `agents/ARCHITECTURE.md` for API route patterns
- Read `agents/STYLE_GUIDE.md` for coding conventions
- Reference `openapi/spec.yaml` for API contract standards

**Requirements:**

Endpoint Details:
- Method: [GET/POST/PUT/DELETE]
- Path: /api/[endpoint-name]
- Purpose: [Brief description]

**Request:**
[Describe expected request body/query parameters]

**Response:**
[Describe expected response format]

**Validation:**
- Create Zod schema in `lib/validations.ts`
- Validate all input
- Return 400 with clear error messages on validation failure

**Rate Limiting:**
- Apply rate limiting using `checkRateLimit()`
- Return 429 with retry information when exceeded

**Error Handling:**
- Use consistent error response format
- Handle Zod validation errors
- Handle external API errors (if applicable)
- Log errors appropriately

**Testing:**
- Suggest test cases for this endpoint
- Include edge cases (validation, rate limits, errors)

**Documentation:**
- Update `openapi/spec.yaml` with new endpoint
- Include request/response examples
- Document all error codes

Please implement following our established patterns from ARCHITECTURE.md.
```

## Example Usage

```
I need to create a new API endpoint following our project conventions.

**Context Files:**
- Read `agents/ARCHITECTURE.md` for API route patterns
- Read `agents/STYLE_GUIDE.md` for coding conventions
- Reference `openapi/spec.yaml` for API contract standards

**Requirements:**

Endpoint Details:
- Method: GET
- Path: /api/models/{modelId}
- Purpose: Retrieve detailed information about a specific model

**Request:**
- Path parameter: modelId (string)
- No query parameters or body

**Response:**
- 200: Model details (LiveModel or StaticBenchmark)
- 404: Model not found

**Validation:**
- Validate modelId format (non-empty string)
- Check if model exists in models.json

**Rate Limiting:**
- Apply standard rate limiting (10 req/10min)

**Error Handling:**
- Handle model not found
- Handle invalid modelId format

**Testing:**
- Test with valid model ID
- Test with invalid model ID
- Test with non-existent model ID
- Test rate limiting

**Documentation:**
- Update OpenAPI spec with GET /api/models/{modelId}
- Include example responses for both live and static models

Please implement following our established patterns from ARCHITECTURE.md.
```

## Expected Output

The AI should generate:

1. **API Route File** (`app/api/[endpoint]/route.ts`)
   - Following the standard API route pattern
   - With proper error handling
   - With rate limiting
   - With validation

2. **Validation Schema** (in `lib/validations.ts`)
   - Zod schema for request validation
   - Exported type inference

3. **OpenAPI Spec Update** (in `openapi/spec.yaml`)
   - New endpoint definition
   - Request/response schemas
   - Error responses
   - Examples

4. **Test Suggestions**
   - Unit test cases
   - Integration test cases
   - Edge cases to cover

## Checklist

After AI generates the code, verify:

- [ ] Follows API route pattern from ARCHITECTURE.md
- [ ] Includes rate limiting
- [ ] Has Zod validation
- [ ] Uses consistent error format
- [ ] Logs errors appropriately
- [ ] OpenAPI spec is updated
- [ ] TypeScript types are correct
- [ ] No ESLint errors
- [ ] Follows naming conventions from STYLE_GUIDE.md

## Common Pitfalls to Avoid

**Don't:**
- Skip rate limiting
- Use `any` types
- Swallow errors silently
- Forget to update OpenAPI spec
- Use inconsistent error formats
- Skip input validation

**Do:**
- Follow the established pattern exactly
- Use Zod for validation
- Return consistent error responses
- Update OpenAPI documentation
- Include helpful error messages
- Log errors for debugging

## Notes

- All API routes should be serverless-ready (no persistent state)
- Rate limiting is in-memory (resets on cold starts)
- Always validate user input
- Always handle errors gracefully
- Always update OpenAPI spec
