---
description: ASDF smart dispatcher - routes to appropriate subcommand
argument-hint: [subcommand] [arguments]
---

## ASDF Command Router

Analyze the provided arguments and route to the appropriate ASDF subcommand.

<arguments>
$ARGUMENTS
</arguments>

## Available Subcommands

| Subcommand | Purpose |
|------------|---------|
| `init` | Initialize ASDF folder structure |
| `spec [name]` | Create feature specification |
| `implement [path]` | Execute implementation from spec |
| `sync` | Trigger Reverse Sync |
| `status` | Update project status |
| `handoff` | Create session handoff notes |

## Routing Logic

1. Parse the first argument as subcommand
2. Pass remaining arguments to subcommand
3. If no subcommand provided, show help

## Execution

Based on the arguments:
- If starts with `init` → Execute `/asdf:init`
- If starts with `spec` → Execute `/asdf:spec [remaining args]`
- If starts with `implement` → Execute `/asdf:implement [remaining args]`
- If starts with `sync` → Execute `/asdf:sync`
- If starts with `status` → Execute `/asdf:status`
- If starts with `handoff` → Execute `/asdf:handoff`
- Otherwise → Show available commands and usage

## Default Behavior (No Arguments)

Display:
```
ASDF - Astraler Spec-Driven Framework

Commands:
  /asdf:init              Initialize project structure
  /asdf:spec [feature]    Create feature specification
  /asdf:implement [path]  Implement from specification
  /asdf:sync              Reverse sync docs from code
  /asdf:status            Update project status
  /asdf:handoff           Create session handoff notes

Usage: /asdf [command] [arguments]
```
