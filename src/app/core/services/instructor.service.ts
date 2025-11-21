import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Course, Student, Enrollment, CourseListDto } from '@core/models/entities.model';

export interface InstructorStatsDto {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalStudents: number;
  activeEnrollments: number;
  completedEnrollments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageRating: number;
  totalReviews: number;
}

export interface CourseStatDto {
  courseId: string;
  courseTitle: string;
  totalStudents: number;
  activeStudents: number;
  completedStudents: number;
  averageProgress: number;
  revenue: number;
  rating: number;
  totalReviews: number;
}

export interface StudentEnrollmentDto {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  courseId: string;
  courseTitle: string;
  enrolledAt: Date;
  progress: number;
  lastAccessedAt?: Date;
  status: string;
}

export interface RevenueDataDto {
  date: string;
  amount: number;
  enrollmentCount: number;
}

export interface RecentActivityDto {
  id: string;
  type: 'enrollment' | 'completion' | 'review' | 'question';
  studentName: string;
  courseName: string;
  message: string;
  timestamp: Date;
  avatar?: string;
}

export interface InstructorDashboardDto {
  stats: InstructorStatsDto;
  topCourses: CourseStatDto[];
  recentEnrollments: StudentEnrollmentDto[];
  recentActivity: RecentActivityDto[];
  revenueData: RevenueDataDto[];
}

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/instructor`;

  /**
   * Get instructor dashboard data
   */
  getDashboard(): Observable<InstructorDashboardDto> {
    return this.http.get<InstructorDashboardDto>(`${this.baseUrl}/dashboard`);
  }

  /**
   * Get instructor statistics
   */
  getStats(): Observable<InstructorStatsDto> {
    return this.http.get<InstructorStatsDto>(`${this.baseUrl}/stats`);
  }

  /**
   * Get instructor courses with statistics
   */
  getMyCourses(): Observable<CourseListDto[]> {
    return this.http.get<CourseListDto[]>(`${this.baseUrl}/courses`);
  }

  /**
   * Get a single course
   */
  getCourse(courseId: string): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/courses/${courseId}`);
  }

  /**
   * Create a new course
   */
  createCourse(courseData: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}/courses`, courseData);
  }

  /**
   * Update an existing course
   */
  updateCourse(courseId: string, courseData: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/courses/${courseId}`, courseData);
  }

  /**
   * Delete a course
   */
  deleteCourse(courseId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/courses/${courseId}`);
  }

  /**
   * Get detailed statistics for a specific course
   */
  getCourseStats(courseId: string): Observable<CourseStatDto> {
    return this.http.get<CourseStatDto>(`${this.baseUrl}/courses/${courseId}/stats`);
  }

  /**
   * Get all students enrolled in instructor's courses
   */
  getStudentEnrollments(courseId: string, filters?: {
    status?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Observable<StudentEnrollmentDto[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.pageNumber) params = params.set('pageNumber', filters.pageNumber.toString());
      if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
    }

    return this.http.get<StudentEnrollmentDto[]>(`${this.baseUrl}/courses/${courseId}/students`, { params });
  }

  /**
   * Get revenue data over time
   */
  getRevenueData(period: 'week' | 'month' | 'year' = 'month'): Observable<RevenueDataDto[]> {
    return this.http.get<RevenueDataDto[]>(`${this.baseUrl}/revenue`, {
      params: new HttpParams().set('period', period)
    });
  }

  /**
   * Get recent activity
   */
  getRecentActivity(limit: number = 10): Observable<RecentActivityDto[]> {
    return this.http.get<RecentActivityDto[]>(`${this.baseUrl}/activity`, {
      params: new HttpParams().set('limit', limit.toString())
    });
  }

  /**
   * Get instructor profile
   */
  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile`);
  }

  /**
   * Update instructor profile
   */
  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/profile`, data);
  }

  // ============================================
  // MODULE MANAGEMENT
  // ============================================

  /**
   * Get all modules for a course
   */
  getCourseModules(courseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/courses/${courseId}/modules`);
  }

  /**
   * Create a new module
   */
  createModule(moduleData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/modules`, moduleData);
  }

  /**
   * Update a module
   */
  updateModule(moduleId: string, moduleData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/modules/${moduleId}`, moduleData);
  }

  /**
   * Delete a module
   */
  deleteModule(moduleId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/modules/${moduleId}`);
  }

  // ============================================
  // LECTURE MANAGEMENT
  // ============================================

  /**
   * Create a new lecture
   */
  createLecture(lectureData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/lectures`, lectureData);
  }

  /**
   * Update a lecture
   */
  updateLecture(lectureId: string, lectureData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/lectures/${lectureId}`, lectureData);
  }

  /**
   * Delete a lecture
   */
  deleteLecture(lectureId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/lectures/${lectureId}`);
  }

  /**
   * Upload lecture content (videos, PDFs, etc.)
   */
  uploadLectureContent(lectureId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${environment.apiUrl}/lectures/${lectureId}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}

