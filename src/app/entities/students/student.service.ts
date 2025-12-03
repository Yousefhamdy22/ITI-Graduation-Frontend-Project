import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Student } from './student.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private useMock = true;

  private mockData: Student[] = [
    { id: '1', name: 'محمد علي', email: 'محمد@example.com', phone: '01000000001', enrolledCourses: 3, enrolledCourseIds: ['1'], avatar: 'https://i.pravatar.cc/150?img=1', joinDate: '2025-01-15' },
    { id: '2', name: 'فاطمة أحمد', email: 'فاطمة@example.com', phone: '01000000002', enrolledCourses: 5, enrolledCourseIds: ['1','2'], avatar: 'https://i.pravatar.cc/150?img=2', joinDate: '2024-11-20' },
    { id: '3', name: 'عمر خالد', email: 'عمر@example.com', phone: '01000000003', enrolledCourses: 2, enrolledCourseIds: ['2'], avatar: 'https://i.pravatar.cc/150?img=3', joinDate: '2025-01-10' },
    { id: '4', name: 'ليلى حسن', email: 'ليلى@example.com', phone: '01000000004', enrolledCourses: 4, enrolledCourseIds: ['1','3'], avatar: 'https://i.pravatar.cc/150?img=4', joinDate: '2024-12-05' },
    { id: '5', name: 'أحمد سالم', email: 'أحمد@example.com', phone: '01000000005', enrolledCourses: 6, enrolledCourseIds: ['3','2'], avatar: 'https://i.pravatar.cc/150?img=5', joinDate: '2024-10-30' },
    { id: '6', name: 'نور محمد', email: 'نور@example.com', phone: '01000000006', enrolledCourses: 3, enrolledCourseIds: ['1'], avatar: 'https://i.pravatar.cc/150?img=6', joinDate: '2025-01-08' }
  ];

  private studentsSubject = new BehaviorSubject<Student[]>(this.mockData);
  students$ = this.studentsSubject.asObservable();

  getTotalStudents$() {
    return this.students$.pipe(map(s => s.length));
  }

  constructor() {
    if (this.useMock) {
      // try to load persisted students first (guard for server/SSR where localStorage is unavailable)
      try {
        const hasStorage = typeof globalThis !== 'undefined' && typeof (globalThis as any).localStorage !== 'undefined';
        if (hasStorage) {
          const raw = (globalThis as any).localStorage.getItem('students_data');
          if (raw) {
            try { this.mockData = JSON.parse(raw); } catch {}
          }
        }
      } catch (e) {
        // ignore - storage not available
      }
      this.studentsSubject.next(this.mockData);
    }
  }

  getStudents(): Observable<Student[]> {
    return this.useMock
      ? of(this.mockData).pipe(delay(300))
      : this.students$;
  }

  getStudentById(id: string): Observable<Student | null> {
    return this.useMock
      ? of(this.mockData.find(s => s.id === id) || null).pipe(delay(300))
      : of(null);
  }

  loadStudents(students: Student[]) {
    this.studentsSubject.next(students);
  }

  addStudent(student: Partial<Student>): Student {
    const s: Student = {
      id: (Date.now()).toString(),
      name: student.name || 'طالب جديد',
      email: student.email || '',
      phone: student.phone || '',
      enrolledCourses: student.enrolledCourses || 0,
      avatar: student.avatar || `https://i.pravatar.cc/150?u=${Date.now()}`,
      joinDate: student.joinDate || new Date().toISOString().slice(0,10)
    } as Student;
    this.mockData.push(s);
    this.persist();
    this.studentsSubject.next(this.mockData);
    return s;
  }

  private persist() {
    try {
      const hasStorage = typeof globalThis !== 'undefined' && typeof (globalThis as any).localStorage !== 'undefined';
      if (hasStorage) (globalThis as any).localStorage.setItem('students_data', JSON.stringify(this.mockData));
    } catch {}
  }

  enrollStudentInCourse(studentId: string, courseId: string) {
    const idx = this.mockData.findIndex(s => s.id === studentId);
    if (idx === -1) return;
    const s = this.mockData[idx];
    s.enrolledCourseIds = s.enrolledCourseIds || [];
    if (!s.enrolledCourseIds.includes(courseId)) {
      s.enrolledCourseIds.push(courseId);
      s.enrolledCourses = (s.enrolledCourseIds.length || 0);
      this.persist();
      this.studentsSubject.next([...this.mockData]);
    }
  }

  unenrollStudentFromCourse(studentId: string, courseId: string) {
    const idx = this.mockData.findIndex(s => s.id === studentId);
    if (idx === -1) return;
    const s = this.mockData[idx];
    s.enrolledCourseIds = s.enrolledCourseIds || [];
    if (s.enrolledCourseIds.includes(courseId)) {
      s.enrolledCourseIds = s.enrolledCourseIds.filter(id => id !== courseId);
      s.enrolledCourses = (s.enrolledCourseIds.length || 0);
      this.persist();
      this.studentsSubject.next([...this.mockData]);
    }
  }

  updateStudent(id: string, patch: Partial<Student>) {
    const idx = this.mockData.findIndex(s => s.id === id);
    if (idx === -1) return null;
    const s = this.mockData[idx];
    const updated = { ...s, ...patch } as Student;
    this.mockData[idx] = updated;
    this.persist();
    this.studentsSubject.next([...this.mockData]);
    return updated;
  }

  deleteStudent(id: string) {
    const idx = this.mockData.findIndex(s => s.id === id);
    if (idx === -1) return false;
    this.mockData.splice(idx, 1);
    this.persist();
    this.studentsSubject.next([...this.mockData]);
    return true;
  }
}
