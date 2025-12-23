# Common Reverse Sync Patterns

## Pattern 1: Technical Approach Change

**Scenario**: Implemented different technology than spec planned

**Example**:
- Spec: "Use localStorage for caching"
- Implementation: "Using IndexedDB for larger storage needs"

**Sync Action**:
```markdown
<!-- Original: Use localStorage for caching -->
Uses IndexedDB for caching, supporting larger datasets and
better query performance. [RS-Improved: YYMMDD]
```

## Pattern 2: API Contract Modification

**Scenario**: API endpoint differs from spec

**Example**:
- Spec: `GET /api/users/{id}`
- Implementation: `GET /api/v2/users/{id}?include=profile`

**Sync Action**:
```markdown
## API Contract

<!-- Original: GET /api/users/{id} -->
### Get User
`GET /api/v2/users/{id}?include=profile`

Changed to v2 API with optional profile inclusion for
frontend performance optimization. [RS-Improved: YYMMDD]
```

## Pattern 3: UI Flow Adjustment

**Scenario**: User flow changed during implementation

**Example**:
- Spec: "3-step wizard"
- Implementation: "2-step wizard (combined steps 2 and 3)"

**Sync Action**:
```markdown
## User Flow

<!-- Original: 3-step wizard (1. Info, 2. Options, 3. Confirm) -->
2-step wizard combining options and confirmation for
better user experience:
1. Enter information
2. Review options and confirm

UX testing showed combined flow reduced drop-off. [RS-Improved: YYMMDD]
```

## Pattern 4: Error Handling Addition

**Scenario**: Added error cases not in spec

**Example**:
- Spec: Silent on network errors
- Implementation: Retry logic with fallback

**Sync Action**:
```markdown
## Error Handling

[Not in original spec - Added during implementation]

### Network Errors
- Automatic retry (3 attempts, exponential backoff)
- Fallback to cached data if available
- User notification after all retries fail

[RS-Discovery: YYMMDD]
```

## Pattern 5: Performance Constraint

**Scenario**: External constraint changed approach

**Example**:
- Spec: "Load all items on page load"
- Implementation: "Paginated loading due to data volume"

**Sync Action**:
```markdown
## Data Loading

<!-- Original: Load all items on page load -->
Paginated loading (50 items per page) with infinite scroll.

Changed due to dataset size (10k+ items) causing
unacceptable load times. [RS-Constrained: YYMMDD]
```

## Pattern 6: Security Fix

**Scenario**: Security issue required design change

**Example**:
- Spec: "Store token in localStorage"
- Implementation: "HttpOnly cookie for token storage"

**Sync Action**:
```markdown
## Authentication

<!-- Original: Store JWT in localStorage -->
JWT stored in HttpOnly cookie to prevent XSS token theft.

Security review identified localStorage vulnerability.
[RS-Fixed: YYMMDD]
```

## Anti-Patterns (What NOT to do)

### Don't Delete Original Intent
❌ Wrong:
```markdown
Uses GraphQL for data fetching.
```

✅ Right:
```markdown
<!-- Original: Uses REST API -->
Uses GraphQL for data fetching. [RS-Improved: YYMMDD]
```

### Don't Skip Changelog
❌ Wrong: Update spec without recording change
✅ Right: Always create changelog entry

### Don't Over-Sync
❌ Wrong: Update spec for every minor code detail
✅ Right: Only sync design-level changes
