import {Component} from '@angular/core';
import {HomeComponent} from '../../../home/home.component';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../auth.service';
import {CourseService} from '../../../entities/courses/course.service';
import {StudentService} from '../../../entities/students/student.service';
import {InstructorService} from '../../../entities/instructors/instructor.service';
import {ToastService} from '../../../shared/toast.service';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-instructor-dashboard',
  imports: [CommonModule, RouterModule, HomeComponent, FormsModule],

  templateUrl: './instructor-dashboard.html',
  styleUrl: './instructor-dashboard.scss',
})
export class InstructorDashboard {
  user: any = null;
  myCourses: any[] = [];
  studentsByCourse: Record<string, any[]> = {};

  editing = false;
  editBio = '';
  editAvatar = '';

  constructor(
    private auth: AuthService,
    private courseService: CourseService,
    private studentService: StudentService,
    private instructorService: InstructorService,
    private toast: ToastService
  ) {
  }

  ngOnInit(): void {
    this.user = this.auth.currentUser;
    if (!this.user || this.user.role !== 'instructor') return;

    this.courseService.getCourses().subscribe(list => {
      this.myCourses = (list || []).filter(c => (c as any).instructorId === this.user.id || c.instructorName === this.user.name);
      // prepare studentsByCourse
      this.studentService.getStudents().subscribe(studs => {
        for (const c of this.myCourses) {
          this.studentsByCourse[c.id] = (studs || []).filter(s => (s.enrolledCourseIds || []).includes(c.id));
        }
      });
    });
  }

  startEdit() {
    if (!this.user) return;
    this.editing = true;
    this.editBio = this.user.bio || '';
    this.editAvatar = this.user.avatar || '';
  }

  saveProfile() {
    if (!this.user) return;
    const updated = this.instructorService.updateInstructor(this.user.id, {bio: this.editBio, avatar: this.editAvatar});
    if (updated) {
      this.user = updated;
      this.editing = false;
      this.toast.show('تم حفظ بيانات الملف الشخصي', 'success');
    }
  }

  cancelEdit() {
    this.editing = false;
  }

  totalStudentsCount(): number {
    return this.myCourses.reduce((acc, c) => acc + (c.studentsCount || 0), 0);
  }

  recentStudentsNames(courseId: string): string {
    const arr = this.studentsByCourse[courseId] || [];
    return (arr.slice(0, 3).map(s => s.name).join(', ')) || 'لا طلاب';
  }
}
