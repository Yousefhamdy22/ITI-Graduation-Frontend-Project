# 🛠️ Backend Requirements - Admin Management System

## 📋 ملخص التغييرات في الـ Frontend

✅ تم إضافة:
1. صفحة جديدة `/admin/manage` لإدارة الـ Admins
2. Admin Model و Admin Service
3. Routes جديدة:
   - `/admin/login` (موجود)
   - `/admin/dashboard` (موجود)
   - `/admin/manage` (جديد) ← صفحة إدارة الـ Admins
4. Navigation في الـ Admin Header

---

## 🔌 Backend API Endpoints المطلوبة

### 1️⃣ Get All Admins

```http
GET /api/Admin/GetAdmins
Authorization: Bearer <access_token>
x-secret-key: osama123
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "value": [
    {
      "id": "ca928c51-4901-44a1-8856-f00228cc1177",
      "email": "osamafathy@gmail.com",
      "firstName": "Osama",
      "lastName": "Fathy",
      "role": "Admin"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "neweadmin@example.com",
      "firstName": "Ahmed",
      "lastName": "Ali",
      "role": "Admin"
    }
  ],
  "count": 2
}
```

**Error (401 Unauthorized):**
```json
{
  "isSuccess": false,
  "message": "التوكن انتهت صلاحيته"
}
```

**Error (403 Forbidden):**
```json
{
  "isSuccess": false,
  "message": "ليس لديك صلاحيات"
}
```

---

### 2️⃣ Create Admin

```http
POST /api/Admin/CreateAdmin
Authorization: Bearer <access_token>
x-secret-key: osama123
Content-Type: application/json

{
  "email": "newadmin@example.com",
  "password": "SecurePassword123",
  "firstName": "Ahmed",
  "lastName": "Ali"
}
```

**Response (200 OK):**
```json
{
  "isSuccess": true,
  "message": "تم إنشاء الـ Admin بنجاح",
  "admin": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "newadmin@example.com",
    "firstName": "Ahmed",
    "lastName": "Ali",
    "role": "Admin"
  }
}
```

**Error (400 Bad Request):**
```json
{
  "isSuccess": false,
  "message": "البريد الإلكتروني موجود بالفعل"
}
```

**Error (403 Forbidden):**
```json
{
  "isSuccess": false,
  "message": "ليس لديك صلاحيات إنشاء admins جدد"
}
```

---

### 3️⃣ Delete Admin

```http
DELETE /api/Admin/DeleteAdmin/{adminId}
Authorization: Bearer <access_token>
x-secret-key: osama123
Content-Type: application/json
```

**Parameters:**
- `adminId`: UUID الخاص بـ Admin المراد حذفه

**Response (200 OK):**
```json
{
  "isSuccess": true,
  "message": "تم حذف الـ Admin بنجاح"
}
```

**Error (400 Bad Request):**
```json
{
  "isSuccess": false,
  "message": "لا يمكن حذف آخر Admin في النظام"
}
```

**Error (403 Forbidden):**
```json
{
  "isSuccess": false,
  "message": "ليس لديك صلاحيات"
}
```

**Error (404 Not Found):**
```json
{
  "isSuccess": false,
  "message": "الـ Admin غير موجود"
}
```

---

### 4️⃣ Update Admin (Optional - للمستقبل)

```http
PUT /api/Admin/UpdateAdmin/{adminId}
Authorization: Bearer <access_token>
x-secret-key: osama123
Content-Type: application/json

{
  "email": "newemail@example.com",
  "firstName": "Ahmed",
  "lastName": "Ali"
}
```

**Response (200 OK):**
```json
{
  "isSuccess": true,
  "message": "تم تحديث الـ Admin",
  "admin": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "newemail@example.com",
    "firstName": "Ahmed",
    "lastName": "Ali",
    "role": "Admin"
  }
}
```

---

## 💾 Database Requirements

### Admin Table - Initial Data

عند تشغيل الـ Backend أول مرة، يجب يكون في database:

```sql
INSERT INTO Admins (Id, Email, PasswordHash, FirstName, LastName, Role, CreatedAt)
VALUES (
  'ca928c51-4901-44a1-8856-f00228cc1177',
  'osamafathy@gmail.com',
  '[HASHED_PASSWORD_OF: password]',  -- استخدم bcrypt أو similar
  'Osama',
  'Fathy',
  'Admin',
  GETUTCDATE()
);
```

**Password Note:**
- الـ password الأول: `password`
- Password يجب يكون hashed (استخدم bcrypt, PBKDF2, أو similar)
- لا تخزن الـ password plain text

---

## 🔐 Authorization Rules

فقط الـ Admin يقدر يدخل صفحة `/admin/manage`:

```typescript
// Frontend Guard:
canActivate: [AuthGuard, RoleGuard]
data: {role: 'admin'}
```

**الـ Backend يجب يتحقق من:**
1. ✅ التوكن صحيح ولم تنتهِ صلاحيته
2. ✅ الـ role في التوكن = "Admin"
3. ✅ الـ x-secret-key = "osama123"

---

## 📊 HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | تم الحصول على الـ admins |
| 201 | Created | تم إنشاء admin جديد |
| 400 | Bad Request | بريد إلكتروني موجود |
| 401 | Unauthorized | التوكن انتهى |
| 403 | Forbidden | ليس لديك صلاحيات |
| 404 | Not Found | الـ admin غير موجود |
| 500 | Server Error | خطأ في الـ server |

---

## 🧪 Testing Checklist

قبل ما تقول إن الـ Backend جاهز:

- [ ] `/api/Admin/GetAdmins` يرجع قائمة الـ admins
- [ ] `/api/Admin/CreateAdmin` ينشئ admin جديد
- [ ] `/api/Admin/DeleteAdmin/{id}` يحذف admin
- [ ] كل endpoint يتطلب `Authorization` header
- [ ] كل endpoint يتطلب `x-secret-key` header
- [ ] فقط الـ Admin يقدر يعدل الـ endpoints دي
- [ ] الـ response format يطابق الـ schema أعلاه

---

## 💻 C# Backend Example (شنو تقريباً يجب تكون)

### Admin Controller
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    
    // GET: api/Admin/GetAdmins
    [HttpGet("GetAdmins")]
    public async Task<IActionResult> GetAdmins()
    {
        var admins = await _adminService.GetAllAdminsAsync();
        return Ok(new { value = admins, count = admins.Count });
    }
    
    // POST: api/Admin/CreateAdmin
    [HttpPost("CreateAdmin")]
    public async Task<IActionResult> CreateAdmin([FromBody] CreateAdminRequest request)
    {
        var result = await _adminService.CreateAdminAsync(request);
        if (!result.IsSuccess) return BadRequest(result);
        return Ok(result);
    }
    
    // DELETE: api/Admin/DeleteAdmin/{id}
    [HttpDelete("DeleteAdmin/{id}")]
    public async Task<IActionResult> DeleteAdmin(string id)
    {
        var result = await _adminService.DeleteAdminAsync(id);
        if (!result.IsSuccess) return BadRequest(result);
        return Ok(result);
    }
}
```

---

## 🔑 Frontend Usage Example

```typescript
// في الـ Component:
this.adminService.getAllAdmins().subscribe({
  next: (response) => {
    console.log('Admins:', response.value);
  },
  error: (error) => {
    console.error('Error:', error);
  }
});

// Create Admin
this.adminService.createAdmin({
  email: 'newadmin@example.com',
  password: 'password123',
  firstName: 'Ahmed',
  lastName: 'Ali'
}).subscribe({
  next: (response) => {
    if (response.isSuccess) {
      console.log('Admin created!');
    }
  }
});
```

---

## 📌 الملفات الجديدة في الـ Frontend

```
src/app/
├── auth/
│   └── admin/
│       ├── admin-manage.component.ts    (منطق الصفحة)
│       ├── admin-manage.component.html  (الـ HTML)
│       └── admin-manage.component.css   (الـ Styles)
└── entities/
    └── admin/
        ├── admin.model.ts               (الـ Models والـ Interfaces)
        └── admin.service.ts             (الـ API calls)
```

---

## 🚀 الـ Flow كاملاً

```
1. Admin يسجل دخول من /admin/login
   ↓
2. يدخل /admin/dashboard
   ↓
3. من الـ navigation يضغط "إدارة الـ Admins"
   ↓
4. يذهب إلى /admin/manage
   ↓
5. الصفحة تجلب قائمة الـ admins من GET /api/Admin/GetAdmins
   ↓
6. Admin يقدر:
   - عرض كل الـ admins
   - إضافة admin جديد (form)
   - حذف admin (button)
```

---

## ✅ Ready?

عندما تخلص الـ Backend endpoints دي:
1. شغّل الـ Frontend
2. سجل دخول من `/admin/login`
3. اضغط "إدارة الـ Admins"
4. جرّب إضافة admin جديد
5. جرّب حذف admin

الـ Frontend سيرسل الـ requests بشكل صحيح للـ Backend! 🎉
