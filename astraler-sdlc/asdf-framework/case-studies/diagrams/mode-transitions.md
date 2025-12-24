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
    HELP --> REPORT: /asdf:report, /asdf:audit
    HELP --> MAINTENANCE: /asdf:cleanup, /asdf:onboard
    HELP --> SESSION: /asdf:handoff, /asdf:unlock

    DESIGN --> EXECUTE: Spec approved
    EXECUTE --> TEST: Code complete
    EXECUTE --> SYNC: Deviation detected
    TEST --> REVIEW: Tests passing
    REVIEW --> SYNC: Review complete
    SYNC --> DESIGN: Spec updated

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
    B --> C[AI Review]
    C --> D{Issues?}
    D -->|Yes| E[Apply Fixes]
    D -->|No| F[Approved]
    E --> C
```

**Transitions:**
- → SYNC: After review complete
- → EXECUTE: If fixes needed

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

### Feature Development
```
DESIGN → EXECUTE → TEST → REVIEW → SYNC → DONE
```

### Maintenance Sprint
```
REPORT → MAINTENANCE → SYNC → REPORT
```

### Bug Fix
```
EXECUTE → TEST → SYNC
```

### Team Handoff
```
SESSION(handoff) → ... → SESSION(onboard) → EXECUTE
```

---

## Mode Compatibility

| From Mode | Can Transition To |
|-----------|-------------------|
| DESIGN | EXECUTE, DESIGN (loop) |
| EXECUTE | TEST, SYNC, EXECUTE (loop) |
| SYNC | DESIGN, EXECUTE |
| TEST | REVIEW, EXECUTE |
| REVIEW | SYNC, EXECUTE |
| REPORT | MAINTENANCE, Any |
| MAINTENANCE | DESIGN, EXECUTE |
| SESSION | Any, End |
