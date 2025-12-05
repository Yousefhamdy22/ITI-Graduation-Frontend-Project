import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LessonService } from '../lesson.service';
import { Lesson } from '../lesson.model';

@Component({
  selector: 'app-lesson-player',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lesson-player.component.html',
  styleUrls: ['./lesson-player.component.css']
})
export class LessonPlayerComponent implements OnInit {
  lesson: Lesson | null = null;
  allLessons: Lesson[] = [];
  loading = true;
  completed = false;
  currentTime = 0;
  duration = 0;

  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    
    // Load the current lesson
    this.lessonService.getLessonById(id).subscribe({
      next: (lesson) => {
        this.lesson = lesson;
        if (lesson) {
          this.duration = lesson.duration * 60; // convert to seconds
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });

    // Load all lessons for navigation
    this.lessonService.getLessons().subscribe({
      next: (lessons) => {
        this.allLessons = lessons;
      }
    });
  }

  markAsCompleted(): void {
    this.completed = true;
    // TODO: Call service to save completion status
  }

  getPreviousLesson(): Lesson | null {
    if (!this.lesson) return null;
    const index = this.allLessons.findIndex(l => l.id === this.lesson?.id);
    return index > 0 ? this.allLessons[index - 1] : null;
  }

  getNextLesson(): Lesson | null {
    if (!this.lesson) return null;
    const index = this.allLessons.findIndex(l => l.id === this.lesson?.id);
    return index < this.allLessons.length - 1 ? this.allLessons[index + 1] : null;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  onVideoEnded(): void {
    this.markAsCompleted();
  }
}
