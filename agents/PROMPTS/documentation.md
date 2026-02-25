# Documentation Creation Prompt

## Context
Use this prompt when creating or updating documentation for the Code Model Arena project.

## Prompt Template

```
I need to create/update documentation following our project conventions.

**Context Files:**
- Read `.agents/ARCHITECTURE.md` for project structure
- Read `.agents/STYLE_GUIDE.md` for conventions
- Review existing documentation for consistency

**Requirements:**

Documentation Type: [README / API Docs / Code Comments / Architecture]
Target Audience: [Developers / Users / Contributors]
Purpose: [What should readers learn or be able to do]

**Content to Include:**
[List specific sections or topics]

**Format:**
[Markdown / JSDoc / OpenAPI / etc.]

Please write documentation that is clear, accurate, and helpful.
```

## README Example

```
I need to create the main README.md following our project conventions.

**Context Files:**
- Read `.agents/ARCHITECTURE.md` for technical details
- Review `openapi/spec.yaml` for API information
- Check existing component files for features

**Requirements:**

Documentation Type: README.md
Target Audience: Developers (portfolio viewers, potential employers, contributors)
Purpose: Help readers understand, set up, and run the project

**Content to Include:**
1. Project overview and purpose
2. Features list with screenshots
3. Tech stack
4. Prerequisites
5. Installation instructions
6. Environment variables
7. Running locally
8. Running tests
9. Deployment guide
10. Project structure
11. API documentation
12. Known limitations
13. Roadmap
14. Contributing guidelines
15. License

**Format:**
- Markdown with clear sections
- Include code blocks with syntax highlighting
- Add badges (build status, coverage, etc.)
- Include screenshots or GIFs
- Use emojis sparingly for visual hierarchy

Please write documentation that showcases the project professionally.
```

## README Template

```markdown
# Code Model Arena

> Compare code generation models side-by-side with live testing and benchmarks

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Live Demo](https://model-arena.vercel.app) | [Documentation](#) | [Report Bug](#)

![Screenshot](docs/images/screenshot.png)

## Features

- **Live Testing** - Run prompts against open-source models via HuggingFace
- **Static Benchmarks** - Compare with GPT-4, Claude, and Gemini
- **Performance Metrics** - Track tokens/sec, response time, and costs
- **Cost Calculator** - Estimate pricing for different usage volumes
- **Clean UI** - Modern, responsive design with Tailwind CSS
- **Rate Limited** - Built-in abuse prevention
- **Mobile Friendly** - Works seamlessly on all devices

## Tech Stack

**Frontend:**
- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Recharts](https://recharts.org/) - Data visualization

**Backend:**
- Next.js API Routes - Serverless functions
- [Zod](https://zod.dev/) - Runtime validation
- HuggingFace Inference API - Model access

**Code Quality:**
- ESLint + Prettier - Code formatting
- Husky + lint-staged - Git hooks
- OpenAPI 3.0 - API documentation

## Prerequisites

- Node.js 18+ 
- npm or yarn
- HuggingFace account (free tier)

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/model-arena.git
cd model-arena
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
HUGGINGFACE_API_KEY=your_hf_api_key_here
```

Get your HuggingFace API key from [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e

# Run with coverage
npm run test:coverage
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm run start
```

## Project Structure

```
model-arena/
├── app/              # Next.js app (pages + API routes)
├── components/       # React components
├── lib/              # Business logic & utilities
├── types/            # TypeScript definitions
├── data/             # Static model metadata
├── openapi/          # API documentation
├── skills/           # Automation scripts
├── tests/            # Test suites
└── .agents/          # AI assistant context
```

## API Documentation

API documentation is available in OpenAPI 3.0 format:
- View: `openapi/spec.yaml`
- Validate: `npm run openapi:validate`

### Key Endpoints

**POST /api/compare**
Compare multiple models

**GET /api/models**
Get all available models

**GET /api/models/{modelId}**
Get specific model details

See [API Documentation](openapi/spec.yaml) for full details.

## Known Limitations

- **Cold Starts**: HuggingFace models can take 30-60s to wake up (first request)
- **Rate Limiting**: In-memory state resets on serverless cold starts
- **Static Data**: Closed-source model benchmarks may become outdated

## Roadmap

- [ ] Streaming responses (real-time token generation)
- [ ] Comparison history (save and share results)
- [ ] More models (expand to 20+ models)
- [ ] Quality scoring (automated code correctness checks)
- [ ] User authentication (save preferences)
- [ ] Database integration (persistent history)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Read `.agents/` documentation for conventions
4. Make your changes
5. Run tests (`npm test`)
6. Commit with conventional commits (`feat: add new feature`)
7. Push to your branch
8. Open a Pull Request

See [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- [HuggingFace](https://huggingface.co/) for free model access
- [Vercel](https://vercel.com/) for hosting
- [Next.js](https://nextjs.org/) team for the amazing framework

---

## JSDoc Example

```
I need to add JSDoc comments to a function following our conventions.

**Context Files:**
- Read `.agents/STYLE_GUIDE.md` for comment conventions

**Requirements:**

Documentation Type: JSDoc comments
Target: queryModel function in lib/huggingface.ts
Purpose: Document API, parameters, return values, and errors

**Content to Include:**
- Function description
- Parameter descriptions with types
- Return value description
- Possible errors/exceptions
- Usage example

Please write clear, concise JSDoc comments.
```

## JSDoc Template

```typescript
/**
 * Query a HuggingFace model with the given prompt
 * 
 * Handles cold starts by retrying once with a 60-second timeout.
 * Returns normalized metrics including tokens/sec calculation.
 * 
 * @param options - Query configuration
 * @param options.modelId - HuggingFace model identifier (e.g., "codellama/CodeLlama-7b-Instruct-hf")
 * @param options.prompt - Code generation prompt (10-2000 characters)
 * @param options.maxTokens - Maximum tokens to generate (default: 256)
 * @param options.temperature - Sampling temperature (default: 0.7)
 * 
 * @returns Model output and performance metrics
 * @returns {string} output - Generated code
 * @returns {object} metrics - Performance measurements
 * @returns {number} metrics.totalTime - Total time in seconds
 * @returns {number} metrics.tokenCount - Number of tokens generated
 * @returns {number} metrics.tokensPerSecond - Generation speed
 * @returns {number} metrics.timeToFirstToken - Time to first token (cold start indicator)
 * 
 * @throws {Error} If model is unavailable after retry
 * @throws {Error} If request times out (>60s)
 * @throws {Error} If HuggingFace API returns an error
 * 
 * @example
 * ```typescript
 * const result = await queryModel({
 *   modelId: "codellama/CodeLlama-7b-Instruct-hf",
 *   prompt: "Write a Python function to reverse a string"
 * });
 * console.log(result.output); // "def reverse_string(s):\n    return s[::-1]"
 * console.log(result.metrics.tokensPerSecond); // 8.19
 * ```
 */
export async function queryModel(options: HFQueryOptions): Promise<HFResponse> {
  // Implementation
}
```

## OpenAPI Documentation Example

```
I need to document a new API endpoint in OpenAPI spec.

**Context Files:**
- Read `openapi/spec.yaml` for existing patterns
- Read `.agents/ARCHITECTURE.md` for API conventions

**Requirements:**

Documentation Type: OpenAPI 3.0 specification
Target: POST /api/compare endpoint
Purpose: Document request/response schemas and examples

**Content to Include:**
- Endpoint summary and description
- Request body schema
- Response schemas (200, 400, 429, 500)
- Request/response examples
- Error response examples

**Format:**
- YAML following OpenAPI 3.0 spec
- Include multiple examples
- Document all possible responses

Please update the OpenAPI spec following existing patterns.
```

## Checklist

After AI generates documentation, verify:

- [ ] Accurate and up-to-date information
- [ ] Clear and concise language
- [ ] Proper formatting (Markdown, JSDoc, etc.)
- [ ] Code examples work correctly
- [ ] Links are valid
- [ ] Follows project style
- [ ] Includes visual aids (diagrams, screenshots)
- [ ] Covers edge cases and limitations
- [ ] Provides next steps or related resources

## Documentation Best Practices

### Writing Style

**DO:**
- Use active voice
- Write in present tense
- Be concise and direct
- Include examples
- Explain "why" not just "what"

**DON'T:**
- Use jargon without explanation
- Assume prior knowledge
- Write walls of text
- Skip error cases
- Leave outdated information

### Structure

1. **Start with the "why"** - Explain purpose and value
2. **Show the "how"** - Provide clear steps
3. **Include examples** - Concrete code samples
4. **Document edge cases** - Known issues, limitations
5. **Link to related docs** - Help readers learn more

### Code Examples

```typescript
// Good - Clear, runnable, with comments
const result = await queryModel({
  modelId: "codellama/CodeLlama-7b-Instruct-hf",
  prompt: "Write a Python function",
});
// Returns: { output: "def...", metrics: {...} }

// Bad - Vague, incomplete
const result = queryModel(params);
```

## Notes

- Keep documentation in sync with code
- Update docs when making changes
- Use consistent terminology
- Include visual aids when helpful
- Test all code examples
- Make docs searchable (clear headings, keywords)
