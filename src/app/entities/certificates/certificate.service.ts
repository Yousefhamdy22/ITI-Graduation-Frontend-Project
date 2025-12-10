import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

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
  private BASE_URL = `${environment.apiUrl}/api/Certificates`;

  constructor(private http: HttpClient) { }

  // Issue certificate
  issueCertificate(userId: string, courseId: string): Observable<Certificate> {
    return this.http.post<Certificate>(`${this.BASE_URL}/issue`, {
      userId,
      courseId
    });
  }

  // View my certificates
  getMyCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.BASE_URL}/ViewCertificate`);
  }
}
