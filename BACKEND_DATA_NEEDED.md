# 🔍 ما أحتاجه من الـ Backend - قائمة دقيقة

## 📝 الخطوات:

### 1️⃣ استخدم Postman وتبع الخطوات:

---

## 🔑 Test 1: Admin Login

```
METHOD: POST
URL: http://localhost:5180/api/admin/login

BODY (JSON):
{
  "email": "osamafathy@gmail.com",
  "password": "password"
}
```

**ابعتلي الـ Response كاملاً (Copy كل الـ JSON اللي يظهر):**
```
[ضع الـ Response هنا]
```

---

## 📊 Test 2: Decode الـ Token

بعد ما تقول لي الـ response من Test 1:

1. خذ قيمة `accessToken`
2. اضغط على https://jwt.io/
3. ضع الـ token في الـ box الأول
4. الـ site سيفك تشفير الـ payload تلقائياً

**ابعتلي:**
- الـ **Decoded Payload** (الـ JSON الأزرق في jwt.io)
- القيمة الدقيقة لـ `exp` (عدد الأرقام)
- القيمة الدقيقة لـ `iat` (عدد الأرقام)

**مثال:**
```json
{
  "sub": "...",
  "email": "...",
  "iat": [الرقم],
  "exp": [الرقم],
  "role": "Admin",
  "iss": "...",
  "aud": [...]
}
```

---

## 🔄 Test 3: API Call بـ Token

```
METHOD: GET
URL: http://localhost:5180/api/Instructor/GetInstructors

HEADERS:
Authorization: Bearer [ضع الـ accessToken هنا]
x-secret-key: osama123
```

**ابعتلي الـ Response:**
- إذا 200 OK: الـ JSON كاملاً
- إذا 401 Unauthorized: الـ error message
- إذا 403 Forbidden: الـ error message

---

## 🔄 Test 4: Refresh Token (إذا كان موجود)

```
METHOD: POST
URL: http://localhost:5180/api/Auth/RefreshToken

BODY (JSON):
{
  "refreshToken": "[ضع الـ refreshToken من Test 1]"
}
```

**ابعتلي:**
- الـ Response (200 OK أو error)
- إذا 200: الـ new accessToken والـ refreshToken

---

## 📋 Test 5: Check Other Endpoints

جرّب كمان:

```
// Test Student Login
POST /api/student/login
Body: {"email": "student@example.com", "password": "password"}

// Test Instructor Login
POST /api/instructor/login
Body: {"email": "instructor@example.com", "password": "password"}

// Test Get Students
GET /api/Student/GetStudents
Headers: Authorization + x-secret-key

// Test Get Courses
GET /api/Course/GetAllCourses
Headers: Authorization + x-secret-key
```

---

## 🎯 الملخص - ابعتلي:

| Test | ما أحتاج |
|------|---------|
| 1 | الـ response من `/api/admin/login` كاملاً (JSON) |
| 2 | الـ decoded payload من jwt.io (شنو الـ claims الموجودة؟) |
| 3 | نتيجة `/api/Instructor/GetInstructors` (هل يشتغل أم 401؟) |
| 4 | نتيجة الـ refresh endpoint (موجود أم لا؟) |
| 5 | أسماء الـ endpoints الأخرى والـ responses |

---

## 💡 مثال على ما أتوقعه:

**لما تقول لي:**

```
Test 1 Response:
{
  "isSuccess": true,
  "message": "success",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYTkyOGM1MS00OTAxLTQ0YTEtODg1Ni1mMDAyMjhjYzExNzciLCJlbWFpbCI6Im9zYW1hZmF0aHlAZ21haWwuY29tIiwiaWF0IjoxNzY1NTQ4NjQ4LCJleHAiOjE3NjU1NTAyNDgsInJvbGUiOiJBZG1pbiIsImlzcyI6IlNlY3VyZUFwaSIsImF1ZCI6WyJTZWN1cmVBcGlVc2VyIl0sIm5hbWVpZCI6ImNhOTI4YzUxLTQ5MDEtNDRhMS04ODU2LWYwMDIyOGNjMTE3NyJ9.xyz123",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYTkyOGM1MS00OTAxLTQ0YTEtODg1Ni1mMDAyMjhjYzExNzciLCJpYXQiOjE3NjU1NDg2NDgsImV4cCI6MTc2NjE1MzQ0OH0.abc456",
  "user": {
    "id": "ca928c51-4901-44a1-8856-f00228cc1177",
    "email": "osamafathy@gmail.com",
    "firstName": "Osama",
    "lastName": "Fathy",
    "role": "Admin"
  }
}

Test 2 Decoded Payload:
{
  "sub": "ca928c51-4901-44a1-8856-f00228cc1177",
  "email": "osamafathy@gmail.com",
  "iat": 1765548648,
  "exp": 1765550248,
  "role": "Admin",
  "iss": "SecureApi",
  "aud": ["SecureApiUser"],
  "nameid": "ca928c51-4901-44a1-8856-f00228cc1177"
}

Test 3 Response:
Status: 200 OK
[JSON الـ instructors هنا]

Test 4 Response:
Status: 404 Not Found
(إذن الـ refresh endpoint غير موجود)
```

**لما تقول لي الـ responses دي، أقدر أعدل الـ Frontend بناءً على الـ Backend الفعلي.**

---

## ⚡ بعد ما تبعتلي الـ Data:

سأعدل:
1. ✅ الـ auth.service.ts بناءً على الـ actual response structure
2. ✅ الـ interceptor بناءً على الـ endpoints الفعلية
3. ✅ الـ guards بناءً على الـ claims الفعلية
4. ✅ الـ routes بناءً على الـ roles الفعلية
5. ✅ أي validation يحتاج تغيير

**النتيجة:** الـ Frontend سيكون 100% متوافق مع الـ Backend الفعلي
