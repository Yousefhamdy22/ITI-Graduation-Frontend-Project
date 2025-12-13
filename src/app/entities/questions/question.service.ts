import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question, ServerResponse } from './question.model';

import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private http: HttpClient = inject(HttpClient);
  private BASE_URL = `${environment.apiUrl}/api/Question`;

  // GET all questions - Backend returns Result<List<QuestionDto>> via Ardalis.Result
  // Auth token is added automatically by AuthInterceptor
  getQuestions(): Observable<ServerResponse<Question[]>> {
    const url = `${this.BASE_URL}/GetAllQuestions`;
    console.log('🔵 getQuestions URL:', url);
    return this.http.get<ServerResponse<Question[]>>(url);
  }

  // POST create question – backend returns Question directly (not wrapped in ServerResponse)
  // Auth token is added automatically by AuthInterceptor
  createQuestion(question: Question | any): Observable<Question> {
    // Backend expects multipart/form-data
    const form = new FormData();
    form.append('Text', question.text || '');
    form.append('Points', (question.points || 1).toString());
    // If question.imageFile exists (from file input), append it, otherwise append empty string for Image
    if (question.imageFile) {
      form.append('Image', question.imageFile, question.imageFile.name || 'image');
    } else {
      form.append('Image', '');
    }
    form.append('ImageUrl', question.imageUrl || '');

    const options = question.answerOptions || [];
    const optionsJson = JSON.stringify(
      options.map((o: any) => ({
        Text: o.text,
        IsCorrect: o.isCorrect
      }))
    );
    form.append('AnswerOptions', optionsJson);

    // Add CourseId if provided
    if (question.courseId) {
      form.append('CourseId', question.courseId);
      console.log('🔵 Adding CourseId to question:', question.courseId);
    }

    return this.http.post<Question>(`${this.BASE_URL}/CreateQuestion`, form);
  }

  // PUT update question (multipart/form-data)
  // Auth token is added automatically by AuthInterceptor
  updateQuestion(question: Question | any): Observable<ServerResponse<Question>> {
    const form = new FormData();
    form.append('Id', question.id || '');
    form.append('Text', question.text || '');
    form.append('Points', (question.points || 1).toString());
    if (question.imageFile) {
      form.append('Image', question.imageFile, question.imageFile.name || 'image');
    }
    form.append('ImageUrl', question.imageUrl || '');

    const options = question.answerOptions || [];
    const optionsJson = JSON.stringify(
      options.map((o: any) => ({
        Id: o.id || '',
        Text: o.text,
        IsCorrect: o.isCorrect
      }))
    );
    form.append('AnswerOptions', optionsJson);

    return this.http.put<ServerResponse<Question>>(`${this.BASE_URL}/UpdateQuestion`, form);
  }

  // DELETE question
  // Auth token is added automatically by AuthInterceptor
  deleteQuestion(id: string): Observable<ServerResponse<boolean>> {
    return this.http.delete<ServerResponse<boolean>>(`${this.BASE_URL}/RemoveQuestion/${id}`);
  }
}