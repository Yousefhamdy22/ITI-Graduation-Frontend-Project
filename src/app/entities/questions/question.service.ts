import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question, ServerResponse } from './question.model';

// Hardcoded API URL - environment import not working with SSR
const BASE_URL = 'http://localhost:5180/api/Question';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) { }

  // Common auth header - SSR safe
  private getHeaders() {
    const headers: any = {
      'Content-Type': 'application/json'
    };
    
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return { headers: new HttpHeaders(headers) };
  }

  // GET question by ID - DISABLED: Backend does not provide this endpoint
  // If needed, fetch all questions and filter client-side
  // getQuestionById(id: string): Observable<ServerResponse<Question>> {
  //   return this.http.get<ServerResponse<Question>>(`${BASE_URL}/GetQuestionById/${id}`, this.getHeaders());
  // }

  // GET all questions - Backend returns Result<List<QuestionDto>> via Ardalis.Result
  getQuestions(): Observable<ServerResponse<Question[]>> {
    const url = `${BASE_URL}/GetAllQuestions`;
    console.log('🔵 getQuestions URL:', url);
    return this.http.get<ServerResponse<Question[]>>(url, this.getHeaders());
  }

  // POST create question – backend returns Question directly (not wrapped in ServerResponse)
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

    const token = localStorage.getItem('token') || '';
    const headers = token ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) } : {};

    return this.http.post<Question>(`${BASE_URL}/CreateQuestion`, form, headers);
  }

  // PUT update question (multipart/form-data)
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

    const token = localStorage.getItem('token') || '';
    const headers = token ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) } : {};

    return this.http.put<ServerResponse<Question>>(`${BASE_URL}/UpdateQuestion`, form, headers);
  }

  // DELETE question
  deleteQuestion(id: string): Observable<ServerResponse<boolean>> {
    return this.http.delete<ServerResponse<boolean>>(`${BASE_URL}/RemoveQuestion/${id}`, this.getHeaders());
  }
}