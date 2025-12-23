# Specialized Agent Ecosystem

The `claudekit-engineer` framework distributes work across specialized agents defined in `.opencode/agent/`. This division of labor ensures that every phase of the Software Development Life Cycle (SDLC) receives expert attention.

## 🎯 Engineering & Creative Team

### 📋 Planner Agent (The Architect)
- **File**: `planner.md`
- **Responsibilities**: Analyzes requirements, triggers parallel research, and synthesizes findings into an implementation plan.
- **Special Skills**: Uses `sequential-thinking` for complex problem-solving.

### 🔍 Researcher Agent (The Investigator)
- **File**: `researcher.md`
- **Responsibilities**: Conducts deep technical research. Uses `search_google`, `search_youtube`, and `repomix --remote` to analyze external GitHub repositories.
- **Output**: Detailed research reports saved in `./plans/<plan-name>/research/`.

### 💡 Solution Brainstormer (The Ideator)
- **File**: `solution-brainstormer.md`
- **Responsibilities**: Explores "out-of-the-box" alternatives before a final approach is chosen. Helps avoid "tunnel vision" in implementation.

### 🎨 UI/UX Team (Design & Interface)
- **UI/UX Designer**: Uses `ai-multimodal` to analyze screenshots and create high-fidelity design specs.
- **UI/UX Developer**: Implements designs using the design system, focusing on "vibrant aesthetics" and responsiveness.

## 🔍 Quality & Reliability Team (QA)

### 🧪 Tester Agent (The QA Engineer)
- **File**: `tester.md`
- **Responsibilities**: Runs unit/integration tests using framework-specific tools (e.g., `npm test`, `flutter test`).
- **Standard**: Typically enforces at least 80% code coverage.

### 👓 Code Reviewer Agent (The Gatekeeper)
- **File**: `code-reviewer.md`
- **Responsibilities**: Audits code for security (OWASP Top 10), performance, and adherence to project standards.
- **Criticality**: Mandatory final checkpoint before feature completion.

### 🐛 Debugger Agent (The Troubleshooter)
- **File**: `debugger.md`
- **Responsibilities**: Analyzes logs, traces errors, and identifies root causes for reported bugs.

## 📚 Management & DevOps Team

### 📈 Project Manager Agent (The Team Lead)
- **File**: `project-manager.md`
- **Responsibilities**: Tracks progress in `task.md`, manages risks, and orchestrates agent interactions.
- **Command**: Powers the `/watzup` command for status reports.

### 📖 Docs Manager Agent (The Technical Writer)
- **File**: `docs-manager.md`
- **Responsibilities**: Ensures `docs/` remains current. Updates `CHANGELOG.md` and `codebase-summary.md`.

### 🌿 Git Manager Agent (VCS Expert)
- **File**: `git-manager.md`
- **Responsibilities**: Manages commits using Conventional Commits, handles merges, and ensures a clean Git history.

---
> [!NOTE]
> Agents communicate primarily through Markdown files in the `./plans` directory, creating a durable audit trail for all technical decisions.
