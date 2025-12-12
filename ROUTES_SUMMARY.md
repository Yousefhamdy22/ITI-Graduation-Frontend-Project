# 🛣️ Application Routes Summary

## Public Routes (No Auth Required)

### 🏠 Landing & Authentication
- `/` - Student Login Page (Default)
- `/home` - Home/Landing Page
- `/register` - Student Registration
- `/login` - Student Login (alias)
- `/instructor-login` - Instructor Login
- `/admin/login` - Admin Login (Hidden URL)
- `/courses` - Browse Courses (Guest Access)

---

## 🔐 Protected Routes

### 👨‍💼 Admin Routes (`/admin/*`)
**Required Role:** `admin`

- `/admin/dashboard` - Admin Dashboard
  - View statistics (students, instructors, courses, enrollments)
  - Quick actions (add course, create exam, issue certificate)
  
- `/admin/manage` - Admin Management
  - Add new admins
  - View all admins
  - Delete admins

### 👨‍🎓 Student Routes
**Required Role:** `student`

- `/student-dashboard` - Student Dashboard
  - View enrolled courses
  - Track progress
  - View certificates

### 👨‍🏫 Instructor Routes
**Required Role:** `instructor`

- `/instructor-dashboard` - Instructor Dashboard
  - View assigned courses
  - Manage lectures and exams
  - View student enrollments

---

## 📚 Courses Routes

- `/courses` - All Courses List (Public)
- `/courses/new` - Create New Course (Instructor/Admin)
- `/courses/:id` - Course Details
- `/courses/:id/edit` - Edit Course (Instructor/Admin)

---

## 📖 Lectures Routes

- `/lectures/:courseId/:id` - Lecture Player
  - Watch lecture video
  - Navigate between lectures
  - Mark as completed
  - Delete lecture (Instructor only)

---

## 📝 Exams Routes

- `/exams` - All Exams List
- `/exams/new` - Create New Exam (Instructor/Admin)
- `/exams/:id` - Exam Details
- `/exams/:id/play` - Take Exam (Student)
- `/exams/:id/assemble` - Assemble Exam Questions (Instructor/Admin)
- `/exams/course/:courseId` - Pick Course for Exam

---

## ❓ Questions Routes

- `/questions` - All Questions List
- `/questions/new` - Create New Question
- `/questions/:id/edit` - Edit Question
- `/questions/exam/:examId` - Questions for Specific Exam

---

## 👥 Users Routes

### Students
- `/students` - All Students List (Admin/Instructor)
- `/students/:id` - Student Details
- `/students/new` - Add New Student (Admin)
- `/students/:id/edit` - Edit Student (Admin)

### Instructors
- `/instructors` - All Instructors List (Admin)
- `/instructors/:id` - Instructor Details
- `/instructors/new` - Add New Instructor (Admin)
- `/instructors/:id/edit` - Edit Instructor (Admin)

---

## 🏆 Certificates Routes

- `/certificates` - All Certificates List
- `/certificates/new` - Issue New Certificate (Admin)
- `/certificates/:id` - View Certificate

---

## 🔍 Other Routes

- `/search` - Search Functionality
- `**` - 404 Not Found Page

---

## 🔒 Route Guards

### AuthGuard
Checks if user is logged in (has valid JWT token)

### RoleGuard
Checks if user has required role for the route
- Reads `data.role` from route config
- Compares with user's role from JWT token

---

## 📱 Navigation Flow

### Guest User:
1. Lands on `/` (Student Login)
2. Can navigate to:
   - `/register` - Sign up as student
   - `/instructor-login` - Login as instructor
   - `/courses` - Browse courses without login

### Student User:
1. Login → `/student-dashboard`
2. Can access:
   - Courses, Lectures, Exams
   - Own certificates
   - Profile

### Instructor User:
1. Login → `/instructor-dashboard`
2. Can access:
   - Manage courses
   - Create lectures/exams/questions
   - View student enrollments

### Admin User:
1. Login via `/admin/login` → `/admin/dashboard`
2. Full access to:
   - Admin management
   - All CRUD operations
   - System statistics

---

## ⚠️ Important Notes:

1. **Default Route:** Redirects to Student Login
2. **Admin Access:** Hidden from public navigation (direct URL only)
3. **Role-Based:** Each protected route checks user role
4. **Token Required:** All protected routes require valid JWT
5. **404 Page:** Any undefined route shows Not Found page
