# Networking

Web communication protocols and strategies.

---

## Table of Contents

1. [WebSocket vs REST](#131-websocket-vs-rest)

---

## 13. Networking

### 13.1. WebSocket vs REST

#### **REST API**

- Giao tiếp **request–response** (1 chiều).
- Stateless, dễ cache, dễ scale.
- Phù hợp cho:
  - CRUD dữ liệu
  - API thông thường / SSR / gọi API từ mobile
  - Tần suất cập nhật thấp

**Ví dụ:** gọi `/users`, `/products`, `/orders`.

#### **WebSocket**

- **Kết nối 2 chiều (full-duplex)** giữ kết nối liên tục.
- Server có thể **đẩy dữ liệu real-time** cho client.
- Phù hợp cho:
  - Chat, notifications
  - Live dashboard / stock price
  - Multiplayer game
  - Collaborative editing

**Ví dụ:** giá coin cập nhật mỗi 100ms.

#### **Khi nào dùng gì?**

- **REST** → dữ liệu tĩnh hoặc thay đổi ít, cần độ tin cậy và dễ debug.
- **WebSocket** → real-time, tần suất cập nhật cao, cần push dữ liệu.

**Tip:** Có thể kết hợp cả hai trong 1 app (REST cho CRUD, WebSocket cho real-time updates).

---


---

[← Back to Overview](../README.md)
