# Practical Usage & Slash Commands

To leverage the full power of `claudekit-engineer`, use the pre-configured **Slash Commands**. These are the fastest way to trigger the right agent for the right task.

## 1. Feature Development Workflow

### Step 1: Planning with `/plan`
Instead of a vague description, use the `/plan` command to trigger the `planner` agent.
-   **Syntax**: `/plan [task description]`
-   **Example**: `/plan "Implement Google OAuth login for the mobile app"`
-   **Result**: Creates a `./plans/YYMMDD-plan.md` file after thorough research.

### Step 2: Implementation with `/code`
Once the plan is approved, start coding.
-   **Syntax**: `/code [path/to/plan.md]`
-   **Example**: `/code plans/231221-google-oauth-plan.md`
-   **Result**: Claude proceeds through each phase of the plan, running tests and reviews automatically.

## 2. Documentation Management with `/docs`

The framework provides specific commands to keep docs in sync with the codebase:
-   **`/docs:init`**: Scans the codebase for the first time and creates core documents (`system-architecture.md`, `code-standards.md`, etc.).
-   **`/docs:update [request]`**: Refreshes documentation after major changes.
-   **`/docs:summarize`**: Generates a quick summary of the current documentation state.

## 3. Technical Support Commands

-   **`/ask [question]`**: Use when researching new tech or asking about the current architecture. Triggers the `researcher`.
-   **`/brainstorm [problem]`**: Triggers the `solution-brainstormer` for creative problem-solving.
-   **`/debug [error]`**: Triggers the `debugger` to analyze logs and find root causes.
-   **`/test`**: Triggers the `tester` to run unit/integration tests and report results.
-   **`/review`**: Triggers the `code-reviewer` to audit code quality and security.
-   **`/watzup`**: Provides a project status report from the `project-manager`.

## 4. Capturing Thoughts with `/journal`

-   **Syntax**: `/journal`
-   **Utility**: Quickly log notes or thoughts during the development process into a dedicated journal file.

---

### Pro-tips:
-   **Shift + Enter**: If you need to provide more detail to a slash command, write the detailed prompt after the command.
-   **The Handoff**: If you restart a session, type `/watzup` to help Claude re-orient itself with the task list and roadmap.
-   **Chaining Commands**: You can ask for composite actions: "Run `/test` then `/review` for the latest changes."
