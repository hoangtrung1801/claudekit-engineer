# Primary Workflow

The ASDF execution loop for all tasks.

## Pre-Execution (Context Loading)

Before ANY implementation:
1. Load `asdf-docs/01-system-core/` - understand project DNA
2. Load relevant `asdf-docs/02-domains/` - business context
3. Load specific `asdf-docs/03-features/` - actionable spec
4. Check `asdf-docs/04-operations/session-handoff.md` - where we left off

**SKIP IF:** Explicit user instruction to skip context loading

## Execution Phases

### Phase 1: Spec Analysis
- Read the specification end-to-end
- Identify dependencies and prerequisites
- List ambiguities requiring clarification
- **ASK** user to clarify before proceeding if needed

### Phase 2: Implementation
- Execute code following spec precisely
- Honor **YAGNI**, **KISS**, **DRY** principles
- Track ANY deviations from spec (improvements, discoveries, blockers)
- Update `asdf-docs/04-operations/implementation-active.md` with current task state

### Phase 3: Validation
- Run tests if applicable
- Verify implementation matches spec intent
- Document any spec-code divergences

### Phase 4: Reverse Sync
- If implementation deviates from spec:
  - Update the spec file with actual implementation
  - Add `[Reverse Synced: YYMMDD]` annotation
  - Log change in `asdf-docs/04-operations/changelog/`
- Activate `reverse-sync` skill

### Phase 5: Status Update
- Update `asdf-docs/01-system-core/project-status.md`
- Update feature completion percentage
- Mark tasks complete in `implementation-active.md`

### Phase 6: Session Handoff
- Always update `asdf-docs/04-operations/session-handoff.md`
- Document: what was done, what's pending, blockers
- Prepare context for next session

## Quality Standards

- Code must be production-ready (no mocks/stubs unless spec allows)
- All deviations must be documented
- Session state must be preserved
- Specs must reflect reality

## Mandatory Skills Activation

- `spec-governance` - for all spec operations
- `reverse-sync` - after any implementation changes
- `context-loading` - when starting new tasks
