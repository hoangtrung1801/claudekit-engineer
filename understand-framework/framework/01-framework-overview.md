# Claudekit Framework Overview

## Introduction
`claudekit-engineer` is a sophisticated boilerplate and framework designed to transform **Claude Code** from a single AI assistant into a highly coordinated **AI Engineering Team**. It provides the structure, rules, and specialized agents necessary for professional-grade software development with AI.

## Core Philosophy
The framework is built on the belief that software engineering is too complex for a single AI agent to handle reliably at scale. By decomposing the engineering process into specialized roles and structured workflows, it achieves higher quality, better maintainability, and faster iteration speeds.

### Key Pillars
1.  **Multi-Agent Orchestration**: Specialized agents for planning, research, coding, testing, and review.
2.  **Strict Protocol Enforcement**: Mandatory planning before coding, and testing before completion.
3.  **Context Preservation**: Using a dedicated documentation system (`docs/`) and plan files (`plans/`) to maintain a single "Source of Truth."
4.  **Tool-Augmented Intelligence**: Deep integration with MCP servers and specialized skills (multimodal, sequential thinking).

## Project Structure
-   `.claude/`: Global configuration and orchestration workflows for Claude Code.
-   `.opencode/agent/`: Definitions and system prompts for specialized sub-agents.
-   `docs/`: Core project documentation (Architecture, Standards, Roadmap).
-   `plans/`: Implementation plans and progress reports generated during development.
-   `CLAUDE.md`: The "brain" of the repository, providing high-level guidance.

## Why it Matters
Developers are no longer just "chatting" with an AI; they are **managing a team**. The framework handles procedural tasks like research, testing, and documentation, allowing developers to focus on high-level architecture and business requirements.
