# 📋 API Contract - ما يجب الـ Backend يرسله بالضبط

## 🔐 Login Endpoints

### Admin Login
```
METHOD: POST
URL: http://localhost:5180/api/admin/login

REQUEST BODY:
{
  "email": "admin@example.com",
  "password": "password123"
}

✅ SUCCESS RESPONSE (200 OK):
{
  "isSuccess": true,
  "message": "تم تسجيل الدخول بنجاح",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YmQwYzUyNC1lYzAyLTQ0YjItODhiZC1mNTJjYWI3ZTk2OTIiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzY1NTQ4NjQ4LCJleHAiOjE3NjU1NTAyNDgsInJvbGUiOiJBZG1pbiIsImlzcyI6IlNlY3VyZUFwaSIsImF1ZCI6WyJTZWN1cmVBcGlVc2VyIl19.signature",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YmQwYzUyNC1lYzAyLTQ0YjItODhiZC1mNTJjYWI3ZTk2OTIiLCJpYXQiOjE3NjU1NDg2NDgsImV4cCI6MTc2NjE1MzQ0OCwicmVmcmVzaCI6dHJ1ZX0.signature",
  "user": {
    "id": "6bd0c524-ec02-44b2-88bd-f52cab7e9692",
    "email": "admin@example.com",
    "firstName": "Osama",
    "lastName": "Fathy",
    "role": "Admin"
  }
}

❌ ERROR RESPONSE (401 Unauthorized):
{
  "isSuccess": false,
  "message": "البريد الإلكتروني أو كلمة المرور غير صحيحة"
}

HTTP HEADERS:
Access-Control-Allow-Origin: http://localhost:4200
Content-Type: application/json
```

---

## 🔄 Refresh Token Endpoint

```
METHOD: POST
URL: http://localhost:5180/api/Auth/RefreshToken

REQUEST BODY:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YmQwYzUyNC1lYzAyLTQ0YjItODhiZC1mNTJjYWI3ZTk2OTIiLCJpYXQiOjE3NjU1NDg2NDgsImV4cCI6MTc2NjE1MzQ0OCwicmVmcmVzaCI6dHJ1ZX0.signature"
}

⚠️ IMPORTANT:
- هذا الـ endpoint يجب أن يقبل invalidated access token
- لا تتوقع access token في الـ request
- فقط refreshToken يجب يكون في الـ body

✅ SUCCESS RESPONSE (200 OK):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YmQwYzUyNC1lYzAyLTQ0YjItODhiZC1mNTJjYWI3ZTk2OTIiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzY1NTQ4NzQ4LCJleHAiOjE3NjU1NTAzNDgsInJvbGUiOiJBZG1pbiIsImlzcyI6IlNlY3VyZUFwaSIsImF1ZCI6WyJTZWN1cmVBcGlVc2VyIl19.signature",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YmQwYzUyNC1lYzAyLTQ0YjItODhiZC1mNTJjYWI3ZTk2OTIiLCJpYXQiOjE3NjU1NDg3NDgsImV4cCI6MTc2NjE1NDM0OCwicmVmcmVzaCI6dHJ1ZX0.signature"
}

❌ ERROR RESPONSE (401 Unauthorized):
{
  "isSuccess": false,
  "message": "الرمز انتهى صلاحيته"
}

HTTP HEADERS:
Access-Control-Allow-Origin: http://localhost:4200
Content-Type: application/json
```

---

## 📚 API Data Endpoints

### Get Instructors
```
METHOD: GET
URL: http://localhost:5180/api/Instructor/GetInstructors

REQUEST HEADERS:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
x-secret-key: osama123

⚠️ IMPORTANT:
- كلا الـ headers مطلوبة
- Authorization يجب يكون بالضبط: "Bearer <token>"
- x-secret-key يجب تكون: "osama123"

✅ SUCCESS RESPONSE (200 OK):
{
  "value": [
    {
      "id": "instructor-uuid-1",
      "firstName": "Ahmed",
      "lastName": "Ali",
      "email": "ahmed@example.com",
      "phone": "201012345678",
      "bio": "متخصص في البرمجة",
      "specialization": "Software Engineering",
      "yearsOfExperience": 5,
      "qualifications": "BSc Computer Science"
    },
    {
      "id": "instructor-uuid-2",
      "firstName": "Fatima",
      "lastName": "Hassan",
      "email": "fatima@example.com",
      "phone": "201098765432",
      "bio": "معلمة في الديزاين",
      "specialization": "UI/UX Design",
      "yearsOfExperience": 3,
      "qualifications": "BFA Graphic Design"
    }
  ],
  "count": 2
}

❌ ERROR RESPONSES:

401 Unauthorized (Missing/Invalid Token):
{
  "isSuccess": false,
  "message": "توكن غير صحيح أو انتهت صلاحيته"
}

403 Forbidden (Invalid x-secret-key):
{
  "isSuccess": false,
  "message": "مفتاح المصادقة غير صحيح"
}

500 Server Error:
{
  "isSuccess": false,
  "message": "حدث خطأ في الخادم"
}

HTTP HEADERS:
Access-Control-Allow-Origin: http://localhost:4200
Content-Type: application/json
```

---

## 🔑 JWT Token Structure

### Access Token (صلاحية: 1 ساعة)

**Decoded Payload:**
```json
{
  "sub": "6bd0c524-ec02-44b2-88bd-f52cab7e9692",
  "email": "admin@example.com",
  "firstName": "Osama",
  "lastName": "Fathy",
  "iat": 1765548648,
  "exp": 1765552248,
  "role": "Admin",
  "iss": "SecureApi",
  "aud": ["SecureApiUser"]
}
```

**معنى كل حقل:**
- `sub` (subject): معرف الـ user (UUID)
- `email`: بريد الـ user
- `firstName`, `lastName`: اسم الـ user الأول والأخير
- `iat` (issued at): وقت الـ issue (Unix timestamp بالثواني)
- `exp` (expiration): وقت انتهاء الصلاحية (Unix timestamp بالثواني)
  - **مهم**: يجب أن تكون قيمة مستقبلية من الوقت الحالي
  - عادة = iat + 3600 (ساعة واحدة)
- `role`: دور الـ user (Admin, Student, Instructor)
  - يجب أن يكون بحرف كبير في البداية
- `iss` (issuer): من أصدر الـ token (عادة اسم الـ API)
  - يجب أن تكون: "SecureApi"
- `aud` (audience): لمن هذا الـ token
  - يجب أن تكون array: ["SecureApiUser"]

### Refresh Token (صلاحية: 7 أيام)

**Decoded Payload:**
```json
{
  "sub": "6bd0c524-ec02-44b2-88bd-f52cab7e9692",
  "iat": 1765548648,
  "exp": 1766153448,
  "refresh": true
}
```

**معنى التركيب:**
- يحتوي على معرف الـ user فقط
- بدون email أو role
- صلاحيته أطول (7 أيام = iat + 604800)
- حقل `refresh: true` يشير إنه refresh token

---

## ✅ Validation Rules

### Backend يجب يتحقق من:

1. **Token Signature:**
   - يتحقق من signature باستخدام نفس الـ secret key
   - إذا كانت مختلفة → 401

2. **Token Expiration:**
   ```
   current_timestamp > token.exp → 401 Unauthorized
   ```

3. **Role Authorization:**
   - كل endpoint يحتاج role معين
   - مثلاً `/api/admin/...` تحتاج `role: "Admin"`
   - مثلاً `/api/student/...` تحتاج `role: "Student"`

4. **X-Secret-Key:**
   - يجب أن تكون = "osama123"
   - إذا كانت مختلفة → 403 Forbidden

5. **CORS Headers:**
   ```
   Access-Control-Allow-Origin: http://localhost:4200
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization, x-secret-key
   ```

---

## 🧪 Testing Checklist

قبل ما تقول الـ 401 مشكلة في الـ Frontend:

- [ ] تأكد أن access token في الـ payload ده موجود في الـ response
- [ ] تأكد أن الـ exp قيمة صحيحة (مستقبلية)
- [ ] تأكد أن الـ role بحرف كبير (Admin, not admin)
- [ ] تأكد أن refresh token في الـ response
- [ ] تأكد أن `/api/Auth/RefreshToken` موجود والـ endpoint شغال
- [ ] تأكد أن الـ x-secret-key = "osama123"
- [ ] تأكد أن الـ CORS headers موجودة
- [ ] استخدم Postman لـ test الـ endpoints مباشرة

---

## 🔗 Frontend Implementation

### 1. Login Save Token
```typescript
// auth.service.ts
private handleAuthResponse(res: AuthResponse) {
  if (res.isSuccess && res.accessToken && res.refreshToken) {
    localStorage.setItem('token', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.userSubject.next(res.user as User);
  }
}
```

### 2. Attach Token to Requests
```typescript
// interceptor.ts
if (token) headers['Authorization'] = `Bearer ${token}`;
if (secret) headers['x-secret-key'] = secret;
```

### 3. Refresh on 401
```typescript
// interceptor.ts
if (error.status === 401 && refreshToken) {
  return this.authService.refreshToken().pipe(
    switchMap(res => {
      // Retry original request with new token
      return next.handle(requestWithNewToken);
    })
  );
}
```

### 4. Guard Protection
```typescript
// auth.guard.ts
export const AuthGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  // Verify token exists and not expired
  // Redirect to login if invalid
};
```

---

## 🎯 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 مع token صحيح | Token Signature خاطئ | تأكد من نفس secret key للـ signing والـ validation |
| 401 بعد دقائق | Token Expired | Frontend يجب يعمل refresh، Backend يرجع 401 عند انتهاء الصلاحية |
| 403 Forbidden | x-secret-key خاطئ | تأكد من القيمة = "osama123" |
| Refresh endpoint 404 | Endpoint غير موجود | استخدم `/api/Auth/RefreshToken` |
| CORS Error | Headers ناقصة | أضف `Access-Control-Allow-Origin: http://localhost:4200` |
| Role not recognized | role case sensitivity | استخدم "Admin" بحرف كبير |

---

## 📞 Debugging Steps

1. **في Postman:**
   ```
   1. POST http://localhost:5180/api/admin/login
      Body: {"email": "...", "password": "..."}
   
   2. Copy accessToken من الـ response
   
   3. GET http://localhost:5180/api/Instructor/GetInstructors
      Headers: 
        Authorization: Bearer <paste-token>
        x-secret-key: osama123
   
   4. إذا 401 → Token مشكلة
      إذا 403 → Secret key مشكلة
      إذا 200 → كل شيء OK
   ```

2. **في Frontend Console:**
   ```javascript
   // ادخل في Browser Console (F12 → Console)
   const token = localStorage.getItem('token');
   const parts = token.split('.');
   const payload = JSON.parse(atob(parts[1]));
   console.log('Current Time:', Date.now() / 1000);
   console.log('Token Expires:', payload.exp);
   console.log('Is Expired?', Date.now() / 1000 > payload.exp);
   ```

3. **في Network Tab:**
   - افتح F12 → Network
   - سجل دخول
   - اذهب إلى أي API call
   - ادخل في Request Headers شوف Authorization موجود؟
   - ادخل في Response شوف Status code؟
