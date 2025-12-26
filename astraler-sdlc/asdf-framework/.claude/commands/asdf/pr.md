---
description: Create PR package for feature review
argument-hint: [feature-name] [--push]
---

# Create PR Package

**Feature:** $ARGUMENTS

**Flags:**
- `--push` — Automatically push to GitHub and create PR after package creation

---

## Skills Required

- **Activate:** `pr-review` (for package creation templates)
- **Activate:** `context-loading` (for spec loading)

---

## Workflow

### Step 1: Locate Feature

1. Find feature in `03-features/*-$ARGUMENTS/`
2. Load `spec.md` and `changelog.md`
3. Load execution file from `04-operations/active/$ARGUMENTS.md` if exists

**If not found:**
```markdown
**Feature Not Found**

Cannot find spec for "$ARGUMENTS" in `03-features/`.

Options:
- Create spec first: `/asdf:spec $ARGUMENTS`
- Check feature name spelling
```

---

### Step 2: Gather Changes

1. **From execution file** (if exists):
   - Extract "Files Modified" list
   - Extract "Deviations" list

2. **From git** (if available):
   ```bash
   git diff --name-only HEAD~N  # recent commits
   git log --oneline -N         # commit messages
   ```

3. **From spec changelog**:
   - Recent version changes
   - Implementation progress notes

---

### Step 3: Generate Package

Create directory: `.pr-review/YYMMDD-$ARGUMENTS/`

**Use current date from:** `date +%y%m%d`

Generate files:

1. **summary.md**
   - Feature ID and spec version
   - Summary from spec overview
   - Files changed table
   - AC status from spec

2. **changes.md**
   - Detailed file-by-file changes
   - Code snippets for significant changes

3. **spec-diff.md**
   - List all deviations from spec
   - Include resolution status (A/B/C)
   - Note if reverse sync needed

4. **checklist.md**
   - Full review checklist from `pr-review` skill
   - Pre-filled based on available info

---

### Step 4: Present Result

```markdown
**PR Package Created**

Feature: $ARGUMENTS
Spec Version: vX.Y.Z
Package: `.pr-review/YYMMDD-$ARGUMENTS/`

**Contents:**
| File | Purpose |
|------|---------|
| summary.md | PR description |
| changes.md | [N] files changed |
| spec-diff.md | [M] deviations |
| checklist.md | Review checklist |

**AC Coverage:**
| Status | Count |
|--------|-------|
| Implemented | [X] |
| Partial | [Y] |
| Missing | [Z] |

**Next Steps:**
1. Review package: `cat .pr-review/YYMMDD-$ARGUMENTS/summary.md`
2. AI review: `/asdf:review .pr-review/YYMMDD-$ARGUMENTS/`
3. Or share for human review

**Reminder:** If deviations exist, run `/asdf:sync $ARGUMENTS` first.
```

---

### Step 5: Push to Remote (if `--push` flag or prompt)

**Check current branch:**
```bash
git branch --show-current
```

**If on main branch:**
```markdown
**⚠️ WARNING: On Main Branch**

You are on the main branch. Creating a PR requires a feature branch.

Options:
- **[create]** Create branch `feature/[feature-name]` and push
- **[abort]** Stop and create branch manually

What would you like to do?
```

**If on feature branch:**

1. **Check remote status:**
   ```bash
   git status  # Check for uncommitted changes
   git log origin/[branch]..HEAD  # Check unpushed commits
   ```

2. **Push branch (if unpushed commits):**
   ```bash
   git push -u origin [branch]
   ```

3. **Create PR on GitHub:**
   ```bash
   gh pr create \
     --title "[Feature] $ARGUMENTS" \
     --body-file .pr-review/YYMMDD-$ARGUMENTS/summary.md \
     --base main
   ```

**Present result:**
```markdown
**PR Created on GitHub**

Branch: [branch-name]
PR #[number]: [url]
Base: main

**Package:** `.pr-review/YYMMDD-$ARGUMENTS/`

**Next Steps:**
1. AI review: `/asdf:review .pr-review/YYMMDD-$ARGUMENTS/`
2. Wait for CI checks
3. After approval: `/asdf:merge $ARGUMENTS`
```

**If `--push` not specified:**
```markdown
**PR Package Ready (Local Only)**

Package created at: `.pr-review/YYMMDD-$ARGUMENTS/`

**To push to GitHub:**
- Run: `/asdf:pr $ARGUMENTS --push`
- Or manually:
  1. `git push -u origin [branch]`
  2. `gh pr create --body-file .pr-review/YYMMDD-$ARGUMENTS/summary.md`

**Next Steps:**
1. Review locally: `cat .pr-review/YYMMDD-$ARGUMENTS/summary.md`
2. AI review: `/asdf:review .pr-review/YYMMDD-$ARGUMENTS/`
```

---

## PR Package Contents Detail

### summary.md Sections

```markdown
# PR: [Feature Name]

> **Feature ID:** ...
> **Spec Version:** ...
> **Created:** ...

## Summary
[From spec overview section]

## Changes
[High-level bullet list]

## Files Changed
| File | Change Type | Lines |

## Acceptance Criteria Status
| AC | Description | Status |

## Deviations from Spec
| Section | Deviation | Reason | Resolution |

## Related
- Spec path
- Domain path
- Execution file path
```

### changes.md Sections

```markdown
# Detailed Changes

## New Files
### `path/to/new-file.ts`
[Description of what this file does]

## Modified Files
### `path/to/modified-file.ts`
[Description of changes]

Key changes:
- [Change 1]
- [Change 2]

## Deleted Files
- `path/to/deleted-file.ts` - [Reason]
```

### spec-diff.md Sections

```markdown
# Spec Deviations

## Deviations Requiring Sync
| # | Section | Spec Says | Implementation | Resolution |
|---|---------|-----------|----------------|------------|

## Already Synced
| # | Section | Original | Updated | Synced Date |
|---|---------|----------|---------|-------------|

## Sync Recommendation
[Run `/asdf:sync` if deviations exist]
```

---

## Rules

- **Spec-based** — PR description derived from spec and changelog
- **Complete** — All changed files must be listed
- **Deviation tracking** — Every spec deviation documented
- **Fresh date** — Use `date +%y%m%d` for package folder name
- **No execution** — This command only creates package, doesn't run git commands
