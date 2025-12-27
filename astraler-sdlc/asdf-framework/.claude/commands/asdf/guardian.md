# `/asdf:guardian` — Pipeline Supervisor

**Purpose:** Full pipeline scan showing all features, their current stage, and health status.

---

## Trigger

User runs: `/asdf:guardian`

---

## Pipeline Stages

```
Spec → Code → Test → PR Local → PR Pushed → CI → Review → Merged
```

| Stage | Marker | Description |
|-------|--------|-------------|
| `SPEC` | Spec file exists, no execution file | Planning phase |
| `CODE` | Execution file exists, status: coding | Implementation in progress |
| `TEST` | Execution file status: testing | Test generation/running |
| `PR_LOCAL` | `.pr-review/` folder exists, no remote PR | PR package created locally |
| `PR_PUSHED` | Remote PR exists, pending review | Awaiting code review |
| `CI` | PR exists, CI checks running/failing | CI pipeline running |
| `REVIEW` | PR approved, ready to merge | Awaiting merge |
| `MERGED` | PR merged, execution file in completed | Done |

---

## Workflow

### Step 1: Scan Features

**Sources:**
```
1. astraler-docs/03-features/*/     → All feature specs
2. astraler-docs/04-operations/active/   → Active execution files
3. astraler-docs/04-operations/completed/ → Completed features
4. .pr-review/                       → Local PR packages
5. gh pr list --json                 → Remote PR status
```

### Step 2: Determine Stage for Each Feature

For each feature folder in `03-features/`:

```
1. Check if execution file exists in 04-operations/active/
   - No → Stage: SPEC
   - Yes → Continue

2. Check execution file status:
   - coding → Stage: CODE
   - testing → Stage: TEST
   - pr-ready → Continue

3. Check if .pr-review/[feature]/ exists:
   - No → Stage: CODE (waiting for PR)
   - Yes → Continue

4. Check if remote PR exists (gh pr list --head feature/[name]):
   - No → Stage: PR_LOCAL
   - Yes → Continue

5. Check CI status (gh pr checks):
   - Failing/Running → Stage: CI
   - Passed → Continue

6. Check review status (gh pr view --json reviews):
   - Not approved → Stage: PR_PUSHED
   - Approved → Stage: REVIEW

7. Check if in completed folder:
   - Yes → Stage: MERGED
```

### Step 3: Calculate Stale Status

**Fixed Thresholds:**

| Condition | Threshold | Alert |
|-----------|-----------|-------|
| Implemented but not synced | Any | 🟡 NOT SYNCED |
| PR created but not pushed | > 1 day | ⚠️ STALE |
| PR pushed but not reviewed | > 2 days | ⚠️ STALE |
| CI failing | > 1 day | 🔴 BLOCKED |
| Approved but not merged | > 1 day | ⚠️ STALE |
| Spec without execution | > 7 days | 💤 DORMANT |
| Coding phase | > 3 days | ⚠️ SLOW |

**Spec Status Alerts:**

| Spec Status | Stage | Alert |
|-------------|-------|-------|
| Implemented | TEST | 🟡 Not Synced — run `/asdf:sync` before `/asdf:test` |
| Implemented | PR_LOCAL+ | 🟡 Not Synced — sync spec before PR review |

### Step 4: Calculate Health Score

```
Health Score = (Non-stale features / Total active features) × 100

Ratings:
  90-100%: 🟢 Healthy
  70-89%:  🟡 Attention Needed
  50-69%:  🟠 At Risk
  < 50%:   🔴 Critical
```

### Step 5: Present Report

---

## Output Format

```
ASDF GUARDIAN — Pipeline Status
═══════════════════════════════════════════════════════════════════════

Health Score: 85% 🟢 Healthy
Active Features: 8 | Stale: 2 | Blocked: 1 | Unsynced: 1

PIPELINE VIEW
─────────────────────────────────────────────────────────────────────────
Stage      │ Feature                    │ Spec Status │ Age    │ Status
─────────────────────────────────────────────────────────────────────────
SPEC       │ 251230-wishlist            │ Draft       │ 2d     │ ✓ Planning
           │ 251229-notifications       │ Approved    │ 8d     │ 💤 Dormant
─────────────────────────────────────────────────────────────────────────
CODE       │ 251228-payment-retry       │ Approved    │ 1d     │ ✓ In Progress
           │ 251227-user-profile        │ Implemented │ 4d     │ ⚠️ Slow
─────────────────────────────────────────────────────────────────────────
TEST       │ 251226-checkout-flow       │ Synced      │ 1d     │ ✓ Testing
           │ 251225-order-refund        │ Implemented │ 1d     │ 🟡 Not Synced
─────────────────────────────────────────────────────────────────────────
PR_LOCAL   │ 251224-inventory           │ Synced      │ 2d     │ ⚠️ Stale (not pushed)
─────────────────────────────────────────────────────────────────────────
PR_PUSHED  │ 251223-order-history       │ Synced      │ 1d     │ ✓ Awaiting Review
─────────────────────────────────────────────────────────────────────────
CI         │ 251222-discount-codes      │ Synced      │ 2d     │ 🔴 Blocked (CI failing)
─────────────────────────────────────────────────────────────────────────
REVIEW     │ 251221-guest-checkout      │ Synced      │ 0d     │ ✓ Ready to Merge
─────────────────────────────────────────────────────────────────────────
MERGED     │ 251220-cart-persistence    │ Synced      │ —      │ ✓ Complete
           │ 251218-product-search      │ Synced      │ —      │ ✓ Complete
═══════════════════════════════════════════════════════════════════════

SPEC STATUS LEGEND
─────────────────────────────────────────────────────────────────────────
Draft → Review → Approved → Implemented → Synced
                            ↑               ↑
                         /asdf:code      /asdf:sync

ALERTS (4)
─────────────────────────────────────────────────────────────────────────
🟡 251225-order-refund     │ Implemented not synced │ /asdf:sync before tests
⚠️  251229-notifications    │ Dormant 8 days         │ /asdf:code or archive
⚠️  251224-inventory        │ PR not pushed 2 days   │ /asdf:pr --push
🔴 251222-discount-codes   │ CI failing 2 days      │ Fix failing tests
─────────────────────────────────────────────────────────────────────────

RECOMMENDATIONS
─────────────────────────────────────────────────────────────────────────
1. Sync before testing: /asdf:sync order-refund (then /asdf:test)
2. Merge approved PR: /asdf:merge guest-checkout
3. Push stale PR: /asdf:pr inventory --push
4. Fix CI: Check 251222-discount-codes test failures
5. Archive or start: 251229-notifications (dormant 8d)
─────────────────────────────────────────────────────────────────────────

Last scan: 2025-12-26 14:30:00
```

---

## Quick Reference

| Icon | Meaning |
|------|---------|
| ✓ | On track |
| 🟡 | Not synced — run `/asdf:sync` |
| ⚠️ | Stale — needs attention |
| 🔴 | Blocked — action required |
| 💤 | Dormant — no activity |

---

## Flags

| Flag | Purpose |
|------|---------|
| `--json` | Output as JSON for tooling |
| `--stage [STAGE]` | Filter by specific stage |
| `--stale` | Show only stale/blocked features |

---

## Examples

### Full Scan
```
/asdf:guardian
```

### Show Only Stale Items
```
/asdf:guardian --stale
```

### Filter by Stage
```
/asdf:guardian --stage PR_PUSHED
```

### JSON Output
```
/asdf:guardian --json
```

---

## Data Model

```yaml
feature:
  name: "251226-payment-retry"
  spec_path: "03-features/251226-payment-retry/"
  execution_path: "04-operations/active/251226-payment-retry.md"
  pr_package: ".pr-review/251226-payment-retry/"
  stage: "PR_PUSHED"
  age_days: 2
  status: "stale"
  alert: "PR not reviewed in 2 days"
  pr:
    number: 47
    url: "https://github.com/..."
    ci_status: "passing"
    review_status: "pending"
```

---

## Integration with Other Commands

| After Guardian Shows | Run Command |
|---------------------|-------------|
| Dormant spec | `/asdf:code [spec]` or archive manually |
| Slow coding | Check blockers, continue implementation |
| PR not pushed | `/asdf:pr [feature] --push` |
| CI failing | Fix tests, push again |
| Not reviewed | Wait or request review |
| Ready to merge | `/asdf:merge [feature]` |

---

## Automation Hooks

Guardian can be triggered automatically:
- Start of session (with `/asdf:onboard`)
- Weekly via cron job
- Before `/asdf:handoff` to capture state
