---
name: reverse-sync
description: Automatically update specifications when implementation deviates from original design.
---

# Reverse Sync Skill

Ensure documentation stays aligned with actual code implementation.

## When to Use

Activate this skill when:
- Implementation differs from specification
- Bug fixes change expected behavior
- Performance optimizations alter approach
- External constraints force design changes
- Running `/asdf:sync` command

## Core Principle

> **Code is truth. Specs reflect code, not aspirations.**

Documentation must always represent the ACTUAL state of the system, not the planned state.

## Responsibilities

### 1. Deviation Detection

Identify mismatches between:
- Spec requirements ↔ Implemented features
- Spec technical design ↔ Actual architecture
- Spec UI/UX ↔ Built interfaces
- Spec acceptance criteria ↔ Test coverage

### 2. Change Classification

Categorize deviations:
- **Improvement**: Code is better than spec planned
- **Constraint**: External factor forced change
- **Fix**: Bug fix changed behavior
- **Discovery**: Implementation revealed new information

### 3. Documentation Update

For each deviation:
1. Locate affected spec section
2. Update to match implementation
3. Add sync annotation
4. Preserve original intent via comments

### 4. Changelog Management

Record all sync actions in:
- Feature-specific `changelog.md`
- Global `operations/changelog/YYMMDD-reverse-sync.md`

## Annotation Standards

Use these markers in updated specs:

```markdown
[Reverse Synced: YYMMDD]           # Standard sync
[RS-Improved: YYMMDD]              # Implementation better than planned
[RS-Constrained: YYMMDD]           # External constraint forced change
[RS-Fixed: YYMMDD]                 # Bug fix changed behavior
[RS-Discovery: YYMMDD]             # New information found during implementation
```

## Process

### Step 1: Identify Deviations

```markdown
## Deviation Analysis

### Spec Location
[Path to spec file]

### Code Location
[Path to implementation]

### Deviation
| Aspect | Spec Says | Code Does |
|--------|-----------|-----------|
| [area] | [spec] | [impl] |
```

### Step 2: Determine Action

- If code is correct → Update spec
- If spec is correct → Flag for code fix (don't auto-change spec)
- If unclear → Escalate to Product Architect

### Step 3: Update Spec

Before:
```markdown
## Technical Design
Uses REST API for data fetching.
```

After:
```markdown
## Technical Design
<!-- Original: Uses REST API for data fetching -->
Uses GraphQL for data fetching due to complex nested data requirements.
[RS-Improved: 231215]
```

### Step 4: Log Change

```markdown
## [YYMMDD] - Reverse Sync

### Changed
- Technical Design: REST → GraphQL

### Reason
GraphQL better handles nested entity queries required by UI

### Classification
Improvement

### Impact
None - internal implementation detail
```

## Escalation Triggers

**STOP and request architect review if:**
- Change affects `system-core/` documents
- Security implications detected
- Breaking API changes
- Cross-domain dependencies impacted
- Original requirement intent unclear

## Integration

Load reference files:
- `references/sync-patterns.md` - Common sync scenarios
- `references/annotation-guide.md` - Annotation usage

## Output

After sync operation:
```
Reverse Sync Complete

Specs Updated: [N]
- [spec path]: [brief change description]

Annotations Added: [N]
- [RS-Improved]: [N]
- [RS-Constrained]: [N]
- [RS-Fixed]: [N]

Changelogs Updated:
- [changelog paths]

Escalations: [N]
- [Items requiring architect review]
```
