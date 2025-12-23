---
name: context-loading
description: Load hierarchical context from ASDF documentation tiers for informed implementation.
---

# Context Loading Skill

Systematically load project context in proper hierarchy before any implementation task.

## When to Use

Activate this skill:
- At start of any implementation task
- When context appears insufficient
- After session restart
- When switching between features

## Core Principle

> **Context hierarchy prevents drift. Load global → domain → feature → session.**

AI must understand project DNA before writing any code.

## Loading Hierarchy

```
Priority 1: system-core/    → Global rules, project DNA (ALWAYS load)
Priority 2: domains/        → Business logic for relevant module
Priority 3: features/       → Specific feature spec being implemented
Priority 4: operations/     → Current state, session continuity
```

## Loading Process

### Step 1: Load System Core (Mandatory)

Always read:
- `asdf-docs/01-system-core/master-map.md` → Project architecture
- `asdf-docs/01-system-core/ui-ux-design-system.md` → Design standards
- `asdf-docs/01-system-core/project-status.md` → Current state

**Extract**:
- Core technologies
- Architectural patterns
- Design principles
- Current project phase

### Step 2: Load Relevant Domain

Based on feature context, identify and load:
- `asdf-docs/02-domains/[relevant-domain].md`

**Extract**:
- Business rules
- Domain entities
- Integration points
- Domain-specific constraints

### Step 3: Load Feature Spec

For implementation tasks:
- `asdf-docs/03-features/[YYMMDD]-[feature-name]/spec.md`
- Related design documents
- Feature changelog

**Extract**:
- Requirements (MUST/SHOULD/MAY)
- Technical design decisions
- Acceptance criteria
- Implementation notes

### Step 4: Load Session State

Always check:
- `asdf-docs/04-operations/session-handoff.md` → What was done last
- `asdf-docs/04-operations/implementation-active.md` → Current task state

**Extract**:
- Previous session work
- Pending items
- Known blockers
- Continuation points

## Context Summary Output

After loading, generate:

```markdown
## Context Summary

### Project
- Name: [from master-map]
- Phase: [from project-status]
- Tech Stack: [from master-map]

### Domain Context
- Module: [identified domain]
- Key Rules: [business logic summary]

### Feature Context
- Feature: [feature name]
- Status: [from spec status]
- Requirements: [count MUST/SHOULD]

### Session Context
- Last Session: [date]
- Pending: [items from handoff]
- Blockers: [any blockers]

### Ready to Proceed
- [ ] System core loaded
- [ ] Domain context loaded
- [ ] Feature spec loaded
- [ ] Session state reviewed
```

## Efficiency Guidelines

### Skip Loading When
- Context already loaded in current session
- User explicitly requests skip
- Task is documentation-only (no code)

### Partial Loading
- For simple bug fixes: system-core + relevant feature only
- For documentation updates: system-core + operations only
- For new features: full loading required

### Cache Strategy
- System-core changes rarely → load once per session
- Domain changes occasionally → reload if switching domains
- Feature/operations change frequently → always check

## Integration Points

This skill integrates with:
- `/asdf:implement` - Called automatically before implementation
- `/asdf:spec` - Called to understand project context
- `/asdf:status` - Uses loaded context for reporting

## Error Handling

If loading fails:
1. Report missing files to user
2. Suggest running `/asdf:init` if structure missing
3. Proceed with available context (with warning)
4. Document gap in session handoff
