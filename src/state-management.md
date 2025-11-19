# State Management

Quản lý state trong Vue applications với Vuex và Pinia.

---

## Table of Contents

1. [Vuex vs Pinia](#1-vuex-vs-pinia)
2. [State Flow](#2-state-flow)
3. [Global vs Local State](#3-global-vs-local-state)
4. [Vuex: commit vs dispatch](#4-vuex-commit-vs-dispatch)

---
## 4. State Management

### 4.1. Vuex vs Pinia

#### **1. Khởi tạo**

- **Vuex:** cần `new Vuex.Store()` → verbose.
- **Pinia:** dùng `defineStore()` → nhẹ, không cần khởi tạo thủ công.

#### **2. Truy cập state**

- **Vuex:** `this.$store.state.xxx`
- **Pinia:** truy cập trực tiếp: `store.xxx`.

#### **3. Thay đổi dữ liệu**

- **Vuex:** chỉ `mutations` mới được phép sửa state (sync). Async phải dùng `actions` → hơi rườm rà.
- **Pinia:** sửa state trực tiếp (`store.count++`) hoặc dùng `actions` nếu muốn.

#### **4. Reactivity**

- **Vuex:** state chỉ là object thường → phụ thuộc Vue reactivity.
- **Pinia:** state được tạo bằng reactive proxy của Vue 3 → reactivity mạnh mẽ.

#### **5. TypeScript Support**

- **Vuex:** yếu, cần setup phức tạp.
- **Pinia:** xuất sắc, type inference tự động.

#### **6. Hủy store**

- **Vuex:** không hỗ trợ.
- **Pinia:** hỗ trợ `store.$dispose()` để cleanup khi không cần.

#### **Tóm tắt dễ nhớ:**

- **Vuex**: phù hợp dự án cũ, flow rõ ràng nhưng verbose.
- **Pinia**: tiêu chuẩn mới (official cho Vue 3), dễ dùng, reactivity mạnh, TS tốt.

---

### 4.2. State Flow

#### **Vuex Flow (classic Flux pattern)**

1. **Component → dispatch(action)**
2. **Action** xử lý async, sau đó **commit(mutation)**
3. **Mutation** thay đổi **state (sync only)**
4. **State thay đổi → getters tính toán lại → UI rerender**

→ Ưu điểm: flow rõ ràng, dễ debug.
→ Nhược: hơi verbose, nhiều boilerplate.

#### **Pinia Flow (simplified)**

- Component gọi **actions** trực tiếp.
- Action thay đổi **state trực tiếp**.
- State reactive → UI cập nhật.

**Ví dụ:**

```ts
const store = useUserStore();
store.count++;
store.loadUsers(); // action
```

#### **Comparison Table**

| Tiêu chí    | Vuex                            | Pinia                              |
| ----------- | ------------------------------- | ---------------------------------- |
| Syntax      | Verbose (mutations/actions)     | Ngắn gọn, không cần mutation       |
| Reactivity  | dựa trên Vue 2 → defineProperty | Proxy (Vue 3)                      |
| TypeScript  | Tích hợp chưa tốt               | Hỗ trợ TS rất tốt                  |
| Khuyến nghị | Legacy projects                 | **Official recommended for Vue 3** |

---

### 4.3. When to Use Global vs Local State

#### **Dùng Global State cho:**

- Auth user / token
- Theme, app settings
- Nhiều component dùng chung
- Caching API global (product list, categories…)

#### **Dùng Local State khi:**

- Chỉ liên quan tới 1 component
- Không cần share cho nơi khác
- Không cần persistence
- Form state đơn giản

→ **Rule dễ nhớ:** Nếu nhiều component cần → global. Nếu chỉ một component cần → local.

---

### 4.4. Vuex: commit vs dispatch

**Câu hỏi:** Khi cần cập nhật giá trị cho state của Vuex. Khi nào thì dùng `$store.commit`, khi nào thì dùng `$store.dispatch`?

**Câu trả lời chuẩn Senior:**

#### **`commit` → Gọi Mutations (Sync only)**

- Mutations phải **đồng bộ (synchronous)**.
- Dùng để **thay đổi state trực tiếp**.
- Dev tools có thể track từng mutation.

```ts
// store/index.js
mutations: {
  INCREMENT(state, payload) {
    state.count += payload;
  },
  SET_USER(state, user) {
    state.user = user;
  }
}

// Component
this.$store.commit('INCREMENT', 1);
this.$store.commit('SET_USER', userData);
```

#### **`dispatch` → Gọi Actions (Async + Logic)**

- Actions có thể **bất đồng bộ (async)**.
- Xử lý business logic, gọi API, sau đó commit mutation.
- Actions có thể dispatch actions khác.

```ts
// store/index.js
actions: {
  async fetchUser({ commit }, userId) {
    try {
      const response = await api.getUser(userId);
      commit('SET_USER', response.data);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    }
  },

  async loadDashboard({ dispatch }) {
    await Promise.all([
      dispatch('fetchUser'),
      dispatch('fetchPosts')
    ]);
  }
}

// Component
this.$store.dispatch('fetchUser', 123);
```

#### **Flow chuẩn:**

```
Component
  ↓ dispatch('actionName')
Action (async logic, API call)
  ↓ commit('MUTATION_NAME')
Mutation (sync update state)
  ↓
State changed
  ↓
Component re-render
```

#### **So sánh:**

| Tiêu chí       | commit (Mutations)   | dispatch (Actions)         |
| -------------- | -------------------- | -------------------------- |
| Đồng bộ        | ✅ Sync only         | ✅ Async OK                |
| Thay đổi state | ✅ Trực tiếp         | ❌ Phải thông qua commit   |
| Business logic | ❌ Không nên         | ✅ Được khuyến khích       |
| API call       | ❌ Không             | ✅ Có                      |
| Devtools       | Track được từng bước | Track cả action + mutation |
| Return value   | Không (undefined)    | Có (Promise)               |

#### **Best Practices:**

```ts
// ❌ Bad: async trong mutation
mutations: {
  async FETCH_USER(state) { // NEVER DO THIS!
    const data = await api.getUser();
    state.user = data;
  }
}

// ✅ Good: async trong action
actions: {
  async fetchUser({ commit }) {
    const data = await api.getUser();
    commit('SET_USER', data);
  }
}
```

**Rule of thumb:**

- **Có async/API call** → dùng `dispatch`.
- **Update state đơn giản, sync** → dùng `commit`.
- **Trong component**: thường chỉ dùng `dispatch`, ít khi dùng `commit` trực tiếp.

**Note:** Với **Pinia** (modern choice), không còn phân biệt mutation/action, actions có thể update state trực tiếp.

---


---

[← Back to Overview](../README.md)
