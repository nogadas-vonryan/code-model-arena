# React Component Creation Prompt

## Context

Use this prompt when creating new React components in the Code Model Arena project.

## Prompt Template

```
I need to create a new React component following our project conventions.

**Context Files:**
- Read `agents/ARCHITECTURE.md` for component patterns
- Read `agents/STYLE_GUIDE.md` for React conventions
- Reference existing components in `components/` for consistency

**Requirements:**

Component Details:
- Name: [ComponentName]
- Location: components/[path]/[ComponentName].tsx
- Purpose: [Brief description]
- Client/Server: [Specify if needs "use client" directive]

**Props:**
[List expected props with types and descriptions]

**State:**
[List any internal state needed]

**Behavior:**
[Describe component behavior and interactions]

**Styling:**
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use `cn()` helper for conditional classes

**Accessibility:**
- Add appropriate ARIA labels
- Support keyboard navigation
- Use semantic HTML

**Performance:**
- Consider React.memo if expensive to render
- Consider useMemo for expensive calculations
- Consider useCallback for passed-down handlers

Please implement following our component structure from STYLE_GUIDE.md.
```

## Example Usage

```
I need to create a new React component following our project conventions.

**Context Files:**
- Read `agents/ARCHITECTURE.md` for component patterns
- Read `agents/STYLE_GUIDE.md` for React conventions
- Reference existing components in `components/` for consistency

**Requirements:**

Component Details:
- Name: BenchmarkTable
- Location: components/BenchmarkTable.tsx
- Purpose: Display all models (live + static) in a sortable table
- Client/Server: Client component (needs useState for sorting)

**Props:**
- models: (LiveModel | StaticBenchmark)[]
- onModelSelect?: (modelId: string) => void

**State:**
- sortBy: "name" | "speed" | "cost"
- sortDirection: "asc" | "desc"

**Behavior:**
- Display all models in a table
- Columns: Model Name, Provider, Type, Speed, Cost, Last Updated
- Clicking column headers sorts the table
- "Live" badge for open-source models
- "Benchmark (date)" badge for closed-source models
- Clicking a row calls onModelSelect (if provided)

**Styling:**
- Responsive table (stack on mobile)
- Hover effects on rows
- Sort indicator on active column
- Badges with appropriate colors

**Accessibility:**
- Table has caption
- Headers have scope
- Sort buttons are keyboard accessible
- Row clicks have keyboard equivalent

**Performance:**
- Memoize sorted data
- Consider virtualizing if table gets large (future)

Please implement following our component structure from STYLE_GUIDE.md.
```

## Expected Output

The AI should generate:

1. **Component File** (`components/[ComponentName].tsx`)
   - Following the standard component structure
   - With TypeScript interface for props
   - With proper hooks organization
   - With JSDoc comments

2. **Related Files** (if needed)
   - Unit test file (`components/[ComponentName].test.tsx`)
   - Storybook story (future phase)

## Component Structure Template

```typescript
"use client"; // Only if using hooks/browser APIs

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * ComponentName - Brief description
 *
 * @example
 * <ComponentName prop1="value" onAction={handleAction} />
 */
interface ComponentNameProps {
  /** Prop description */
  prop1: string;
  prop2?: number;
  onAction?: () => void;
}

export default function ComponentName({
  prop1,
  prop2 = 0,
  onAction,
}: ComponentNameProps) {
  // 1. Hooks
  const [localState, setLocalState] = useState(initialValue);

  // 2. Derived state / Memoized values
  const computedValue = useMemo(() => {
    return expensiveCalculation(prop1);
  }, [prop1]);

  // 3. Effects
  useEffect(() => {
    // Side effects
  }, [dependency]);

  // 4. Event handlers
  const handleClick = () => {
    setLocalState(newValue);
    onAction?.();
  };

  // 5. Render helpers (optional)
  const renderSection = () => {
    return <div>Section content</div>;
  };

  // 6. Early returns (loading/error states)
  if (prop2 === 0) {
    return <div>Empty state</div>;
  }

  // 7. Main render
  return (
    <div className="...">
      {/* Component JSX */}
    </div>
  );
}
```

## Checklist

After AI generates the component, verify:

- [ ] Follows component structure from STYLE_GUIDE.md
- [ ] Props interface is well-documented
- [ ] Uses TypeScript properly (no `any` types)
- [ ] Hooks are in correct order
- [ ] Event handlers are named consistently
- [ ] Tailwind classes are organized logically
- [ ] Component is accessible (ARIA, keyboard)
- [ ] Responsive design is considered
- [ ] No ESLint warnings
- [ ] Follows naming conventions

## Common Pitfalls to Avoid

**Don't:**

- Use `any` types for props
- Call hooks conditionally
- Forget "use client" when using hooks
- Mix Tailwind with inline styles
- Create deeply nested components
- Ignore accessibility
- Pass entire objects as props unnecessarily

**Do:**

- Use TypeScript interfaces
- Destructure props in signature
- Add JSDoc comments
- Use semantic HTML
- Follow mobile-first responsive design
- Memoize expensive calculations
- Use the `cn()` helper for conditional classes

## UI Component Pattern

For reusable UI primitives (Button, Card, Badge, etc.):

```typescript
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "font-medium rounded-lg transition-colors",
        // Size variants
        {
          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2 text-base": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        },
        // Color variants
        {
          "bg-blue-600 text-white hover:bg-blue-700": variant === "primary",
          "bg-gray-200 text-gray-900 hover:bg-gray-300": variant === "secondary",
          "border border-gray-300 hover:bg-gray-50": variant === "outline",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

## Notes

- Always use "use client" for components with hooks or event handlers
- Keep components focused (single responsibility)
- Prefer composition over configuration
- Use TypeScript for prop validation
- Consider accessibility from the start
- Test on mobile viewport sizes
