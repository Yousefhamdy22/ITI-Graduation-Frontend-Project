# 📡 API Endpoints Summary

## Base URL: `http://localhost:5180/api`

---

## 🔐 Authentication

### Admin
- **POST** `/admin/login` - Admin login
- **POST** `/admin/register` - Register new admin (from admin dashboard)
- **GET** `/admin/admins` - Get all admins
- **DELETE** `/admin/{id}` - Delete admin

### Student
- **POST** `/Auth/StudentLogin` - Student login
- **POST** `/Auth/RegisterStudent` - Student registration

### Instructor
- **POST** `/Auth/InstructorLogin` - Instructor login

### Token Refresh
- **POST** `/Auth/RefreshToken` - Refresh access token

---

## 📚 Courses
- **GET** `/courses` - Get all courses
- **GET** `/courses/{id}` - Get course by ID
- **POST** `/courses` - Create new course
- **PUT** `/courses/{id}` - Update course
- **DELETE** `/courses/{id}` - Delete course
- **GET** `/courses/{courseId}/lectures` - Get lectures for course

---

## 📖 Lectures
- **GET** `/Lectures` - Get all lectures
- **GET** `/Lectures/{id}` - Get lecture by ID
- **POST** `/Lectures` - Create new lecture
- **PUT** `/Lectures/{id}` - Update lecture
- **DELETE** `/Lectures/{id}` - Delete lecture
- **GET** `/Lectures/GetLecturesByModule?moduleId={id}` - Get lectures by module

---

## 📝 Exams
- **GET** `/exams` - Get all exams
- **GET** `/exams/{id}` - Get exam by ID
- **POST** `/exams` - Create new exam
- **PUT** `/exams/{id}` - Update exam
- **DELETE** `/exams/{id}` - Delete exam
- **GET** `/courses/{courseId}/exams` - Get exams for course
- **POST** `/exams/{examId}/submit` - Submit exam answers

---

## ❓ Questions
- **GET** `/questions` or `/Question/GetQuestions` - Get all questions
- **GET** `/Question/GetQuestionsByExamId?examId={id}` - Get questions by exam
- **POST** `/CreateQuestion` - Create new question
- **PUT** `/UpdateQuestion` - Update question
- **DELETE** `/RemoveQuestion/{id}` - Delete question

---

## 👨‍🎓 Students
- **GET** `/students` - Get all students
- **GET** `/students/{id}` - Get student by ID
- **GET** `/students/user/{userId}` - Get student by user ID
- **GET** `/students/CourseEnrollment/{studentId}` - Get enrollments for student
- **GET** `/students/GetAllWithEnrollments` - Get all students with enrollments
- **POST** `/students` - Create new student
- **POST** `/students/submit` - Submit student work
- **DELETE** `/students/{id}` - Delete student

---

## 👨‍🏫 Instructors
- **GET** `/Instructor/GetInstructors` - Get all instructors
- **GET** `/Instructor/GetInstructorById/{id}` - Get instructor by ID
- **POST** `/Instructor/CreateInstructor` - Create new instructor
- **PUT** `/Instructor/UpdateInstructor` - Update instructor
- **DELETE** `/Instructor/RemoveInstructor/{id}` - Delete instructor

---

## 🎓 Enrollments
- **GET** `/enrollments` - Get all enrollments
- **GET** `/enrollments/{id}` - Get enrollment by ID
- **POST** `/enrollments` - Create enrollment
- **PUT** `/enrollments/{id}` - Update enrollment
- **DELETE** `/enrollments/{id}` - Delete enrollment

---

## 🏆 Certificates
- **POST** `/certificates/issue` - Issue new certificate
- **GET** `/certificates/View%20Certificate` - View all certificates

---

## 📋 Notes:
1. All authenticated endpoints require:
   - `Authorization: Bearer {token}`
   - `x-secret-key: osama123`

2. Role-based access:
   - Admin: Full access to all endpoints
   - Instructor: Access to courses, lectures, exams, questions
   - Student: Access to view courses, submit exams, view certificates

3. Response format:
```json
{
  "isSuccess": true,
  "message": "Success message",
  "data": { ... }
}
```

4. Error format:
```json
{
  "isSuccess": false,
  "message": "Error message",
  "errors": ["Error detail 1", "Error detail 2"]
}
```
