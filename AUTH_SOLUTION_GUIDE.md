# 🔐 حل مشكلة التوكن والـ 401 - شرح كامل

## 📊 المشكلة الحالية

**الأعراض:**
```
Request: GET /api/Instructor/GetInstructors
Headers: Authorization: Bearer <token>
Headers: x-secret-key: osama123
Response: 401 Unauthorized
```

**السبب المحتمل:**
- الـ Backend عامل validation قاسي جداً
- قد يكون الـ Token منتهي الصلاحية
- قد يكون الـ Secret key غير صحيح
- قد تكون هناك مشكلة في JWT signature أو claims

---

## ✅ الحل الذي تم تطبيقه

### 1️⃣ Guards الصحيحة

```typescript
// AuthGuard: تحقق من وجود token وصلاحيته
canActivate: [
  () => import('./auth/auth.guard').then(m => m.AuthGuard),
  () => import('./auth/role.guard').then(m => m.RoleGuard)
]
```

**ماذا يفعل AuthGuard:**
- ✅ يتحقق من وجود token في localStorage
- ✅ يفك تشفير JWT ويتحقق من exp
- ✅ يعيد توجيه للـ login إذا انتهت الصلاحية
- ✅ يحفظ الـ user في AuthService

**ماذا يفعل RoleGuard:**
- ✅ يتحقق من أن user له الـ role المطلوب
- ✅ يمنع الوصول إذا كان role غير صحيح

### 2️⃣ Interceptor المحسّن

```typescript
// AuthInterceptor يفعل:
- ✅ أضف Authorization header بشكل تلقائي
- ✅ أضف x-secret-key بشكل تلقائي
- ✅ اكتشف 401 responses
- ✅ حاول refresh التوكن تلقائياً
- ✅ قائم الـ pending requests وأكملها بعد الـ refresh
- ✅ امسح الـ storage إذا فشل الـ refresh
```

### 3️⃣ Refresh Token Flow

```
1. User يسجل دخول → الـ Backend يرسل:
   - accessToken (صلاحية: 1 ساعة)
   - refreshToken (صلاحية: 7 أيام)

2. عند انتهاء accessToken:
   - Frontend يستقبل 401
   - Interceptor ينادي POST /api/Auth/RefreshToken
   - Backend يرد بـ accessToken جديد
   - Frontend يعيد محاولة الـ request

3. إذا فشل Refresh:
   - Frontend يمسح الـ storage
   - Frontend يوجه الـ user للـ login
```

---

## 📋 ما يجب الـ Backend يرسله

### ✅ Login Response (200 OK)
```json
{
  "isSuccess": true,
  "message": "تم تسجيل الدخول بنجاح",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "admin@example.com",
    "firstName": "Osama",
    "lastName": "Fathy",
    "role": "Admin"
  }
}
```

**مهم:**
- accessToken يجب أن يحتوي على `exp` (expiration timestamp)
- refreshToken يجب أن يحتوي على `exp` أطول
- role يجب أن يكون بحرف كبير (Admin, Student, Instructor)

### ✅ JWT Token Structure
```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "sub": "user-uuid",
  "email": "admin@example.com",
  "iat": 1765548648,           // issued at (seconds)
  "exp": 1765550448,           // expires at (seconds)
  "role": "Admin",
  "iss": "SecureApi",
  "aud": ["SecureApiUser"]
}

Signature: HMACSHA256(header.payload, secret-key)
```

### ✅ Refresh Token Response (200 OK)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**CRITICAL:** 
- هذا الـ endpoint يجب أن يكون في `/api/Auth/RefreshToken`
- يجب أن يقبل refreshToken في الـ body
- يجب أن يرجع access token جديد

### ✅ API Response (200 OK)
```json
{
  "value": [
    {
      "id": "uuid",
      "firstName": "Ahmed",
      "lastName": "Ali",
      "email": "ahmed@example.com"
    }
  ],
  "count": 1
}
```

---

## 🚀 خطوات الفحص

### 1. شغّل الـ validation script:
```powershell
pwsh .\scripts\validate_backend.ps1 `
  -BaseUrl "http://localhost:5180" `
  -Email "osamafathy@gmail.com" `
  -Password "your-password"
```

**هذا الـ script يفحص:**
1. ✅ الـ login يرسل accessToken و refreshToken؟
2. ✅ الـ token صالح (valid JWT)?
3. ✅ الـ token لم ينتهي بعد؟
4. ✅ الـ API endpoint يقبل الـ token؟
5. ✅ الـ refresh endpoint يشتغل؟

### 2. شغّل الـ Frontend وجرّب:
```powershell
npm run start
# ثم اضغط F12 في البراوزر وشوف console
```

**في Console يجب تشوف:**
```javascript
✅ AuthGuard: Authentication verified
✅ RoleGuard: User authorized
📡 Request with Authorization: Bearer...
✅ Response: 200 OK
```

### 3. إذا ما زالت الـ 401:
```javascript
// في Browser Console اكتب:
localStorage.getItem('token')       // يجب يطبع token
localStorage.getItem('refreshToken') // يجب يطبع refresh token
localStorage.getItem('x-secret-key') // يجب يطبع osama123

// فك تشفير الـ token:
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('exp:', new Date(payload.exp * 1000)); // شوف الـ expiration
console.log('role:', payload.role);  // شوف الـ role
```

---

## ⚠️ الأسباب الشائعة للـ 401

| السبب | الحل |
|------|------|
| Token منتهي | سجل دخول مرة أخرى |
| x-secret-key غير صحيح | تحقق من القيمة في الـ Backend |
| JWT signature خاطئ | تحقق من الـ secret key المستخدم للـ signing |
| Role غير صحيح | تأكد أن الـ Backend يرسل role بحرف كبير |
| Refresh endpoint غير موجود | استخدم `/api/Auth/RefreshToken` أو عدّل الـ AuthService |
| CORS مفعّل | تأكد من `Access-Control-Allow-Origin` في الـ Backend |

---

## 📝 الملفات التي تم تعديلها

| الملف | التغييرات |
|------|----------|
| `src/app/auth/auth.guard.ts` | ✅ تم إنشاء - يتحقق من Token والـ expiration |
| `src/app/auth/role.guard.ts` | ✅ تم تحديث - يتحقق من الـ role |
| `src/app/auth/interceptor.ts` | ✅ تم تحديث - auto-refresh على 401 |
| `src/app/auth/auth.service.ts` | ✅ تم تحديث - refreshToken method + error logging |
| `src/app/app.routes.ts` | ✅ تم تحديث - استخدام AuthGuard + RoleGuard |
| `src/app/auth/API_CONTRACT.ts` | ✅ تم إنشاء - توثيق الـ API |
| `scripts/validate_backend.ps1` | ✅ تم إنشاء - فحص الـ Backend |

---

## 🎯 الخطوات التالية

### فوراً:
1. ✅ شغّل `npm run start`
2. ✅ سجل دخول من جديد
3. ✅ شغّل الـ validation script
4. ✅ ابعت لي الـ output

### إذا ما زالت الـ 401:
1. ✅ تحقق من Backend API logs
2. ✅ تأكد أن الـ Backend يرسل `accessToken` و `refreshToken`
3. ✅ جرب الـ endpoint مع Postman مع الـ token
4. ✅ ابعت لي:
   - الـ Login response من الـ Backend (without passwords)
   - الـ error message من الـ Backend logs

---

## 💬 أسئلة سريعة

**Q: هل يجب أغيّر الـ x-secret-key؟**  
A: إذا كان Backend متطلب قيمة مختلفة، قول لي والـ interceptor سيستخدم القيمة من localStorage

**Q: ما الفرق بين accessToken و refreshToken؟**  
A: accessToken قصير الأجل (ساعة واحدة)، refreshToken طويل الأجل (أسبوع) يستخدم لعمل access token جديد

**Q: ماذا لو الـ Backend لا يدعم refresh endpoint؟**  
A: إذن يجب نزود مدة الـ accessToken نفسه من 1 ساعة إلى فترة أطول

---

## 📞 اتصل إذا احتجت مساعدة!
