# Development Rules

Core principles governing all ASDF implementations.

## Fundamental Principles

**YAGNI** - You Aren't Gonna Need It
- Only implement what the spec requires
- No speculative features
- No "nice to have" additions without spec approval

**KISS** - Keep It Simple, Stupid
- Simplest solution that meets spec requirements
- Avoid over-engineering
- Prefer readability over cleverness

**DRY** - Don't Repeat Yourself
- Extract common patterns
- Reuse existing components
- Reference existing specs rather than duplicating

## Spec-First Rules

1. **Never code without reading spec first**
   - Load context hierarchy before implementation
   - Understand the "why" behind requirements

2. **Spec is contract, not suggestion**
   - Deviations require documentation
   - Improvements trigger Reverse Sync
   - Blockers must be escalated

3. **Reality trumps aspiration**
   - If code differs from spec, spec must update
   - Documentation reflects actual state, not planned state

## Code Quality

- **File Size**: Keep under 200 lines for context optimization
- **Naming**: Use descriptive, kebab-case filenames
- **Structure**: Follow established project patterns
- **Error Handling**: Implement proper error boundaries
- **Security**: No hardcoded secrets, follow OWASP guidelines

## Documentation Standards

- Specs use markdown format
- Include code snippets for complex logic
- Add mermaid diagrams for flows
- Timestamp all changes with `[YYMMDD]` format

## Prohibited Actions

- **NO** implementing without spec context
- **NO** ignoring Reverse Sync requirements
- **NO** leaving undocumented changes
- **NO** mock data in production code (unless spec allows)
- **NO** committing without updating session handoff

## Session Discipline

At session START:
- Load `session-handoff.md`
- Verify previous session state
- Continue from documented point

At session END:
- Update `session-handoff.md`
- Document all changes made
- List pending items
- Note any blockers
