import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question, ServerResponse } from './question.model';
import { environment } from '../../../environment/environment';

const BASE_URL = `${environment.apiUrl}/api/Question`;

@Injectable({ providedIn: 'root' })
export class QuestionService {

  constructor(private http: HttpClient) { }

  // Common auth header
  private getHeaders() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // GET question by ID - assuming endpoint follows naming convention
  getQuestionById(id: string): Observable<ServerResponse<Question>> {
    return this.http.get<ServerResponse<Question>>(`${BASE_URL}/GetQuestionById/${id}`, this.getHeaders());
  }

  // GET all questions
  getQuestions(): Observable<ServerResponse<Question[]>> {
    return this.http.get<ServerResponse<Question[]>>(`${BASE_URL}/GetAllQuestions`, this.getHeaders());
  }

  // POST create question – backend expects application/x-www-form-urlencoded
  createQuestion(question: Question | any): Observable<ServerResponse<Question>> {
    const params = new URLSearchParams();
    params.set('Text', question.text);
    params.set('Points', (question.points || 1).toString());
    params.set('Image', '');
    params.set('ImageUrl', question.imageUrl || '');

    const options = question.answerOptions || [];
    const optionsJson = JSON.stringify(
      options.map((o: any) => ({
        Text: o.text,
        IsCorrect: o.isCorrect
      }))
    );
    params.set('AnswerOptions', optionsJson);

    return this.http.post<ServerResponse<Question>>(`${BASE_URL}/CreateQuestion`, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
  }

  // PUT update question
  updateQuestion(question: Question | any): Observable<ServerResponse<Question>> {
    const params = new URLSearchParams();
    params.set('Id', question.id || '');
    params.set('Text', question.text);
    params.set('Points', (question.points || 1).toString());
    params.set('ImageUrl', question.imageUrl || '');

    const options = question.answerOptions || [];
    const optionsJson = JSON.stringify(
      options.map((o: any) => ({
        Id: o.id || '', // Include ID if it exists for updates
        Text: o.text,
        IsCorrect: o.isCorrect
      }))
    );
    params.set('AnswerOptions', optionsJson);

    return this.http.put<ServerResponse<Question>>(`${BASE_URL}/UpdateQuestion`, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
  }

  // DELETE question
  deleteQuestion(id: string): Observable<ServerResponse<boolean>> {
    return this.http.delete<ServerResponse<boolean>>(`${BASE_URL}/RemoveQuestion/${id}`, this.getHeaders());
  }
}