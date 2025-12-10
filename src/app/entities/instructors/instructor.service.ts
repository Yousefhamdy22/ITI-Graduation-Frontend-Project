import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Instructor } from './instructor.model';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class InstructorService {
  constructor(private http: HttpClient) {}

  /**
   * Create a new instructor
   * @param data { firstName, lastName, email }
   */
  createInstructor(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/Instructor/CreateInstructor`, data);
  }

  /**
   * Remove instructor by id
   * @param id instructor id
   */
  removeInstructor(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/Instructor/RemoveInstructor/${id}`);
  }

  /**
   * Update instructor details
   * @param data instructor data
   */
  updateInstructor(data: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/api/Instructor/UpdateInstructor`, data);
  }

  /**
   * Get instructor by id
   * @param id instructor id
   */
  getInstructorById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/Instructor/GetInstructorById/${id}`);
  }

  /**
   * Get all instructors
   */
  getInstructors(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/Instructor/GetInstructors`);
  }
}
