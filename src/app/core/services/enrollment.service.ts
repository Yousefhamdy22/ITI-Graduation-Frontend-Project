import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { 
  Enrollment, 
  LectureProgress, 
  EnrollmentStatus,
  PaginatedResult 
} from '@core/models/entities.model';

export interface EnrollmentFilters {
  pageNumber?: number;
  pageSize?: number;
  status?: EnrollmentStatus;
  sortBy?: 'enrolledAt' | 'progress' | 'lastAccessedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateEnrollmentDto {
  courseId: string;
}

export interface UpdateLectureProgressDto {
  lectureId: string;
  isCompleted: boolean;
  timeSpent?: number; // in seconds
  lastPosition?: number; // for video progress
}

export interface EnrollmentStatsDto {
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  totalTimeSpent: number; // in minutes
  averageProgress: number;
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/enrollments`;

  // Observable for real-time enrollment updates
  private enrollmentsSubject = new BehaviorSubject<Enrollment[]>([]);
  public enrollments$ = this.enrollmentsSubject.asObservable();

  /**
   * Get all enrollments for the current student
   */
  getMyEnrollments(filters?: EnrollmentFilters): Observable<PaginatedResult<Enrollment>> {
    let params = new HttpParams();

    if (filters) {
      if (filters.pageNumber) params = params.set('pageNumber', filters.pageNumber.toString());
      if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
      if (filters.status) params = params.set('status', filters.status);
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);
    }

    return this.http.get<PaginatedResult<Enrollment>>(`${this.baseUrl}/my-enrollments`, { params })
      .pipe(
        tap(result => this.enrollmentsSubject.next(result.items))
      );
  }

  /**
   * Get a specific enrollment by ID
   */
  getEnrollmentById(enrollmentId: string): Observable<Enrollment> {
    return this.http.get<Enrollment>(`${this.baseUrl}/${enrollmentId}`);
  }

  /**
   * Get enrollment for a specific course
   */
  getEnrollmentByCourse(courseId: string): Observable<Enrollment> {
    return this.http.get<Enrollment>(`${this.baseUrl}/course/${courseId}`);
  }

  /**
   * Check if student is enrolled in a course
   */
  isEnrolled(courseId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check/${courseId}`);
  }

  /**
   * Enroll in a course
   */
  enrollInCourse(dto: CreateEnrollmentDto): Observable<Enrollment> {
    return this.http.post<Enrollment>(this.baseUrl, dto)
      .pipe(
        tap(enrollment => {
          const current = this.enrollmentsSubject.value;
          this.enrollmentsSubject.next([...current, enrollment]);
        })
      );
  }

  /**
   * Update enrollment status
   */
  updateEnrollmentStatus(enrollmentId: string, status: EnrollmentStatus): Observable<Enrollment> {
    return this.http.patch<Enrollment>(`${this.baseUrl}/${enrollmentId}/status`, { status })
      .pipe(
        tap(updated => {
          const current = this.enrollmentsSubject.value;
          const index = current.findIndex(e => e.id === enrollmentId);
          if (index !== -1) {
            current[index] = updated;
            this.enrollmentsSubject.next([...current]);
          }
        })
      );
  }

  /**
   * Update lecture progress
   */
  updateLectureProgress(
    enrollmentId: string, 
    dto: UpdateLectureProgressDto
  ): Observable<LectureProgress> {
    return this.http.post<LectureProgress>(
      `${this.baseUrl}/${enrollmentId}/lecture-progress`, 
      dto
    );
  }

  /**
   * Mark lecture as complete
   */
  markLectureComplete(enrollmentId: string, lectureId: string): Observable<LectureProgress> {
    return this.updateLectureProgress(enrollmentId, {
      lectureId,
      isCompleted: true
    });
  }

  /**
   * Get lecture progress
   */
  getLectureProgress(enrollmentId: string, lectureId: string): Observable<LectureProgress> {
    return this.http.get<LectureProgress>(
      `${this.baseUrl}/${enrollmentId}/lecture-progress/${lectureId}`
    );
  }

  /**
   * Get all lecture progress for an enrollment
   */
  getAllLectureProgress(enrollmentId: string): Observable<LectureProgress[]> {
    return this.http.get<LectureProgress[]>(
      `${this.baseUrl}/${enrollmentId}/lecture-progress`
    );
  }

  /**
   * Get enrollment statistics for current student
   */
  getMyStats(): Observable<EnrollmentStatsDto> {
    return this.http.get<EnrollmentStatsDto>(`${this.baseUrl}/my-stats`);
  }

  /**
   * Calculate course progress percentage
   */
  calculateProgress(completedLectures: number, totalLectures: number): number {
    if (totalLectures === 0) return 0;
    return Math.round((completedLectures / totalLectures) * 100);
  }

  /**
   * Drop/unenroll from a course
   */
  dropCourse(enrollmentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${enrollmentId}`)
      .pipe(
        tap(() => {
          const current = this.enrollmentsSubject.value;
          this.enrollmentsSubject.next(current.filter(e => e.id !== enrollmentId));
        })
      );
  }

  /**
   * Request certificate
   */
  requestCertificate(enrollmentId: string): Observable<{ certificateUrl: string }> {
    return this.http.post<{ certificateUrl: string }>(
      `${this.baseUrl}/${enrollmentId}/certificate`, 
      {}
    );
  }

  /**
   * Get recent activity
   */
  getRecentActivity(limit: number = 10): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.baseUrl}/recent-activity`, {
      params: new HttpParams().set('limit', limit.toString())
    });
  }

  /**
   * Clear local cache
   */
  clearCache(): void {
    this.enrollmentsSubject.next([]);
  }
}
