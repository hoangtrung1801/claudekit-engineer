---
description: View and manage ASDF settings
argument-hint: [setting] [value] | [--list] | [--reset]
---

# ASDF Configuration

**Action:** $ARGUMENTS

**Usage:**
- `/asdf:config` — Show all settings
- `/asdf:config --list` — List all available settings
- `/asdf:config [setting]` — Show specific setting value
- `/asdf:config [setting] [value]` — Set a specific value
- `/asdf:config --reset` — Reset all settings to defaults

---

## Settings Storage

**Location:** `04-operations/settings.yaml`

If file doesn't exist, create with defaults on first access.

---

## Workflow

### If no arguments (show all)

1. Read `04-operations/settings.yaml`
2. Display current configuration:

```markdown
**ASDF Configuration**

File: `04-operations/settings.yaml`

## Current Settings

### ASDF
| Setting | Value |
|---------|-------|
| version | 4.2 |

### Git
| Setting | Value | Description |
|---------|-------|-------------|
| provider | github | Git hosting provider |
| default_branch | main | Default branch name |
| merge_strategy | squash | PR merge strategy |
| auto_delete_branch | true | Delete branch after merge |
| auto_post_review | true | Post review to PR |

### Locks
| Setting | Value | Description |
|---------|-------|-------------|
| timeout_hours | 4 | Hours before lock is stale |
| conflict_log | true | Log lock conflicts |

---

**Commands:**
- Set value: `/asdf:config git.merge_strategy merge`
- Reset all: `/asdf:config --reset`
- List options: `/asdf:config --list`
```

---

### If `--list` (show available settings)

```markdown
**Available ASDF Settings**

## Git Settings

| Key | Type | Options | Default |
|-----|------|---------|---------|
| `git.provider` | string | github, gitlab, bitbucket | github |
| `git.default_branch` | string | any | main |
| `git.merge_strategy` | enum | squash, merge, rebase | squash |
| `git.auto_delete_branch` | bool | true, false | true |
| `git.auto_post_review` | bool | true, false | true |

## Lock Settings

| Key | Type | Options | Default |
|-----|------|---------|---------|
| `locks.timeout_hours` | number | 1-24 | 4 |
| `locks.conflict_log` | bool | true, false | true |

## Examples

```bash
/asdf:config git.merge_strategy merge
/asdf:config git.auto_post_review false
/asdf:config locks.timeout_hours 8
```
```

---

### If `[setting]` only (show specific value)

1. Parse setting key (e.g., `git.merge_strategy`)
2. Read from `04-operations/settings.yaml`
3. Display current value:

```markdown
**Setting: [key]**

Current value: [value]
Default: [default]
Options: [options if enum]

To change: `/asdf:config [key] [new-value]`
```

---

### If `[setting] [value]` (set value)

1. Validate setting key exists
2. Validate value is valid for setting type
3. Update `04-operations/settings.yaml`
4. Confirm change:

```markdown
**Setting Updated**

| Setting | Old Value | New Value |
|---------|-----------|-----------|
| [key] | [old] | [new] |

Saved to: `04-operations/settings.yaml`
```

**If invalid key:**
```markdown
**Invalid Setting**

Setting "[key]" not recognized.

Run `/asdf:config --list` to see available settings.
```

**If invalid value:**
```markdown
**Invalid Value**

Setting: [key]
Value: [value]
Expected: [type/options]

Valid options: [list options]
```

---

### If `--reset` (reset to defaults)

1. Confirm with user:

```markdown
**Reset Configuration?**

This will reset ALL settings to defaults:

| Setting | Current | Default |
|---------|---------|---------|
| git.provider | [current] | github |
| git.merge_strategy | [current] | squash |
| ... | ... | ... |

Options:
- **[yes]** Reset all settings
- **[no]** Cancel

What would you like to do?
```

2. If confirmed, overwrite with defaults:

```markdown
**Configuration Reset**

All settings restored to defaults.

Run `/asdf:config` to view current settings.
```

---

## Default Settings Template

```yaml
# ASDF Settings
# Location: 04-operations/settings.yaml

asdf:
  version: "4.2"

git:
  provider: github
  default_branch: main
  merge_strategy: squash
  auto_delete_branch: true
  auto_post_review: true

locks:
  timeout_hours: 4
  conflict_log: true
```

---

## Settings Reference

### git.provider

Git hosting provider for CLI commands.

| Value | CLI Tool | Commands |
|-------|----------|----------|
| `github` | `gh` | `gh pr create`, `gh pr merge` |
| `gitlab` | `glab` | `glab mr create`, `glab mr merge` |
| `bitbucket` | `bb` | (limited support) |

### git.merge_strategy

How PRs are merged.

| Value | Description | Result |
|-------|-------------|--------|
| `squash` | Squash all commits | Single commit on main |
| `merge` | Create merge commit | Merge commit preserves history |
| `rebase` | Rebase commits | Linear history, no merge commit |

### git.auto_post_review

Whether `/asdf:review` automatically posts to GitHub PR.

| Value | Behavior |
|-------|----------|
| `true` | Post review as PR comment + approval/request changes |
| `false` | Keep review local only |

### locks.timeout_hours

Hours after which a lock is considered stale and can be overridden.

| Value | Use Case |
|-------|----------|
| `2` | Fast-paced team, short tasks |
| `4` | Default, typical workday |
| `8` | Long implementation sessions |
| `24` | Multi-day features |

---

## Rules

| Rule | Description |
|------|-------------|
| Auto-create | Create settings.yaml if not exists |
| Validate | Reject invalid keys and values |
| Confirm reset | Require confirmation before reset |
| Version track | Include asdf.version in settings |

---

## --help

```
/asdf:config [setting] [value] | [--list] | [--reset]

View and manage ASDF configuration settings.

Usage:
  /asdf:config                    Show all current settings
  /asdf:config --list             List all available settings
  /asdf:config [key]              Show specific setting value
  /asdf:config [key] [value]      Set a specific value
  /asdf:config --reset            Reset all settings to defaults

Examples:
  /asdf:config                           # View all settings
  /asdf:config git.merge_strategy        # View merge strategy
  /asdf:config git.merge_strategy merge  # Change to merge commits
  /asdf:config locks.timeout_hours 8     # Increase lock timeout
  /asdf:config --reset                   # Reset to defaults

Settings file: 04-operations/settings.yaml
```
