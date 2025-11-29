# State Management

State management in Vue applications with Vuex and Pinia.

---

## Table of Contents

1. [Vuex vs Pinia](#71-vuex-vs-pinia)

2. [State Flow](#72-state-flow)

3. [Global vs Local State](#73-when-to-use-global-vs-local-state)

4. [Vuex: commit vs dispatch](#74-vuex-commit-vs-dispatch)

5. [Dispatch vs Actions](#75-dispatch-vs-actions-vuex)

---

## 7. State Management

### 7.1. Vuex vs Pinia

#### **1. Setup**

- **Vuex:** needs `new Vuex.Store()` → verbose.
- **Pinia:** uses `defineStore()` → light, no manual setup needed.

#### **2. Access state**

- **Vuex:** `this.$store.state.xxx`
- **Pinia:** direct access: `store.xxx`.

#### **3. Change data**

- **Vuex:** only `mutations` can change state (sync). Async must use `actions` → bit verbose.
- **Pinia:** change state directly (`store.count++`) or use `actions` if you want.

#### **4. Reactivity**

- **Vuex:** state is just a normal object → depends on Vue reactivity.
- **Pinia:** state created with Vue 3's reactive proxy → stronger reactivity.

#### **5. TypeScript Support**

- **Vuex:** weak, needs complex setup.
- **Pinia:** excellent, auto type inference.

#### **6. Dispose store**

- **Vuex:** not supported.
- **Pinia:** supports `store.$dispose()` to cleanup when not needed.

#### **Summary:**

- **Vuex**: good for old projects, clear flow but verbose.
- **Pinia**: new standard (official for Vue 3), easy to use, strong reactivity, good TS.

---

### 7.2. State Flow

#### **Vuex Flow (classic Flux pattern)**

1. **Component → dispatch(action)**
2. **Action** handles async, then **commit(mutation)**
3. **Mutation** changes **state (sync only)**
4. **State changes → getters recalculate → UI re-renders**

→ Pros: clear flow, easy to debug.
→ Cons: bit verbose, lots of boilerplate.

#### **Pinia Flow (simplified)**

- Component calls **actions** directly.
- Action changes **state directly**.
- State is reactive → UI updates.

**Example:**

```ts
const store = useUserStore();
store.count++;
store.loadUsers(); // action
```

#### **Comparison Table**

| Feature    | Vuex                              | Pinia                              |
| ---------- | --------------------------------- | ---------------------------------- |
| Syntax     | Verbose (mutations/actions)       | Short, no mutations needed         |
| Reactivity | Based on Vue 2 → defineProperty   | Proxy (Vue 3)                      |
| TypeScript | Not well integrated               | Very good TS support               |
| Recommend  | Legacy projects                   | **Official recommended for Vue 3** |

---

### 7.3. When to Use Global vs Local State

#### **Use Global State for:**

- Auth user / token
- Theme, app settings
- Shared across many components
- Global API caching (product list, categories…)

#### **Use Local State when:**

- Only related to 1 component
- No need to share elsewhere
- No need for persistence
- Simple form state

→ **Easy rule:** If many components need it → global. If only one component needs it → local.

---

### 7.4. Vuex: commit vs dispatch

**Question:** When updating Vuex state, when to use `$store.commit` vs `$store.dispatch`?

**Senior-level Answer:**

#### **`commit` → Call Mutations (Sync only)**

- Mutations must be **synchronous**.
- Use to **change state directly**.
- Dev tools can track each mutation.

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

#### **`dispatch` → Call Actions (Async + Logic)**

- Actions can be **asynchronous**.
- Handle business logic, call API, then commit mutation.
- Actions can dispatch other actions.

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

#### **Standard Flow:**

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

#### **Comparison:**

| Feature        | commit (Mutations)     | dispatch (Actions)         |
| -------------- | ---------------------- | -------------------------- |
| Sync           | ✅ Sync only           | ✅ Async OK                |
| Change state   | ✅ Direct              | ❌ Must go through commit  |
| Business logic | ❌ Should not          | ✅ Recommended             |
| API call       | ❌ No                  | ✅ Yes                     |
| Devtools       | Track each step        | Track both action + mutation |
| Return value   | No (undefined)         | Yes (Promise)              |

#### **Best Practices:**

```ts
// ❌ Bad: async in mutation
mutations: {
  async FETCH_USER(state) { // NEVER DO THIS!
    const data = await api.getUser();
    state.user = data;
  }
}

// ✅ Good: async in action
actions: {
  async fetchUser({ commit }) {
    const data = await api.getUser();
    commit('SET_USER', data);
  }
}
```

**Rule of thumb:**

- **Has async/API call** → use `dispatch`.
- **Simple state update, sync** → use `commit`.
- **In component**: usually only use `dispatch`, rarely use `commit` directly.

**Note:** With **Pinia** (modern choice), no distinction between mutation/action, actions can update state directly.

---

### 7.5. Dispatch vs Actions (Vuex)

#### **Concept:**

- **Action**: function containing business logic (sync/async).
- **Dispatch**: method to call/trigger that action.

→ `dispatch` is how you execute an `action`.

#### **Usage:**

```ts
// Component calls action
this.$store.dispatch('fetchUser', userId);

// Action calls other actions
actions: {
  async login({ dispatch, commit }, credentials) {
    const user = await api.login(credentials);
    commit('SET_USER', user);

    // Dispatch other actions
    await dispatch('fetchUserProfile');
    await dispatch('loadSettings');
  }
}
```

#### **When to use what:**

| Situation                      | Use what           | Reason                      |
| ------------------------------ | ------------------ | --------------------------- |
| Component needs to fetch data  | `dispatch(action)` | Action handles async        |
| Component simple state update  | `commit(mutation)` | Mutation sync, direct       |
| Action needs to call another   | `dispatch(action)` | Reuse, orchestrate          |
| Need to handle many mutations  | `dispatch(action)` | Centralize logic            |

#### **Best Practices:**

```ts
// ✅ Good: Component dispatch action
methods: {
  async loadData() {
    await this.$store.dispatch('fetchUser', this.userId);
  }
}

// ❌ Bad: Component commit mutation directly
methods: {
  updateUser(user) {
    this.$store.commit('SET_USER', user); // Avoid!
    // Should: put in action for easier maintenance
  }
}
```

#### **Easy rule:**

- **Has async/complex logic** → `dispatch(action)`
- **Simple state update, sync** → `commit(mutation)`
- **In component** → prefer `dispatch`, rarely use `commit` directly

---

---

[← Back to Overview](../../README-en.md)

