import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Instructor, CreateInstructor } from './instructor.model';

import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class InstructorService {
  private BASE_URL = `${environment.apiUrl}/api/Instructor`;

  constructor(private http: HttpClient) { }

  /**
   * Create a new instructor
   */
  createInstructor(data: CreateInstructor): Observable<Instructor> {
    return this.http.post<Instructor>(`${this.BASE_URL}/CreateInstructor`, data);
  }

  /**
   * Remove instructor by id
   */
  removeInstructor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/RemoveInstructor/${id}`);
  }

  /**
   * Update instructor details
   */
  updateInstructor(data: Instructor): Observable<Instructor> {
    return this.http.put<Instructor>(`${this.BASE_URL}/UpdateInstructor`, data);
  }

  /**
   * Get instructor by id
   */
  getInstructorById(id: string): Observable<Instructor> {
    return this.http.get<Instructor>(`${this.BASE_URL}/GetInstructorById/${id}`);
  }

  /**
   * Get all instructors
   */
  getInstructors(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(`${this.BASE_URL}/GetInstructors`);
  }
}
