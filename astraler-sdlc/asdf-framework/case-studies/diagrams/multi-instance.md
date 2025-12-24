# Multi-Instance Diagram

**Purpose:** Visualize the lock mechanism for parallel work.

---

## Lock Sequence Diagram

```mermaid
sequenceDiagram
    participant I1 as Instance 1 (Alice)
    participant LS as Lock System
    participant I2 as Instance 2 (Bob)

    Note over I1,I2: Normal Lock Flow

    I1->>LS: /asdf:code checkout
    LS-->>I1: ✓ Lock acquired

    I2->>LS: /asdf:code checkout
    LS-->>I2: ❌ LOCKED by Instance 1

    I2->>LS: /asdf:code user-profile
    LS-->>I2: ✓ Lock acquired

    Note over I1,I2: Working in parallel...

    I1->>LS: Implementation complete
    LS-->>I1: ✓ Lock released

    I2->>LS: Implementation complete
    LS-->>I2: ✓ Lock released

    Note over I1,I2: Stale Lock Scenario

    I1->>LS: /asdf:code inventory
    LS-->>I1: ✓ Lock acquired
    Note over I1: Instance crashes/disconnects

    I2->>LS: /asdf:code inventory (next day)
    LS-->>I2: ⚠️ STALE LOCK (18h old)

    I2->>LS: Force override
    LS-->>I2: ✓ Lock transferred (logged)
```

---

## Lock File Structure

```mermaid
flowchart TD
    subgraph Locks["04-operations/locks/"]
        L1["251224-checkout.lock"]
        L2["251224-user-profile.lock"]
        L3["251224-inventory.lock"]
    end

    subgraph SpecLocks["04-operations/spec-locks/"]
        S1["auth.lock"]
        S2["payments.lock"]
    end

    subgraph ConflictLog["04-operations/conflict-log.md"]
        C1["Override history"]
    end

    L1 --> ConflictLog
    L2 --> ConflictLog
    S1 --> ConflictLog
```

---

## Lock Types

### Code Lock
**Location:** `04-operations/locks/[feature].lock`
**Created by:** `/asdf:code`
**Released by:** Completion or `/asdf:handoff`

```yaml
# Example: 04-operations/locks/251224-checkout.lock
instance_id: claude-alice-001
locked_at: 2024-12-24T09:15:00Z
task: "Implementing FR-001 to FR-005"
estimated_duration: 2h
contact: "Session #42"
```

### Spec Lock
**Location:** `04-operations/spec-locks/[name].lock`
**Created by:** `/asdf:spec`, `/asdf:update`
**Released by:** Confirmation or cancel

```yaml
# Example: 04-operations/spec-locks/auth.lock
instance_id: claude-bob-002
locked_at: 2024-12-24T14:30:00Z
task: "Updating User entity"
operation: UPDATE
```

---

## Lock States

```mermaid
stateDiagram-v2
    [*] --> Available: No lock exists

    Available --> Active: Lock acquired
    Active --> Available: Lock released

    Active --> Stale: >4 hours elapsed
    Stale --> Available: Force override

    Active --> Blocked: Another instance tries
    Blocked --> Waiting: Choose to wait
    Blocked --> Available: Choose other feature
    Waiting --> Active: Original lock released
```

---

## Conflict Resolution Flow

```mermaid
flowchart TD
    A[Try to acquire lock] --> B{Lock exists?}
    B -->|No| C[Create lock file]
    B -->|Yes| D{Lock age?}

    D -->|<1 hour| E[Active - Wait or pick other]
    D -->|1-4 hours| F[Aging - Warn before override]
    D -->|>4 hours| G[Stale - Safe to override]

    E --> H{User choice}
    H -->|wait| I[Check again in 5 min]
    H -->|other| J[Pick different feature]
    H -->|force| K[Override with confirmation]

    F --> H
    G --> L[Override without warning]

    K --> M[Log to conflict-log.md]
    L --> M
    M --> C
```

---

## Parallel Work Patterns

### Pattern 1: Different Features
```mermaid
gantt
    title Parallel Work - Different Features
    dateFormat HH:mm
    axisFormat %H:%M

    section Instance 1
    checkout (locked)     :active, 09:00, 2h
    handoff               :milestone, 11:00, 0h

    section Instance 2
    user-profile (locked) :active, 09:30, 1.5h
    handoff               :milestone, 11:00, 0h
```

### Pattern 2: Sequential on Same Feature
```mermaid
gantt
    title Sequential Work - Same Feature
    dateFormat HH:mm
    axisFormat %H:%M

    section Instance 1
    checkout (locked)     :active, 09:00, 2h
    handoff               :milestone, 11:00, 0h

    section Instance 2
    blocked               :crit, 09:30, 0.5h
    checkout (locked)     :active, 11:00, 2h
    handoff               :milestone, 13:00, 0h
```

### Pattern 3: Stale Lock Override
```mermaid
gantt
    title Stale Lock Override
    dateFormat HH:mm
    axisFormat %H:%M

    section Instance 1 (crashed)
    inventory (locked)    :active, 09:00, 1h
    CRASH                 :crit, 10:00, 18h

    section Instance 2 (next day)
    detect stale          :milestone, 04:00, 0h
    override + continue   :active, 04:00, 2h
```

---

## Best Practices

| Practice | Reason |
|----------|--------|
| Work on different features | Avoid blocking |
| Small features | Shorter lock times |
| Frequent handoffs | Release locks regularly |
| Check locks first | Don't start blocked work |
| Use `/asdf:onboard` | See active locks |

---

## Lock Commands

| Command | Action |
|---------|--------|
| `/asdf:code` | Acquires code lock |
| `/asdf:spec` | Acquires spec lock |
| `/asdf:update` | Acquires spec lock |
| `/asdf:handoff` | Releases held locks |
| `/asdf:unlock [name]` | Admin force release |

---

## Conflict Log Format

```markdown
# Conflict Log

| Date | Lock | Original Instance | Released By | Reason |
|------|------|-------------------|-------------|--------|
| 251225 | inventory | claude-alice-001 | claude-bob-002 | Stale (18h) |
| 251224 | checkout | claude-x-003 | claude-y-004 | Force override |
```
