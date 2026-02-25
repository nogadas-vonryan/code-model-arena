## Workflow

### Starting a New Feature

```bash
# 1. Point the AI assistant to the relevant context
"Read agents/ARCHITECTURE.md and agents/STYLE_GUIDE.md before we start"

# 2. Use feature-specific prompts
"Follow agents/PROMPTS/api-endpoint.md to create a new API route"

# 3. AI now understands:
#    - Project structure
#    - Coding conventions
#    - Testing requirements
#    - Documentation standards
```

### Working on Existing Features

```bash
# Reference specific sections
"Use the validation pattern from ARCHITECTURE.md"
"Follow the component structure in STYLE_GUIDE.md"
```

### Code Review with AI

```bash
# Ask AI to verify adherence
"Does this code follow our STYLE_GUIDE.md conventions?"
"Review this against ARCHITECTURE.md patterns"
```

## Directory Structure

```
agents/
├── README.md           ← You are here
├── ARCHITECTURE.md     ← Tech stack, folder structure, patterns
├── STYLE_GUIDE.md      ← Code conventions, naming, formatting
└── PROMPTS/            ← Reusable prompt templates
    ├── api-endpoint.md
    ├── component.md
    ├── test-suite.md
    └── documentation.md
```

## File Purposes

### ARCHITECTURE.md
- Tech stack overview
- Project structure
- Design patterns (rate limiting, validation, error handling)
- Data flow diagrams
- Integration points (HuggingFace API, etc.)

### STYLE_GUIDE.md
- TypeScript conventions
- React patterns
- Naming conventions
- File organization
- Comment standards
- Testing patterns

### PROMPTS/
Reusable templates for common tasks:
- Creating API endpoints
- Building React components
- Writing tests
- Generating documentation

## Best Practices

### For Developers

1. **Update as you build** - Add new patterns when you establish them
2. **Keep it current** - Update ARCHITECTURE.md when tech stack changes
3. **Be specific** - Vague guidelines aren't helpful to AI
4. **Include examples** - Show, don't just tell

### For AI Assistants

When a developer references these files:
1. **Read carefully** - These are project-specific rules
2. **Ask for clarification** - If something conflicts, ask the developer
3. **Suggest improvements** - If you spot inconsistencies, mention them
4. **Follow strictly** - These override general best practices

## Example Usage

### Manual Workflow with agents/

**Developer:** "Create an API endpoint for comparing models"

**AI:** *Creates endpoint with inconsistent error handling, wrong validation library, different file structure*

### Context-Aware Workflow with agents/

**Developer:** "Read agents/ARCHITECTURE.md and agents/PROMPTS/api-endpoint.md, then create an API endpoint for comparing models"

**AI:** *Creates endpoint following project patterns: Zod validation, rate limiting, proper error responses, correct folder structure*

## Maintenance

- **Review quarterly** - Ensure docs reflect current state
- **Update after major refactors** - Keep architecture doc in sync
- **Version control** - Commit changes with meaningful messages
- **Peer review** - Have team review changes to shared context

## Related

- See `skills/` directory for automated scripts/agents
- See `openapi/` for API contract documentation
- See main `README.md` for project setup

