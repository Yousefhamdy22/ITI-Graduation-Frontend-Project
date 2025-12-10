import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { LessonService } from '../lesson.service';
import { CourseService } from '../../courses/course.service';
import { AuthService } from '../../../auth/auth.service';
import { Lecture } from '../lesson.model';
import { Course } from '../../courses/course.model';
import { ToastService } from '../../../shared/toast.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RoleHeaderComponent } from '../../../core/header/role-header.component';
import { FooterComponent } from '../../../core/footer/footer.component';

@Component({
  selector: 'app-lesson-player',
  standalone: true,
  imports: [CommonModule, RouterModule, RoleHeaderComponent, FooterComponent],
  templateUrl: './lesson-player.component.html',
  styleUrls: ['./lesson-player.component.css']
})
export class LessonPlayerComponent implements OnInit {
  lesson: Lecture | null = null;
  course: Course | null = null;
  allLessons: Lecture[] = [];
  loading = true;
  currentLessonIndex = 0;
  completed = false;
  currentTime = 0;
  duration = 0;
  safeVideoUrl: SafeResourceUrl | null = null;

  isInstructor = false;
  editingDescription = false;
  editedDescription = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lessonService: LessonService,
    private courseService: CourseService,
    public auth: AuthService,
    private toast: ToastService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const lessonId = this.route.snapshot.paramMap.get('id');
    const courseId = this.route.snapshot.paramMap.get('courseId');

    if (!lessonId) {
      this.toast.show('لم يتم العثور على الدرس', 'error');
      this.router.navigate(['/courses']);
      return;
    }

    // Load course info
    if (courseId) {
      this.courseService.getCourseById(courseId).subscribe({
        next: (c) => {
          if (c) {
            this.course = c;
            this.isInstructor = this.auth.currentUser?.role === 'instructor' &&
              ((c as any).instructorId === this.auth.currentUser?.id ||
                c.instructorName === this.auth.currentUser?.name);
          }
        },
        error: () => this.toast.show('خطأ في تحميل الكورس', 'error')
      });

      // Load all lessons for this course
      this.lessonService.getLessonsByCourse(courseId).subscribe({
        next: (lessons) => {
          this.allLessons = lessons;
          const idx = lessons.findIndex(l => l.id === lessonId);
          this.currentLessonIndex = idx >= 0 ? idx : 0;
          this.loadLesson(this.allLessons[this.currentLessonIndex]);
        },
        error: () => {
          this.loading = false;
          this.toast.show('خطأ في تحميل الدروس', 'error');
        }
      });
    } else {
      // Fallback: load all lessons
      this.lessonService.getLessons().subscribe({
        next: (lessons) => {
          this.allLessons = lessons;
          const idx = lessons.findIndex(l => l.id === lessonId);
          this.currentLessonIndex = idx >= 0 ? idx : 0;
          this.loadLesson(this.allLessons[this.currentLessonIndex]);
        }
      });
    }
  }

  loadLesson(lesson: Lecture): void {
    this.lesson = lesson;
    // Use Zoom recording URL if available, otherwise null
    const videoUrl = lesson.zoomRecording?.recordingUrl || '';
    this.safeVideoUrl = videoUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl) : null;
    this.editedDescription = ''; // Lecture model doesn't have description
    // Parse duration from TimeSpan format (HH:MM:SS) to seconds
    this.duration = this.parseDurationToSeconds(lesson.duration);
    this.completed = lesson.isCompleted;
    this.currentTime = 0;
    this.loading = false;
  }

  goToNextLesson(): void {
    if (this.currentLessonIndex < this.allLessons.length - 1) {
      this.currentLessonIndex++;
      this.loadLesson(this.allLessons[this.currentLessonIndex]);
      window.scrollTo(0, 0);
    }
  }

  goToPreviousLesson(): void {
    if (this.currentLessonIndex > 0) {
      this.currentLessonIndex--;
      this.loadLesson(this.allLessons[this.currentLessonIndex]);
      window.scrollTo(0, 0);
    }
  }

  goToLesson(index: number): void {
    this.currentLessonIndex = index;
    this.loadLesson(this.allLessons[index]);
    window.scrollTo(0, 0);
  }

  getPreviousLesson(): Lecture | null {
    return this.currentLessonIndex > 0 ? this.allLessons[this.currentLessonIndex - 1] : null;
  }

  getNextLesson(): Lecture | null {
    return this.currentLessonIndex < this.allLessons.length - 1 ? this.allLessons[this.currentLessonIndex + 1] : null;
  }

  /**
   * Parse TimeSpan duration string to seconds
   * @param duration - TimeSpan format (HH:MM:SS)
   * @returns Total seconds
   */
  parseDurationToSeconds(duration: string): number {
    if (!duration) return 0;
    const parts = duration.split(':');
    const hours = parseInt(parts[0] || '0');
    const minutes = parseInt(parts[1] || '0');
    const seconds = parseInt(parts[2] || '0');
    return hours * 3600 + minutes * 60 + seconds;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  onVideoEnded(): void {
    this.markAsCompleted();
  }

  markAsCompleted(): void {
    this.completed = true;
    this.toast.show('تم تحديد الدرس كـ مُكتمل', 'success');
    // في المستقبل: هنا سيتم إرسال request للـ API لحفظ حالة الإكمال
  }

  startEditDescription(): void {
    if (!this.isInstructor) return;
    this.editingDescription = true;
    this.toast.show('تعديل الوصف غير متاح في Lecture API', 'warning');
  }

  saveDescription(): void {
    if (!this.lesson || !this.isInstructor) return;
    // Note: Lecture model doesn't have description field
    // This functionality is disabled for Lecture API
    this.editingDescription = false;
    this.toast.show('تعديل الوصف غير متاح في Lecture API', 'warning');
  }

  cancelEditDescription(): void {
    this.editingDescription = false;
    this.editedDescription = '';
  }

  deleteLesson(): void {
    if (!this.lesson || !this.isInstructor) return;
    if (confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
      // في المستقبل: هنا سيتم إرسال DELETE request للـ API
      this.toast.show('تم حذف الدرس', 'success');
      this.router.navigate(['/courses', this.course?.id]);
    }
  }
}
