# Astraler Agile-Dynamic Framework (AADF): Master Blueprint
> **Version**: 1.0 (Initial Agile Design)
> **Status**: Agile-Native Approach

---

## 1. Triết lý: Agile-First SDLC
Khác với ASDF hướng tới sự ổn định và chặt chẽ cấp hệ thống, **AADF** hướng tới tốc độ và sự thích ứng. Tri thức không được xây dựng "một cục" ngay từ đầu mà lớn dần qua từng **Sprint Increment**.

### 🎯 Nguyên tắc "3 Không":
1. **Không Over-design**: Chỉ thiết kế những gì cần code ngay.
2. **Không Over-doc**: Viết doc tinh gọn, tập trung vào spec thực thi của Sprint.
3. **Không Context Drift**: Dùng `sprint-memory` để neo giữ mục tiêu ngắn hạn.

---

## 2. Cấu trúc Thư mục Agile-Native

```text
aadf-agile-framework/
├── 🔄 sprints/                     # Trái tim vận hành
│   ├── sprint-01/                  # Bao đóng tri thức theo Sprint
│   │   ├── sprint-goal.md          # Mục tiêu & Scope
│   │   ├── specs/                  # Actionable Specs (Hợp nhất TDD/UI)
│   │   └── sprint-memory.md        # ✨ NEW: Trạng thái chi tiết của Sprint
│   └── backlog/                    # Product Backlog (Ước mơ chưa làm)
│
├── 🧠 project-knowledge-base/      # Nơi tri thức "kết tinh" (Evolving)
│   ├── architecture-log.md         # Kiến trúc lớn dần theo Code
│   ├── vibe-design-system.md       # UI/UX Styleguide tích lũy
│   └── domain-dictionary.md        # Từ điển nghiệp vụ
│
└── ⚙️ agile-ops/
    ├── session-heartbeat.md        # Nhật ký phiên làm việc (Handoff)
    └── agile-prompts.md            # Các prompt chuyên biệt cho Scrum/Kanban
```

---

## 3. Quy trình Tăng trưởng Tri thức (The Evolving Loop)

1. **Sprint Kickoff**: Role A nạp nhanh mục tiêu vào `sprint-goal.md`.
2. **Just-in-Time Spec**: AI soạn Spec cực nhanh cho các task trong Sprint.
3. **Execution**: Role B và AI thực thi code.
4. **Knowledge Promotion**: Sau khi Sprint hoàn thành, những gì quan trọng về kiến trúc/UI sẽ được AI tự động "promote" lên thư mục `project-knowledge-base/`.

---

## 4. Case Study: Thêm tính năng "Chat" theo kiểu Agile

**Prompt nạp AI:**
> "Chúng ta đang ở Sprint 3. Mục tiêu là thêm 'Chat đơn giản giữa 2 User'.
> 1. Hãy tạo thư mục `sprints/sprint-03/specs/chat-basic.md`.
> 2. Đọc `project-knowledge-base/` để xem các component UI hiện có.
> 3. Chỉ thiết kế Spec cho phần nhắn tin text. Đừng làm Spec cho phần gửi file (để Sprint sau)."

---

## 💡 Kết luận
AADF là công cụ hoàn hảo cho Product Builder. Nó giúp bạn code nhanh như "vibe coding" nhưng vẫn giữ được sự kiểm soát tri thức của "SDLC".
