---
description: SYNC MODE - Reverse sync code changes back to specs with confirmation
argument-hint: [feature-path] (optional)
---

# SYNC MODE: Reverse Sync

**Target:** $ARGUMENTS (or scan all active features if blank)

---

## Skills Required

- **Activate:** `reverse-sync` (for sync protocol)
- **Activate:** `refinement-loop` (for confirmation)
- **Activate:** `impact-analysis` (for detecting related docs)

---

## Workflow

### Step 1: Identify Scope

1. If path provided: sync that specific feature
2. If blank: check `astraler-docs/04-operations/implementation-active.md` for active work
3. List features to sync

---

### Step 2: Compare Code vs Spec

For each feature in scope:

1. Read current spec from `astraler-docs/03-features/[feature]/spec.md`
2. Note spec version (e.g., v1.2.0)
3. Analyze actual implementation in codebase
4. Identify deviations:
   - **Additions** — Code has features not in spec
   - **Changes** — Implementation differs from spec
   - **Removals** — Spec features not implemented

---

### Step 2.5: Impact Analysis (Related Docs)

**Scan for related documentation that may need updating:**

1. **Scan 01-system-core/** for references to changed items:
   - Entity/model changes → `data-architecture.md`
   - API changes → `api-standards.md`
   - New dependencies → `tech-stack.md`
   - Config changes → `infrastructure.md`
   - Security changes → `security-policy.md`

2. **Scan 02-domains/** for affected domain specs:
   - Changed entities → domain spec updates
   - Modified business rules → domain logic updates

**Impact Detection:**

| Change Type | Scan For | Files Affected |
|-------------|----------|----------------|
| Entity changed | References in 02-domains/, data-architecture.md | HIGH |
| API endpoint changed | References in api-standards.md, domain specs | MEDIUM |
| New dependency added | tech-stack.md | LOW |
| Config changed | infrastructure.md | LOW |

**Present impact if found:**

```markdown
**Impact Detected**

Changes in [feature-name] may affect these files:

| File | Reason | Severity |
|------|--------|----------|
| 02-domains/auth/domain.md | User entity changed | HIGH |
| 01-system-core/data-architecture.md | Schema changed | MEDIUM |

Options:
- **[feature-only]** Sync feature spec only
- **[include-impact]** Sync all affected files (recommended)
- **[review]** Review each file individually
- **[cancel]** Abort
```

**If [include-impact] selected:**
- Add affected files to sync scope
- Apply same sync process to each affected file
- Track all files updated in completion report

---

### Step 3: Present Sync Preview

```markdown
**Sync Preview for [Feature Name]**

Current spec version: v[X.Y.Z]

**Deviations Found:**

| # | Type | Section | Spec Says | Code Does | Reason |
|---|------|---------|-----------|-----------|--------|
| 1 | Change | API | POST /users | POST /api/v1/users | Added versioning |
| 2 | Addition | - | Not specified | Rate limiting | Security |
| 3 | Removal | UI | Wizard flow | Single form | Simplified UX |

**Proposed spec update:** v[X.Y.+1]

Please choose:
- **Feedback** — Type your changes to the sync
- **Confirm** — Type `confirm` to apply sync
- **Cancel** — Type `cancel` to abort
```

---

### Step 4: On Confirm — Apply Sync

For each deviation:

1. **Update spec section:**
   ```markdown
   ### [Section Name]

   <!-- Original (v1.2.0): [what spec said] -->
   [What was actually implemented]

   **Reason:** [Why the change was necessary]
   [Reverse Synced: YYMMDD]
   ```

2. **Increment spec version** (minor bump: X.Y.+1)

3. **Update changelog:**
   ```markdown
   ### YYMMDD - Reverse Sync (v[X.Y.Z])

   - [Section]: [Change description]
   - [Section]: [Change description]
   - Reason: [Brief explanation]
   ```

---

### Step 5: Update Spec Status & Report

After applying sync:

1. **Update spec status to "Synced"** in spec header:
   ```markdown
   > **Version:** X.Y.Z+1
   > **Status:** Synced ← (changed from Implemented)
   > **Last Updated:** YYMMDD
   ```

2. **Present completion report:**

```markdown
**Sync Complete**

- **Feature:** [feature-name]
- **Previous Version:** v[X.Y.Z]
- **New Version:** v[X.Y.Z+1]
- **Spec Status:** Synced ← (updated from Implemented)
- **Sections Updated:** [N]

**Feature Spec Changes:**
- [Section]: [What changed]
- [Section]: [What changed]

**Related Docs Updated:** [if include-impact selected]
| File | Changes | New Version |
|------|---------|-------------|
| 02-domains/auth/domain.md | User entity updated | v1.3.0 |
| 01-system-core/data-architecture.md | Schema updated | v1.2.0 |

All specs now accurately reflect implementation.

**Next steps:**
- Run `/asdf:test` to generate/update tests from synced spec
- Run `/asdf:pr` to create PR for review
```

---

## Audit Trail Format

Preserve original text in HTML comments:

```markdown
## 3. Technical Design

### API Endpoint

<!-- Original (v1.0.0): POST /users with email, password -->
POST /api/v1/users with email, password, and optional phone

**Reason:** Added API versioning and optional phone field for 2FA
[Reverse Synced: 251224]
```

---

## When to Trigger

- After implementation deviates from spec (called from `/asdf:code`)
- When discovering code-spec drift during review
- Before session handoff to ensure docs are current
- After bug fixes that reveal spec inaccuracies

---

## Rules

- **Always preview first** — Show what will change before applying
- **Always confirm** — Never apply sync without explicit confirm
- **Truth over convenience** — Document what IS, not what should be
- **Preserve history** — Use HTML comments for original text
- **Explain why** — Every change needs a reason
- **Version track** — Increment spec version on sync
- **Atomic updates** — Sync one feature at a time for clarity
