# Tiered TDD System for Large Projects

This system helps you handle large projects by breaking them down into Technical Design Documents (TDD) at different levels.

## 📁 File Structure

```
3.technical-design/
├── 0.master.md              # Master orchestrator - System usage guide
├── 1.system-overview-tdd.md # Level 1: System Overview TDD
├── 2.domain-module-tdd.md   # Level 2: Domain/Module TDD
├── 3.feature-tdd.md         # Level 3: Feature TDD
└── README.md                # This file
```

## 🎯 Tiered System

This system is designed to handle large projects by breaking them down into TDDs at different levels:

→ Use tiered system:
1. Start with `0.master.md` to understand the workflow
2. Level 1: `1.system-overview-tdd.md` - Create System Overview
3. Level 2: `2.domain-module-tdd.md` - Create Domain TDD for each domain
4. Level 3: `3.feature-tdd.md` - Create Feature TDD for each feature

## 📋 Workflow

### **Step 1: System Overview (Level 1)**
```
Input: PRD + SAD
Prompt: 1.system-overview-tdd.md
Output: System Overview TDD + List of domains/modules
```

### **Step 2: Domain Design (Level 2)**
```
Input: System Overview TDD + Domain PRD + Domain SAD
Prompt: 2.domain-module-tdd.md
Output: Domain TDD + List of features in domain
```
**Repeat for each domain/module**

### **Step 3: Feature Design (Level 3)**
```
Input: Domain TDD + Feature PRD + User stories
Prompt: 3.feature-tdd.md
Output: Detailed Feature TDD (implementation-ready)
```
**Repeat for each feature**

## 🔄 Workflow Diagram

```
PRD + SAD
    ↓
[Level 1: System Overview TDD]
    ├─→ Domain A
    ├─→ Domain B
    └─→ Domain C
         ↓
    [Level 2: Domain TDD]
         ├─→ Feature 1
         ├─→ Feature 2
         └─→ Feature 3
              ↓
         [Level 3: Feature TDD]
              ↓
         [Implementation]
```

## 📊 Level Comparison

| Aspect | Level 1 (System) | Level 2 (Domain) | Level 3 (Feature) |
|--------|------------------|------------------|-------------------|
| **Scope** | Entire system | One domain | One feature |
| **Detail Level** | High-level | Medium-level | Implementation-ready |
| **Diagrams** | Architecture overview | Domain architecture | User flows, UI |
| **Database** | Strategy | Schema design | Migration scripts |
| **API** | Integration points | Endpoints list | Request/Response details |
| **Timeline** | 1-2 days | 2-3 days | 1 day |
| **Output Size** | 20-30 pages | 15-25 pages | 10-15 pages |

## ✅ Checklist before starting

- [ ] Have complete PRD
- [ ] Have SAD (or high-level architecture)
- [ ] Have defined project scope and boundaries
- [ ] Have clear team structure and ownership
- [ ] Have timeline and milestones

## 🚀 Getting Started

1. **Read `0.master.md`** to understand the system clearly
2. **Start with Level 1** - System Overview TDD
3. **Break down domains** and create Level 2 for each domain
4. **Break down features** and create Level 3 for each feature
5. **Implementation** based on Feature TDD

## 💡 Tips

- **Always start from Level 1** - Don't skip System Overview
- **Iterative approach** - Can return to Level 1 to refine
- **Consistency** - Ensure Domain and Feature TDDs align with System Overview
- **Traceability** - Each Feature TDD must reference Domain and System Overview TDD
- **Parallel work** - After System Overview, can work on multiple Domain TDDs in parallel

## 📝 Notes

- This tiered system is for large, complex projects
- Can mix: some domains use Level 2, some features use Level 3 depending on complexity
- Can start from Level 2 or Level 3 if System Overview is available from another source

---

**Happy Designing! 🎨**
