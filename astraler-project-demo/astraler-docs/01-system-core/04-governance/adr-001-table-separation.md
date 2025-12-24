# ADR-001: Table Separation vs Shared Tables

> **Version:** 1.0.0
> **Status:** Under Review
> **Last Updated:** 251224
> **Decision Type:** Critical Architecture Decision

---

## 1. Context

The current database architecture uses **shared tables** (`SocialChannel`, `VideoAds`, `VideoOrganic`) with classification rules (`projectId` vs `competitorId`) to distinguish between internal (Astraler's own) and external (competitor) data.

### Problem Statement

This design has caused several issues:

1. **Complex WHERE clauses**: Every query requires `WHERE projectId IS NOT NULL AND competitorId IS NULL`
2. **Easy to forget logic**: Bugs where `source` parameter is not passed
3. **Data integrity violations**: MIXED channels with both `projectId` AND `competitorId` set
4. **Hard-to-maintain code**: Classification logic scattered everywhere
5. **Error-prone**: Easy to misapply rules → data contamination

---

## 2. Decision Drivers

- Data integrity enforcement
- Code maintainability
- Query simplicity
- Type safety
- Developer experience
- Migration complexity

---

## 3. Options Considered

### Option A: Keep Shared Tables (Quick Fix)

**Actions:**
1. Fix controller to pass `source` parameter
2. Fix MIXED channel data manually
3. Add validation to prevent MIXED channels
4. Improve error handling

**Pros:**
- No migration needed
- Quick implementation (1-2 days)
- No breaking changes

**Cons:**
- Root cause not addressed
- Still error-prone
- Complex queries remain

### Option B: Table Separation (Recommended)

**Architecture:**
```
INTERNAL (Our Data)              EXTERNAL (Competitor Data)
─────────────────               ─────────────────────────
ProjectSocialChannel            CompetitorSocialChannel
ProjectVideoAds                 CompetitorVideoAds
ProjectVideoOrganic             CompetitorVideoOrganic
```

**Pros:**
- Table name IS classification
- Impossible to mix data
- Simpler queries
- Schema-enforced integrity
- Self-documenting
- Type-safe

**Cons:**
- Migration effort required
- Breaking API changes
- Some code duplication
- 2-3 weeks timeline

---

## 4. Decision Matrix

| Criteria | Weight | Option A (Quick Fix) | Option B (Separation) |
|----------|--------|---------------------|----------------------|
| Fixes Current Bugs | High | ✅ Yes | ✅ Yes |
| Prevents Future Bugs | High | ⚠️ Partial | ✅ Yes |
| Development Time | Medium | ✅ 1-2 days | ❌ 2-3 weeks |
| Maintainability | High | ⚠️ Complex | ✅ Simple |
| Data Integrity | High | ⚠️ Can violate | ✅ Enforced |
| Breaking Changes | Medium | ✅ None | ❌ High |

---

## 5. Decision

### Short-term (This Sprint): Option A
Implement quick fixes to restore functionality immediately.

### Long-term (Next Sprint): Option B
Migrate to separate tables for better architecture.

---

## 6. Implementation Plan

### Phase 1: Quick Fix (Immediate)
- [ ] Fix controller `source` parameter
- [ ] Clean MIXED channel data
- [ ] Add validation constraints
- [ ] Improve error handling

### Phase 2: Schema Changes
- [ ] Create new Prisma schema with separate tables
- [ ] Create migration scripts
- [ ] Update services and controllers

### Phase 3: API Changes
**Internal endpoints:**
- `POST /api/projects/:projectId/channels`
- `GET /api/projects/:projectId/video-ads`

**External endpoints:**
- `POST /api/projects/:projectId/competitors/:competitorId/channels`
- `GET /api/projects/:projectId/competitors/video-ads`

### Phase 4: Data Migration
1. Create new tables
2. Migrate internal data (`projectId IS NOT NULL AND competitorId IS NULL`)
3. Migrate external data (`competitorId IS NOT NULL`)
4. Review MIXED channels case-by-case
5. Verify integrity
6. Drop old tables

### Phase 5: Frontend Updates
- Update API calls
- Remove `source` parameter logic
- Update TypeScript types

---

## 7. Consequences

### Positive
- Eliminates root cause of data integrity bugs
- Simpler, more maintainable code
- Schema-enforced data separation
- Better developer experience

### Negative
- Significant migration effort
- Breaking API changes
- Temporary code duplication

### Risks
| Risk | Mitigation |
|------|------------|
| Data loss during migration | Comprehensive backup, staged migration |
| Breaking existing integrations | Version API, maintain backward compatibility |
| Timeline overrun | Phased approach, thorough planning |

---

## 8. Related Documents

- `data-architecture.md` - Current ERD
- `database-schema-separation-proposal.md` - Detailed proposal
- System TDD - Technical implementation details

---

## 9. Open Questions

| # | Question | Impact | Status |
|---|----------|--------|--------|
| 1 | Exact timeline for Phase 2? | Planning | Open |
| 2 | Backward compatibility period? | API design | Open |
| 3 | How to handle MIXED channels? | Data migration | Open |

---

## 10. Changelog

### 251224 - v1.0.0 - Initial Draft
- Created ADR from architecture-decision-table-separation.md
- Documented options and decision matrix
- Outlined implementation plan
