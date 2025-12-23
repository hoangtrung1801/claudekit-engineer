---
description: Create session handoff notes for continuity
argument-hint: [none]
---

## Mission

Document current session state to ensure seamless continuation in next session.

## Pre-Execution

1. Review current session activity
2. Check `asdf-docs/04-operations/implementation-active.md`
3. Note any uncommitted work or pending decisions

## Execution Steps

### Step 1: Summarize Session Activity

Gather:
- What tasks were worked on
- What was completed
- What remains in progress
- Any blockers encountered
- Decisions made

### Step 2: Document Pending Items

Identify:
- Incomplete implementations
- Unresolved questions
- Waiting for external input
- Known issues needing attention

### Step 3: Capture Context

Record information critical for next session:
- Current code state
- Active branches (if using git)
- Environment considerations
- Files that were being edited

### Step 4: Update Handoff File

Update `asdf-docs/04-operations/session-handoff.md`:

```markdown
# Session Handoff

## Session Info
- Date: [YYMMDD]
- Duration: [Approximate time spent]
- Focus: [Main area of work]

## Completed This Session
- [x] [Task 1 with brief details]
- [x] [Task 2 with brief details]
- [x] [Task 3 with brief details]

## In Progress (Partial Completion)
- [ ] [Task with current state]
  - Completed: [What's done]
  - Remaining: [What's left]
  - Notes: [Any context]

## Pending Next Session
- [ ] [Priority 1 task]
- [ ] [Priority 2 task]
- [ ] [Priority 3 task]

## Blockers
| Blocker | Impact | Waiting On |
|---------|--------|------------|
| [Issue] | [What it blocks] | [Resolution needed] |

## Decisions Made
- [Decision 1]: [Rationale]
- [Decision 2]: [Rationale]

## Questions for Product Architect
- [Question 1]?
- [Question 2]?

## Technical Notes
[Any technical context needed to continue:
- Active branch: [branch name]
- Files being edited: [file list]
- Environment state: [notes]
- API keys/configs: [reminders without exposing secrets]
]

## Quick Start for Next Session
1. [First thing to do]
2. [Second thing to do]
3. [Third thing to do]

---
Handoff Created: [YYMMDD]
Previous Handoff: [YYMMDD or N/A]
```

### Step 5: Archive Previous Handoff

If previous handoff exists:
1. Copy to `asdf-docs/04-operations/changelog/YYMMDD-session-handoff.md`
2. Replace with new handoff content

### Step 6: Update Implementation Active

Ensure `implementation-active.md` reflects current state:
- Move completed items to "Recently Completed"
- Update "In Progress" with accurate status
- Add new blockers if any

### Step 7: Report Summary

Output to user:

```
SESSION HANDOFF COMPLETE - [YYMMDD]

Session Summary:
- Completed: [N] tasks
- In Progress: [N] tasks
- Blockers: [N]

Key Accomplishments:
- [Highlight 1]
- [Highlight 2]

Critical for Next Session:
- [Most important item]
- [Second most important]

Questions Pending:
- [Questions needing architect input]

Handoff saved: asdf-docs/04-operations/session-handoff.md

Ready to end session. Next session can run:
  /asdf:status - to review project state
  /asdf:implement [path] - to continue implementation
```

## Automatic Triggers

This command should be suggested:
- At natural stopping points
- Before context window limits
- When switching focus to different feature
- When user indicates ending session

## Post-Execution

Remind user:
- Commit any code changes if applicable
- Review handoff for accuracy
- Add any missing context before closing
