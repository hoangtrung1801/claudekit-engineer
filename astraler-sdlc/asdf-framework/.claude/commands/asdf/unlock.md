---
description: Admin command to release stale or abandoned spec/code locks
argument-hint: [lock-name]
---

# UNLOCK: Release Stale Lock

**Lock:** $ARGUMENTS

---

## Skills Required

- **Activate:** `maintenance` (for lock management)

---

## Workflow

### Step 1: Identify Lock

```bash
# Check for lock file
ls astraler-docs/04-operations/locks/$ARGUMENTS.lock 2>/dev/null || \
ls astraler-docs/04-operations/spec-locks/$ARGUMENTS.lock 2>/dev/null
```

**If lock not found:**
```markdown
**Lock Not Found**

No lock exists for: $ARGUMENTS

Available locks:
[List all .lock files in locks/ and spec-locks/]

Type lock name to release, or `cancel` to exit.
```

---

### Step 2: Display Lock Info

```markdown
**Lock Found**

| Field | Value |
|-------|-------|
| Lock | $ARGUMENTS |
| Type | [Code | Spec] |
| Locked by | [instance-id] |
| Since | [timestamp] |
| Age | [N hours M minutes] |
| Task | [task description] |

**Status:** [Active | Stale (>4h)]

Options:
- **[release]** Force release this lock
- **[cancel]** Keep lock, exit
```

---

### Step 3: Confirm Release

On **release**:

1. **Log the override:**
   ```bash
   # Append to conflict-log.md
   echo "| $(date +%y%m%d) | $ARGUMENTS | [original-instance] | [your-instance] | Admin unlock |" >> astraler-docs/04-operations/conflict-log.md
   ```

2. **Delete lock file:**
   ```bash
   rm astraler-docs/04-operations/locks/$ARGUMENTS.lock 2>/dev/null || \
   rm astraler-docs/04-operations/spec-locks/$ARGUMENTS.lock 2>/dev/null
   ```

3. **Confirm:**
   ```markdown
   **Lock Released**

   Lock: $ARGUMENTS
   Released: [timestamp]
   Logged to: conflict-log.md

   ⚠️ If the original instance is still active, they may encounter conflicts.
   ```

---

## Lock Types

| Type | Location | Used By |
|------|----------|---------|
| Code Lock | `04-operations/locks/` | `/asdf:code` |
| Spec Lock | `04-operations/spec-locks/` | `/asdf:spec`, `/asdf:update` |

---

## Stale Lock Policy

| Age | Status | Action |
|-----|--------|--------|
| <1 hour | Active | Do not unlock without confirmation |
| 1-4 hours | Aging | Warn before unlock |
| >4 hours | Stale | Safe to unlock |

**Configurable:** Set `lock_timeout_hours` in `settings.json` (default: 4)

---

## Conflict Log Format

```markdown
# Conflict Log

| Date | Lock | Original Instance | Released By | Reason |
|------|------|-------------------|-------------|--------|
| YYMMDD | [lock-name] | [instance-id] | [releaser-id] | [reason] |
```

---

## Rules

- **Always log** — Every forced release must be logged
- **Warn on active** — Locks <4h old require explicit confirmation
- **Check before force** — Verify the original instance isn't actively working
- **Notify if possible** — If session ID known, mention in handoff

---

## Help

**Usage:** `/asdf:unlock [lock-name]`

**Arguments:**
- lock-name: Name of the lock to release (e.g., `251224-checkout`, `user-auth`)

**Behavior:**
1. Find lock file (code or spec lock)
2. Display lock info and age
3. Confirm release action
4. Log to conflict-log.md
5. Delete lock file

**Examples:**
- `/asdf:unlock 251224-checkout` — Release checkout feature lock
- `/asdf:unlock user-auth` — Release user-auth spec lock

**Related:**
- `/asdf:code` — Creates code locks
- `/asdf:spec` — Creates spec locks
- `/asdf:update` — Creates spec locks
- `/asdf` — All commands
