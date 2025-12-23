# Spec Governance Protocol

Rules for creating, maintaining, and enforcing specifications.

## Spec Hierarchy

```
Tier 1: system-core/    → Global rules, immutable without architect approval
Tier 2: domains/        → Module business logic, semi-stable
Tier 3: features/       → Actionable specs, frequently updated
Tier 4: operations/     → Execution state, session-volatile
```

## Spec Creation Standards

### Required Sections

Every feature spec MUST contain:

```markdown
# [Feature Name]

## Overview
Brief description and business context

## Requirements
- Functional requirements (MUST have)
- Non-functional requirements (SHOULD have)
- Constraints and limitations

## Technical Design
Architecture decisions, data flows, integrations

## UI/UX (if applicable)
Wireframes, interaction patterns, states

## Implementation Notes
Specific technical guidance, edge cases

## Acceptance Criteria
Testable conditions for completion

## Status
- [ ] Spec approved
- [ ] Implementation started
- [ ] Testing complete
- [ ] Reverse synced
```

### Naming Convention

```
features/
└── YYMMDD-feature-name/
    ├── spec.md           # Main specification
    ├── design.md         # Detailed design (optional)
    ├── api-contract.md   # API definitions (if applicable)
    └── changelog.md      # Spec change history
```

## Spec Modification Rules

### Architect-Only Changes
- `system-core/` files
- `domains/` structural changes
- Breaking changes to existing specs

### AI-Initiated Changes (Reverse Sync)
- Implementation details in `features/`
- Bug fixes and clarifications
- Performance optimizations
- **MUST** annotate with `[Reverse Synced: YYMMDD by Coder AI]`

## Validation Gates

Before spec is considered complete:
- [ ] All required sections present
- [ ] Acceptance criteria are testable
- [ ] Dependencies documented
- [ ] No conflicting requirements
- [ ] Reviewed by Product Architect (for new specs)

## Conflict Resolution

When code and spec conflict:
1. Stop implementation
2. Document the conflict
3. Determine which is correct (code or spec)
4. Update the incorrect artifact
5. Log in changelog
6. Continue implementation

## Spec Lifecycle

```
Draft → Review → Approved → In Progress → Implemented → Reverse Synced → Final
```

Each transition must be logged in `operations/changelog/`.
