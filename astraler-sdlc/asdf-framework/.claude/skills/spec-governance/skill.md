---
name: spec-governance
description: Enforce spec-driven development standards, validate specifications, and ensure documentation quality.
---

# Spec Governance Skill

Ensure all specifications meet ASDF quality standards and properly govern the development process.

## When to Use

Activate this skill when:
- Creating new feature specifications (`/asdf:spec`)
- Validating existing specs before implementation
- Reviewing spec completeness after updates
- Checking spec-code alignment

## Core Responsibilities

### 1. Spec Validation

Verify every spec contains required sections:
- [ ] Overview with business context
- [ ] Requirements (functional/non-functional)
- [ ] Technical design
- [ ] Acceptance criteria
- [ ] Status tracking

### 2. Quality Enforcement

Check specifications for:
- **Completeness**: All required sections present
- **Clarity**: Unambiguous requirements
- **Testability**: Acceptance criteria are verifiable
- **Consistency**: Aligned with `system-core/` rules

### 3. Hierarchy Compliance

Ensure proper tier relationships:
```
system-core/ → Cannot be modified without architect approval
domains/     → Changes require impact assessment
features/    → Can be updated via reverse sync
operations/  → Freely updatable by AI
```

### 4. Change Tracking

All spec modifications must:
- Include `[YYMMDD]` timestamp
- Reference reason for change
- Update relevant changelogs

## Validation Checklist

```markdown
## Spec Validation: [Feature Name]

### Structure
- [ ] Title and overview present
- [ ] Requirements section complete
- [ ] Technical design documented
- [ ] UI/UX defined (if applicable)
- [ ] Acceptance criteria listed
- [ ] Status section present

### Quality
- [ ] No ambiguous requirements
- [ ] Dependencies documented
- [ ] Constraints identified
- [ ] Edge cases considered

### Compliance
- [ ] Follows `system-core/` guidelines
- [ ] Aligned with `domains/` logic
- [ ] No conflicts with other features
- [ ] Changelog updated

### Result
[PASS/FAIL] - [Notes]
```

## Integration Points

Load reference files:
- `references/validation-rules.md` - Detailed validation criteria
- `references/template-spec.md` - Standard spec template

## Output

After validation, report:
```
Spec Governance Check: [Feature Name]

Status: [PASS/FAIL/NEEDS REVIEW]

Issues Found: [N]
- [Issue 1]
- [Issue 2]

Recommendations:
- [Action items]

Changelog updated: [Yes/No]
```
