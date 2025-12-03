import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Instructor } from './instructor.model';

@Injectable({ providedIn: 'root' })
export class InstructorService {
  private useMock = true;

  private mockData: Instructor[] = [
    { 
      id: '1', 
      name: 'محمد أحمد', 
      email: 'محمد@example.com', 
      bio: 'خبير في تطوير تطبيقات Angular والويب الحديثة مع 10 سنوات خبرة', 
      avatar: 'https://i.pravatar.cc/150?img=7', 
      expertise: ['Angular', 'TypeScript', 'Web Development'], 
      coursesCount: 5, 
      studentsCount: 8200, 
      rating: 4.8 
    },
    { 
      id: '2', 
      name: 'د. سارة علي', 
      email: 'سارة@example.com', 
      bio: 'متخصصة في الذكاء الاصطناعي وتعلم الآلة مع 8 سنوات خبرة أكاديمية', 
      avatar: 'https://i.pravatar.cc/150?img=8', 
      expertise: ['AI', 'Machine Learning', 'Python'], 
      coursesCount: 3, 
      studentsCount: 18420, 
      rating: 4.9 
    },
    { 
      id: '3', 
      name: 'أحمد خالد', 
      email: 'أحمد@example.com', 
      bio: 'متخصص في DevOps والـ Cloud Infrastructure مع 12 سنة خبرة عملية', 
      avatar: 'https://i.pravatar.cc/150?img=9', 
      expertise: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'], 
      coursesCount: 4, 
      studentsCount: 9870, 
      rating: 4.7 
    },
    { 
      id: '4', 
      name: 'عمر حسن', 
      email: 'عمر@example.com', 
      bio: 'خبير في أمن المعلومات والـ Ethical Hacking مع شهادات دولية معتمدة', 
      avatar: 'https://i.pravatar.cc/150?img=10', 
      expertise: ['Cybersecurity', 'Ethical Hacking', 'Network Security'], 
      coursesCount: 2, 
      studentsCount: 15670, 
      rating: 4.6 
    },
    { 
      id: '5', 
      name: 'مريم عبدالله', 
      email: 'مريم@example.com', 
      bio: 'معلمة في JavaScript والـ React مع خبرة 7 سنوات في الشركات الكبرى', 
      avatar: 'https://i.pravatar.cc/150?img=11', 
      expertise: ['React', 'JavaScript', 'Frontend'], 
      coursesCount: 6, 
      studentsCount: 12300, 
      rating: 4.9 
    }
  ];

  private instructorsSubject = new BehaviorSubject<Instructor[]>(this.mockData);
  instructors$ = this.instructorsSubject.asObservable();

  constructor(private http: HttpClient) {
    if (this.useMock) {
      this.instructorsSubject.next(this.mockData);
    }
  }

  getInstructors(): Observable<Instructor[]> {
    return this.useMock
      ? of(this.mockData).pipe(delay(300))
      : this.http.get<Instructor[]>('/api/instructors');
  }

  getInstructorById(id: string): Observable<Instructor | null> {
    return this.useMock
      ? of(this.mockData.find(i => i.id === id) || null).pipe(delay(300))
      : this.http.get<Instructor>(`/api/instructors/${id}`);
  }

  getTotalInstructors$(): Observable<number> {
    return this.instructors$.pipe(map(instructors => instructors.length));
  }

  getTopRatedInstructors(): Observable<Instructor[]> {
    return this.useMock
      ? of(this.mockData.sort((a, b) => b.rating - a.rating).slice(0, 3)).pipe(delay(300))
      : this.http.get<Instructor[]>('/api/instructors/top-rated');
  }

  loadInstructors(instructors: Instructor[]) {
    this.instructorsSubject.next(instructors);
  }

  addInstructor(instructor: Partial<Instructor>): Instructor {
    const i: Instructor = {
      id: (Date.now()).toString(),
      name: instructor.name || 'مدرب جديد',
      email: instructor.email || '',
      bio: instructor.bio || '',
      avatar: instructor.avatar || `https://i.pravatar.cc/150?u=${Date.now()}`,
      expertise: instructor.expertise || [],
      coursesCount: instructor.coursesCount || 0,
      studentsCount: instructor.studentsCount || 0,
      rating: instructor.rating || 0,
    } as Instructor;
    this.mockData.push(i);
    this.instructorsSubject.next(this.mockData);
    return i;
  }

  updateInstructor(id: string, patch: Partial<Instructor>) {
    const idx = this.mockData.findIndex(x => x.id === id);
    if (idx === -1) return null;
    const updated = { ...this.mockData[idx], ...patch } as Instructor;
    this.mockData[idx] = updated;
    this.instructorsSubject.next([...this.mockData]);
    return updated;
  }

  deleteInstructor(id: string) {
    const idx = this.mockData.findIndex(i => i.id === id);
    if (idx === -1) return false;
    this.mockData.splice(idx, 1);
    this.instructorsSubject.next([...this.mockData]);
    return true;
  }
}
