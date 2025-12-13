import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Enrollment, EnrollmentDetails } from './enrollment.model';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
    private http: HttpClient = inject(HttpClient);
    private BASE_URL = 'http://localhost:5180/api/Enrollments';

    // Get all enrollments
    getEnrollments(): Observable<EnrollmentDetails[]> {
        return this.http.get<EnrollmentDetails[]>(this.BASE_URL);
    }

    // Get enrollment by ID
    getEnrollmentById(id: string): Observable<EnrollmentDetails> {
        return this.http.get<EnrollmentDetails>(`${this.BASE_URL}/${id}`);
    }

    // Get enrollments for a specific student
    getEnrollmentsByStudentId(studentId: string): Observable<EnrollmentDetails[]> {
        return this.http.get<EnrollmentDetails[]>(`${this.BASE_URL}/student/${studentId}`);
    }

    // Create enrollment
    createEnrollment(studentId: string, courseId: string): Observable<any> {
        return this.http.post<any>(this.BASE_URL, {
            studentId,
            courseId
        });
    }

    // Update enrollment status
    updateEnrollmentStatus(enrollmentId: string, status: string): Observable<any> {
        return this.http.put<any>(`${this.BASE_URL}/${enrollmentId}`, {
            enrollmentId,
            status
        });
    }

    // Cancel enrollment
    cancelEnrollment(id: string, cancellationReason?: string): Observable<any> {
        return this.http.delete<any>(`${this.BASE_URL}/${id}`, {
            body: {
                id,
                cancellationReason: cancellationReason || 'User requested cancellation'
            }
        });
    }
}
