# ASDF (Astraler Spec-Driven Framework)

> **Version**: 2.0.0
> **Last Updated**: 241223
> **Status**: Production Ready

---

## 1. Overview

ASDF is a **Spec-Driven Development** framework for AI-native software development. Specifications are the single source of truth—code follows specs, and specs auto-update via Reverse Sync when implementation deviates.

### Core Philosophy

```
Specs → Code → Reverse Sync → Specs
```

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Context Control** | Hierarchical docs prevent AI context drift |
| **Knowledge Preservation** | Reverse Sync keeps docs accurate |
| **Session Continuity** | Handoff notes enable seamless AI sessions |
| **Quality Enforcement** | Validation hooks ensure spec compliance |

---

## 2. Roles

### Product Architect (Human)

- Designs specifications
- Approves implementation plans
- Reviews Reverse Sync updates
- Resolves blockers

### Coder AI

- Reads specs before implementing
- Executes code following specs
- Triggers Reverse Sync on deviations
- Documents session state for handoff

---

## 3. Documentation Hierarchy

Four-tier structure with priority-based loading:

```
astraler-docs/
├── 01-system-core/          # Tier 1: Global rules, project DNA
│   ├── 01-architecture/     # System design
│   │   ├── master-map.md
│   │   ├── tech-stack.md
│   │   ├── data-architecture.md
│   │   └── infrastructure.md
│   ├── 02-standards/        # Development conventions
│   │   ├── coding-standards.md
│   │   ├── api-standards.md
│   │   ├── testing-strategy.md
│   │   └── performance-slas.md
│   ├── 03-design/           # UI/UX specifications
│   │   ├── ui-ux-design-system.md
│   │   └── component-library.md
│   ├── 04-governance/       # Policies & decisions
│   │   ├── security-policy.md
│   │   ├── decision-log.md
│   │   └── glossary.md
│   └── project-status.md    # Live project heartbeat
│
├── 02-domains/              # Tier 2: Business logic modules
│   ├── authentication/
│   ├── payments/
│   ├── orders/
│   └── notifications/
│
├── 03-features/             # Tier 3: Actionable feature specs
│   └── YYMMDD-feature-name/
│       ├── spec.md
│       └── changelog.md
│
└── 04-operations/           # Tier 4: Execution state
    ├── implementation-active.md
    ├── session-handoff.md
    └── changelog/
```

### Context Loading Order

When starting any task, AI loads context in this sequence:

1. `01-system-core/` → Global rules, architecture
2. `02-domains/` → Relevant business logic
3. `03-features/` → Specific feature spec
4. `04-operations/session-handoff.md` → Last session state

---

## 4. Claude Code Integration

### 4.1 Directory Structure

```
.claude/
├── workflows/
│   ├── primary-workflow.md
│   ├── development-rules.md
│   ├── spec-governance.md
│   └── reverse-sync-protocol.md
├── commands/asdf/
│   ├── init.md
│   ├── spec.md
│   ├── implement.md
│   ├── sync.md
│   ├── status.md
│   └── handoff.md
├── skills/
│   ├── spec-governance/
│   ├── reverse-sync/
│   └── context-loading/
├── agents/
│   ├── spec-architect.md
│   └── implementer.md
└── hooks/
    ├── spec-validation-hook.js
    └── deviation-tracker-hook.js
```

### 4.2 Slash Commands

| Command | Purpose |
|---------|---------|
| `/asdf:init` | Initialize ASDF structure for new project |
| `/asdf:spec [feature]` | Brainstorm and create feature specification |
| `/asdf:implement [path]` | Execute implementation from specification |
| `/asdf:sync` | Trigger Reverse Sync (Code → Docs) |
| `/asdf:status` | Update project-level status heartbeat |
| `/asdf:handoff` | Create session handoff notes |

### 4.3 Skills

| Skill | Purpose |
|-------|---------|
| `spec-governance` | Validate specs, enforce standards |
| `reverse-sync` | Detect deviations, update specs |
| `context-loading` | Load hierarchical context properly |

### 4.4 Agents

| Agent | Purpose |
|-------|---------|
| `spec-architect` | Design mode - create/refine specs |
| `implementer` | Execute mode - code from specs |

---

## 5. Spec Templates

### 5.1 Domain Spec Structure

```markdown
# [Domain] Domain

> **Version**: 1.0.0
> **Status**: Active | Planned | Deprecated

## 1. Domain Purpose
## 2. Business Rules (with IDs: XXX-001)
## 3. Entities (TypeScript interfaces)
## 4. State Machine (if applicable)
## 5. Integration Points (inbound/outbound)
## 6. API Contracts
## 7. Error Codes
## 8. Dependencies

**Related Features:** [links]
```

### 5.2 Feature Spec Structure

```markdown
# [Feature Name]

> **Feature ID**: YYMMDD-feature-name
> **Status**: Planned | In Progress (%) | Implemented

## 1. Overview + Business Value
## 2. Requirements
   - 2.1 Functional (MUST) - FR-001, FR-002...
   - 2.2 Non-Functional (SHOULD) - NFR-001...
   - 2.3 Out of Scope
## 3. Technical Design
   - Architecture diagram
   - Key files
## 4. UI/UX (wireframes)
## 5. API Contract
## 6. Acceptance Criteria (AC-001...)
## 7. Testing
## 8. Blockers (if any)
## 9. Implementation Progress
## 10. Changelog

**Domain:** [link]
```

---

## 6. Reverse Sync Protocol

### When to Trigger

- Implementation deviates from spec
- Better approach discovered during coding
- Requirements change during implementation
- Bug fix reveals spec inaccuracy

### Process

1. **Detect** - Identify deviation between code and spec
2. **Annotate** - Mark changed section with `[Reverse Synced: YYMMDD]`
3. **Document** - Explain what changed and why
4. **Update Changelog** - Add entry to feature changelog
5. **Verify** - Ensure spec reflects actual implementation

### Annotation Format

```markdown
<!-- Original: [what spec said] -->
[Actual implementation description]
[Reverse Synced: YYMMDD]
```

---

## 7. Session Handoff Protocol

### Before Ending Session

1. Update `implementation-active.md` with current state
2. Create/update `session-handoff.md` with:
   - What was completed
   - What's in progress
   - Blockers and their status
   - Pending actions for next session
   - Quick start commands
3. Verify all changes committed
4. Update feature changelogs if needed

### Starting New Session

1. Read `session-handoff.md` for last state
2. Check `implementation-active.md` for blockers
3. Load relevant context (system → domain → feature)
4. Continue from documented state

---

## 8. Quality Gates

### Before Implementation

- [ ] Spec exists and is approved
- [ ] Context loaded (system → domain → feature)
- [ ] Dependencies identified
- [ ] Acceptance criteria defined

### After Implementation

- [ ] Code matches spec intent
- [ ] Reverse Sync completed if deviations exist
- [ ] Tests pass
- [ ] `implementation-active.md` updated
- [ ] `session-handoff.md` updated (if ending session)

---

## 9. Workflow Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    ASDF WORKFLOW                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. INTENT        Product Architect issues command          │
│       ↓           (e.g., /asdf:spec checkout)               │
│                                                             │
│  2. ALIGNMENT     AI clarifies via questions                │
│       ↓           Loads context hierarchy                   │
│                                                             │
│  3. DOC FIRST     AI creates/reads Spec before coding       │
│       ↓           Uses spec-governance skill                │
│                                                             │
│  4. EXECUTE       AI implements from spec                   │
│       ↓           Uses implementer agent                    │
│                                                             │
│  5. REVERSE SYNC  AI updates Docs if code deviates          │
│       ↓           Uses reverse-sync skill                   │
│                                                             │
│  6. HANDOFF       AI logs session state                     │
│                   Updates implementation-active.md          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Quick Start

### For New Projects

```bash
# 1. Copy framework to your project
cp -r asdf-framework/.claude your-project/
cp asdf-framework/CLAUDE.md your-project/

# 2. Initialize documentation structure
# (In Claude Code)
/asdf:init

# 3. Create first feature spec
/asdf:spec user-authentication

# 4. Implement from spec
/asdf:implement astraler-docs/03-features/YYMMDD-user-authentication/
```

### For Existing Sessions

```bash
# 1. Check last session state
cat astraler-docs/04-operations/session-handoff.md

# 2. Check active work and blockers
cat astraler-docs/04-operations/implementation-active.md

# 3. Continue implementation
/asdf:implement [spec-path]

# 4. End session properly
/asdf:handoff
```

---

## 11. Reference Implementation

A complete sample project demonstrating ASDF patterns is available at:

```
astraler-docs/
├── 01-system-core/    # 13 files - architecture, standards, design, governance
├── 02-domains/        # 4 domains - auth, payments, orders, notifications
├── 03-features/       # 3 features - showing full lifecycle
└── 04-operations/     # Session continuity examples
```

---

**Cross-References:**
- Claude Code Config: `.claude/`
- Sample Specs: `astraler-docs/`
- Entry Point: `CLAUDE.md`
