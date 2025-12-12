import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { LectureService } from '../lecture.service';
import { CourseService } from '../../courses/course.service';
import { AuthService } from '../../../auth/auth.service';
import { Lecture } from '../lecture.model';
import { Course } from '../../courses/course.model';
import { ToastService } from '../../../shared/toast.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RoleHeaderComponent } from '../../../core/header/role-header.component';
import { FooterComponent } from '../../../core/footer/footer.component';

@Component({
  selector: 'app-lecture-player',
  standalone: true,
  imports: [CommonModule, RouterModule, RoleHeaderComponent, FooterComponent],
  templateUrl: './lecture-player.component.html',
  styleUrls: ['./lecture-player.component.css']
})
export class LecturePlayerComponent implements OnInit {
  lecture: Lecture | null = null;
  course: Course | null = null;
  allLectures: Lecture[] = [];
  loading = true;
  currentLectureIndex = 0;
  completed = false;
  currentTime = 0;
  duration = 0;
  safeVideoUrl: SafeResourceUrl | null = null;

  isInstructor = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private lectureService = inject(LectureService);
  private courseService = inject(CourseService);
  public auth = inject(AuthService);
  private toast = inject(ToastService);
  private sanitizer = inject(DomSanitizer);

  constructor() { }

  ngOnInit(): void {
    const lectureId = this.route.snapshot.paramMap.get('id');
    const courseId = this.route.snapshot.paramMap.get('courseId');

    if (!lectureId) {
      this.toast.show('لم يتم العثور على المحاضرة', 'error');
      this.router.navigate(['/courses']);
      return;
    }

    // Load course info
    if (courseId) {
      this.courseService.getCourseById(courseId).subscribe({
        next: (c: any) => {
          if (c) {
            this.course = c;
            this.isInstructor = this.auth.currentUser?.role === 'instructor' &&
              ((c as any).instructorId === this.auth.currentUser?.id ||
                c.instructorName === this.auth.currentUser?.name);
          }
        },
        error: () => this.toast.show('خطأ في تحميل الكورس', 'error')
      });

      // Load all lectures for this course
      this.lectureService.getLecturesByModule(courseId).subscribe({
        next: (lectures: any) => {
          this.allLectures = lectures;
          const idx = lectures.findIndex((l: any) => l.id === lectureId);
          this.currentLectureIndex = idx >= 0 ? idx : 0;
          this.loadLecture(this.allLectures[this.currentLectureIndex]);
        },
        error: () => {
          this.loading = false;
          this.toast.show('خطأ في تحميل المحاضرات', 'error');
        }
      });
    }
  }

  loadLecture(lecture: Lecture): void {
    this.lecture = lecture;
    // Use Zoom recording URL if available
    const videoUrl = lecture.zoomRecording?.recordingUrl || '';
    this.safeVideoUrl = videoUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl) : null;
    // Parse duration from TimeSpan format (HH:MM:SS) to seconds
    this.duration = this.parseDurationToSeconds(lecture.duration);
    this.completed = lecture.isCompleted;
    this.currentTime = 0;
    this.loading = false;
  }

  goToNextLecture(): void {
    if (this.currentLectureIndex < this.allLectures.length - 1) {
      this.currentLectureIndex++;
      this.loadLecture(this.allLectures[this.currentLectureIndex]);
      window.scrollTo(0, 0);
    }
  }

  goToPreviousLecture(): void {
    if (this.currentLectureIndex > 0) {
      this.currentLectureIndex--;
      this.loadLecture(this.allLectures[this.currentLectureIndex]);
      window.scrollTo(0, 0);
    }
  }

  goToLecture(index: number): void {
    this.currentLectureIndex = index;
    this.loadLecture(this.allLectures[index]);
    window.scrollTo(0, 0);
  }

  getPreviousLecture(): Lecture | null {
    return this.currentLectureIndex > 0 ? this.allLectures[this.currentLectureIndex - 1] : null;
  }

  getNextLecture(): Lecture | null {
    return this.currentLectureIndex < this.allLectures.length - 1 ? this.allLectures[this.currentLectureIndex + 1] : null;
  }

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
    this.toast.show('تم تحديد المحاضرة كـ مُكتمل', 'success');
  }

  deleteLecture(): void {
    if (!this.lecture || !this.isInstructor) return;
    if (confirm('هل أنت متأكد من حذف هذه المحاضرة؟')) {
      this.lectureService.deleteLecture(this.lecture.id).subscribe({
        next: () => {
          this.toast.show('تم حذف المحاضرة', 'success');
          this.router.navigate(['/courses', this.course?.id]);
        },
        error: () => this.toast.show('خطأ في حذف المحاضرة', 'error')
      });
    }
  }
}
