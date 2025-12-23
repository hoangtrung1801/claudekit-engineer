# Reverse Sync Protocol

The mechanism ensuring documentation never becomes stale.

## Core Principle

> **Code is truth. Specs must reflect code, not aspirations.**

When implementation deviates from specification, the spec MUST be updated to match the actual implementation.

## Trigger Conditions

Reverse Sync is triggered when:
1. Implementation differs from spec (intentional improvement)
2. Bug fix changes expected behavior
3. Performance optimization changes approach
4. External constraint forces different solution
5. Discovery during implementation invalidates spec assumption

## Reverse Sync Process

### Step 1: Detect Deviation
During implementation, track:
- What spec said vs what was implemented
- Reason for deviation
- Impact on other components

### Step 2: Document Changes
Create changelog entry:
```markdown
## [YYMMDD] Reverse Sync: [Feature Name]

### Changed
- [What changed in implementation]

### Reason
- [Why deviation was necessary/beneficial]

### Spec Updates Required
- [ ] `features/xxx/spec.md` - [specific sections]
- [ ] `domains/xxx.md` - [if domain logic changed]
- [ ] `system-core/xxx.md` - [if global rule affected]

### Impact
- [Downstream effects, if any]
```

### Step 3: Update Specs
For each affected spec:
1. Open the spec file
2. Update relevant sections
3. Add annotation: `[Reverse Synced: YYMMDD]`
4. Preserve original text in comments if significant

Example:
```markdown
## Technical Design

<!-- Original: Used REST API for real-time updates -->
<!-- Reverse Synced 231215: Changed to WebSocket for performance -->

Uses WebSocket connection for real-time updates due to latency
requirements discovered during implementation. [Reverse Synced: 231215]
```

### Step 4: Update Status Files
- Update `implementation-active.md` with sync status
- Update `project-status.md` if feature status changed
- Log in `operations/changelog/YYMMDD-reverse-sync.md`

## Annotation Standards

Use these markers in specs:
- `[Reverse Synced: YYMMDD]` - Standard sync marker
- `[RS-Improved: YYMMDD]` - Implementation improved on spec
- `[RS-Constrained: YYMMDD]` - External constraint forced change
- `[RS-Fixed: YYMMDD]` - Bug fix changed behavior

## Prohibited Actions

- **NO** leaving code-spec mismatches undocumented
- **NO** updating spec without changelog entry
- **NO** removing original spec intent without annotation
- **NO** reverse syncing `system-core/` without architect approval

## Escalation

If reverse sync would require changing:
- Core architectural decisions
- Security-critical specifications
- Cross-domain business logic

**STOP** and request Product Architect review before proceeding.

## Automation

When `/asdf:sync` is invoked:
1. Scan codebase for recent changes
2. Compare against specs
3. Generate diff report
4. Propose spec updates
5. Apply updates with proper annotations
6. Generate changelog entry
