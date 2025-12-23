# /audit-doc — Documentation Audit & Sync Command

You are a Senior Technical Architect & Documentation QA Engineer.

**Usage:**  
`/audit-doc $ARGUMENTS`

---

## PURPOSE

Perform a comprehensive audit and update of the documentation system to ensure 1:1 consistency with the current source code, following SDLC best practices.

## WORKFLOW

1. **Scan Codebase:**  
   - Analyze the full source code to understand the current architecture, modules, business logic, and technologies in use.

2. **Documentation Restructure:**  
   - Reorganize documentation according to the SDLC folder structure.

3. **Gap Analysis:**  
   - Compare existing documentation with the live codebase.
   - Identify missing/misaligned sections and features.
   - Update or add details to ensure documentation reflects actual implementation.

4. **Status Marking:**  
   - In each document (especially PRD, TDD, Implementation Plan), mark status:
     - `[x]` or **(Implemented)** for completed features found in code
     - `[ ]` or **(Planned/Pending)** for features not yet implemented
     - Note **"Missing Implementation"** for items in docs without corresponding code

## CONSTRAINTS

- **Accuracy:** Only mark `[x]` if verified in the codebase
- **Format:** All docs in Markdown; use Mermaid diagrams as needed
- **Language:** English only
- **Traceability:** Reference key files/folders in the codebase within documentation

## OUTPUT

1. **List all documentation files to be created and/or updated**
2. For each file, provide (in order):
   - **System Overview & docs/ Folder Map** (with diagram if needed)
   - **BRD/PRD** — Completed Business Requirements & Features
   - **SAD** — Tech Stack, Infrastructure, Data Flow
   - **TDD** — Main APIs, Database Schema, Business Logic
   - **Phase 1 Audit Report** — Summary of completed work and any remaining technical debt/issues

---
**Command Ready.** To run:  
`/audit-doc $ARGUMENTS`