---
description: Initialize ASDF folder structure for new project
argument-hint: [project-name]
---

## Mission

Initialize the ASDF documentation structure for spec-driven development.

<project-name>
$ARGUMENTS
</project-name>

## Execution Steps

### Step 1: Create Directory Structure

Create the following structure:
```
asdf-docs/
├── system-core/
│   ├── master-map.md
│   ├── ui-ux-design-system.md
│   └── project-status.md
├── domains/
│   └── .gitkeep
├── features/
│   └── .gitkeep
└── operations/
    ├── implementation-active.md
    ├── session-handoff.md
    └── changelog/
        └── .gitkeep
```

### Step 2: Initialize System Core Files

**master-map.md:**
```markdown
# Project Master Map

## Overview
[Project name and description]

## Core Technologies
- [List main technologies]

## Architecture Overview
[High-level architecture description]

## Module Structure
[List main modules/domains]

## External Integrations
[List external services/APIs]

---
Last Updated: [YYMMDD]
```

**ui-ux-design-system.md:**
```markdown
# UI/UX Design System

## Design Principles
- [Core design principles]

## Color Palette
- Primary: [color]
- Secondary: [color]
- Accent: [color]

## Typography
- Headings: [font]
- Body: [font]

## Components
[List reusable UI components]

## Interaction Patterns
[Define standard interactions]

---
Last Updated: [YYMMDD]
```

**project-status.md:**
```markdown
# Project Status (Heartbeat)

## Overall Progress
- Features Planned: 0
- Features In Progress: 0
- Features Complete: 0
- Completion: 0%

## Current Phase
[Phase name]

## Recent Activity
- [YYMMDD] Project initialized with ASDF

## Blockers
[None]

---
Last Updated: [YYMMDD]
```

### Step 3: Initialize Operations Files

**implementation-active.md:**
```markdown
# Active Implementation

## Current Task
[None - Ready for first task]

## In Progress
[None]

## Blocked
[None]

## Recently Completed
[None]

---
Last Updated: [YYMMDD]
```

**session-handoff.md:**
```markdown
# Session Handoff

## Last Session
- Date: [YYMMDD]
- Duration: [N/A - Initial setup]

## Completed This Session
- [x] ASDF structure initialized

## Pending Next Session
- [ ] Define master-map.md details
- [ ] Create first feature spec

## Notes for Next Session
Project initialized. Ready for Product Architect to define project scope and first features.

## Blockers
[None]

---
Handoff Created: [YYMMDD]
```

### Step 4: Report Completion

Report:
```
ASDF initialized successfully!

Created structure:
- asdf-docs/01-system-core/ (3 files)
- asdf-docs/02-domains/ (empty, ready for modules)
- asdf-docs/03-features/ (empty, ready for specs)
- asdf-docs/04-operations/ (3 files + changelog/)

Next steps:
1. Update master-map.md with project details
2. Define UI/UX design system
3. Create first feature spec with /asdf:spec [feature-name]
```

## Post-Execution

Activate `context-loading` skill to verify structure is readable.
