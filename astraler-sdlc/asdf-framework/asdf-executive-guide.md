# ASDF Executive Guide: The Operating System for AI Development

Tài liệu này định nghĩa bộ lệnh và quy trình vận hành (**Executive Layer**) để **Product Architect** điều khiển **Coder AI** (Claude Code, Cursor, acli, etc.) một cách thống nhất và hiệu quả.

---

## 1. Bộ lệnh Điều khiển (Pseudo-Slash Commands)

Dù công cụ AI bạn đang dùng có hỗ trợ slash commands hay không, hãy sử dụng các cú pháp sau để kích hoạt các "Workflow" chuẩn của ASDF:

### 🏛️ `/asdf:init`
**Mục đích**: Khởi tạo cấu trúc thư mục ASDF cho dự án mới.
- **AI sẽ làm**: Tạo folder `asdf-docs/` với các tầng `01-system-core/`, `02-domains/`, `03-features/`, `04-operations/`.

### 🚀 `/asdf:spec [tên_tính_năng]`
**Mục đích**: Brainstorm và phác thảo tài liệu đặc tả (Spec) cho một tính năng mới.
- **AI sẽ làm**: Đọc `01-system-core/`, hỏi Architect 5 câu hỏi làm rõ logic, sau đó tạo file `.md` trong `03-features/`.

### 💻 `/asdf:implement [đường_dẫn_spec]`
**Mục đích**: Kích hoạt việc lập trình dựa trên tài liệu đặc tả.
- **AI sẽ làm**: Đọc Spec, phân rã task vào `implementation-active.md`, thực thi code, và chạy test.

### 🔄 `/asdf:sync`
**Mục đích**: Kích hoạt cơ chế **Reverse Sync** (Đồng bộ ngược).
- **AI sẽ làm**: Đọc codebase hiện tại, so sánh với Specs, và cập nhật lại tài liệu đặc tả cho khớp với thực tế kèm theo các ghi chú về nâng cấp.

### 📊 `/asdf:status`
**Mục đích**: Cập nhật trạng thái tổng thể của dự án.
- **AI sẽ làm**: Rà soát các tính năng đã xong, cập nhật `% hoàn thành` vào `01-system-core/project-status.md`.

### 📝 `/asdf:handoff`
**Mục đích**: Kết thúc phiên làm việc và chuẩn bị cho phiên sau.
- **AI sẽ làm**: Ghi lại "Nhật ký cuối phiên" vào `04-operations/session-handoff.md` gồm các việc đã làm và việc cần làm tiếp theo.

---

## 2. Cách "Cài đặt" ASDF vào AI

Để Coder AI hiểu và tuân thủ bộ lệnh này, Product Architect cần nạp file chỉ thị hệ thống. 

### Tùy chọn 1: Dùng Cursor
Copy nội dung file [`.asdf-rules`](file:///Users/tranthien/Documents/1.DEV/12.Github/claudekit-engineer/astraler-sdlc/asdf-framework/.asdf-rules) (sắp tạo) vào phần **Project Rules** trong Cursor Settings.

### Tùy chọn 2: Dùng Claude Code / Terminal AI
Sử dụng prompt khởi tạo:
> "Hãy đọc hướng dẫn vận hành tại `asdf-framework/asdf-executive-guide.md` và tuân thủ bộ lệnh `/asdf:...` để phối hợp với tôi."

---

## 3. Quy trình Vận hành Chuẩn (The Standard Loop)

1.  **Driver Intent**: Người dùng ra lệnh (vd: `/asdf:spec Checkout`).
2.  **AI Alignment**: AI hỏi lại để làm rõ context.
3.  **Doc Second**: AI tạo/cập nhật Spec.
4.  **Action**: AI thực thi code.
5.  **Reverse Sync**: AI tự cập nhật lại Doc sau khi xong.

---

## 💡 Triết lý vận hành
Trong ASDF, **Lệnh (Command)** là cách chúng ta kích hoạt **Tri thức (Knowledge)**. Đừng yêu cầu AI "viết code", hãy yêu cầu AI "thực thi Spec".
