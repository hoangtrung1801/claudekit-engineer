# Spec Validation Rules

## Required Sections

Every feature specification MUST have:

| Section | Purpose | Validation |
|---------|---------|------------|
| Overview | Business context | Non-empty, explains "why" |
| Requirements | What to build | At least 1 functional requirement |
| Technical Design | How to build | Architecture decisions documented |
| Acceptance Criteria | Definition of done | At least 1 testable criterion |
| Status | Progress tracking | All checkboxes present |

## Quality Standards

### Requirements Quality
- MUST be specific, not vague
- MUST be testable/verifiable
- SHOULD use consistent language (MUST/SHOULD/MAY)
- MUST NOT conflict with other requirements

### Technical Design Quality
- MUST reference existing architecture
- MUST identify dependencies
- SHOULD include data flow description
- MAY include code snippets for clarity

### Acceptance Criteria Quality
- MUST be binary (pass/fail)
- MUST be objectively testable
- SHOULD cover happy path and error cases
- MUST NOT include implementation details

## Hierarchy Rules

### Tier 1 (system-core/)
- **Modification**: Requires architect approval
- **Validation**: Changes must not break existing features
- **Format**: Must maintain stable structure

### Tier 2 (domains/)
- **Modification**: Impact assessment required
- **Validation**: Cross-domain dependencies checked
- **Format**: Business logic clearly separated

### Tier 3 (features/)
- **Modification**: Can be updated via reverse sync
- **Validation**: Must comply with Tier 1 & 2
- **Format**: Standard spec template required

### Tier 4 (operations/)
- **Modification**: Freely updatable
- **Validation**: Timestamps required
- **Format**: Session-oriented structure

## Common Validation Failures

1. **Missing Dependencies**: Feature requires module not documented
2. **Conflicting Requirements**: Two specs define same behavior differently
3. **Untestable Criteria**: "Should be fast" instead of "Response < 200ms"
4. **Orphan Features**: No connection to domain or system-core
5. **Stale Status**: Status doesn't reflect actual implementation state
