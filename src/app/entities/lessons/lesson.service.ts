import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Lesson } from './lesson.model';

@Injectable({ providedIn: 'root' })
export class LessonService {
  private useMock = true;

  private mockData: Lesson[] = [
    { id: '1', courseId: '1', title: 'مقدمة في Angular', description: 'أساسيات Angular والمزايا الرئيسية', videoUrl: 'https://example.com/lesson1.mp4', duration: 45, order: 1 },
    { id: '2', courseId: '1', title: 'Standalone Components', description: 'شرح الـ Standalone Components والفوائد', videoUrl: 'https://example.com/lesson2.mp4', duration: 60, order: 2 },
    { id: '3', courseId: '1', title: 'Angular Routing', description: 'كيفية إعداد الـ routing في Angular', videoUrl: 'https://example.com/lesson3.mp4', duration: 50, order: 3 },
    { id: '4', courseId: '2', title: 'React Basics', description: 'أساسيات React والـ JSX', videoUrl: 'https://example.com/lesson4.mp4', duration: 55, order: 1 },
    { id: '5', courseId: '2', title: 'React Hooks', description: 'شرح الـ Hooks في React', videoUrl: 'https://example.com/lesson5.mp4', duration: 70, order: 2 },
    { id: '6', courseId: '3', title: 'Python Basics', description: 'أساسيات لغة Python', videoUrl: 'https://example.com/lesson6.mp4', duration: 40, order: 1 },
  ];

  private lessonsSubject = new BehaviorSubject<Lesson[]>(this.mockData);
  lessons$ = this.lessonsSubject.asObservable();

  constructor(private http: HttpClient) {
    if (this.useMock) {
      this.lessonsSubject.next(this.mockData);
    }
  }

  getLessons(): Observable<Lesson[]> {
    return this.useMock
      ? of(this.mockData).pipe(delay(300))
      : this.http.get<Lesson[]>('/api/lessons');
  }

  getLessonById(id: string): Observable<Lesson | null> {
    return this.useMock
      ? of(this.mockData.find(l => l.id === id) || null).pipe(delay(300))
      : this.http.get<Lesson>(`/api/lessons/${id}`);
  }

  getLessonsByCourse(courseId: string): Observable<Lesson[]> {
    return this.useMock
      ? of(this.mockData.filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order)).pipe(delay(300))
      : this.http.get<Lesson[]>(`/api/courses/${courseId}/lessons`);
  }

  getTotalLessons$(): Observable<number> {
    return this.lessons$.pipe(map(lessons => lessons.length));
  }

  loadLessons(lessons: Lesson[]) {
    this.lessonsSubject.next(lessons);
  }
}
