import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Course } from './course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private useMock = true;

  private mockData: Course[] = [
    { id: '1', title: 'تعلم Angular من الصفر إلى الاحتراف 2025', categoryKey: 'web', price: 599, oldPrice: 1499, rating: 4.8, reviewsCount: 3421, studentsCount: 12850, instructorName: 'محمد أحمد', image: 'https://img-c.udemycdn.com/course/480x270/4561060_2b2e_3.jpg', isBestseller: true },
    { id: '2', title: 'الذكاء الاصطناعي وتعلم الآلة بالعربي', categoryKey: 'ai', price: 799, oldPrice: 1999, rating: 4.9, reviewsCount: 5678, studentsCount: 18420, instructorName: 'د. سارة علي', image: 'https://img-c.udemycdn.com/course/480x270/4123456_8b93_5.jpg', isBestseller: true },
    { id: '3', title: 'DevOps كاملة: Docker + Kubernetes + CI/CD', categoryKey: 'devops', price: 899, oldPrice: 2299, rating: 4.7, reviewsCount: 2890, studentsCount: 9870, instructorName: 'أحمد خالد', image: 'https://img-c.udemycdn.com/course/480x270/3456789_ab12.jpg', isBestseller: false },
    { id: '4', title: 'أمن المعلومات واختراق الأنظمة الأخلاقي CEH v12', categoryKey: 'security', price: 999, oldPrice: 2499, rating: 4.6, reviewsCount: 4123, studentsCount: 15670, instructorName: 'عمر حسن', image: 'https://img-c.udemycdn.com/course/480x270/2345678_def4.jpg', isBestseller: false }
  ];

  courses$ = new BehaviorSubject<Course[]>(this.mockData);

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.useMock ? of(this.mockData).pipe(delay(300)) : this.http.get<Course[]>('/api/courses');
  }

  getCourseById(id: string): Observable<Course | null> {
    return this.useMock
      ? of(this.mockData.find(c => c.id === id) || null).pipe(delay(300))
      : this.http.get<Course>(`/api/courses/${id}`);
  }

  getTotalCourses$(): Observable<number> {
    return this.courses$.pipe(map(courses => courses.length));
  }

  getRevenueEstimate$(): Observable<number> {
    return this.courses$.pipe(map(courses => courses.reduce((sum, c) => sum + (c.price || 0), 0)));
  }

  getFeaturedCourses(): Observable<Course[]> {
    return this.useMock 
      ? of(this.mockData.filter(c => c.isBestseller).slice(0, 6)).pipe(delay(300))
      : this.http.get<Course[]>('/api/courses/featured');
  }
}