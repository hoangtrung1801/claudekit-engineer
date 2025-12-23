# Workflow Orchestration

The `claudekit-engineer` framework follows strict, document-driven workflows to ensure coordination between agents and transparency for the human developer.

## The Core Technical Loop
The framework operates as a "Chain of Agents," where the output of one agent serves as the input for the next.

1.  **Planning Phase**: Triggered by user requests or `/plan`.
    -   `Planner` delegates to `Researchers`.
    -   `Researchers` report back technical findings.
    -   `Planner` writes a formal plan to `./plans/YYMMDD-feature-plan.md`.
2.  **Execution Phase**: Triggered after plan approval or via `/code`.
    -   `Main Agent` implements code based on the plan.
    -   `Project Manager` updates the task list.
3.  **QA Loop**:
    -   `Main Agent` triggers `Tester` for validation.
    -   `Code Reviewer` audits implementation against security and standards.
4.  **Finalization**:
    -   `Docs Manager` updates relevant documentation.
    -   `Git Manager` handles the commit and push.

## Communication Models

### File-Based "Shared Memory"
To avoid "Context Drift" (AI losing its place in long chats), the framework uses the filesystem as long-term memory.
-   **Shared Context**: Core files like `task.md` and `plans/` are read by agents to resume work seamlessly.
-   **Handoff Reports**: Agents leave reports for each other using the format: `YYMMDD-from-agent-A-to-agent-B-task-report.md`.

### Orchestration Protocols
Defined in `.claude/workflows/orchestration-protocol.md`:
-   **Sequential Chaining**: Used for linear feature development (Plan → Code → Test → Review).
-   **Parallel Execution**: Used for independent tasks (Coding features while simultaneously writing tests and documentation).

## Development Rules
Strictly enforced by `development-rules.md`:
-   **KISS & YAGNI**: Reviewers reject over-engineering.
-   **File Size Management**: Files are kept under 200 lines to optimize AI context windows.
-   **No Simulation**: Real code implementation is mandatory; mock data is used only when absolutely necessary.
