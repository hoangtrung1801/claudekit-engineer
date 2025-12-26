---
description: Merge PR after approval with cleanup
argument-hint: [feature-name] [--strategy=squash|merge|rebase]
---

# Merge PR

**Feature:** $ARGUMENTS

**Flags:**
- `--strategy=squash` — Squash and merge (default)
- `--strategy=merge` — Create merge commit
- `--strategy=rebase` — Rebase and merge

---

## Skills Required

- **Activate:** `pr-review` (for PR verification)
- **Activate:** `context-loading` (for execution file handling)

---

## Workflow

### Step 1: Locate PR

1. Extract feature name from $ARGUMENTS
2. Find PR package at `.pr-review/*-[feature-name]/`
3. Get current branch: `git branch --show-current`

**Check for open PR:**
```bash
gh pr view --json number,state,title,mergeable,reviews,statusCheckRollup
```

**If no PR found:**
```markdown
**PR Not Found**

No open PR found for feature "$ARGUMENTS".

Options:
- Create PR first: `/asdf:pr $ARGUMENTS --push`
- Check feature name spelling
- Verify you're on the correct branch
```

---

### Step 2: Check Approval Status

**Parse reviews from PR:**
```bash
gh pr view --json reviews --jq '.reviews[-1].state'
```

**Approval states:**

| State | Action |
|-------|--------|
| APPROVED | Proceed to merge |
| CHANGES_REQUESTED | Block merge |
| PENDING | Warn, offer to proceed |
| No reviews | Warn, offer to proceed |

**If not approved:**
```markdown
**⚠️ PR Not Approved**

PR #[number]: [title]
Status: [CHANGES_REQUESTED | PENDING | No reviews]

Last review: [reviewer] — [state]

Options:
- **[wait]** Wait for approval
- **[force]** Merge anyway (not recommended)
- **[review]** Run AI review: `/asdf:review`

What would you like to do?
```

**If approved:**
```markdown
**PR Approved**

PR #[number]: [title]
Approved by: [reviewer(s)]

Proceeding to CI check...
```

---

### Step 3: Check CI Status

**Get CI status:**
```bash
gh pr checks --json name,state,conclusion
```

**CI states:**

| State | Action |
|-------|--------|
| All PASS | Proceed to merge |
| Any FAIL | Block merge |
| PENDING | Wait or warn |
| No checks | Warn, proceed |

**If CI failing:**
```markdown
**❌ CI Checks Failing**

PR #[number]: [title]

| Check | Status | Conclusion |
|-------|--------|------------|
| [name] | [state] | [conclusion] |

Options:
- **[wait]** Wait for CI to pass
- **[details]** View failure details
- **[force]** Merge anyway (DANGER)

What would you like to do?
```

**If CI passing:**
```markdown
**CI Checks Passing**

| Check | Status |
|-------|--------|
| [name] | ✓ PASS |

Proceeding to merge...
```

---

### Step 4: Execute Merge

**Get merge strategy:**
1. From `--strategy` flag if provided
2. From settings (`04-operations/settings.yaml` → `git.merge_strategy`)
3. Default: `squash`

**Execute merge:**
```bash
# Squash (default)
gh pr merge [PR-number] --squash --delete-branch

# Merge commit
gh pr merge [PR-number] --merge --delete-branch

# Rebase
gh pr merge [PR-number] --rebase --delete-branch
```

**If merge successful:**
```markdown
**PR Merged Successfully**

PR #[number]: [title]
Strategy: [squash | merge | rebase]
Merged to: [base-branch]

Remote branch deleted: [branch-name]

Proceeding to cleanup...
```

**If merge conflict:**
```markdown
**❌ Merge Conflict**

PR #[number] cannot be merged due to conflicts.

Options:
- **[resolve]** Pull latest and resolve conflicts locally
- **[abort]** Cancel merge

To resolve manually:
1. `git fetch origin main`
2. `git rebase origin/main` (or merge)
3. Resolve conflicts
4. `git push --force-with-lease`
5. Re-run `/asdf:merge $ARGUMENTS`
```

---

### Step 5: Local Cleanup

**After successful merge:**

1. **Switch to main branch:**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Delete local feature branch:**
   ```bash
   git branch -d [feature-branch]
   ```

3. **Archive PR package:**
   ```bash
   mkdir -p .pr-review/archived/
   mv .pr-review/*-[feature-name]/ .pr-review/archived/
   ```

4. **Update execution file:**
   - Move: `04-operations/active/[feature].md` → `04-operations/completed/[feature].md`
   - Add merge info to completed file

5. **Release lock (if exists):**
   - Delete: `04-operations/locks/[feature].lock`

---

### Step 6: Present Result

```markdown
**Merge Complete**

## Summary

| Item | Status |
|------|--------|
| PR Merged | ✓ #[number] |
| Strategy | [squash/merge/rebase] |
| Remote Branch | ✓ Deleted |
| Local Branch | ✓ Deleted |
| PR Package | ✓ Archived |
| Execution File | ✓ Moved to completed |
| Lock | ✓ Released |

## Merged PR

- **Title:** [title]
- **Base:** [main]
- **Commits:** [N] commits squashed
- **URL:** [PR URL]

## Next Steps

- View merged code: `git log -1`
- Start next feature: `/asdf:spec [next-feature]`
- Check project status: `/asdf:status`
```

---

## Merge Strategy Reference

| Strategy | When to Use | Result |
|----------|-------------|--------|
| `squash` | Default, clean history | Single commit on main |
| `merge` | Preserve all commits | Merge commit created |
| `rebase` | Linear history | Commits replayed on main |

---

## Rules

| Rule | Description |
|------|-------------|
| Approval Required | Default requires at least 1 approval |
| CI Must Pass | Default requires all CI checks pass |
| Auto-Cleanup | Always delete branch and archive package |
| Lock Release | Always release lock after merge |
| Force Merge | Available but not recommended |

---

## --help

```
/asdf:merge [feature-name] [--strategy=squash|merge|rebase]

Merge an approved PR with automatic cleanup.

Arguments:
  feature-name    Name of the feature to merge

Flags:
  --strategy      Merge strategy: squash (default), merge, rebase

Examples:
  /asdf:merge user-auth
  /asdf:merge checkout-flow --strategy=merge

Prerequisites:
  - PR must exist on GitHub
  - PR should be approved (warns if not)
  - CI checks should pass (warns if not)

What it does:
  1. Verifies PR approval status
  2. Checks CI status
  3. Merges PR with chosen strategy
  4. Deletes remote and local branches
  5. Archives PR package
  6. Moves execution file to completed
  7. Releases any locks
```
