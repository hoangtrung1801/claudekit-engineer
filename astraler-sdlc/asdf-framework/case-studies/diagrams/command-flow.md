# Command Flow Diagram

**Purpose:** Help users know which command to use when.

---

## Decision Flowchart

```mermaid
flowchart TD
    Start([What do you need?]) --> Q1{Starting a project?}

    Q1 -->|Yes| Init["/asdf:init"]
    Q1 -->|No| Q2{Need a new feature?}

    Q2 -->|Yes| Spec["/asdf:spec [name]"]
    Q2 -->|No| Q3{Ready to implement?}

    Q3 -->|Yes| Code["/asdf:code [spec-path]"]
    Q3 -->|No| Q4{Code differs from spec?}

    Q4 -->|Yes| Sync["/asdf:sync"]
    Q4 -->|No| Q5{Need to update docs?}

    Q5 -->|Yes| Update["/asdf:update [component]"]
    Q5 -->|No| Q6{Need tests?}

    Q6 -->|Yes| Test["/asdf:test [feature]"]
    Q6 -->|No| Q7{Ready for review?}

    Q7 -->|Yes| PR["/asdf:pr [feature]"]
    Q7 -->|No| Q8{Check project health?}

    Q8 -->|Yes| Q8a{What kind?}
    Q8a -->|Status| Report["/asdf:report"]
    Q8a -->|Issues| Audit["/asdf:audit"]
    Q8a -->|Cleanup| Cleanup["/asdf:cleanup"]

    Q8 -->|No| Q9{End of session?}

    Q9 -->|Yes| Handoff["/asdf:handoff"]
    Q9 -->|No| Q10{New to project?}

    Q10 -->|Yes| Onboard["/asdf:onboard"]
    Q10 -->|No| Help["/asdf --help"]
```

---

## Quick Reference

### By Situation

| Situation | Command |
|-----------|---------|
| Starting new project | `/asdf:init` |
| Adding ASDF to existing code | `/asdf:init` (option B) |
| Planning new feature | `/asdf:spec [name]` |
| Implementing feature | `/asdf:code [spec-path]` |
| Generating tests | `/asdf:test [feature]` |
| Code changed, spec outdated | `/asdf:sync` |
| Updating documentation | `/asdf:update [component]` |
| Creating pull request | `/asdf:pr [feature]` |
| Getting code reviewed | `/asdf:review [path]` |
| Checking project status | `/asdf:report [feature\|all]` |
| Finding spec issues | `/asdf:audit` |
| Removing unused specs | `/asdf:cleanup` |
| Ending work session | `/asdf:handoff` |
| Starting work session | `/asdf:onboard` |
| Lock stuck | `/asdf:unlock [name]` |
| Need help | `/asdf` |

---

## By Development Phase

```mermaid
flowchart LR
    subgraph Plan["Planning"]
        A["/asdf:init"]
        B["/asdf:spec"]
        C["/asdf:update"]
    end

    subgraph Build["Building"]
        D["/asdf:code"]
        E["/asdf:test"]
    end

    subgraph Review["Reviewing"]
        F["/asdf:pr"]
        G["/asdf:review"]
        H["/asdf:sync"]
    end

    subgraph Maintain["Maintaining"]
        I["/asdf:report"]
        J["/asdf:audit"]
        K["/asdf:cleanup"]
    end

    subgraph Session["Session"]
        L["/asdf:onboard"]
        M["/asdf:handoff"]
        N["/asdf:unlock"]
    end

    Plan --> Build --> Review --> Maintain
    Session -.-> Plan
    Session -.-> Build
```

---

## Command Categories

### Spec Creation
| Command | Purpose |
|---------|---------|
| `/asdf:init` | Initialize project structure |
| `/asdf:spec [name]` | Create feature specification |
| `/asdf:update [path]` | Update existing documentation |

### Implementation
| Command | Purpose |
|---------|---------|
| `/asdf:code [spec]` | Implement from specification |
| `/asdf:test [feature]` | Generate test suites |
| `/asdf:sync` | Sync spec with code changes |

### Review
| Command | Purpose |
|---------|---------|
| `/asdf:pr [feature]` | Create PR package |
| `/asdf:review [path]` | AI code review |

### Project Management
| Command | Purpose |
|---------|---------|
| `/asdf:report [target]` | Progress reports |
| `/asdf:audit` | Spec health check |
| `/asdf:cleanup` | Remove unused specs |
| `/asdf:roadmap` | Phase management |
| `/asdf:status` | Project heartbeat |

### Session
| Command | Purpose |
|---------|---------|
| `/asdf:onboard` | Quick project tour |
| `/asdf:handoff` | Session notes |
| `/asdf:unlock [name]` | Release stuck locks |

---

## Common Workflows

### New Feature (Full Cycle)
```
/asdf:spec → /asdf:code → /asdf:test → /asdf:pr → /asdf:review → /asdf:sync
```

### Quick Bug Fix
```
/asdf:code → /asdf:test → /asdf:sync
```

### Weekly Maintenance
```
/asdf:report all → /asdf:audit → /asdf:cleanup
```

### Daily Start/End
```
Start: /asdf:onboard
End: /asdf:handoff
```
