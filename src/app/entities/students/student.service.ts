import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Student } from './student.model';

import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private BASE_URL = `${environment.apiUrl}/api/Students`;

  constructor(private http: HttpClient) { }

  // Get all students
  getStudents(): Observable<Student[]> {
    return this.http.get<any[]>(this.BASE_URL).pipe(
      map(students => students.map(s => this.mapToStudent(s)))
    );
  }

  // Get student by ID
  getStudentById(id: string): Observable<Student | null> {
    return this.http.get<any>(`${this.BASE_URL}/${id}`).pipe(
      map(s => s ? this.mapToStudent(s) : null)
    );
  }

  // Get student by User ID
  getStudentByUserId(userId: string): Observable<Student | null> {
    return this.http.get<any>(`${this.BASE_URL}/user/${userId}`).pipe(
      map(s => s ? this.mapToStudent(s) : null)
    );
  }

  // Get student enrollments
  getStudentEnrollments(studentId: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/CourseEnrollment/${studentId}`);
  }

  // Get all students with enrollments
  getAllStudentsWithEnrollments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/GetAllWithEnrollments`);
  }

  // Create student
  createStudent(data: { firstName: string; lastName: string; email: string }): Observable<any> {
    return this.http.post<any>(this.BASE_URL, data);
  }

  // Submit student answer
  submitAnswer(questionId: string, selectedAnswerId: string): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/submit`, {
      questionId,
      selectedAnswerId
    });
  }

  // Delete student
  deleteStudent(id: string): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/${id}`);
  }

  // Helper: Get total students count
  getTotalStudents$(): Observable<number> {
    return this.getStudents().pipe(map(students => students.length));
  }

  // Helper: Map API response to Student model
  private mapToStudent(apiStudent: any): Student {
    return {
      ...apiStudent,
      enrolledCourseIds: apiStudent.enrollments?.map((e: any) => e.id) || []
    };
  }

  // Legacy methods for backward compatibility (can be removed later)
  addStudent(student: Partial<Student>): Observable<any> {
    return this.createStudent({
      firstName: student.firstName || 'Student',
      lastName: student.lastName || '',
      email: student.email || ''
    });
  }

  updateStudent(id: string, patch: Partial<Student>): Observable<any> {
    // Note: Update endpoint not in API docs, might need backend implementation
    console.warn('Update student endpoint not available in API');
    return this.getStudentById(id);
  }

  enrollStudentInCourse(studentId: string, courseId: string): void {
    // This should use Enrollment service instead
    console.warn('Use EnrollmentService.createEnrollment() instead');
  }

  unenrollStudentFromCourse(studentId: string, courseId: string): void {
    // This should use Enrollment service instead
    console.warn('Use EnrollmentService.cancelEnrollment() instead');
  }
}
