import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lecture } from './lesson.model';
import { environment } from '../../../environment/environment';

/**
 * LessonService - handles Lecture API operations
 * Note: Service is named LessonService for backward compatibility,
 * but interacts with the Lectures API endpoint
 */
@Injectable({ providedIn: 'root' })
export class LessonService {
  private BASE_URL = `${environment.apiUrl}/api/Lectures`;

  private lecturesSubject = new BehaviorSubject<Lecture[]>([]);
  lectures$ = this.lecturesSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Get lectures by module ID
   * @param moduleId - The module/course ID
   * @returns Observable of lectures array
   */
  getLecturesByModule(moduleId: string): Observable<Lecture[]> {
    return this.http.get<Lecture[]>(`${this.BASE_URL}/ByModule/${moduleId}`);
  }

  /**
   * Delete a lecture
   * @param lectureId - The lecture ID to delete
   * @returns Observable with success message
   */
  deleteLecture(lectureId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.BASE_URL}/${lectureId}`);
  }

  // ========================================
  // DISABLED ENDPOINTS (Not active in backend)
  // ========================================

  /**
   * Create a new lecture (DISABLED - endpoint not active)
   * @param lecture - Lecture data to create
   * @returns Observable of created lecture
   */
  // createLecture(lecture: Partial<Lecture>): Observable<Lecture> {
  //   return this.http.post<Lecture>(`${this.BASE_URL}`, lecture);
  // }

  /**
   * Get lectures for a specific student (DISABLED - endpoint not active)
   * @param studentId - The student ID
   * @returns Observable of student's lectures
   */
  // getStudentLectures(studentId: string): Observable<Lecture[]> {
  //   return this.http.get<Lecture[]>(`${environment.apiUrl}/api/Students/${studentId}/lectures`);
  // }

  // ========================================
  // HELPER METHODS
  // ========================================

  /**
   * Get total lectures count
   */
  getTotalLectures$(): Observable<number> {
    return this.lectures$.pipe(map(lectures => lectures.length));
  }

  /**
   * Load lectures into the subject
   * @param lectures - Array of lectures to load
   */
  loadLectures(lectures: Lecture[]) {
    this.lecturesSubject.next(lectures);
  }

  // ========================================
  // LEGACY METHODS (for backward compatibility)
  // ========================================

  /**
   * @deprecated Use getLecturesByModule instead
   */
  getLessons(): Observable<Lecture[]> {
    console.warn('getLessons() is deprecated. Use getLecturesByModule(moduleId) instead.');
    return this.lectures$;
  }

  /**
   * @deprecated Use getLecturesByModule instead
   */
  getLessonById(id: string): Observable<Lecture | null> {
    console.warn('getLessonById() is deprecated. Backend does not support getting single lecture by ID.');
    return this.lectures$.pipe(
      map(lectures => lectures.find(l => l.id === id) || null)
    );
  }

  /**
   * @deprecated Use getLecturesByModule instead
   */
  getLessonsByCourse(courseId: string): Observable<Lecture[]> {
    console.warn('getLessonsByCourse() is deprecated. Use getLecturesByModule(moduleId) instead.');
    return this.getLecturesByModule(courseId);
  }
}
