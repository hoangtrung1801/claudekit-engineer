# Visual Workflow Diagrams

These diagrams visualize the file calls and agent interactions triggered by major Slash Commands.

## 1. Planning Workflow (`/plan`)

Triggered for research and initial design.

```mermaid
graph TD
    User(["User types /plan"]) --> CmdPlan["file: .claude/commands/plan.md"]
    CmdPlan --> PlannerAgent["Agent: planner.md"]
    
    subgraph ResearchPhase ["Research Phase"]
        PlannerAgent --> ResAgent1["Agent: researcher.md - Topic 1"]
        PlannerAgent --> ResAgent2["Agent: researcher.md - Topic 2"]
        ResAgent1 & ResAgent2 --> PlannerAgent
    end
    
    PlannerAgent --> OutputPlan[("(Result file: ./plans/YYMMDD-plan.md)")]
    OutputPlan --> UserReview(["User reviews the plan"])

    style CmdPlan fill:#e1f5fe,stroke:#01579b
    style PlannerAgent fill:#fff3e0,stroke:#e65100
    style OutputPlan fill:#f9f,stroke:#333
```

## 2. Coding Workflow (`/code`)

Synthesizes the plan into a complete implementation with quality gates.

```mermaid
graph TD
    User(["User types /code [plan.md]"]) --> CmdCode["file: .claude/commands/code.md"]
    CmdCode --> MainAgent["ROLE: Main AI Engineer"]
    
    MainAgent --> PM["Agent: project-manager.md - Updates task.md"]
    MainAgent --> Implement["Implements real code"]
    
    subgraph QA_Loop ["Quality Gate Loop"]
        Implement --> Tester["Agent: tester.md - Runs Unit/Integration Tests"]
        Tester -- Error --> Implement
        Tester -- Pass --> Reviewer["Agent: code-reviewer.md - Security/Style audit"]
        Reviewer -- Suggestion --> Implement
    end
    
    Reviewer -- Approved --> Docs["Agent: docs-manager.md - Updates /docs"]
    Docs --> Git["Agent: git-manager.md - Commit & Push"]
    Git --> Done(["Feature Completed"])

    style CmdCode fill:#e1f5fe,stroke:#01579b
    style MainAgent fill:#fff3e0,stroke:#e65100
    style QA_Loop fill:#f1f8e9,stroke:#33691e
```

## 3. Architecture Consultation (`/ask`)

High-level design and strategic advice.

```mermaid
graph TD
    User(["User types /ask"]) --> CmdAsk["file: .claude/commands/ask.md"]
    CmdAsk --> Architect["ROLE: Senior Systems Architect"]
    
    subgraph Specialists ["Architectural Advisors"]
        Architect --> SysDes["Systems Designer"]
        Architect --> TechStrat["Technology Strategist"]
        Architect --> ScaleCon["Scalability Consultant"]
        Architect --> RiskAna["Risk Analyst"]
    end
    
    Specialists --> Synthesis["Guidance Synthesis"]
    Synthesis --> Response(["Delivers Architectural Report to User"])

    style CmdAsk fill:#e1f5fe,stroke:#01579b
    style Architect fill:#ede7f6,stroke:#311b92
```

## 4. Brainstorm (`/brainstorm`) & Debug (`/debug`)

```mermaid
graph LR
    subgraph Brainstorming
        B_User(["/brainstorm"]) --> B_Cmd["brainstorm.md"]
        B_Cmd --> B_Agent["solution-brainstormer.md"]
        B_Agent --> B_Result(["Ideation Report"])
    end
    
    subgraph Debugging
        D_User(["/debug"]) --> D_Cmd["debug.md"]
        D_Cmd --> D_Agent["debugger.md"]
        D_Agent --> D_Result(["Root Cause Report"])
    end

    style B_Cmd fill:#fffde7,stroke:#fbc02d
    style D_Cmd fill:#fce4ec,stroke:#c2185b
```

---
> [!TIP]
> **Key Takeaway**: File-based communication ensures that the "intent" captured in `/plan` is strictly followed by the `/code` loop, with explicit validation at every step.
