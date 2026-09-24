# Networking

Web communication protocols and strategies.

---

## Table of Contents

1. [WebSocket vs REST](#131-websocket-vs-rest)

---

## 13. Networking

### 13.1. WebSocket vs REST

#### **REST API**

- **Request-response** communication (one-way).
- Stateless, easy to cache, easy to scale.
- Good for:
  - CRUD operations
  - Standard APIs / SSR / mobile app calls
  - Low update frequency

**Example:** calling `/users`, `/products`, `/orders`.

#### **WebSocket**

- **Two-way (full-duplex) connection** keeps connection alive.
- Server can **push real-time data** to client.
- Good for:
  - Chat, notifications
  - Live dashboards / stock prices
  - Multiplayer games
  - Collaborative editing

**Example:** crypto price updates every 100ms.

#### **When to use what?**

- **REST** → static data or low change rate, need reliability and easy debugging.
- **WebSocket** → real-time, high update frequency, need to push data.

**Tip:** You can combine both in one app (REST for CRUD, WebSocket for real-time updates).

---


---

[← Back to Overview](../../README-en.md)

