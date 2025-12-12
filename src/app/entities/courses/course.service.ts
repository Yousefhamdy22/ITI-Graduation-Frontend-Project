import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from './course.model';

// Hardcoded API URL - environment import not working with SSR
const API_URL = 'http://localhost:5180';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http: HttpClient = inject(HttpClient);

  // جلب جميع الكورسات
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${API_URL}/api/Course/GetAllCourses`);
  }

  // جلب كورس واحد
  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${API_URL}/api/Course/GetCourseById/${id}`);
  }

  // إنشاء كورس جديد
  createCourse(course: any): Observable<any> {
    // Backend expects data wrapped in "dto" property
    return this.http.post<any>(`${API_URL}/api/Course/Create`, { dto: course });
  }

  // تعديل كورس
  updateCourse(id: string, course: any): Observable<any> {
    // Backend expects POST to /api/Course/Update/{id} according to Swagger
    return this.http.post<any>(`${API_URL}/api/Course/Update/${id}`, course);
  }

  // حذف كورس
  deleteCourse(id: string): Observable<any> {
    return this.http.delete<any>(`${API_URL}/api/Course/Delete/${id}`);
  }
}