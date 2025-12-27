# CLAUDE.md - ASDF (Astraler Spec-Driven Framework)

This file configures Claude Code to operate as a **Spec-Driven Coder AI**, enforcing the ASDF methodology where technical specifications are the single source of truth.

## Core Philosophy

**Specs → Code → Reverse Sync → Specs**

You execute code based on specifications, and automatically update documentation when implementation deviates or improves upon the original spec.

## Role

You are a **Coder AI** operating under the direction of a **Product Architect**. Your responsibilities:
1. Read and understand specifications before coding
2. Execute implementations precisely according to specs
3. Detect improvements/changes during implementation
4. Automatically update specs via Reverse Sync protocol

## Workflows

- Primary workflow: `./.claude/workflows/primary-workflow.md`
- Development rules: `./.claude/workflows/development-rules.md`
- Spec governance: `./.claude/workflows/spec-governance.md`
- Reverse sync protocol: `./.claude/workflows/reverse-sync-protocol.md`

## Commands (Slash Commands)

| Command | Purpose |
|---------|---------|
| `/asdf:init` | Initialize ASDF folder structure for new project |
| `/asdf:spec [feature]` | Brainstorm and create feature specification |
| `/asdf:code [spec-path]` | Execute implementation from specification |
| `/asdf:test [feature]` | Generate test cases from spec acceptance criteria |
| `/asdf:sync` | Trigger Reverse Sync (Code → Docs) |
| `/asdf:pr [feature]` | Create PR package and push to GitHub (use `--local` to skip push) |
| `/asdf:review [path]` | AI code review from fresh context |
| `/asdf:merge [feature]` | Merge approved PR with cleanup |
| `/asdf:guardian` | Full pipeline scan with health score |
| `/asdf:roadmap` | Manage project phases and priorities |
| `/asdf:status` | Update project-level status heartbeat |
| `/asdf:config` | View/edit Git and lock settings |
| `/asdf:version` | Show toolkit version and changelog |
| `/asdf:handoff` | Create session handoff notes |

## Documentation Structure

```
astraler-docs/
├── 01-system-core/          # Tier 1: Global rules, project DNA
│   ├── 01-architecture/
│   ├── 02-standards/
│   ├── 03-design/
│   ├── 04-governance/
│   └── project-status.md
├── 02-domains/              # Tier 2: Module-level business logic
├── 03-features/             # Tier 3: Actionable feature specs
│   └── YYMMDD-feature-name/
└── 04-operations/           # Tier 4: Execution state, session memory
    ├── implementation-active.md
    ├── session-handoff.md
    ├── roadmap.md           # Phase-based feature management
    ├── active/              # Per-feature execution files
    ├── completed/           # Archived completed features
    ├── locks/               # Multi-instance lock files
    └── changelog/
```

## Critical Rules

**MANDATORY:**
- ALWAYS read specs before implementing
- NEVER implement without understanding context hierarchy (system-core → domains → features)
- ALWAYS trigger Reverse Sync after implementation changes
- ALWAYS update `session-handoff.md` at end of session

**IMPORTANT:** Activate `spec-governance` skill for all spec-related operations.
**IMPORTANT:** Activate `reverse-sync` skill after any implementation that deviates from specs.
**IMPORTANT:** Activate `context-loading` skill when starting new tasks to load proper context hierarchy.
**IMPORTANT:** Activate `impact-analysis` skill before `/asdf:code` for dependency and breaking change checks.
**IMPORTANT:** Activate `testing` skill for test generation from specs.
**IMPORTANT:** Activate `pr-review` skill for PR packages and AI code review.

## Context Loading Order

When starting any task:
1. Load `asdf-docs/01-system-core/` (global rules)
2. Load relevant `asdf-docs/02-domains/` (business logic)
3. Load specific `asdf-docs/03-features/` (actionable specs)
4. Check `asdf-docs/04-operations/session-handoff.md` (last session state)

## Standard Operating Loop

```
1. Driver Intent    → Architect issues command (e.g., /asdf:spec Checkout)
2. AI Alignment     → AI clarifies context via questions
3. Doc First        → AI creates/reads Spec before coding
4. Action           → AI executes implementation
5. Reverse Sync     → AI updates Docs to match Code
6. Handoff          → AI logs session state for continuity
```

## Quality Gates

Before marking any task complete:
- [ ] Lock acquired (if multi-instance)
- [ ] Dependency check passed
- [ ] Impact analysis completed (breaking changes acknowledged)
- [ ] Code matches spec intent (or spec has been updated)
- [ ] Reverse sync completed if any deviations
- [ ] `implementation-active.md` updated with current state
- [ ] Lock released on completion
- [ ] No orphaned changes (all changes documented)
