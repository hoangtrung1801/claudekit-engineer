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

    Q7 -->|Yes| PR["/asdf:pr [feature] --push"]
    Q7 -->|No| Q8{PR approved?}

    Q8 -->|Yes| Merge["/asdf:merge [feature]"]
    Q8 -->|No| Q9{Check project health?}

    Q9 -->|Yes| Q9a{What kind?}
    Q9a -->|Pipeline| Guardian["/asdf:guardian"]
    Q9a -->|Status| Report["/asdf:report"]
    Q9a -->|Issues| Audit["/asdf:audit"]
    Q9a -->|Cleanup| Cleanup["/asdf:cleanup"]

    Q9 -->|No| Q10{End of session?}

    Q10 -->|Yes| Handoff["/asdf:handoff"]
    Q10 -->|No| Q11{New to project?}

    Q11 -->|Yes| Onboard["/asdf:onboard"]
    Q11 -->|No| Q12{Change settings?}

    Q12 -->|Yes| Config["/asdf:config"]
    Q12 -->|No| Help["/asdf --help"]
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
| Creating pull request | `/asdf:pr [feature] --push` |
| Getting code reviewed | `/asdf:review [path]` |
| Merging approved PR | `/asdf:merge [feature]` |
| Full pipeline scan | `/asdf:guardian` |
| Checking project status | `/asdf:report [feature\|all]` |
| Finding spec issues | `/asdf:audit` |
| Removing unused specs | `/asdf:cleanup` |
| Ending work session | `/asdf:handoff` |
| Starting work session | `/asdf:onboard` |
| Lock stuck | `/asdf:unlock [name]` |
| Change settings | `/asdf:config [key] [value]` |
| Check toolkit version | `/asdf:version` |
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

    subgraph Review["Review & Merge"]
        F["/asdf:pr --push"]
        G["/asdf:review"]
        H["/asdf:merge"]
        I["/asdf:sync"]
    end

    subgraph Maintain["Maintaining"]
        J["/asdf:guardian"]
        J1["/asdf:report"]
        K["/asdf:audit"]
        L["/asdf:cleanup"]
    end

    subgraph Session["Session & Config"]
        M["/asdf:onboard"]
        N["/asdf:handoff"]
        O["/asdf:unlock"]
        P["/asdf:config"]
        Q["/asdf:version"]
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
| `/asdf:code [spec]` | Implement from spec (auto-creates branch) |
| `/asdf:test [feature]` | Generate test suites |
| `/asdf:sync` | Sync spec with code changes |

### Review & Merge
| Command | Purpose |
|---------|---------|
| `/asdf:pr [feature]` | Create PR package (add `--push` to create GitHub PR) |
| `/asdf:review [path]` | AI code review (auto-posts to GitHub PR) |
| `/asdf:merge [feature]` | Merge approved PR with cleanup |

### Project Management
| Command | Purpose |
|---------|---------|
| `/asdf:guardian` | Full pipeline scan with health score |
| `/asdf:report [target]` | Progress reports |
| `/asdf:audit` | Spec health check |
| `/asdf:cleanup` | Remove unused specs |
| `/asdf:roadmap` | Phase management |
| `/asdf:status` | Project heartbeat |

### Session & Config
| Command | Purpose |
|---------|---------|
| `/asdf:onboard` | Quick project tour |
| `/asdf:handoff` | Session notes |
| `/asdf:unlock [name]` | Release stuck locks |
| `/asdf:config` | View/edit Git and lock settings |
| `/asdf:version` | Show toolkit version and changelog |

---

## Common Workflows

### New Feature (Full Cycle with Git)
```
/asdf:spec → /asdf:code → /asdf:test → /asdf:pr --push → /asdf:review → /asdf:sync → /asdf:merge
```

### Quick Bug Fix
```
/asdf:code → /asdf:test → /asdf:pr --push → /asdf:merge
```

### Weekly Maintenance
```
/asdf:guardian → /asdf:report all → /asdf:audit → /asdf:cleanup
```

### Pipeline Oversight
```
/asdf:guardian                    # Full pipeline scan
/asdf:guardian --stale            # Show stale/blocked only
/asdf:guardian --stage PR_PUSHED  # Filter by stage
```

### Daily Start/End
```
Start: /asdf:onboard
End: /asdf:handoff
```

### Git PR Workflow
```
/asdf:pr --push → /asdf:review → /asdf:merge
```

### Configure Settings
```
/asdf:config                              # View all settings
/asdf:config git.merge_strategy merge     # Change merge strategy
/asdf:config --reset                      # Reset to defaults
```
