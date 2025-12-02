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
  {
    id: '1',
    title: 'تعلم Angular من الصفر إلى الاحتراف 2025',
    subtitle: 'دورة شاملة للمبتدئين والمحترفين',
    description: 'دورة شاملة تبدأ معك من الأساسيات حتى بناء مشاريع احترافية باستخدام Angular 17.',
    categoryKey: 'web',
    category: 'Web Development',
    level: 'Beginner to Advanced',
    hours: 18,
    duration: 18,
    lessonsCount: 25,
    price: 599,
    oldPrice: 1499,
    rating: 4.8,
    reviewsCount: 3421,
    studentsCount: 12850,
    image: 'https://img-c.udemycdn.com/course/480x270/4561060_2b2e_3.jpg',
    promoVideoUrl: 'https://www.youtube.com/embed/2OHbjep_WjQ',
    learningObjectives: [
      'فهم أساسيات Angular',
      'إنشاء Components وModules',
      'التعامل مع Services و Dependency Injection',
      'ربط Angular مع API باستخدام HttpClient',
      'بناء لوحة تحكم Dashboard كاملة'
    ],
    instructorName: 'محمد أحمد',
    instructorTitle: 'Senior Frontend Engineer',
    instructorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    isBestseller: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'الذكاء الاصطناعي وتعلم الآلة بالعربي',
    subtitle: 'دورة متقدمة لتعلم AI و ML بالعربي',
    description: 'دورة متقدمة لشرح أساسيات وخوارزميات الذكاء الاصطناعي وتطبيقاتها العملية.',
    categoryKey: 'ai',
    category: 'Artificial Intelligence',
    level: 'Intermediate',
    hours: 22,
    duration: 22,
    lessonsCount: 30,
    price: 799,
    oldPrice: 1999,
    rating: 4.9,
    reviewsCount: 5678,
    studentsCount: 18420,
    image: 'https://img-c.udemycdn.com/course/480x270/4123456_8b93_5.jpg',
    promoVideoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
    learningObjectives: [
      'مقدمة في الذكاء الاصطناعي',
      'فهم خوارزميات تعلم الآلة',
      'تنفيذ نماذج ML باستخدام Python',
      'تحليل البيانات وتدريب الموديل',
      'تحسين ودقة النماذج'
    ],
    instructorName: 'د. سارة علي',
    instructorTitle: 'AI Researcher',
    instructorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    isBestseller: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
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