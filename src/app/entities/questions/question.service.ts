import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Question } from './question.model';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private mock: Question[] = [
    { id: 'q1', text: 'هل تحب البرمجة؟', type: 'tf', correctBoolean: true, courseId: '1', createdAt: new Date() },
    { id: 'q2', text: 'ما هي لغة البرمجة المفضلة لديك؟', type: 'text', courseId: '1', createdAt: new Date() },
    { id: 'q3', text: 'ما هو ناتج 2+2؟', type: 'mcq', options: ['2','3','4','5'], correctOptionIndex: 2, courseId: '2', createdAt: new Date() }
  ];

  private sub = new BehaviorSubject<Question[]>([...this.mock]);
  questions$ = this.sub.asObservable();

  constructor() {}

  getQuestions(): Observable<Question[]> {
    return this.questions$;
  }

  getQuestionById(id: string): Observable<Question | undefined> {
    return new BehaviorSubject(this.mock.find(q => q.id === id)).asObservable();
  }

  createQuestion(q: Partial<Question>): Question {
    const newQ: Question = {
      id: Date.now().toString(),
      text: q.text || '',
      type: q.type || 'text',
      options: q.options || [],
      correctOptionIndex: q.correctOptionIndex,
      correctBoolean: q.correctBoolean,
      courseId: (q as any).courseId,
      createdBy: q.createdBy,
      createdAt: new Date()
    };
    this.mock.push(newQ);
    this.sub.next([...this.mock]);
    return newQ;
  }

  updateQuestion(id: string, patch: Partial<Question>) {
    const idx = this.mock.findIndex(m => m.id === id);
    if (idx === -1) return;
    this.mock[idx] = { ...this.mock[idx], ...patch };
    this.sub.next([...this.mock]);
  }

  deleteQuestion(id: string) {
    this.mock = this.mock.filter(m => m.id !== id);
    this.sub.next([...this.mock]);
  }
}
