# Prompts System for Simple Projects

**Purpose:**  
This system is for small/medium projects (< 10 features, not too complex). Uses simple, non-tiered prompts.

---

## 🎯 When to use this system?

- Project has < 10 features
- Project is not too complex in terms of business logic
- Small team (< 5 people)
- Short timeline (< 3 months)
- No need to break down into many domains/modules

---

## 📋 Simple Workflow

```
Raw Requirements
    ↓
PRD (Business Analysis)
    ↓
SAD (Solution Architecture)
    ↓
TDD (Technical Design)
    ↓
UI Design (User Interface Design)
    ↓
Planning & Setup
    ↓
Initialization
    ↓
Implementation
```

---

## 📁 File Structure

```
simple/
├── README.md                    # This file
├── 1.prd.md                    # PRD prompt (simple)
├── 2.sad.md                    # SAD prompt (simple)
├── 3.tdd.md                    # TDD prompt (simple)
├── 4.ui-design.md              # UI Design prompt (simple)
├── 5.planning.md               # Planning prompt (simple)
├── 6.initialization.md         # Initialization prompt (simple)
├── 7.backend-implementation.md # Backend Implementation prompt (simple)
├── 8.frontend-implementation.md # Frontend Implementation prompt (simple)
└── 9.review-refactor.md        # Review & Refactor prompt (simple)
```

---

## 🚀 Quick Start

1. **Start with PRD**
   ```
   Use: simple/1.prd.md
   Input: Raw requirements from stakeholder/client
   Output: Complete PRD
   ```

2. **Continue with SAD**
   ```
   Use: simple/2.sad.md
   Input: PRD (just created)
   Output: Complete SAD
   ```

3. **Continue with TDD**
   ```
   Use: simple/3.tdd.md
   Input: PRD + SAD
   Output: Complete TDD
   ```

4. **Continue with UI Design**
   ```
   Use: simple/4.ui-design.md
   Input: PRD + SAD + TDD + Brand guidelines
   Output: Complete UI Design System
   ```

5. **Planning & Setup**
   ```
   Use: simple/5.planning.md
   Input: PRD + SAD + TDD + UI Design
   Output: Roadmap with phases breakdown
   ```

6. **Initialization**
   ```
   Use: simple/6.initialization.md
   Input: Planning + SAD + TDD
   Output: Project setup and configuration
   ```

7. **Implementation - Backend**
   ```
   Use: simple/7.backend-implementation.md
   Input: TDD + Feature requirements
   Output: Backend code
   ```

8. **Implementation - Frontend**
   ```
   Use: simple/8.frontend-implementation.md
   Input: PRD + UI Design + TDD + Backend APIs
   Output: Frontend code
   ```

9. **Review & Refactor**
   ```
   Use: simple/9.review-refactor.md
   Input: Code + PRD + TDD + UI Design
   Output: Review report + Fixed code
   ```

---

## ⚠️ When should you switch to tiered system?

If during work you notice:
- Project is more complex than expected (> 10 features)
- Need to break down into many domains/modules
- Large team and need to work on many parts in parallel
- Long timeline and need to manage by phases

→ Switch to tiered system in corresponding folders (e.g., `1.business analyst/`, `2.solution architect/`, etc.)

---

**Happy Designing! 🎨**
