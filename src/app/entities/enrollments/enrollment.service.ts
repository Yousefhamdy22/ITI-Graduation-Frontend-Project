import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface Enrollment {
    id: string;
    studentId: string;
    courseId: string;
    enrollmentDate: string;
    status?: string;
    student?: any;
    course?: any;
}

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
    private BASE_URL = `${environment.apiUrl}/api/Enrollments`;

    constructor(private http: HttpClient) { }

    // Get all enrollments
    getEnrollments(): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(this.BASE_URL);
    }

    // Get enrollment by ID
    getEnrollmentById(id: string): Observable<Enrollment> {
        return this.http.get<Enrollment>(`${this.BASE_URL}/${id}`);
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
