import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from './course.model';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {



  constructor(private http: HttpClient) { }

  // جلب جميع الكورسات
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${environment.apiUrl}/api/Course/GetAllCourses`);
  }

  // جلب كورس واحد
  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${environment.apiUrl}/api/Course/GetCourseById/${id}`);
  }

  // إنشاء كورس جديد
  createCourse(course: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/Course/Create`, course);
  }

  // تعديل كورس
  updateCourse(id: string, course: any): Observable<any> {
    // Backend expects POST to /api/Course/Update/{id} according to Swagger
    return this.http.post<any>(`${environment.apiUrl}/api/Course/Update/${id}`, course);
  }

  // حذف كورس
  deleteCourse(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/Course/Delete/${id}`);
  }
}