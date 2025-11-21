import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InstructorService } from '@core/services/instructor.service';
import { Course, CourseLevel } from '@core/models/entities.model';
import { CardComponent } from '@shared/components/card/card.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-instructor-course-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardComponent,
    ButtonComponent,
    LoaderComponent
  ],
  template: `
      <div class="max-w-4xl mx-auto space-y-6 p-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {{ isEditMode() ? 'Edit Course' : 'Create New Course' }}
            </h1>
            <p class="text-neutral-600 dark:text-neutral-400 mt-1">
              {{ isEditMode() ? 'Update your course information' : 'Fill in the details to create a new course' }}
            </p>
          </div>
          <app-button [routerLink]="['/instructor/courses']" variant="ghost">
            Cancel
          </app-button>
        </div>

        @if (loading()) {
          <div class="flex justify-center py-12">
            <app-loader></app-loader>
          </div>
        } @else {
          <form [formGroup]="courseForm" (ngSubmit)="onSubmit()">
            <!-- Basic Information -->
            <app-card header="Basic Information">
              <div class="space-y-4">
                <div>
                  <label class="form-label">Course Title *</label>
                  <input
                    type="text"
                    formControlName="title"
                    class="form-input"
                    placeholder="Enter course title"
                  />
                  @if (courseForm.get('title')?.invalid && courseForm.get('title')?.touched) {
                    <p class="form-error">Title is required</p>
                  }
                </div>

                <div>
                  <label class="form-label">Short Description *</label>
                  <textarea
                    formControlName="shortDescription"
                    rows="2"
                    class="form-input"
                    placeholder="Brief description of your course"
                  ></textarea>
                  @if (courseForm.get('shortDescription')?.invalid && courseForm.get('shortDescription')?.touched) {
                    <p class="form-error">Short description is required</p>
                  }
                </div>

                <div>
                  <label class="form-label">Full Description *</label>
                  <textarea
                    formControlName="description"
                    rows="6"
                    class="form-input"
                    placeholder="Detailed course description"
                  ></textarea>
                  @if (courseForm.get('description')?.invalid && courseForm.get('description')?.touched) {
                    <p class="form-error">Description is required</p>
                  }
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">Category *</label>
                    <select formControlName="category" class="form-input">
                      <option value="">Select a category</option>
                      <option value="programming">Programming</option>
                      <option value="design">Design</option>
                      <option value="business">Business</option>
                      <option value="marketing">Marketing</option>
                      <option value="data-science">Data Science</option>
                      <option value="languages">Languages</option>
                      <option value="other">Other</option>
                    </select>
                    @if (courseForm.get('category')?.invalid && courseForm.get('category')?.touched) {
                      <p class="form-error">Category is required</p>
                    }
                  </div>

                  <div>
                    <label class="form-label">Level *</label>
                    <select formControlName="level" class="form-input">
                      <option value="">Select level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    @if (courseForm.get('level')?.invalid && courseForm.get('level')?.touched) {
                      <p class="form-error">Level is required</p>
                    }
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">Language *</label>
                    <select formControlName="language" class="form-input">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>

                  <div>
                    <label class="form-label">Duration (hours)</label>
                    <input
                      type="number"
                      formControlName="duration"
                      class="form-input"
                      placeholder="0"
                      min="0"
                      step="0.5"
                    />
                  </div>
                </div>
              </div>
            </app-card>

            <!-- Pricing -->
            <app-card header="Pricing">
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">Price *</label>
                    <div class="relative">
                      <span class="absolute left-3 top-2.5 text-neutral-500">$</span>
                      <input
                        type="number"
                        formControlName="price"
                        class="form-input pl-8"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    @if (courseForm.get('price')?.invalid && courseForm.get('price')?.touched) {
                      <p class="form-error">Price is required</p>
                    }
                  </div>

                  <div>
                    <label class="form-label">Discount Price</label>
                    <div class="relative">
                      <span class="absolute left-3 top-2.5 text-neutral-500">$</span>
                      <input
                        type="number"
                        formControlName="discountPrice"
                        class="form-input pl-8"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </app-card>

            <!-- Media -->
            <app-card header="Media">
              <div class="space-y-4">
                <div>
                  <label class="form-label">Cover Image URL</label>
                  <input
                    type="url"
                    formControlName="coverImage"
                    class="form-input"
                    placeholder="https://example.com/image.jpg"
                  />
                  @if (courseForm.get('coverImage')?.value) {
                    <div class="mt-2">
                      <img [src]="courseForm.get('coverImage')?.value" alt="Cover preview" class="w-full h-48 object-cover rounded-lg" />
                    </div>
                  }
                </div>

                <div>
                  <label class="form-label">Promo Video URL</label>
                  <input
                    type="url"
                    formControlName="promoVideoUrl"
                    class="form-input"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>
            </app-card>

            <!-- Additional Details -->
            <app-card header="Additional Details">
              <div class="space-y-4">
                <div>
                  <label class="form-label">Requirements</label>
                  <textarea
                    formControlName="requirements"
                    rows="4"
                    class="form-input"
                    placeholder="List course requirements"
                  ></textarea>
                  <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    One requirement per line
                  </p>
                </div>

                <div>
                  <label class="form-label">What Students Will Learn</label>
                  <textarea
                    formControlName="whatYouWillLearn"
                    rows="4"
                    class="form-input"
                    placeholder="What will students learn?"
                  ></textarea>
                  <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    One requirement per line
                  </p>
                </div>

                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    formControlName="isFeatured"
                    class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <label for="isFeatured" class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Featured Course
                  </label>
                </div>

                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPublished"
                    formControlName="isPublished"
                    class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <label for="isPublished" class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Publish Course
                  </label>
                </div>
              </div>
            </app-card>

            <!-- Actions -->
            <div class="flex gap-4 justify-end">
              <app-button [routerLink]="['/instructor/courses']" variant="ghost" type="button">
                Cancel
              </app-button>
              <app-button type="submit" variant="primary" [loading]="saving()" [disabled]="courseForm.invalid">
                {{ isEditMode() ? 'Update Course' : 'Create Course' }}
              </app-button>
            </div>
          </form>
        }
      </div>
  `,
  styles: []
})
export class InstructorCourseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private instructorService = inject(InstructorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = signal(false);
  saving = signal(false);
  isEditMode = signal(false);
  courseId = signal<string | null>(null);

  courseForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    shortDescription: ['', [Validators.required, Validators.minLength(20)]],
    description: ['', [Validators.required, Validators.minLength(50)]],
    category: ['', Validators.required],
    level: ['', Validators.required],
    language: ['en', Validators.required],
    duration: [0],
    price: [0, [Validators.required, Validators.min(0)]],
    discountPrice: [null],
    coverImage: [''],
    promoVideoUrl: [''],
    requirements: [''],
    whatYouWillLearn: [''],
    isFeatured: [false],
    isPublished: [false]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.courseId.set(id);
      this.loadCourse(id);
    }
  }

  loadCourse(id: string): void {
    this.loading.set(true);
    this.instructorService.getCourse(id).subscribe({
      next: (course) => {
        this.courseForm.patchValue({
          title: course.title,
          shortDescription: course.shortDescription,
          description: course.description,
          category: course.category,
          level: course.level,
          language: course.language,
          duration: course.duration / 3600, // Convert seconds to hours
          price: course.price,
          discountPrice: course.discountPrice,
          coverImage: course.coverImage,
          promoVideoUrl: course.promoVideoUrl,
          requirements: course.requirements,
          whatYouWillLearn: course.whatYouWillLearn,
          isFeatured: course.isFeatured,
          isPublished: course.isPublished
        });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/instructor/courses']);
      }
    });
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const formValue = this.courseForm.value;

    const courseData: Partial<Course> = {
      title: formValue.title,
      shortDescription: formValue.shortDescription,
      description: formValue.description,
      category: formValue.category,
      level: formValue.level as CourseLevel,
      language: formValue.language,
      duration: formValue.duration * 3600, // Convert hours to seconds
      price: formValue.price,
      discountPrice: formValue.discountPrice,
      coverImage: formValue.coverImage,
      promoVideoUrl: formValue.promoVideoUrl,
      requirements: formValue.requirements?.split('\n').filter((r: string) => r.trim()),
      whatYouWillLearn: formValue.whatYouWillLearn?.split('\n').filter((w: string) => w.trim()),
      isFeatured: formValue.isFeatured,
      isPublished: formValue.isPublished
    };

    const request = this.isEditMode()
      ? this.instructorService.updateCourse(this.courseId()!, courseData)
      : this.instructorService.createCourse(courseData);

    request.subscribe({
      next: (course) => {
        this.saving.set(false);
        if (this.isEditMode()) {
          this.router.navigate(['/instructor/courses', course.id, 'curriculum']);
        } else {
          this.router.navigate(['/instructor/courses']);
        }
      },
      error: () => {
        this.saving.set(false);
      }
    });
  }
}

