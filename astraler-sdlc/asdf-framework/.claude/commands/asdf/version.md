# `/asdf:version` — Display Toolkit Version

**Purpose:** Show current ASDF toolkit version and changelog.

---

## Trigger

User runs: `/asdf:version`

---

## Output Format

```
ASDF Toolkit v2.1.0
Astraler Spec-Driven Framework

Changelog:
───────────────────────────────────
v2.1.0 (Current)
  ├─ 6-state spec status lifecycle
  │   └─ Draft → Review → Approved → Implemented → Synced → Completed
  ├─ Auto status: /asdf:code → Implemented
  ├─ Auto status: /asdf:sync → Synced
  ├─ Auto status: /asdf:merge → Completed
  ├─ /asdf:pr pushes by default (--local to skip)
  ├─ /asdf:sync detects and updates related docs (impact analysis)
  ├─ /asdf:test warns if spec not synced
  ├─ Guardian shows spec status column
  ├─ "Not synced" alert in Guardian
  ├─ Playwright MCP for E2E testing
  └─ Correct workflow: Code → Sync → Test

v2.0.0
  ├─ /asdf:guardian — Pipeline supervisor
  ├─ /asdf:version — Toolkit versioning
  ├─ Stale detection thresholds
  └─ Health score calculation

v1.2.0
  ├─ /asdf:merge — PR merge with cleanup
  ├─ /asdf:config — Settings management
  ├─ Auto-branch creation in /asdf:code
  └─ Auto-push in /asdf:pr --push

v1.1.0
  ├─ /asdf:pr — PR package creation
  ├─ /asdf:review — AI code review
  ├─ Multi-instance locks
  └─ Execution file tracking

v1.0.0
  ├─ /asdf:init — Project initialization
  ├─ /asdf:spec — Specification creation
  ├─ /asdf:code — Implementation from spec
  ├─ /asdf:test — Test generation
  ├─ /asdf:sync — Reverse sync
  ├─ /asdf:roadmap — Phase management
  └─ /asdf:handoff — Session notes
───────────────────────────────────

Documentation: case-studies/README.md
```

---

## Behavior

1. Display version number
2. Display changelog (hardcoded)
3. No file reads required
4. No configuration needed

---

## Version Numbering

Format: `vMAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes to command interface
- **MINOR**: New commands or significant features
- **PATCH**: Bug fixes and minor improvements

Current: **v2.1.0**
