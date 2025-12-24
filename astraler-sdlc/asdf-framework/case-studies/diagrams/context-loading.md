# Context Loading Diagram

**Purpose:** Visualize the hierarchy of context loading in ASDF.

---

## Loading Hierarchy

```mermaid
flowchart TD
    subgraph Tier1["Tier 1: System Core (Always First)"]
        A1["01-system-core/"]
        A2["01-architecture/"]
        A3["02-standards/"]
        A4["03-design/"]
        A5["project-status.md"]
    end

    subgraph Tier2["Tier 2: Domains (Load Relevant)"]
        B1["02-domains/"]
        B2["auth/domain.md"]
        B3["payments/domain.md"]
        B4["orders/domain.md"]
    end

    subgraph Tier3["Tier 3: Features (Load Specific)"]
        C1["03-features/"]
        C2["251224-checkout/spec.md"]
        C3["251224-user-profile/spec.md"]
    end

    subgraph Tier4["Tier 4: Operations (Check State)"]
        D1["04-operations/"]
        D2["session-handoff.md"]
        D3["implementation-active.md"]
        D4["tech-debt.md"]
    end

    Tier1 --> Tier2 --> Tier3 --> Tier4
```

---

## Loading Order

```mermaid
sequenceDiagram
    participant AI as Claude Instance
    participant T1 as 01-system-core
    participant T2 as 02-domains
    participant T3 as 03-features
    participant T4 as 04-operations

    AI->>T1: 1. Load global rules
    T1-->>AI: Architecture, standards, design

    AI->>T2: 2. Load relevant domain
    T2-->>AI: Business rules, entities

    AI->>T3: 3. Load specific feature
    T3-->>AI: Requirements, API contracts

    AI->>T4: 4. Check session state
    T4-->>AI: Last handoff, active work

    Note over AI: Context fully loaded ✓
```

---

## What Gets Loaded Per Command

### `/asdf:init`
```mermaid
flowchart LR
    A[Check existing] --> B[01-system-core templates]
    B --> C[02-domains structure]
    C --> D[03-features structure]
    D --> E[04-operations structure]
```
**Loads:** Templates and structure references

### `/asdf:spec [feature]`
```mermaid
flowchart LR
    A[01-system-core] --> B[02-domains relevant]
    B --> C[03-features existing]
    C --> D[04-operations/session-handoff.md]
```
**Loads:** Full hierarchy to understand context

### `/asdf:code [spec]`
```mermaid
flowchart LR
    A[01-system-core/02-standards] --> B[02-domains dependencies]
    B --> C[03-features/spec.md]
    C --> D[04-operations/locks/]
    D --> E[04-operations/implementation-active.md]
```
**Loads:** Standards + dependencies + spec + lock state

### `/asdf:sync`
```mermaid
flowchart LR
    A[03-features/spec.md] --> B[Codebase scan]
    B --> C[Compare diff]
```
**Loads:** Spec only, then scans code

### `/asdf:test [feature]`
```mermaid
flowchart LR
    A[03-features/spec.md] --> B[01-system-core/02-standards/testing-strategy.md]
    B --> C[Existing test patterns]
```
**Loads:** Spec + testing standards

### `/asdf:report`
```mermaid
flowchart LR
    A[All 03-features/] --> B[04-operations/implementation-active.md]
    B --> C[04-operations/tech-debt.md]
    C --> D[project-status.md]
```
**Loads:** All features + operations for aggregation

### `/asdf:onboard`
```mermaid
flowchart LR
    A[project-status.md] --> B[04-operations/session-handoff.md]
    B --> C[04-operations/locks/]
    C --> D[03-features/ status]
```
**Loads:** Status + handoff + active locks

---

## Context by Tier

### Tier 1: System Core
**What it contains:**
- Architecture decisions (ADRs)
- Tech stack definitions
- Coding standards
- Design system
- Project status

**When to load:** Always first, for any command

### Tier 2: Domains
**What it contains:**
- Entity definitions
- Business rules
- Domain-specific APIs
- Cross-feature logic

**When to load:** When working on features that use the domain

### Tier 3: Features
**What it contains:**
- Acceptance criteria
- User flows
- API contracts
- UI/UX requirements
- Dependencies

**When to load:** When implementing specific feature

### Tier 4: Operations
**What it contains:**
- Session handoff notes
- Active implementations
- Tech debt register
- Lock files
- Changelogs

**When to load:** For state awareness and continuity

---

## Dependency Resolution

```mermaid
flowchart TD
    A[Feature Spec] --> B{Has dependencies?}
    B -->|Yes| C[Load each dependency]
    B -->|No| D[Ready to implement]

    C --> E{Domain dependency?}
    E -->|Yes| F[Load 02-domains/X/]
    E -->|No| G{Feature dependency?}

    G -->|Yes| H[Load 03-features/Y/]
    G -->|No| I{External?}

    I -->|Yes| J[Check availability]
    I -->|No| D

    F --> D
    H --> D
    J --> D
```

---

## Example: Loading for Checkout Feature

```mermaid
flowchart TD
    subgraph Step1["Step 1: System Core"]
        A1["master-map.md"]
        A2["code-standards.md"]
        A3["design-system.md"]
    end

    subgraph Step2["Step 2: Domains"]
        B1["cart/domain.md"]
        B2["payments/domain.md"]
        B3["orders/domain.md"]
    end

    subgraph Step3["Step 3: Feature"]
        C1["251224-checkout/spec.md"]
    end

    subgraph Step4["Step 4: State"]
        D1["session-handoff.md"]
        D2["locks/251224-checkout.lock"]
    end

    Step1 --> Step2 --> Step3 --> Step4

    style C1 fill:#90EE90
```

---

## Loading Performance Tips

| Tip | Benefit |
|-----|---------|
| Load relevant domains only | Faster context |
| Check session-handoff first | Know prior state |
| Skip unchanged system-core | Efficiency |
| Cache frequently used specs | Speed |

---

## Context Freshness

| Source | Freshness Check |
|--------|-----------------|
| System Core | Rarely changes |
| Domains | Check on dependency load |
| Features | Always load latest |
| Operations | Always load latest |
