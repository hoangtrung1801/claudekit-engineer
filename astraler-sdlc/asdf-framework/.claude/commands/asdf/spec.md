---
description: Brainstorm and create feature specification
argument-hint: [feature-name]
---

## Mission

Collaborate with Product Architect to create a comprehensive feature specification.

<feature-name>
$ARGUMENTS
</feature-name>

## Pre-Execution

1. Activate `context-loading` skill
2. Load `asdf-docs/01-system-core/` for project context
3. Load relevant `asdf-docs/02-domains/` if applicable
4. Check `asdf-docs/04-operations/session-handoff.md` for continuity

## Execution Steps

### Step 1: Context Gathering

Ask Product Architect 5 clarifying questions:

1. **Business Context**: What problem does this feature solve? Who benefits?
2. **Scope**: What are the must-have vs nice-to-have requirements?
3. **Dependencies**: What existing systems/features does this interact with?
4. **Constraints**: Any technical, timeline, or resource limitations?
5. **Success Criteria**: How do we know this feature is complete and working?

**WAIT** for answers before proceeding.

### Step 2: Create Feature Directory

```
asdf-docs/03-features/[YYMMDD]-[feature-name]/
├── spec.md
├── changelog.md
└── [additional files as needed]
```

### Step 3: Draft Specification

Create `spec.md` with this structure:

```markdown
# [Feature Name]

## Overview
[Brief description based on architect's answers]

## Business Context
[Problem being solved, stakeholders, value proposition]

## Requirements

### Functional (MUST)
- [ ] [Requirement 1]
- [ ] [Requirement 2]

### Non-Functional (SHOULD)
- [ ] [Performance requirements]
- [ ] [Security requirements]

### Out of Scope
- [Explicitly excluded items]

## Technical Design

### Architecture
[How this fits into existing system]

### Data Flow
[Input → Processing → Output]

### Dependencies
- [Existing modules/services required]
- [External APIs/integrations]

## UI/UX (if applicable)

### User Flow
[Step-by-step user interaction]

### States
- Default state
- Loading state
- Error state
- Success state

### Wireframe
[ASCII or description of layout]

## Implementation Notes
[Technical guidance, edge cases, gotchas]

## Acceptance Criteria
- [ ] [Testable criterion 1]
- [ ] [Testable criterion 2]

## Status
- [x] Spec drafted
- [ ] Spec approved by Architect
- [ ] Implementation started
- [ ] Testing complete
- [ ] Reverse synced

---
Created: [YYMMDD]
Author: Product Architect + Coder AI
```

### Step 4: Initialize Changelog

Create `changelog.md`:
```markdown
# Changelog: [Feature Name]

## [YYMMDD] - Initial Draft
- Created specification based on architect requirements
- Pending architect review

---
```

### Step 5: Update Operations

Update `asdf-docs/04-operations/implementation-active.md`:
```markdown
## Current Task
Feature Spec: [feature-name]
Status: Awaiting architect approval
Path: asdf-docs/03-features/[YYMMDD]-[feature-name]/spec.md
```

### Step 6: Report & Request Review

Present spec summary to Product Architect:
```
Specification created: [feature-name]
Location: asdf-docs/03-features/[YYMMDD]-[feature-name]/spec.md

Summary:
- [Key points from spec]

Awaiting your review. Please:
1. Review the spec for accuracy
2. Approve or request changes
3. When approved, run /asdf:implement [spec-path]
```

## Post-Execution

Activate `spec-governance` skill to validate spec completeness.
