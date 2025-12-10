import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface Lecture {
    id: string;
    title: string;
    scheduledAt: string;
    duration: string;
    moduleId: string;
}

@Injectable({ providedIn: 'root' })
export class LectureService {
    private BASE_URL = `${environment.apiUrl}/api/Lectures`;

    constructor(private http: HttpClient) { }

    // Get lectures by module ID
    getLecturesByModule(moduleId: string): Observable<Lecture[]> {
        return this.http.get<Lecture[]>(`${this.BASE_URL}/ByModule/${moduleId}`);
    }

    // Delete lecture
    deleteLecture(lectureId: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.BASE_URL}/${lectureId}`);
    }
}
