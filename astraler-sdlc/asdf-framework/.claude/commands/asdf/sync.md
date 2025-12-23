---
description: Trigger Reverse Sync - update specs from code
argument-hint: [scope: all|feature-path]
---

## Mission

Scan codebase, detect spec-code divergences, and update specifications to reflect actual implementation.

<scope>
$ARGUMENTS
</scope>

## Pre-Execution

1. Activate `reverse-sync` skill
2. Determine scope:
   - If `all` or empty → Full project sync
   - If path provided → Sync specific feature only

## Execution Steps

### Step 1: Gather Current State

**For full sync:**
- List all features in `asdf-docs/03-features/`
- Identify corresponding code locations
- Note last sync dates from spec annotations

**For targeted sync:**
- Load specified feature spec
- Identify related code files
- Check existing sync annotations

### Step 2: Analyze Divergences

For each feature:

1. **Read spec** requirements and technical design
2. **Scan code** for implementation
3. **Compare** spec vs code:
   - Missing implementations (spec has, code doesn't)
   - Extra implementations (code has, spec doesn't)
   - Different implementations (both have, but differ)

### Step 3: Generate Diff Report

```markdown
# Reverse Sync Report - [YYMMDD]

## Summary
- Features analyzed: [N]
- Divergences found: [N]
- Specs requiring update: [N]

## Divergence Details

### Feature: [feature-name]
**Status**: Needs sync / Up to date

| Spec Says | Code Does | Action |
|-----------|-----------|--------|
| [requirement] | [implementation] | Update spec |

### Feature: [feature-name-2]
...
```

### Step 4: Update Specifications

For each divergence:

1. **Open** the spec file
2. **Update** relevant sections
3. **Annotate** with sync marker:
   ```markdown
   [Reverse Synced: YYMMDD]
   ```
4. **Preserve** original intent in comments if significant change

Example update:
```markdown
## Technical Design

### Data Storage
<!-- Original: Planned to use localStorage -->
Uses IndexedDB for offline data persistence, providing better
performance for large datasets. [Reverse Synced: 231215]
```

### Step 5: Update Changelogs

For each updated spec, append to its changelog:
```markdown
## [YYMMDD] - Reverse Sync
- Updated [section] to reflect implementation
- Reason: [Code improvement/Constraint/Bug fix]
- Changed by: Coder AI (automated sync)
```

Create/update global changelog:
`asdf-docs/04-operations/changelog/YYMMDD-reverse-sync.md`

```markdown
# Reverse Sync Log - [YYMMDD]

## Scope
[All features / Specific feature]

## Updated Specs
1. `features/YYMMDD-feature-1/spec.md`
   - [List of changes]
2. `features/YYMMDD-feature-2/spec.md`
   - [List of changes]

## Unchanged (Already in sync)
- `features/YYMMDD-feature-3/spec.md`

## Warnings
[Any concerning divergences requiring architect review]
```

### Step 6: Update Project Status

Update `asdf-docs/01-system-core/project-status.md`:
```markdown
## Recent Activity
- [YYMMDD] Reverse sync completed ([N] specs updated)
```

### Step 7: Report Results

```
Reverse Sync Complete

Scope: [All / Specific path]
Features Analyzed: [N]
Specs Updated: [N]
Specs Unchanged: [N]

Updated Files:
- asdf-docs/03-features/[path]/spec.md
- [additional files]

Changelog: asdf-docs/04-operations/changelog/YYMMDD-reverse-sync.md

Warnings:
- [Any items needing architect attention]

Recommendation:
- [Next steps, if any]
```

## Escalation Triggers

**STOP and alert Product Architect if:**
- Divergence affects `system-core/` documents
- Breaking changes detected
- Security-related changes found
- Cross-domain dependencies affected

## Post-Execution

Activate `spec-governance` skill to validate updated specs.
