# ASDF Case Studies & Visual Guides

Practical examples and visual diagrams to help you understand ASDF workflows.

---

## Case Studies

| # | Title | Scenario | Best For |
|---|-------|----------|----------|
| 01 | [New Project](01-new-project.md) | Starting e-commerce from scratch | First-time ASDF users |
| 02 | [Existing Codebase](02-existing-codebase.md) | Adding ASDF to 50+ file project | Brownfield adoption |
| 03 | [Team Collaboration](03-team-collaboration.md) | 2 developers working in parallel | Multi-instance setups |
| 04 | [Maintenance Workflow](04-maintenance-workflow.md) | Fixing drifted specs, tech debt | Project health |
| 05 | [Feature Lifecycle](05-feature-lifecycle.md) | Guest Checkout end-to-end | Complete workflow |

---

## Visual Diagrams

| Diagram | Purpose | When to Reference |
|---------|---------|-------------------|
| [Command Flow](diagrams/command-flow.md) | Which command to use | Unsure what to run next |
| [Mode Transitions](diagrams/mode-transitions.md) | How modes connect | Understanding the system |
| [Multi-Instance](diagrams/multi-instance.md) | Lock mechanism | Parallel development |
| [Context Loading](diagrams/context-loading.md) | Hierarchy visualization | Starting any task |
| [Refinement Loop](diagrams/refinement-loop.md) | Feedback cycle | During spec creation |

---

## Quick Start

**New to ASDF?**
1. Read [01-new-project.md](01-new-project.md) for a complete walkthrough
2. Reference [Command Flow](diagrams/command-flow.md) when stuck

**Adding ASDF to existing project?**
1. Read [02-existing-codebase.md](02-existing-codebase.md)
2. Focus on `/asdf:init` option B

**Working with a team?**
1. Read [03-team-collaboration.md](03-team-collaboration.md)
2. Reference [Multi-Instance](diagrams/multi-instance.md) for lock handling

**Project needs cleanup?**
1. Read [04-maintenance-workflow.md](04-maintenance-workflow.md)
2. Start with `/asdf:audit`

**Want the full picture?**
1. Read [05-feature-lifecycle.md](05-feature-lifecycle.md)
2. Reference [Mode Transitions](diagrams/mode-transitions.md)

---

## Related Documentation

- [ASDF-Framework.md](../ASDF-Framework.md) - Main framework documentation
- [Commands](../.claude/commands/asdf/) - All command references
- [Skills](../.claude/skills/) - Skill documentation
- [Agent](../.claude/agents/asdf-coder.md) - Agent behavior reference

---

## How to Use These Guides

1. **Case studies** are narrative walkthroughs with realistic scenarios
2. **Diagrams** are quick visual references
3. All examples use actual ASDF commands with expected outputs
4. Both happy path and edge cases are covered

Each case study is self-contained — read any one without reading others.
