import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Exam, Question, ExamResult, ExamResultDetail } from './exam.model';

import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private http: HttpClient = inject(HttpClient);
  private useMock = false; // Connect to real backend
  private BASE_URL = `${environment.apiUrl}/api/Exams`;

  private mockData: Exam[] = [
    {
      id: '1',
      courseId: '1',
      title: 'Angular Basic Exam',
      description: 'Comprehensive exam for Angular basics',
      durationMinutes: 60,
      passingScore: 70,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      questions: [
        {
          id: '1', text: 'What is Angular?', points: 10, answerOptions: [
            { id: '1a', text: 'Framework', isCorrect: true },
            { id: '1b', text: 'Library', isCorrect: false },
            { id: '1c', text: 'Language', isCorrect: false },
            { id: '1d', text: 'IDE', isCorrect: false }
          ]
        },
        {
          id: '2', text: 'What is a Standalone Component?', points: 10, answerOptions: [
            { id: '2a', text: 'Normal Component', isCorrect: false },
            { id: '2b', text: 'Component that does not need NgModule', isCorrect: true },
            { id: '2c', text: 'Encrypted Component', isCorrect: false },
            { id: '2d', text: 'Server Component', isCorrect: false }
          ]
        }
      ]
    },
    {
      id: '2',
      courseId: '1',
      title: 'Angular Routing Exam',
      description: 'Advanced exam on routing',
      durationMinutes: 45,
      passingScore: 60,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      questions: [
        {
          id: '3', text: 'How do you define a route?', points: 10, answerOptions: [
            { id: '3a', text: 'In Component', isCorrect: false },
            { id: '3b', text: 'In Routes array', isCorrect: true },
            { id: '3c', text: 'In Service', isCorrect: false },
            { id: '3d', text: 'In HTML', isCorrect: false }
          ]
        },
        {
          id: '4', text: 'What is ActivatedRoute?', points: 10, answerOptions: [
            { id: '4a', text: 'Used Router', isCorrect: false },
            { id: '4b', text: 'Information about current route', isCorrect: true },
            { id: '4c', text: 'Navigation Service', isCorrect: false },
            { id: '4d', text: 'HTTP Client', isCorrect: false }
          ]
        }
      ]
    },
    {
      id: '3',
      courseId: '2',
      title: 'React Basic Exam',
      description: 'React basics exam',
      durationMinutes: 50,
      passingScore: 75,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      questions: [
        {
          id: '5', text: 'What is JSX?', points: 10, answerOptions: [
            { id: '5a', text: 'Syntax extension like XML with JavaScript', isCorrect: true },
            { id: '5b', text: 'Programming Language', isCorrect: false },
            { id: '5c', text: 'Enhanced HTML', isCorrect: false },
            { id: '5d', text: 'CSS framework', isCorrect: false }
          ]
        },
        {
          id: '6', text: 'What are React Hooks?', points: 10, answerOptions: [
            { id: '6a', text: 'Functions for state management', isCorrect: true },
            { id: '6b', text: 'Method to catch errors', isCorrect: false },
            { id: '6c', text: 'HTTP client', isCorrect: false },
            { id: '6d', text: 'Router library', isCorrect: false }
          ]
        }
      ]
    }
  ];

  private examsSubject = new BehaviorSubject<Exam[]>(this.mockData);
  exams$ = this.examsSubject.asObservable();

  constructor() {
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
    return this.exams$.pipe(map((exams: any) => exams.length));
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
        durationMinutes: exam.durationMinutes || 0,
        passingScore: exam.passingScore || 0,
        startDate: exam.startDate || new Date().toISOString(),
        endDate: exam.endDate || new Date().toISOString(),
        questions: exam.questions || []
      };
      this.mockData.push(newExam);
      this.examsSubject.next([...this.mockData]);
      return of(newExam).pipe(delay(300));
    }
    return this.http.post<Exam>(`${this.BASE_URL}`, exam);
  }
}

