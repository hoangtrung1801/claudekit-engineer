# Code Audit Request

**Role:** Senior Software Engineer / Technical Auditor

**Scope:** `<MODULE_OR_CONTEXT>`

---

## Audit Objectives

Analyze the specified scope and deliver findings for:

### 1. Feature Inventory
- Identify all features/functionalities present in the codebase
- Classify each: ✅ Implemented | 🚧 In Progress | ❌ Not Implemented
- Group by logical domain or use case

### 2. Configuration Audit
- Document all configuration requirements (env vars, dependencies, external services)
- Outline setup steps for a new developer to run this module

### 3. Gap Analysis & Risk
- Identify gaps: missing code, config, documentation, or tests
- Assess risk level for each gap: Critical / High / Medium / Low
- Provide actionable recommendations

---

## Audit Principles

1. **Evidence-based:** All findings must reference actual code or files
2. **No assumptions:** State unknowns explicitly rather than inferring
3. **Codebase-first:** Follow existing conventions; do not suggest alternatives

---

## Output Format

Structure your response with clear headings. Use tables or lists as appropriate for readability.

> Replace `<MODULE_OR_CONTEXT>` with target scope