# Context Loading Checklist

## Quick Reference

Use this checklist to verify proper context loading.

## Pre-Implementation Checklist

### System Core (Required)
- [ ] Read `master-map.md`
  - [ ] Noted project name and description
  - [ ] Identified core technologies
  - [ ] Understood module structure

- [ ] Read `ui-ux-design-system.md`
  - [ ] Noted color palette
  - [ ] Understood component patterns
  - [ ] Identified interaction standards

- [ ] Read `project-status.md`
  - [ ] Noted completion percentage
  - [ ] Identified current phase
  - [ ] Checked for blockers

### Domain Context (If Applicable)
- [ ] Identified relevant domain from task
- [ ] Read `domains/[domain].md`
  - [ ] Understood business rules
  - [ ] Noted entity relationships
  - [ ] Identified integration points

### Feature Context (For Implementation)
- [ ] Located feature spec
- [ ] Read `features/[feature]/spec.md`
  - [ ] Listed MUST requirements
  - [ ] Listed SHOULD requirements
  - [ ] Understood technical design
  - [ ] Noted acceptance criteria

- [ ] Checked feature changelog
  - [ ] Noted any reverse syncs
  - [ ] Understood evolution

### Session Context (Always)
- [ ] Read `session-handoff.md`
  - [ ] Noted last session date
  - [ ] Listed completed items
  - [ ] Listed pending items
  - [ ] Identified blockers

- [ ] Read `implementation-active.md`
  - [ ] Checked current task
  - [ ] Noted in-progress items
  - [ ] Reviewed recently completed

## Context Verification

After loading, verify:

| Check | Status |
|-------|--------|
| Can describe project in one sentence | [ ] |
| Know which technologies to use | [ ] |
| Understand feature requirements | [ ] |
| Know where last session stopped | [ ] |
| Aware of any blockers | [ ] |

## Common Loading Mistakes

1. **Skipping system-core** → Architectural misalignment
2. **Missing domain context** → Business rule violations
3. **Ignoring session-handoff** → Duplicated work
4. **Not checking status** → Working on blocked feature

## Recovery Actions

If context is incomplete:
1. `/asdf:init` - If structure missing
2. `/asdf:status` - To understand current state
3. Ask user for clarification - If docs insufficient
