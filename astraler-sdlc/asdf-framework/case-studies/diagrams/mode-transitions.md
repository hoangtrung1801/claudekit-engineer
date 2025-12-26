# Mode Transitions Diagram

**Purpose:** Show how ASDF operating modes connect and transition.

---

## Mode State Diagram

```mermaid
stateDiagram-v2
    [*] --> HELP: /asdf

    HELP --> DESIGN: /asdf:init, /asdf:spec
    HELP --> EXECUTE: /asdf:code
    HELP --> SYNC: /asdf:sync
    HELP --> TEST: /asdf:test
    HELP --> REVIEW: /asdf:pr, /asdf:review
    HELP --> MERGE: /asdf:merge
    HELP --> GUARDIAN: /asdf:guardian
    HELP --> REPORT: /asdf:report, /asdf:audit
    HELP --> MAINTENANCE: /asdf:cleanup, /asdf:onboard
    HELP --> CONFIG: /asdf:config, /asdf:version
    HELP --> SESSION: /asdf:handoff, /asdf:unlock

    DESIGN --> EXECUTE: Spec approved
    EXECUTE --> TEST: Code complete
    EXECUTE --> SYNC: Deviation detected
    TEST --> REVIEW: Tests passing
    REVIEW --> SYNC: Review complete
    REVIEW --> MERGE: Approved
    MERGE --> DESIGN: Feature done
    SYNC --> DESIGN: Spec updated

    GUARDIAN --> REPORT: Drill down
    GUARDIAN --> MAINTENANCE: Stale items
    REPORT --> MAINTENANCE: Issues found
    MAINTENANCE --> DESIGN: Cleanup done

    SESSION --> DESIGN: Start work
    SESSION --> [*]: End session
```

---

## Mode Details

### DESIGN MODE
**Commands:** `/asdf:init`, `/asdf:spec`, `/asdf:update`

**Purpose:** Create and refine specifications

**Flow:**
```mermaid
flowchart LR
    A[Collect References] --> B[Draft Spec]
    B --> C{Review}
    C -->|Feedback| B
    C -->|Confirm| D[Finalize]
```

**Transitions:**
- → EXECUTE: After spec approved
- → DESIGN: On feedback loop

---

### EXECUTE MODE
**Commands:** `/asdf:code`

**Purpose:** Implement code from specifications

**Flow:**
```mermaid
flowchart LR
    A[Load Spec] --> B[Check Dependencies]
    B --> C[Impact Analysis]
    C --> D[Acquire Lock]
    D --> E[Implement]
    E --> F{Deviation?}
    F -->|No| G[Complete]
    F -->|Yes| H[Handle A/B/C]
    H --> E
    G --> I[Release Lock]
```

**Transitions:**
- → TEST: After implementation complete
- → SYNC: If deviation option B chosen

---

### SYNC MODE
**Commands:** `/asdf:sync`

**Purpose:** Reconcile code reality with spec documentation

**Flow:**
```mermaid
flowchart LR
    A[Compare Code vs Spec] --> B[Identify Deviations]
    B --> C[Preview Changes]
    C --> D{Confirm?}
    D -->|Yes| E[Update Spec]
    D -->|No| F[Abort]
    E --> G[Version Bump]
```

**Transitions:**
- → DESIGN: Spec now reflects code
- → EXECUTE: Continue with aligned spec

---

### TEST MODE
**Commands:** `/asdf:test`

**Purpose:** Generate test suites from specifications

**Flow:**
```mermaid
flowchart LR
    A[Load Spec] --> B[Extract AC]
    B --> C[Build Test Matrix]
    C --> D{Options}
    D -->|skip-e2e| E[Generate Unit+Integration]
    D -->|yes| F[Generate All]
    E --> G[Run Tests]
    F --> G
```

**Transitions:**
- → REVIEW: After tests passing
- → EXECUTE: If tests fail, fix code

---

### REVIEW MODE
**Commands:** `/asdf:pr`, `/asdf:review`

**Purpose:** Create PR packages and perform code review

**Flow:**
```mermaid
flowchart LR
    A[Bundle Changes] --> B[Generate PR Summary]
    B --> C[Push to GitHub]
    C --> D[AI Review]
    D --> E{Issues?}
    E -->|Yes| F[Apply Fixes]
    E -->|No| G[Approved]
    F --> D
    G --> H[Ready to Merge]
```

**Transitions:**
- → MERGE: After PR approved
- → SYNC: After review complete
- → EXECUTE: If fixes needed

---

### MERGE MODE
**Commands:** `/asdf:merge`

**Purpose:** Merge approved PRs with automatic cleanup

**Flow:**
```mermaid
flowchart LR
    A[Find PR] --> B[Check Approval]
    B --> C[Check CI]
    C --> D{All Pass?}
    D -->|Yes| E[Execute Merge]
    D -->|No| F[Block]
    E --> G[Cleanup]
    G --> H[Done]
```

**Transitions:**
- → DESIGN: Feature complete, start next
- → EXECUTE: If fixes needed before merge

---

### GUARDIAN MODE
**Commands:** `/asdf:guardian`

**Purpose:** Full pipeline scan with health monitoring

**Flow:**
```mermaid
flowchart LR
    A[Scan Features] --> B[Determine Stages]
    B --> C[Check Stale]
    C --> D[Calculate Health]
    D --> E[Generate Report]
    E --> F[Recommendations]
```

**Transitions:**
- → REPORT: Drill down for details
- → MAINTENANCE: Address stale items
- → MERGE: Ready-to-merge items found

---

### CONFIG MODE
**Commands:** `/asdf:config`, `/asdf:version`

**Purpose:** View/edit settings and toolkit version

**Flow:**
```mermaid
flowchart LR
    subgraph Config
        A1[View Settings] --> B1{Change?}
        B1 -->|Yes| C1[Update]
        B1 -->|No| D1[Done]
    end
    subgraph Version
        A2[Display Version] --> B2[Show Changelog]
    end
```

**Transitions:**
- → Any Mode: After configuration

---

### REPORT MODE
**Commands:** `/asdf:report`, `/asdf:audit`

**Purpose:** Generate progress reports and detect issues

**Flow:**
```mermaid
flowchart LR
    A[Scan Project] --> B[Calculate Metrics]
    B --> C[Generate Report]
    C --> D{Issues Found?}
    D -->|Yes| E[Recommendations]
    D -->|No| F[Healthy Status]
```

**Transitions:**
- → MAINTENANCE: If issues found
- → EXECUTE: Continue normal work

---

### MAINTENANCE MODE
**Commands:** `/asdf:cleanup`, `/asdf:onboard`

**Purpose:** Project health maintenance and onboarding

**Flow:**
```mermaid
flowchart LR
    subgraph Cleanup
        A1[Identify Orphaned] --> B1[Archive/Delete]
    end
    subgraph Onboard
        A2[Load Context] --> B2[Show Status]
        B2 --> C2[Ready to Work]
    end
```

**Transitions:**
- → DESIGN: After onboarding
- → EXECUTE: Ready to work

---

### SESSION MODE
**Commands:** `/asdf:handoff`, `/asdf:unlock`

**Purpose:** Session management and lock handling

**Flow:**
```mermaid
flowchart LR
    subgraph Handoff
        A1[Summarize Work] --> B1[Save Context]
    end
    subgraph Unlock
        A2[Find Lock] --> B2[Verify Stale]
        B2 --> C2[Release + Log]
    end
```

**Transitions:**
- → End: Session complete
- → Any Mode: After unlock

---

## Typical Mode Sequences

### Feature Development (Full Cycle)
```
DESIGN → EXECUTE → TEST → REVIEW → SYNC → MERGE → DONE
```

### Quick Feature
```
DESIGN → EXECUTE → TEST → REVIEW(--push) → MERGE
```

### Maintenance Sprint
```
GUARDIAN → REPORT → MAINTENANCE → SYNC → GUARDIAN
```

### Weekly Health Check
```
GUARDIAN → REPORT → AUDIT → CLEANUP
```

### Bug Fix
```
EXECUTE → TEST → REVIEW(--push) → MERGE
```

### Team Handoff
```
SESSION(handoff) → ... → SESSION(onboard) → GUARDIAN → EXECUTE
```

---

## Mode Compatibility

| From Mode | Can Transition To |
|-----------|-------------------|
| DESIGN | EXECUTE, DESIGN (loop) |
| EXECUTE | TEST, SYNC, EXECUTE (loop) |
| SYNC | DESIGN, EXECUTE |
| TEST | REVIEW, EXECUTE |
| REVIEW | MERGE, SYNC, EXECUTE |
| MERGE | DESIGN, GUARDIAN |
| GUARDIAN | REPORT, MAINTENANCE, MERGE |
| REPORT | MAINTENANCE, Any |
| MAINTENANCE | DESIGN, EXECUTE |
| CONFIG | Any |
| SESSION | Any, End |
