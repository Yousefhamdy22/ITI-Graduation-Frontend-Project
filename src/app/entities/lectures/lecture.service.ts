import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Lecture, CreateLecture } from './lecture.model';

/**
 * LectureService - handles Lecture API operations
 * Course contains Lectures
 */
@Injectable({ providedIn: 'root' })
export class LectureService {
  private BASE_URL = 'http://localhost:5180/api/Lectures';

  private lecturesSubject = new BehaviorSubject<Lecture[]>([]);
  lectures$ = this.lecturesSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Get lectures by module ID
   */
  getLecturesByModule(moduleId: string): Observable<Lecture[]> {
    return this.http.get<Lecture[]>(`${this.BASE_URL}/ByModule/${moduleId}`);
  }

  /**
   * Get lecture by ID
   */
  getLectureById(lectureId: string): Observable<Lecture> {
    return this.http.get<Lecture>(`${this.BASE_URL}/${lectureId}`);
  }

  /**
   * Create a new lecture
   */
  createLecture(data: CreateLecture): Observable<Lecture> {
    return this.http.post<Lecture>(this.BASE_URL, data);
  }

  /**
   * Update lecture
   */
  updateLecture(data: Lecture): Observable<Lecture> {
    return this.http.put<Lecture>(`${this.BASE_URL}/${data.id}`, data);
  }

  /**
   * Delete a lecture
   */
  deleteLecture(lectureId: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${lectureId}`);
  }
}

// Alias for backward compatibility
export { LectureService as LessonService };
