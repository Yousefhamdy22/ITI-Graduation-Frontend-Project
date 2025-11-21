import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CourseService } from '@core/services/course.service';
import { CourseDetailDto, Lecture, Module, LectureContentType, VideoProvider } from '@core/models/entities.model';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-lecture-player',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LoaderComponent
  ],
  templateUrl: './lecture-player.component.html',
  styles: []
})
export class LecturePlayerComponent implements OnInit {
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  course = signal<CourseDetailDto | null>(null);
  currentLecture = signal<Lecture | null>(null);
  currentModule = signal<Module | null>(null);
  loading = signal(true);
  sidebarOpen = signal(true);
  completingLecture = signal(false);

  // Computed values
  videoUrl = computed(() => {
    const lecture = this.currentLecture();
    if (!lecture || lecture.contentType !== 'video') return null;

    const url = this.getEmbedUrl(lecture.videoUrl!, lecture.videoProvider!);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  pdfUrl = computed(() => {
    const lecture = this.currentLecture();
    if (!lecture || lecture.contentType !== 'pdf') return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(lecture.pdfUrl!);
  });

  hasNextLecture = computed(() => {
    const course = this.course();
    const currentLecture = this.currentLecture();
    if (!course || !currentLecture) return false;

    const allLectures = this.getAllLectures();
    const currentIndex = allLectures.findIndex(l => l.id === currentLecture.id);
    return currentIndex < allLectures.length - 1;
  });

  hasPreviousLecture = computed(() => {
    const course = this.course();
    const currentLecture = this.currentLecture();
    if (!course || !currentLecture) return false;

    const allLectures = this.getAllLectures();
    const currentIndex = allLectures.findIndex(l => l.id === currentLecture.id);
    return currentIndex > 0;
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      const lectureId = params['lectureId'];

      if (slug && lectureId) {
        this.loadCourseAndLecture(slug, lectureId);
      }
    });
  }

  loadCourseAndLecture(slug: string, lectureId: string): void {
    this.loading.set(true);
    
    this.courseService.getCourseBySlug(slug).subscribe({
      next: (course) => {
        this.course.set(course);

        // Find the lecture and its module
        for (const module of course.modules) {
          const lecture = module.lectures.find(l => l.id === lectureId);
          if (lecture) {
            this.currentLecture.set(lecture);
            this.currentModule.set(module);
            break;
          }
        }

        if (!this.currentLecture()) {
          // Lecture not found, redirect to course detail
          this.router.navigate(['/courses', slug]);
        }

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/courses']);
      }
    });
  }

  getEmbedUrl(url: string, provider: VideoProvider): string {
    if (provider === 'youtube') {
      // Extract video ID from various YouTube URL formats
      const videoId = this.extractYouTubeId(url);
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (provider === 'vimeo') {
      // Extract video ID from Vimeo URL
      const videoId = this.extractVimeoId(url);
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  }

  extractYouTubeId(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  }

  extractVimeoId(url: string): string {
    const regExp = /vimeo.*\/(\d+)/i;
    const match = url.match(regExp);
    return match ? match[1] : url;
  }

  getAllLectures(): Lecture[] {
    const course = this.course();
    if (!course) return [];

    return course.modules.flatMap(module => module.lectures);
  }

  goToNextLecture(): void {
    const allLectures = this.getAllLectures();
    const currentIndex = allLectures.findIndex(l => l.id === this.currentLecture()?.id);
    
    if (currentIndex < allLectures.length - 1) {
      const nextLecture = allLectures[currentIndex + 1];
      this.navigateToLecture(nextLecture.id);
    }
  }

  goToPreviousLecture(): void {
    const allLectures = this.getAllLectures();
    const currentIndex = allLectures.findIndex(l => l.id === this.currentLecture()?.id);
    
    if (currentIndex > 0) {
      const previousLecture = allLectures[currentIndex - 1];
      this.navigateToLecture(previousLecture.id);
    }
  }

  navigateToLecture(lectureId: string): void {
    const course = this.course();
    if (!course) return;

    this.router.navigate(['/courses', course.slug, 'lecture', lectureId]);
  }

  markAsComplete(): void {
    const lecture = this.currentLecture();
    if (!lecture) return;

    this.completingLecture.set(true);
    
    // TODO: Call API to mark lecture as complete
    setTimeout(() => {
      this.completingLecture.set(false);
      // Auto-advance to next lecture
      if (this.hasNextLecture()) {
        this.goToNextLecture();
      }
    }, 500);
  }

  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  getLectureIcon(type: LectureContentType): string {
    switch (type) {
      case 'video': return '🎥';
      case 'pdf': return '📄';
      case 'text': return '📝';
      default: return '📚';
    }
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }
}
