import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InstructorService } from '@core/services/instructor.service';
import { Module, Lecture, LectureContentType } from '@core/models/entities.model';
import { MainLayoutComponent } from '@app/layout/main-layout/main-layout.component';
import { CardComponent } from '@shared/components/card/card.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-course-curriculum',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    ButtonComponent,
    BadgeComponent,
    LoaderComponent
  ],
  template: `
    <app-main-layout>
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <button (click)="goBack()" class="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Course Curriculum</h1>
            </div>
            <p class="text-neutral-600 dark:text-neutral-400">Manage modules and lectures for your course</p>
          </div>
          <app-button (click)="showModuleForm = true; editingModule = null" variant="primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Module
          </app-button>
        </div>

        <!-- Loading -->
        <div *ngIf="loading()" class="flex justify-center py-12">
          <app-loader></app-loader>
        </div>

        <!-- Modules List -->
        <div *ngIf="!loading()" class="space-y-4">
          <!-- Empty State -->
          <app-card *ngIf="modules().length === 0">
            <div class="text-center py-12">
              <svg class="w-16 h-16 mx-auto text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">No Modules Yet</h3>
              <p class="text-neutral-600 dark:text-neutral-400 mb-4">Start building your course by adding the first module</p>
              <app-button (click)="showModuleForm = true; editingModule = null" variant="primary">
                Add First Module
              </app-button>
            </div>
          </app-card>

          <!-- Modules -->
          <div *ngFor="let module of modules(); let i = index" class="border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <!-- Module Header -->
            <div class="bg-neutral-50 dark:bg-neutral-800 p-4 flex items-center justify-between">
              <div class="flex items-center gap-4 flex-1">
                <div class="flex flex-col gap-1">
                  <button class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200" 
                          (click)="moveModule(i, -1)" 
                          [disabled]="i === 0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200" 
                          (click)="moveModule(i, 1)" 
                          [disabled]="i === modules().length - 1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Module {{ i + 1 }}: {{ module.title }}
                    </h3>
                    <app-badge [variant]="module.isPublished ? 'success' : 'warning'">
                      {{ module.isPublished ? 'Published' : 'Draft' }}
                    </app-badge>
                  </div>
                  <p *ngIf="module.description" class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    {{ module.description }}
                  </p>
                  <p class="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                    {{ module.lectures?.length || 0 }} lectures • {{ module.duration }} min
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button (click)="toggleModule(module.id)" 
                        class="p-2 text-neutral-600 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700 rounded">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" 
                       [class.rotate-180]="expandedModules().has(module.id)">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button (click)="editModule(module)" 
                        class="p-2 text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20 rounded">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button (click)="deleteModule(module.id)" 
                        class="p-2 text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-900/20 rounded">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Lectures List -->
            <div *ngIf="expandedModules().has(module.id)" class="p-4">
              <div class="space-y-2 mb-4">
                <div *ngFor="let lecture of module.lectures; let j = index" 
                     class="flex items-center justify-between p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded hover:shadow-sm transition-shadow">
                  <div class="flex items-center gap-3 flex-1">
                    <div class="flex flex-col gap-1">
                      <button class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200" 
                              (click)="moveLecture(module.id, j, -1)" 
                              [disabled]="j === 0">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200" 
                              (click)="moveLecture(module.id, j, 1)" 
                              [disabled]="j === (module.lectures?.length || 0) - 1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="text-2xl">{{ getLectureIcon(lecture.contentType) }}</span>
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ lecture.title }}</span>
                          <app-badge *ngIf="lecture.isFree" variant="success" size="sm">Free Preview</app-badge>
                        </div>
                        <p class="text-xs text-neutral-500 dark:text-neutral-500">
                          {{ lecture.contentType }} • {{ lecture.duration }} min
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button (click)="editLecture(module.id, lecture)" 
                            class="p-2 text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20 rounded">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button (click)="deleteLecture(module.id, lecture.id)" 
                            class="p-2 text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-900/20 rounded">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Empty State -->
                <div *ngIf="!module.lectures || module.lectures.length === 0" class="text-center py-6 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded">
                  <p class="text-neutral-500 dark:text-neutral-500 text-sm mb-2">No lectures in this module yet</p>
                </div>
              </div>

              <app-button (click)="showLectureForm = true; editingLecture = null; selectedModuleId = module.id" 
                          variant="outline" 
                          size="sm">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Lecture
              </app-button>
            </div>
          </div>
        </div>

        <!-- Module Form Modal -->
        <div *ngIf="showModuleForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-neutral-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {{ editingModule ? 'Edit Module' : 'Add New Module' }}
                </h2>
                <button (click)="closeModuleForm()" class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form (ngSubmit)="saveModule()" class="space-y-4">
                <div>
                  <label class="form-label">Module Title *</label>
                  <input type="text" [(ngModel)]="moduleForm.title" name="title" class="form-input" placeholder="Introduction to Programming" required>
                </div>

                <div>
                  <label class="form-label">Description</label>
                  <textarea [(ngModel)]="moduleForm.description" name="description" class="form-input" rows="3" placeholder="Brief description of what this module covers"></textarea>
                </div>

                <div class="flex items-center gap-2">
                  <input type="checkbox" [(ngModel)]="moduleForm.isPublished" name="isPublished" id="modulePublished" class="rounded">
                  <label for="modulePublished" class="text-sm text-neutral-700 dark:text-neutral-300">Publish this module</label>
                </div>

                <div class="flex gap-3 justify-end pt-4">
                  <app-button type="button" (click)="closeModuleForm()" variant="outline">Cancel</app-button>
                  <app-button type="submit" variant="primary">{{ editingModule ? 'Update' : 'Create' }} Module</app-button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Lecture Form Modal -->
        <div *ngIf="showLectureForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-neutral-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {{ editingLecture ? 'Edit Lecture' : 'Add New Lecture' }}
                </h2>
                <button (click)="closeLectureForm()" class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form (ngSubmit)="saveLecture()" class="space-y-4">
                <div>
                  <label class="form-label">Lecture Title *</label>
                  <input type="text" [(ngModel)]="lectureForm.title" name="title" class="form-input" placeholder="Getting Started" required>
                </div>

                <div>
                  <label class="form-label">Description</label>
                  <textarea [(ngModel)]="lectureForm.description" name="description" class="form-input" rows="2" placeholder="What students will learn in this lecture"></textarea>
                </div>

                <div>
                  <label class="form-label">Content Type *</label>
                  <select [(ngModel)]="lectureForm.contentType" name="contentType" class="form-input" required>
                    <option value="video">Video</option>
                    <option value="pdf">PDF Document</option>
                    <option value="text">Text/Article</option>
                    <option value="quiz">Quiz</option>
                    <option value="assignment">Assignment</option>
                  </select>
                </div>

                <!-- Video Fields -->
                <div *ngIf="lectureForm.contentType === 'video'" class="space-y-4">
                  <div>
                    <label class="form-label">Video Provider</label>
                    <select [(ngModel)]="lectureForm.videoProvider" name="videoProvider" class="form-input">
                      <option value="youtube">YouTube</option>
                      <option value="vimeo">Vimeo</option>
                      <option value="custom">Custom/Direct URL</option>
                    </select>
                  </div>
                  <div>
                    <label class="form-label">Video URL *</label>
                    <input type="url" [(ngModel)]="lectureForm.videoUrl" name="videoUrl" class="form-input" placeholder="https://youtube.com/watch?v=...">
                  </div>
                </div>

                <!-- PDF Field -->
                <div *ngIf="lectureForm.contentType === 'pdf'">
                  <label class="form-label">PDF URL *</label>
                  <input type="url" [(ngModel)]="lectureForm.pdfUrl" name="pdfUrl" class="form-input" placeholder="https://example.com/document.pdf">
                </div>

                <!-- Text Content -->
                <div *ngIf="lectureForm.contentType === 'text'">
                  <label class="form-label">Content *</label>
                  <textarea [(ngModel)]="lectureForm.textContent" name="textContent" class="form-input" rows="8" placeholder="Write your article content here..."></textarea>
                </div>

                <div>
                  <label class="form-label">Duration (minutes) *</label>
                  <input type="number" [(ngModel)]="lectureForm.duration" name="duration" class="form-input" min="1" placeholder="15" required>
                </div>

                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="lectureForm.isFree" name="isFree" id="lectureFree" class="rounded">
                    <label for="lectureFree" class="text-sm text-neutral-700 dark:text-neutral-300">Free Preview</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="lectureForm.isPublished" name="isPublished" id="lecturePublished" class="rounded">
                    <label for="lecturePublished" class="text-sm text-neutral-700 dark:text-neutral-300">Publish this lecture</label>
                  </div>
                </div>

                <div class="flex gap-3 justify-end pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <app-button type="button" (click)="closeLectureForm()" variant="outline">Cancel</app-button>
                  <app-button type="submit" variant="primary">{{ editingLecture ? 'Update' : 'Create' }} Lecture</app-button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  `,
  styles: []
})
export class CourseCurriculumComponent implements OnInit {
  private instructorService = inject(InstructorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  courseId = '';
  modules = signal<Module[]>([]);
  loading = signal(true);
  expandedModules = signal(new Set<string>());

  showModuleForm = false;
  editingModule: Module | null = null;
  moduleForm = {
    title: '',
    description: '',
    isPublished: false
  };

  showLectureForm = false;
  editingLecture: Lecture | null = null;
  selectedModuleId = '';
  lectureForm = {
    title: '',
    description: '',
    contentType: 'video' as LectureContentType,
    videoUrl: '',
    videoProvider: 'youtube' as 'youtube' | 'vimeo' | 'custom',
    pdfUrl: '',
    textContent: '',
    duration: 10,
    isFree: false,
    isPublished: false
  };

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCurriculum();
  }

  loadCurriculum(): void {
    this.loading.set(true);
    this.instructorService.getCourseModules(this.courseId).subscribe({
      next: (modules) => {
        this.modules.set(modules);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  toggleModule(moduleId: string): void {
    const expanded = new Set(this.expandedModules());
    if (expanded.has(moduleId)) {
      expanded.delete(moduleId);
    } else {
      expanded.add(moduleId);
    }
    this.expandedModules.set(expanded);
  }

  editModule(module: Module): void {
    this.editingModule = module;
    this.moduleForm = {
      title: module.title,
      description: module.description || '',
      isPublished: module.isPublished
    };
    this.showModuleForm = true;
  }

  saveModule(): void {
    if (this.editingModule) {
      // Update existing module
      this.instructorService.updateModule(this.editingModule.id, this.moduleForm).subscribe({
        next: () => {
          this.loadCurriculum();
          this.closeModuleForm();
        }
      });
    } else {
      // Create new module
      const newModule = {
        ...this.moduleForm,
        courseId: this.courseId,
        orderIndex: this.modules().length
      };
      this.instructorService.createModule(newModule).subscribe({
        next: () => {
          this.loadCurriculum();
          this.closeModuleForm();
        }
      });
    }
  }

  deleteModule(moduleId: string): void {
    if (confirm('Are you sure you want to delete this module and all its lectures?')) {
      this.instructorService.deleteModule(moduleId).subscribe({
        next: () => {
          this.loadCurriculum();
        }
      });
    }
  }

  closeModuleForm(): void {
    this.showModuleForm = false;
    this.editingModule = null;
    this.moduleForm = { title: '', description: '', isPublished: false };
  }

  editLecture(moduleId: string, lecture: Lecture): void {
    this.selectedModuleId = moduleId;
    this.editingLecture = lecture;
    this.lectureForm = {
      title: lecture.title,
      description: lecture.description || '',
      contentType: lecture.contentType,
      videoUrl: lecture.videoUrl || '',
      videoProvider: (lecture.videoProvider as any) || 'youtube',
      pdfUrl: lecture.pdfUrl || '',
      textContent: lecture.textContent || '',
      duration: lecture.duration,
      isFree: lecture.isFree,
      isPublished: lecture.isPublished
    };
    this.showLectureForm = true;
  }

  saveLecture(): void {
    if (this.editingLecture) {
      // Update existing lecture
      this.instructorService.updateLecture(this.editingLecture.id, this.lectureForm).subscribe({
        next: () => {
          this.loadCurriculum();
          this.closeLectureForm();
        }
      });
    } else {
      // Create new lecture
      const lecturesInModule = this.modules().find(m => m.id === this.selectedModuleId)?.lectures?.length || 0;
      const newLecture = {
        ...this.lectureForm,
        moduleId: this.selectedModuleId,
        orderIndex: lecturesInModule
      };
      this.instructorService.createLecture(newLecture).subscribe({
        next: () => {
          this.loadCurriculum();
          this.closeLectureForm();
        }
      });
    }
  }

  deleteLecture(moduleId: string, lectureId: string): void {
    if (confirm('Are you sure you want to delete this lecture?')) {
      this.instructorService.deleteLecture(lectureId).subscribe({
        next: () => {
          this.loadCurriculum();
        }
      });
    }
  }

  closeLectureForm(): void {
    this.showLectureForm = false;
    this.editingLecture = null;
    this.selectedModuleId = '';
    this.lectureForm = {
      title: '',
      description: '',
      contentType: 'video',
      videoUrl: '',
      videoProvider: 'youtube',
      pdfUrl: '',
      textContent: '',
      duration: 10,
      isFree: false,
      isPublished: false
    };
  }

  moveModule(index: number, direction: number): void {
    const newModules = [...this.modules()];
    const targetIndex = index + direction;
    
    if (targetIndex < 0 || targetIndex >= newModules.length) return;

    [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
    
    // Update order indices
    newModules.forEach((module, idx) => {
      this.instructorService.updateModule(module.id, { orderIndex: idx }).subscribe();
    });
    
    this.modules.set(newModules);
  }

  moveLecture(moduleId: string, index: number, direction: number): void {
    const module = this.modules().find(m => m.id === moduleId);
    if (!module || !module.lectures) return;

    const newLectures = [...module.lectures];
    const targetIndex = index + direction;
    
    if (targetIndex < 0 || targetIndex >= newLectures.length) return;

    [newLectures[index], newLectures[targetIndex]] = [newLectures[targetIndex], newLectures[index]];
    
    // Update order indices
    newLectures.forEach((lecture, idx) => {
      this.instructorService.updateLecture(lecture.id, { orderIndex: idx }).subscribe();
    });
    
    this.loadCurriculum();
  }

  getLectureIcon(contentType: LectureContentType): string {
    switch (contentType) {
      case 'video': return '🎥';
      case 'pdf': return '📄';
      case 'text': return '📝';
      case 'quiz': return '❓';
      case 'assignment': return '📋';
      default: return '📚';
    }
  }

  goBack(): void {
    this.router.navigate(['/instructor/courses']);
  }
}
