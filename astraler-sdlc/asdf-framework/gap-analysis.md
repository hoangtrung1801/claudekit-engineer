# ASDF Framework Gap Analysis

> **Purpose**: Compare ideal spec output (`astraler-docs/`) against current framework to identify what's missing or insufficient.

---

## 1. Executive Summary

The current `Approach-1-ASDF-Master-Blueprint.md` provides a **conceptual foundation** but lacks the **structural enforcement** and **templates** needed for consistent execution.

| Aspect | Current State | Ideal State | Gap |
|--------|---------------|-------------|-----|
| Philosophy | ✅ Defined | ✅ Defined | None |
| Directory Structure | ⚠️ Outlined | ✅ Detailed | Templates missing |
| File Templates | ❌ None | ✅ Complete | **Critical gap** |
| Required Sections | ❌ Undefined | ✅ Strict schema | **Critical gap** |
| Enforcement | ❌ None | ✅ Hooks + validation | **Critical gap** |
| Cross-references | ⚠️ Mentioned | ✅ Explicit links | Partial |

---

## 2. Structural Gaps

### 2.1 System-Core Tier

**Current Framework Says:**
```
01-system-core/
├── master-map.md
├── ui-ux-design-system.md
└── project-status.md
```

**Ideal Output Has:**
```
01-system-core/
├── master-map.md           # Project DNA, architecture
├── ui-ux-design-system.md  # Complete design tokens
├── project-status.md       # Live heartbeat
├── coding-standards.md     # ⚠️ MISSING from blueprint
└── security-policy.md      # ⚠️ MISSING from blueprint
```

**Gap**: Blueprint doesn't specify coding standards or security policy as required system-core documents.

---

### 2.2 Domains Tier

**Current Framework Says:**
```
02-domains/
└── ...  (empty, no guidance)
```

**Ideal Output Has:**
```
02-domains/
├── authentication/auth-domain.md
├── payments/payments-domain.md
├── orders/orders-domain.md
└── notifications/notifications-domain.md
```

**Gap**: Blueprint provides **zero guidance** on domain documentation structure. No template, no required sections, no examples.

---

### 2.3 Features Tier

**Current Framework Says:**
```
03-features/
└── ...  (empty, no guidance)
```

**Ideal Output Has:**
```
03-features/
└── YYMMDD-feature-name/
    ├── spec.md        # Full specification
    ├── changelog.md   # Change history
    └── [api-contract.md]  # Optional
```

**Gap**: Blueprint mentions features but provides **no template** for what a feature spec should contain.

---

### 2.4 Operations Tier

**Current Framework Says:**
```
04-operations/
├── implementation-active.md
├── session-handoff.md
└── changelog/
```

**Ideal Output Has:**
Same structure, but with **defined schemas** for each file.

**Gap**: Structure matches, but **content format undefined**.

---

## 3. Template Gaps

### 3.1 Feature Spec Template

**Current**: Non-existent
**Required**:

```markdown
# [Feature Name]

> **Feature ID**: YYMMDD-feature-name
> **Status**: [Draft|In Progress|Complete]
> **Last Updated**: YYMMDD

## 1. Overview
[Business context, value proposition]

## 2. Requirements
### 2.1 Functional (MUST)
- [ ] FR-001: [Requirement]

### 2.2 Non-Functional (SHOULD)
- [ ] NFR-001: [Requirement]

### 2.3 Out of Scope
- [Explicitly excluded]

## 3. Technical Design
### 3.1 Architecture
[Diagram, key decisions]

### 3.2 Key Files
[File paths]

## 4. UI/UX
[Wireframes, states, flows]

## 5. API Contract
[Endpoints, request/response]

## 6. Acceptance Criteria
- [ ] AC-001: Given/When/Then

## 7. Changelog
[Date, change, by]
```

---

### 3.2 Domain Spec Template

**Current**: Non-existent
**Required**:

```markdown
# [Domain Name] Domain

## 1. Domain Purpose
[Single responsibility]

## 2. Business Rules
| Rule ID | Rule | Enforcement |
|---------|------|-------------|

## 3. Entities
[TypeScript interfaces]

## 4. State Machine
[State diagrams]

## 5. Integration Points
[Inbound/Outbound events]

## 6. API Contracts
[Endpoints by role]

## 7. Error Codes
[Domain-specific errors]
```

---

### 3.3 System-Core Templates

**Missing Templates For:**
- `master-map.md` - What sections are required?
- `ui-ux-design-system.md` - What must be defined?
- `coding-standards.md` - Not mentioned at all
- `security-policy.md` - Not mentioned at all
- `project-status.md` - What metrics to track?

---

## 4. Enforcement Gaps

### 4.1 No Validation Rules

**Current**: Trust-based (human discipline)
**Required**:

| Validation | Purpose |
|------------|---------|
| Spec has all required sections | Completeness |
| Requirements are checkboxes | Trackability |
| Acceptance criteria are testable | Quality |
| Status field is current | Accuracy |
| Changelog has recent entry | Audit trail |

---

### 4.2 No Hooks/Commands

**Current**: Pseudo-commands mentioned but not implemented
**Required**:

| Command | Validation |
|---------|------------|
| `/asdf:spec` | Must create file matching template |
| `/asdf:implement` | Must verify spec exists and is approved |
| `/asdf:sync` | Must detect all divergences |
| `/asdf:status` | Must scan all features for metrics |

---

### 4.3 No Cross-Reference Enforcement

**Current**: Manual
**Required**:
- Feature specs MUST link to domain
- Domain specs MUST link to system-core
- All changes MUST update changelog

---

## 5. Content Depth Gaps

### 5.1 Master Map Insufficient

**Current Blueprint Section**:
> "Bản đồ gene dự án" (Project gene map)

**Ideal Content Required**:
- Project identity (name, type, stage)
- Technical architecture diagram
- Technology stack with rationale
- Module dependency graph
- Integration points
- Environment configuration
- Non-functional requirements
- Decision log
- Technical debt register

---

### 5.2 Design System Insufficient

**Current**: "Kinh thánh UI/UX" (UI/UX Bible)

**Ideal Content Required**:
- Color palette (with CSS variables)
- Typography scale
- Spacing system
- Border radius tokens
- Shadow tokens
- Component specifications
- Interaction patterns
- Motion guidelines
- Accessibility standards

---

### 5.3 Project Status Insufficient

**Current**: "Trạng thái tổng thể" (Overall status)

**Ideal Content Required**:
- Executive summary with health indicator
- Feature progress by status
- Domain implementation status
- Technical health metrics
- Active blockers with escalation
- Risk register
- Recent activity log
- Upcoming milestones
- Session notes

---

## 6. Reverse Sync Gaps

### 6.1 No Annotation Standard

**Current**: Mentioned but undefined
**Required**:

```markdown
[Reverse Synced: YYMMDD]      # Standard
[RS-Improved: YYMMDD]         # Code better than spec
[RS-Constrained: YYMMDD]      # External limitation
[RS-Fixed: YYMMDD]            # Bug fix changed behavior
```

---

### 6.2 No Deviation Tracking

**Current**: Not specified
**Required**:
- Track all spec-code divergences
- Classify deviation type
- Log in feature changelog
- Log in operations changelog
- Update project-status.md

---

## 7. Priority Recommendations

### Critical (Must Fix)

1. **Create Feature Spec Template**
   - Define all required sections
   - Provide example content
   - Enforce via validation

2. **Create Domain Spec Template**
   - Define business rule format
   - Define entity schema format
   - Define integration point format

3. **Add System-Core Templates**
   - Master-map sections
   - Design system tokens
   - Coding standards (new)
   - Security policy (new)

4. **Implement Enforcement**
   - Spec validation hook
   - Required section checker
   - Cross-reference validator

### High (Should Fix)

5. **Define Operations Schemas**
   - Implementation-active format
   - Session-handoff format
   - Changelog entry format

6. **Standardize Annotations**
   - Reverse sync markers
   - Status indicators
   - Blocker references

### Medium (Could Fix)

7. **Add Examples**
   - Sample completed feature
   - Sample domain spec
   - Sample session handoff

8. **Documentation**
   - Workflow diagrams
   - Decision trees
   - Troubleshooting guide

---

## 8. Recommended New Files

Add to ASDF framework:

```
asdf-framework/
├── templates/
│   ├── feature-spec.template.md
│   ├── domain-spec.template.md
│   ├── master-map.template.md
│   ├── design-system.template.md
│   ├── coding-standards.template.md
│   ├── security-policy.template.md
│   ├── project-status.template.md
│   ├── implementation-active.template.md
│   ├── session-handoff.template.md
│   └── changelog-entry.template.md
├── validation/
│   ├── spec-schema.json
│   └── required-sections.json
└── examples/
    └── astraler-docs/  ← (what we just created)
```

---

## 9. Conclusion

The current ASDF blueprint is **60% philosophy, 40% structure** when it should be **20% philosophy, 80% structure**.

**What exists**: Good conceptual foundation
**What's missing**: Enforceable templates, validation rules, concrete examples

The `astraler-docs/` folder created in this session serves as the **reference implementation** showing what mature ASDF output should look like.

---

**Next Step**: Use this gap analysis to upgrade the framework with proper templates and enforcement mechanisms.
