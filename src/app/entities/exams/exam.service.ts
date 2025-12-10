import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Exam, Question } from './exam.model';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private useMock = false;
  private BASE_URL = `${environment.apiUrl}/api/Exams`;

  private mockData: Exam[] = [
    {
      id: '1',
      courseId: '1',
      title: 'اختبار Angular الأساسي',
      description: 'اختبار شامل لأساسيات Angular',
      duration: 60,
      passingScore: 70,
      questions: [
        { id: '1', text: 'ما هو Angular؟', options: ['Framework', 'Library', 'Language', 'IDE'], correctOption: 0 },
        { id: '2', text: 'ما هو Standalone Component؟', options: ['Component عادي', 'Component لا يحتاج NgModule', 'Component مُشفر', 'Component للـ Server'], correctOption: 1 }
      ]
    },
    {
      id: '2',
      courseId: '1',
      title: 'اختبار الـ Routing في Angular',
      description: 'اختبار متقدم على الـ routing',
      duration: 45,
      passingScore: 75,
      questions: [
        { id: '3', text: 'كيف تعرّف route؟', options: ['في Component', 'في Routes array', 'في Service', 'في HTML'], correctOption: 1 },
        { id: '4', text: 'ما هو ActivatedRoute؟', options: ['Router مستخدم', 'معلومات الـ route الحالي', 'Service للـ Navigation', 'HTTP Client'], correctOption: 1 }
      ]
    },
    {
      id: '3',
      courseId: '2',
      title: 'اختبار React الأساسي',
      description: 'اختبار أساسيات React',
      duration: 50,
      passingScore: 70,
      questions: [
        { id: '5', text: 'ما هو JSX؟', options: ['تكويس مثل XML مع JavaScript', 'لغة برمجة', 'HTML محسّن', 'CSS framework'], correctOption: 0 },
        { id: '6', text: 'ما هي React Hooks؟', options: ['دوال لـ state management', 'طريقة تصيد الأخطاء', 'HTTP client', 'Router library'], correctOption: 0 }
      ]
    }
  ];

  private examsSubject = new BehaviorSubject<Exam[]>(this.mockData);
  exams$ = this.examsSubject.asObservable();

  constructor(private http: HttpClient) {
    if (this.useMock) {
      this.examsSubject.next(this.mockData);
    }
  }

  getExams(): Observable<Exam[]> {
    return this.useMock
      ? of(this.mockData).pipe(delay(300))
      : this.http.get<Exam[]>(`${this.BASE_URL}`);
  }

  getExamById(id: string): Observable<Exam | null> {
    return this.useMock
      ? of(this.mockData.find(e => e.id === id) || null).pipe(delay(300))
      : this.http.get<Exam>(`${this.BASE_URL}/${id}`);
  }

  updateExam(id: string, patch: Partial<Exam>): Observable<Exam | null> {
    if (this.useMock) {
      const idx = this.mockData.findIndex(e => e.id === id);
      if (idx === -1) return of(null);

      this.mockData[idx] = { ...this.mockData[idx], ...patch };
      this.examsSubject.next([...this.mockData]);
      return of(this.mockData[idx]).pipe(delay(300));
    }
    return this.http.put<Exam>(`${this.BASE_URL}/${id}`, patch);
  }

  deleteExam(id: string): Observable<void> {
    if (this.useMock) {
      this.mockData = this.mockData.filter(e => e.id !== id);
      this.examsSubject.next([...this.mockData]);
      return of(void 0).pipe(delay(300));
    }
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }

  getExamsByCourse(courseId: string): Observable<Exam[]> {
    return this.useMock
      ? of(this.mockData.filter(e => e.courseId === courseId)).pipe(delay(300))
      : this.http.get<Exam[]>(`${environment.apiUrl}/api/courses/${courseId}/exams`);
  }

  submitExam(examId: string, answers: number[]): Observable<{ score: number; passed: boolean }> {
    return this.useMock
      ? of({ score: 85, passed: true }).pipe(delay(500))
      : this.http.post<{ score: number; passed: boolean }>(`${this.BASE_URL}/${examId}/submit`, { answers });
  }

  getTotalExams$(): Observable<number> {
    return this.exams$.pipe(map(exams => exams.length));
  }

  loadExams(exams: Exam[]) {
    this.examsSubject.next(exams);
  }

  createExam(exam: Partial<Exam>): Observable<Exam> {
    if (this.useMock) {
      const newExam: Exam = {
        id: (Date.now()).toString(),
        courseId: exam.courseId || '',
        title: exam.title || '',
        description: exam.description || '',
        duration: exam.duration || 0,
        passingScore: exam.passingScore || 0,
        questions: exam.questions || [],
        modelAnswers: exam.modelAnswers,
        modelAnswerSummary: exam.modelAnswerSummary
      };
      this.mockData.push(newExam);
      this.examsSubject.next([...this.mockData]);
      return of(newExam).pipe(delay(300));
    }
    return this.http.post<Exam>(`${this.BASE_URL}`, exam);
  }
}

