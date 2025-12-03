import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Certificate } from './certificate.model';

@Injectable({ providedIn: 'root' })
export class CertificateService {
  private mockData: Certificate[] = [
    {
      id: '1',
      studentId: '1',
      studentName: 'أحمد محمد',
      courseId: '1',
      courseName: 'Python للمبتدئين',
      grade: 95,
      issueDate: new Date('2024-11-15'),
      instructorName: 'د. سارة أحمد'
    },
    {
      id: '2',
      studentId: '2',
      studentName: 'فاطمة علي',
      courseId: '2',
      courseName: 'JavaScript المتقدم',
      grade: 88,
      issueDate: new Date('2024-11-20'),
      instructorName: 'م. خالد حسن'
    }
  ];

  private certificatesSubject = new BehaviorSubject<Certificate[]>(this.mockData);
  certificates$ = this.certificatesSubject.asObservable();

  constructor() {}

  getCertificates(): Observable<Certificate[]> {
    return this.certificates$;
  }

  getCertificateById(id: string): Observable<Certificate | undefined> {
    return new BehaviorSubject(this.mockData.find(c => c.id === id)).asObservable();
  }

  createCertificate(cert: Partial<Certificate>): Certificate {
    const newCert: Certificate = {
      id: Date.now().toString(),
      studentId: cert.studentId || '',
      studentName: cert.studentName || '',
      courseId: cert.courseId || '',
      courseName: cert.courseName || '',
      grade: cert.grade || 0,
      issueDate: new Date(),
      instructorName: cert.instructorName
    };
    this.mockData.push(newCert);
    this.certificatesSubject.next([...this.mockData]);
    return newCert;
  }

  getCertificatesByStudent(studentId: string): Observable<Certificate[]> {
    return new BehaviorSubject(this.mockData.filter(c => c.studentId === studentId)).asObservable();
  }
}
