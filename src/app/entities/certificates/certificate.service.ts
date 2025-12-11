import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  courseName: string;
  issuedAt: string;
  certificateNumber: string;
}

@Injectable({ providedIn: 'root' })
export class CertificateService {
  private BASE_URL = 'http://localhost:5180/api/Certificates';

  constructor(private http: HttpClient) { }

  // Issue certificate
  issueCertificate(userId: string, courseId: string): Observable<Certificate> {
    return this.http.post<Certificate>(`${this.BASE_URL}/issue`, {
      userId,
      courseId
    });
  }

  // View my certificates
  // Backend route is defined as "View Certificate" (contains a space).
  // Use encoded path to match the backend until backend route is fixed.
  getMyCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.BASE_URL}/View%20Certificate`);
  }
}
