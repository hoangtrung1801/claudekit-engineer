# Internal Architecture Deep Dive

Understanding the "under the hood" mechanics of `claudekit-engineer` is essential for customization or troubleshooting.

## 1. The .claude/ Directory (The Control Brain)
This directory contains instructions that Claude Code reads at the start of every session:
-   **`workflows/`**: Contains Standard Operating Procedures (SOPs). Modify these files to change how agents interact or how reviews are conducted.
-   **`commands/`**: Definitions for Slash Commands. These files define the "Mission" and "Workflow" for commands like `/plan` and `/code`.
-   **`skills/`**: Definitions for MCP skills or helper functions.
-   **`settings.json`**: Environment configuration for the agents.

## 2. The .opencode/agent/ Directory (Personnel Definitions)
This is where agent profiles are stored. Each `.md` file here acts as a specialized **System Prompt**:
-   **Agent metadata**: Name, description, and when to invoke the agent.
-   **Core Responsibilities**: A detailed checklist of tasks the agent is authorized to perform.
-   **Working Process**: Step-by-step instructions for the agent's internal operation.
-   **Output Format**: Mandatory structure for the agent's reports.

## 3. The plans/ Directory (Shared Memory)
This is the coordination hub. Since AI conversations have limited context windows, files in `plans/` act as **permanent memory**.
-   **Hierarchy**:
    -   `./plans/YYMMDD-feature/`: Root folder for a major feature.
    -   `./plans/YYMMDD-feature/research/`: Findings from the `Researcher` agent.
    -   `./plans/YYMMDD-feature/reports/`: Reports from `Tester` or `Code Reviewer`.

## 4. CLAUDE.md (The Constitution)
Sitting at the root, this is the very first file Claude Code reads. It acts as a legal framework for AI behavior:
-   It mandates which agents to use for specific tasks.
-   It forces compliance with `README.md` and `development-rules.md`.
-   **Crucial**: Never delete the "IMPORTANT" blocks in this file, as they are the anchors that prevent the AI from drifting off-protocol.

## 5. Tooling Mechanics (MCP Integration)
The framework maximizes the **Model Context Protocol (MCP)**:
-   It doesn't just read files; it interacts with the world:
    -   `search_google`: To fetch the latest tech updates (bypassing LLM training cutoff dates).
    -   `ai-multimodal`: To process and evaluate visual assets.
    -   `bash`: To execute actual terminal commands, ensuring code is not just "technically correct" but "executes correctly."
