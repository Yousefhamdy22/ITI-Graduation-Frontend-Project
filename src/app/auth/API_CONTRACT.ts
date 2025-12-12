/**
 * ✅ BACKEND API CONTRACT
 * 
 * هذا الملف يوضح بالضبط ما يجب أن يرسله الـ Backend
 * من أجل أن يشتغل الـ Frontend بشكل صحيح
 */

// ============================================
// 1️⃣ LOGIN ENDPOINT
// ============================================
/*
POST /api/admin/login
Content-Type: application/json
x-secret-key: osama123

REQUEST:
{
  "email": "admin@example.com",
  "password": "password123"
}

✅ SUCCESS (200 OK):
{
  "isSuccess": true,
  "message": "تم تسجيل الدخول بنجاح",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid-here",
    "email": "admin@example.com",
    "firstName": "Osama",
    "lastName": "Fathy",
    "role": "Admin"  // مهم: بدء بحرف كبير
  }
}

❌ FAILURE (400/401):
{
  "isSuccess": false,
  "message": "بيانات المستخدم غير صحيحة",
  "errors": ["Invalid credentials"]
}
*/

// ============================================
// 2️⃣ REFRESH TOKEN ENDPOINT (CRITICAL!)
// ============================================
/*
POST /api/Auth/RefreshToken
Content-Type: application/json
x-secret-key: osama123

REQUEST:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

✅ SUCCESS (200 OK):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

❌ FAILURE (401/400):
{
  "isSuccess": false,
  "message": "Invalid refresh token"
}

ملاحظة CRITICAL:
- هذا الـ endpoint يجب أن يكون متاح حتى لو الـ access token منتهي
- الـ Frontend يعتمد عليه لإعادة الاتصال تلقائياً
- بدون هذا الـ endpoint، الـ user سيضطر يسجل دخول كل شوية
*/

// ============================================
// 3️⃣ API REQUESTS (WITH VALID TOKEN)
// ============================================
/*
GET /api/Instructor/GetInstructors
Authorization: Bearer <valid-access-token>
x-secret-key: osama123

✅ SUCCESS (200 OK):
{
  "value": [
    {
      "id": "uuid",
      "firstName": "Ahmed",
      "lastName": "Ali",
      "email": "ahmed@example.com",
      ...
    }
  ],
  "count": 1
}

❌ UNAUTHORIZED (401):
يجب أن يعود مع 401 فقط إذا:
1. لا يوجد Authorization header
2. التوكن منتهي الصلاحية (exp < now)
3. المفتاح السري (x-secret-key) غير صحيح

بعد 401:
- Frontend سيحاول عمل refresh التوكن
- إذا نجح الـ refresh: سيعيد محاولة الـ request
- إذا فشل الـ refresh: سيوجه الـ user للـ login
*/

// ============================================
// 4️⃣ JWT TOKEN STRUCTURE (IMPORTANT!)
// ============================================
/*
عند عمل encode للـ JWT، يجب أن تحتوي على:

HEADER:
{
  "alg": "HS256",
  "typ": "JWT"
}

PAYLOAD:
{
  "sub": "user-uuid",
  "jti": "token-uuid",
  "email": "admin@example.com",
  "iat": 1765548648,        // issued at (seconds)
  "exp": 1765550448,        // expiration (3600 seconds = 1 hour from now)
  "aud": ["SecureApiUser", "SecureApiUser"],
  "iss": "SecureApi",
  "role": "Admin",          // مهم: case-sensitive
  "nbf": 1765548648
}

SIGNATURE:
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret-key
)

مهم جداً:
✓ exp يجب أن يكون عدد صحيح (seconds since epoch)
✓ exp > iat (الانتهاء بعد الإنشاء)
✓ role قد تكون "Admin" أو "admin" (بس كن consistent)
✓ aud و iss يجب أن تطابق ما يتوقعه الـ Backend
*/

// ============================================
// 5️⃣ HEADERS REQUIRED FOR ALL REQUESTS
// ============================================
/*
كل request من Frontend سيشمل:

Authorization: Bearer <token>
x-secret-key: osama123
Content-Type: application/json
Origin: http://localhost:4200

الـ Backend يجب أن يتقبل CORS من:
- http://localhost:4200
- http://localhost:4200/

الـ Response يجب أن تحتوي على:
Access-Control-Allow-Origin: http://localhost:4200
Access-Control-Allow-Credentials: true
*/

// ============================================
// 6️⃣ ERROR RESPONSES REQUIRED
// ============================================
/*
400 Bad Request:
{
  "isSuccess": false,
  "message": "بيانات غير صحيحة",
  "errors": ["field error 1", "field error 2"]
}

401 Unauthorized:
{
  "isSuccess": false,
  "message": "غير مصرح"
}

403 Forbidden:
{
  "isSuccess": false,
  "message": "ليس لديك صلاحيات"
}

404 Not Found:
{
  "isSuccess": false,
  "message": "غير موجود"
}

500 Internal Server Error:
{
  "isSuccess": false,
  "message": "خطأ في الخادم"
}
*/

// ============================================
// 7️⃣ SUMMARY: WHAT FRONTEND EXPECTS
// ============================================
/*
✅ When login succeeds:
   - Return accessToken (valid for ~1 hour)
   - Return refreshToken (valid for ~7 days)
   - User data with role

✅ When access token expires:
   - Return 401 with "exp < now" in JWT
   - Frontend calls /api/Auth/RefreshToken with refreshToken
   - Return new accessToken

✅ When refresh fails:
   - Return 401
   - Frontend clears localStorage and redirects to login

✅ When API request comes with valid token:
   - Process normally and return data

❌ Problems that cause infinite 401 loops:
   - access token never expires (exp in future but set wrong)
   - refresh endpoint doesn't exist
   - refresh endpoint requires expired access token (circular dependency)
   - secret key validation is too strict
*/

export const API_CONTRACT = true;
