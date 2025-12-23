## Context

This is a **maintenance project**. The codebase has established conventions and patterns set by the previous team.

## Requirements for AI Coder

### 1. Mandatory First Step

Scan and analyze the codebase to understand:
- Coding style in use (naming conventions, formatting, file structure)
- Design patterns already applied
- Error handling, logging, and validation approaches
- Module/layer organization

### 2. Golden Rule

New code must **"blend in"** — seamlessly integrate with existing code. A reader should not be able to distinguish between old and new code.

### 3. Strictly Prohibited

- Do NOT suggest "better approaches" if they differ from current conventions
- Do NOT refactor existing code unless explicitly requested
- Do NOT introduce new patterns, even if more popular or modern

### 4. Conflict Resolution Priority
```
Codebase Conventions > General Best Practices > Personal Preferences
```

### 5. Guiding Principles

> **"Respect the codebase. Follow, don't lead."**

> **"When maintaining, conforming beats improving."**

## Expected Behavior

| Situation | Correct Response | Incorrect Response |
|-----------|------------------|-------------------|
| Codebase uses callbacks | Use callbacks | Suggest switching to async/await |
| Codebase uses MVC | Follow MVC structure | Propose Clean Architecture |
| Codebase uses snake_case | Use snake_case | Use camelCase because "it's standard" |
| Codebase has verbose error handling | Match the style | Simplify it |

## Output Requirements

When writing or modifying code:
1. First, cite the existing pattern/convention you are following
2. Ensure stylistic consistency with surrounding code
3. If uncertain, ask for clarification rather than assume