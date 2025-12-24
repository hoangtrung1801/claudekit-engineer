# ASDF (Astraler Spec-Driven Framework)

> **Version**: 4.0.0
> **Last Updated**: 241224
> **Status**: Production Ready

### v4.0 Features (New)
- **Help System** — `/asdf` shows grouped command reference, all commands have `--help`
- **Component Update** — `/asdf:update [component]` with impact analysis
- **Progress Reports** — `/asdf:report [feature|all]` for feature/project health
- **Spec Audit** — `/asdf:audit` detects outdated/missing/orphaned specs
- **Cleanup Command** — `/asdf:cleanup` archives unused specs
- **Onboarding** — `/asdf:onboard` 5-minute guided tour for new devs
- **Incomplete Detection** — `/asdf:init` scans and resumes partial setups
- **Enhanced Handoff** — Mental context, decisions, environment state
- **Spec Locking** — Lock specs during editing (multi-instance)
- **Test Matrix** — Classify tests by type (Unit/Integration/API/E2E)

### v3.0 Features (Inherited)
- **Testing Strategy** — AI generates test cases from spec ACs (`/asdf:test`)
- **PR Protocol** — Structured code review with `/asdf:pr` and `/asdf:review`
- **Dependency Check** — Block implementation if prerequisites not met
- **Impact Analysis** — Detect breaking changes before implementation
- **Roadmap Management** — Phase-based feature planning (`/asdf:roadmap`)
- **Multi-Instance Support** — Lock mechanism for parallel Claude instances

### v2.x Features (Inherited)
- **Iterative Refinement Loop** — Feedback → Reference → Confirm cycle
- **Duplicate Detection** — Checks existing specs before creation
- **Reference Collection** — Progressive document gathering
- **Mermaid Diagrams** — Required for all architecture/domain/feature specs
- **13 System-Core Templates** — Complete template library
- **Version Management** — Semantic versioning (X.Y.Z) in all specs

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
    ├── roadmap.md           # Phase-based planning
    ├── tech-debt.md         # v4: Tech debt register
    ├── active/              # Per-feature execution files
    ├── completed/           # Archived completed features
    ├── locks/               # Multi-instance lock files
    ├── spec-locks/          # v4: Spec editing locks
    ├── archived/            # v4: Archived specs from cleanup
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
├── settings.json
├── commands/asdf/
│   ├── asdf.md              # v4: Main help, command reference
│   ├── init.md              # Initialize ASDF structure
│   ├── spec.md              # Create feature specifications
│   ├── code.md              # Execute implementation from spec
│   ├── test.md              # Generate tests from spec
│   ├── sync.md              # Trigger Reverse Sync
│   ├── update.md            # v4: Update component with impact analysis
│   ├── report.md            # v4: Progress reports
│   ├── audit.md             # v4: Spec health audit
│   ├── cleanup.md           # v4: Remove unused specs
│   ├── onboard.md           # v4: Guided tour for new devs
│   ├── pr.md                # Create PR package
│   ├── review.md            # AI code review
│   ├── roadmap.md           # Manage project phases
│   ├── status.md            # Update project status
│   └── handoff.md           # Create session handoff notes
├── skills/
│   ├── spec-governance/     # Validate specs, templates
│   ├── reverse-sync/        # Code-spec reconciliation
│   ├── context-loading/     # Hierarchical context loading
│   ├── refinement-loop/     # Feedback/reference/confirm cycle
│   ├── impact-analysis/     # Dependency & breaking changes
│   ├── testing/             # Test generation, test matrix
│   ├── pr-review/           # PR & review protocols
│   └── maintenance/         # v4: Audit, cleanup, tech debt
└── agents/
    └── asdf-coder.md        # Single agent with multiple modes
```

### 4.2 Slash Commands

**Help & Discovery:**
| Command | Purpose | Mode |
|---------|---------|------|
| `/asdf` | Show all commands grouped by category | HELP |
| `/asdf:[cmd] --help` | Show help for specific command | HELP |

**Core Workflow:**
| Command | Purpose | Mode |
|---------|---------|------|
| `/asdf:init` | Initialize ASDF structure (with incomplete detection) | DESIGN |
| `/asdf:spec [feature]` | Create feature specification (with spec locking) | DESIGN |
| `/asdf:code [path]` | Execute implementation from specification | EXECUTE |
| `/asdf:test [feature]` | Generate test cases with test matrix | TEST |
| `/asdf:sync` | Trigger Reverse Sync (Code → Docs) | SYNC |

**Updates & Maintenance:**
| Command | Purpose | Mode |
|---------|---------|------|
| `/asdf:update [component]` | Update component with impact analysis | UPDATE |
| `/asdf:audit` | Scan for outdated/missing/orphaned specs | AUDIT |
| `/asdf:cleanup` | Archive/remove unused specs | CLEANUP |

**Reporting:**
| Command | Purpose | Mode |
|---------|---------|------|
| `/asdf:report [feature\|all]` | Generate progress/health reports | REPORT |
| `/asdf:status` | Update project-level status heartbeat | OPS |

**Collaboration:**
| Command | Purpose | Mode |
|---------|---------|------|
| `/asdf:onboard` | 5-minute guided tour for new devs | ONBOARD |
| `/asdf:handoff` | Create enhanced session handoff notes | OPS |
| `/asdf:roadmap` | Manage project phases and priorities | OPS |

**Code Review:**
| Command | Purpose | Mode |
|---------|---------|------|
| `/asdf:pr [feature]` | Create PR package for code review | PR |
| `/asdf:review [path]` | AI code review from fresh context | REVIEW |

### 4.3 Skills

| Skill | Purpose | Version |
|-------|---------|---------|
| `spec-governance` | Validate specs, enforce standards, templates | v2.0 |
| `reverse-sync` | Detect deviations, update specs | v2.0 |
| `context-loading` | Load hierarchical context properly | v2.0 |
| `refinement-loop` | Collect references, iterate feedback/refine/confirm | v2.1 |
| `impact-analysis` | Dependency check + breaking change detection | v3.0 |
| `testing` | Test matrix, test generation (Unit/Integration/API/E2E) | v4.0 |
| `pr-review` | PR package creation + AI code review | v3.0 |
| `maintenance` | Audit, cleanup, tech debt tracking patterns | v4.0 |

### 4.4 Agent

| Agent | Mode | Purpose |
|-------|------|---------|
| `asdf-coder` | DESIGN | Create/refine specs (brainstorm, structure) |
| `asdf-coder` | EXECUTE | Implement code from specs (with lock, dependency, impact checks) |
| `asdf-coder` | SYNC | Validate code-spec alignment, reverse sync |
| `asdf-coder` | TEST | Generate test suites with test matrix |
| `asdf-coder` | UPDATE | Update components with impact analysis |
| `asdf-coder` | REPORT | Generate feature/project health reports |
| `asdf-coder` | AUDIT | Scan for spec health issues |
| `asdf-coder` | CLEANUP | Archive/remove unused specs |
| `asdf-coder` | ONBOARD | Guided tour for new developers |
| `asdf-coder` | HELP | Show command reference and help |
| `asdf-coder` | PR | Create PR packages for review |
| `asdf-coder` | REVIEW | AI code review from fresh context |
| `asdf-coder` | OPS | Roadmap, status, handoff management |

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
│       ↓           Uses asdf-coder (EXECUTE mode)            │
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

## 10. Case Studies

### Case Study 1: New Project Initialization

**Scenario:** Starting a new e-commerce project called "ShopFlow"

```
Architect: /asdf:init

AI: I'll initialize ASDF structure for your project.
    What reference documents do you have?

    A) Existing codebase to analyze
    B) Design documents (Figma, PRD, etc.)
    C) Requirements documents (BRD, SAD, TDD)
    D) Start from scratch

Architect: C - I have BRD and database schema docs

AI: [Collects references from provided documents]
    [Creates astraler-docs/ structure]

    Generated:
    ├── 01-system-core/
    │   ├── 01-architecture/master-map.md      ← From BRD
    │   ├── 01-architecture/data-architecture.md ← From DB schema
    │   └── 02-standards/code-standards.md
    ├── 02-domains/
    │   ├── auth/domain.md
    │   ├── products/domain.md
    │   ├── cart/domain.md
    │   └── orders/domain.md
    └── 04-operations/
        └── session-handoff.md

    Ready for refinement. Any feedback?

Architect: Add payment domain, we're using Stripe

AI: [Updates structure, adds payments/domain.md with Stripe integration]
    Confirmed. 19 files created.
```

---

### Case Study 2: Feature Development Lifecycle

**Scenario:** Adding "Guest Checkout" feature to ShopFlow

```
Architect: /asdf:spec guest-checkout

AI: [Loads context: system-core → cart domain → orders domain]

    Brainstorming guest-checkout feature...

    Questions:
    1. Should guests convert to registered users post-purchase?
    2. Email required for order confirmation?
    3. Save address for future use (with consent)?

Architect: Yes to all three

AI: [Creates 03-features/251224-guest-checkout.md]

    Feature Spec Draft:
    - FR-001: Allow checkout without account
    - FR-002: Collect email for confirmation
    - FR-003: Optional account creation post-purchase
    - FR-004: Address save with GDPR consent

    Acceptance Criteria:
    - AC-001: Guest can complete purchase in <3 clicks
    - AC-002: Order confirmation sent within 30s

    Ready for refinement?

Architect: confirm

AI: Spec finalized. Ready to implement with /asdf:code
```

```
Architect: /asdf:code 03-features/251224-guest-checkout

AI: [Reads spec, loads domain context]

    Implementation Plan:
    1. Backend: GuestCheckoutService, OrderController updates
    2. Frontend: GuestCheckoutForm component
    3. Database: guest_orders table migration

    Proceeding...

    [Creates files, implements feature]

    Implementation complete. Tests passing.
    Updated implementation-active.md
```

---

### Case Study 3: Reverse Sync (Code Deviation)

**Scenario:** During implementation, discovered spec needs correction

```
Architect: /asdf:code 03-features/251224-guest-checkout

AI: [Implementing FR-003: Post-purchase account creation]

    ⚠️ DEVIATION DETECTED

    Spec says: "Create account automatically after purchase"
    Reality: GDPR requires explicit opt-in, cannot auto-create

    Triggering Reverse Sync...

    Updated spec (251224-guest-checkout.md):

    - FR-003: ~~Auto-create account post-purchase~~
    + FR-003: Show account creation prompt post-purchase
            User must explicitly opt-in (GDPR compliance)
    [Reverse Synced: 251224]

    Changelog updated:
    - 251224: FR-003 modified for GDPR compliance

    Continue implementation with corrected approach?

Architect: yes

AI: [Implements opt-in flow instead of auto-creation]
    Done. Spec and code now aligned.
```

---

### Case Study 4: Session Continuity (Handoff)

**Scenario:** Ending work session, another AI will continue tomorrow

```
Architect: /asdf:handoff

AI: Creating session handoff notes...

    SESSION HANDOFF - 251224
    ─────────────────────────

    ✅ COMPLETED:
    - Guest checkout backend (100%)
    - Database migrations applied
    - Unit tests passing (12/12)

    🔄 IN PROGRESS:
    - Frontend GuestCheckoutForm (60%)
    - Pending: validation, error states

    ❌ BLOCKED:
    - Email service config missing (needs SMTP credentials)

    📋 NEXT SESSION:
    1. Get SMTP credentials from DevOps
    2. Complete GuestCheckoutForm
    3. Integration tests
    4. /asdf:sync to verify alignment

    Quick Resume:
    cat astraler-docs/04-operations/session-handoff.md
    /asdf:code 03-features/251224-guest-checkout

    Saved to session-handoff.md
```

**Next day, new session:**

```
Architect: Continue where we left off

AI: [Reads session-handoff.md]

    Resuming from 251224 session:
    - Guest checkout frontend at 60%
    - Blocker: SMTP credentials

    Do you have the SMTP credentials now?

Architect: Yes, here they are...

AI: [Continues implementation seamlessly]
```

---

### Case Study 5: Test Generation (v3)

**Scenario:** Generating comprehensive tests from spec acceptance criteria

```
Architect: /asdf:test guest-checkout

AI: [Loads spec: 03-features/251224-guest-checkout/spec.md]
    [Analyzes acceptance criteria]

    **Test Plan for guest-checkout**

    Spec Version: v1.2.0

    ### Unit Tests

    | Test ID | AC | Description | Priority |
    |---------|-----|-------------|----------|
    | UT-001 | AC-001 | Guest can checkout without account | P0 |
    | UT-002 | AC-001 | Validates email format | P0 |
    | UT-003 | AC-002 | Order confirmation email sent | P0 |

    ### Integration Tests

    | Test ID | AC | Description | Priority |
    |---------|-----|-------------|----------|
    | IT-001 | AC-001 | POST /checkout/guest returns 201 | P0 |
    | IT-002 | AC-003 | Account creation prompt shown | P1 |

    ### Edge Cases

    | Case | Description | How to Handle |
    |------|-------------|---------------|
    | EC-001 | Cart empty | Return 400 with message |
    | EC-002 | Payment timeout | Retry 3x, then fail gracefully |

    Proceed with test generation? (yes/feedback)

Architect: yes

AI: [Creates test files]

    **Tests Generated:**
    - __tests__/guest-checkout/checkout.test.ts (6 tests)
    - __tests__/guest-checkout/checkout.integration.test.ts (4 tests)
    - __tests__/guest-checkout/fixtures.ts

    **Spec Updated:**
    - Testing section populated with test mapping

    Run: npm test -- --grep "guest-checkout"
```

---

### Case Study 6: Dependency Check & Impact Analysis (v3)

**Scenario:** Starting implementation with unmet dependencies

```
Architect: /asdf:code 03-features/251225-order-history

AI: [Acquires lock for order-history]
    [Reads spec, checks dependencies]

    **BLOCKED: Dependencies not satisfied**

    Feature: order-history

    | Dependency | Type | Status | Blocker? |
    |------------|------|--------|----------|
    | orders domain | Domain | Implemented | No |
    | 251224-guest-checkout | Feature | 60% | YES |

    This feature requires guest-checkout to be complete.

    Options:
    - [wait] Abort until dependencies ready
    - [stub] Create interface stubs
    - [override] Proceed anyway (RISK)

    What would you like to do?

Architect: wait

AI: [Releases lock]

    Lock released. Feature available for later.

    Recommendation:
    1. Complete guest-checkout first: /asdf:code 03-features/251224-guest-checkout
    2. Then return: /asdf:code 03-features/251225-order-history
```

**Later, with breaking changes detected:**

```
Architect: /asdf:code 03-features/251226-oauth-login

AI: [Acquires lock, passes dependency check]
    [Running impact analysis...]

    **Impact Analysis**

    Feature: oauth-login

    **Breaking Changes Detected:**

    | Affected | Type | Change | Severity |
    |----------|------|--------|----------|
    | 251224-guest-checkout | API | /auth/login signature | HIGH |
    | user-profile | Schema | User.authProvider field | MEDIUM |

    Total: 1 HIGH, 1 MEDIUM

    Options:
    - [review] Show detailed impact
    - [proceed] Continue (update specs later)
    - [abort] Cancel

Architect: review

AI: ### HIGH: guest-checkout

    Current: POST /auth/login accepts {email, password}
    After: POST /auth/login accepts {email, password, provider?}

    Impact: Existing login calls will still work (provider optional)
    Mitigation: None needed, backwards compatible

    Proceed? (yes/abort)

Architect: yes

AI: [Continues implementation with impact logged]
    Reminder: Run /asdf:sync for affected features after.
```

---

### Case Study 7: PR Protocol & AI Review (v3)

**Scenario:** Creating PR package and getting AI review

```
Architect: /asdf:pr guest-checkout

AI: [Gathering changes for guest-checkout...]

    **PR Package Created**

    Location: .pr-review/241224-guest-checkout/

    | File | Purpose |
    |------|---------|
    | summary.md | PR description |
    | changes.md | 12 files changed |
    | spec-diff.md | 1 deviation |
    | checklist.md | Review checklist |

    AC Coverage: 5/5 implemented

    Next: /asdf:review .pr-review/241224-guest-checkout/
```

**Getting AI review (ideally in fresh instance):**

```
Architect: /asdf:review .pr-review/241224-guest-checkout/

AI: [Loading PR package with FRESH context...]
    [Reading spec from scratch...]
    [Applying review checklist...]

    # AI Review: Guest Checkout

    **Verdict: REQUEST_CHANGES**

    ## Spec Compliance: 4/5 ACs Passing

    | AC | Status | Notes |
    |----|--------|-------|
    | AC-001 | PASS | |
    | AC-002 | PASS | |
    | AC-003 | FAIL | Missing GDPR consent checkbox |
    | AC-004 | PASS | |
    | AC-005 | PASS | |

    ## Issues Found

    ### Critical (1)
    | File | Line | Issue |
    |------|------|-------|
    | GuestCheckoutForm.tsx | 45 | Missing GDPR consent before address save |

    ### Major (1)
    | File | Line | Issue |
    |------|------|-------|
    | checkout.service.ts | 78 | No retry for payment API timeout |

    ## Required Actions
    1. Add GDPR consent checkbox (AC-003)
    2. Add payment retry logic

    After fixes: /asdf:review .pr-review/241224-guest-checkout/
```

---

### Case Study 8: Multi-Instance & Roadmap (v3)

**Scenario:** Two Claude instances working in parallel

**Instance 1:**
```
Architect: /asdf:code guest-checkout

AI: [Checking locks...]
    [No lock exists, acquiring...]

    Lock acquired for guest-checkout.
    Created: 04-operations/active/guest-checkout.md

    Proceeding with implementation...
```

**Instance 2 (simultaneous):**
```
Architect: /asdf:code guest-checkout

AI: **FEATURE LOCKED**

    Feature: guest-checkout
    Locked by: Instance-1
    Since: 5 minutes ago
    Task: "Implementing FR-001 to FR-003"

    Options:
    - [wait] Check again later
    - [force] Override (DANGER)
    - [other] Work on different feature

Architect: other

AI: Available features without locks:
    - order-management
    - push-notifications

    Which would you like to work on?
```

**Managing project roadmap:**
```
Architect: /asdf:roadmap

AI: **Project Roadmap v1.0**

    Current Phase: Phase 1 - MVP Auth (60%)

    | Phase | Status | Progress |
    |-------|--------|----------|
    | Phase 1: MVP Auth | Active | 60% |
    | Phase 2: Payments | Planned | 0% |
    | Phase 3: Scale | Planned | 0% |

    Phase 1 Features:
    | Priority | Feature | Status |
    |----------|---------|--------|
    | P0 | user-auth | Done |
    | P0 | guest-checkout | 60% |
    | P0 | push-notifications | Blocked |

    Commands:
    - /asdf:roadmap add [feature] [phase] [priority]
    - /asdf:roadmap reorder [feature] [target]
    - /asdf:roadmap phase close
```

---

## 11. Quick Start

### For New Projects

```bash
# 1. Copy framework to your project
cp -r asdf-framework/.claude your-project/
cp asdf-framework/CLAUDE.md your-project/

# 2. Initialize documentation structure
/asdf:init

# 3. Create first feature spec
/asdf:spec user-authentication

# 4. Implement from spec
/asdf:code astraler-docs/03-features/YYMMDD-user-authentication/
```

### For New Team Members

```bash
# Quick 5-minute orientation
/asdf:onboard
```

### For Existing Sessions

```bash
# 1. Check last session state
cat astraler-docs/04-operations/session-handoff.md

# 2. Check active work and blockers
cat astraler-docs/04-operations/implementation-active.md

# 3. Continue implementation
/asdf:code [spec-path]

# 4. End session properly
/asdf:handoff
```

### For Maintenance

```bash
# Check spec health
/asdf:audit

# View project health report
/asdf:report all

# Cleanup unused specs
/asdf:cleanup

# Get help on any command
/asdf
/asdf:spec --help
```

---

## 12. Reference Implementation

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
