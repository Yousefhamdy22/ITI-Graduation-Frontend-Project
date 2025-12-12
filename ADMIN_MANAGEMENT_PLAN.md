# 🎯 Plan تعديل نظام الـ Admin

## 📋 المتطلبات:

### 1️⃣ Admin Management System
```
صفحة: /admin/manage
ميزات:
- ✅ عرض قائمة الـ admins الموجودين
- ✅ إضافة admin جديد (فورم)
- ✅ حذف admin (إذا كان أكثر من واحد)
- ✅ تعديل بيانات admin
- ⚠️ فقط الـ Admin يقدر يدخلها
```

### 2️⃣ Login URLs
```
Admin:     /admin/login           (موجود)
Student:   /student-login         (موجود، لكن شوية تعديلات)
Instructor:/instructor/login      (موجود، لكن شوية تعديلات)
```

### 3️⃣ Default Admin
```
Email:    osamafathy@gmail.com
Password: password
Role:     Admin

هذا يكون أول admin في Database
```

---

## 🔧 الملفات اللي نحتاج نعدلها/نضيفها:

| الملف | النوع | الوصف |
|------|------|-------|
| `src/app/auth/admin/admin-manage.component.ts` | ✨ NEW | صفحة إدارة الـ Admins |
| `src/app/auth/admin/admin-manage.component.html` | ✨ NEW | HTML للـ صفحة |
| `src/app/auth/admin/admin-manage.component.css` | ✨ NEW | CSS للـ صفحة |
| `src/app/entities/admin/admin.model.ts` | ✨ NEW | Model للـ Admin |
| `src/app/entities/admin/admin.service.ts` | ✨ NEW | Service لـ API calls |
| `src/app/app.routes.ts` | 🔄 EDIT | إضافة route للـ admin manage |
| `src/app/core/header/admin/admin-header.component.ts` | 🔄 EDIT | إضافة navigation للـ admin manage |

---

## 💾 Backend Requirements

### Endpoints اللي تحتاج:

#### 1. Create Admin
```
METHOD: POST
URL: /api/Admin/CreateAdmin
Headers: Authorization, x-secret-key

REQUEST:
{
  "email": "newadmin@example.com",
  "password": "password123",
  "firstName": "Ahmed",
  "lastName": "Ali"
}

RESPONSE (200 OK):
{
  "isSuccess": true,
  "message": "تم إنشاء الـ Admin بنجاح",
  "admin": {
    "id": "uuid",
    "email": "newadmin@example.com",
    "firstName": "Ahmed",
    "lastName": "Ali",
    "role": "Admin"
  }
}

ERROR (403):
{
  "isSuccess": false,
  "message": "ليس لديك صلاحيات"
}
```

#### 2. Get All Admins
```
METHOD: GET
URL: /api/Admin/GetAdmins
Headers: Authorization, x-secret-key

RESPONSE (200 OK):
{
  "value": [
    {
      "id": "uuid1",
      "email": "admin1@example.com",
      "firstName": "Osama",
      "lastName": "Fathy",
      "role": "Admin"
    }
  ],
  "count": 1
}
```

#### 3. Delete Admin
```
METHOD: DELETE
URL: /api/Admin/DeleteAdmin/{adminId}
Headers: Authorization, x-secret-key

RESPONSE (200 OK):
{
  "isSuccess": true,
  "message": "تم حذف الـ Admin"
}
```

#### 4. Update Admin
```
METHOD: PUT
URL: /api/Admin/UpdateAdmin/{adminId}
Headers: Authorization, x-secret-key

REQUEST:
{
  "email": "newemail@example.com",
  "firstName": "Ahmed",
  "lastName": "Ali"
}

RESPONSE (200 OK):
{
  "isSuccess": true,
  "message": "تم تحديث الـ Admin",
  "admin": {...}
}
```

---

## 🔐 Role-Based Access

```typescript
// Admin يقدر:
- ✅ يسجل دخول من /admin/login
- ✅ يدخل /admin/manage
- ✅ يضيف admin جديد
- ✅ يعدل معلومات admin
- ✅ يحذف admin (إذا أكثر من واحد)

// Student يقدر:
- ✅ يسجل دخول من /student-login
- ✅ يدخل /student/dashboard
- ❌ ما يقدر يدخل /admin/manage

// Instructor يقدر:
- ✅ يسجل دخول من /instructor/login
- ✅ يدخل /instructor/dashboard
- ❌ ما يقدر يدخل /admin/manage
```

---

## 📝 Database Initial Data

عند تشغيل الـ Backend أول مرة:
```sql
INSERT INTO Admin (Id, Email, Password, FirstName, LastName, Role)
VALUES (
  'ca928c51-4901-44a1-8856-f00228cc1177',
  'osamafathy@gmail.com',
  'hashed_password_here',  -- hash الـ password
  'Osama',
  'Fathy',
  'Admin'
)
```

---

## 🎨 UI Flow

```
Login Page (/admin/login)
    ↓
Admin Dashboard (/admin/dashboard)
    ↓ (في الـ header navigation)
Admin Management (/admin/manage)
    ↓
عرض قائمة الـ Admins
    ↓
زر "إضافة Admin جديد" → فورم
    ↓
إدخال البيانات → API call → نجاح/خطأ
```

---

## 📌 الخطوات الكاملة:

1. ✅ انتظر توثيق الـ Backend endpoints
2. ✅ أنشئ admin.model.ts و admin.service.ts
3. ✅ أنشئ admin-manage.component (صفحة الإدارة)
4. ✅ أضيف route جديد للصفحة
5. ✅ أضيف navigation في الـ header
6. ✅ test الـ كل شيء
