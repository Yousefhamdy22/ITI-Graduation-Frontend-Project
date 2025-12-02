import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { SearchPipe } from '../shared/pipes/search-pipe';
import { CourseService } from '../entities/courses/course.service';
import { Course } from '../entities/courses/course.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-6">
      <h2 class="text-2xl font-bold mb-4">Search results</h2>

      <div if="!q" class="text-gray-600 mb-4">Type a query in the dashboard search and press Enter.</div>

      <div if="q" class="mb-4">
        <div class="flex items-center gap-3 mb-3">
          <p class="font-semibold">Results for:</p>
          <p class="text-[#0E4D67]">"{{ q }}"</p>
          <button class="ml-auto text-sm text-gray-500" (click)="onClear()">Clear</button>
        </div>

        <div if="(courses$ | async) as courses">
          <div if="(courses | search:q:['title','instructorName']).length === 0" class="text-gray-600">No results found.</div>

            <div class="space-y-3">
              <div [innerHTML]="resultsHtml"></div>
            </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SearchComponent {
  q = '';
  courses$: Observable<Course[]>;
  resultsHtml: SafeHtml = '';
  private latestCourses: Course[] = [];

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.courses$ = this.courseService.getCourses();

    this.courses$.subscribe((list) => {
      this.latestCourses = list || [];
      this.renderResults();
    });

    this.route.queryParamMap.subscribe((m) => {
      this.q = m.get('q') || '';
      this.renderResults();
    });
  }

  onClear() {
    this.router.navigate([], { queryParams: { q: null }, queryParamsHandling: 'merge' });
    this.q = '';
  }

  private renderResults() {
    try {
      const pipe = new SearchPipe();
      const filtered = pipe.transform(this.latestCourses || [], this.q, ['title', 'instructorName']) || [];
      if (!filtered || filtered.length === 0) {
        this.resultsHtml = this.sanitizer.bypassSecurityTrustHtml('<div class="text-gray-600">No results found.</div>');
        return;
      }

      const html = filtered
        .map((c) => {
          const image = c.image || '';
          const title = (c.title || '').toString().replace(/</g, '&lt;').replace(/>/g, '&gt;');
          const instructor = (c.instructorName || '').toString().replace(/</g, '&lt;').replace(/>/g, '&gt;');
          const students = (c.studentsCount || 0).toString();
          return `
            <div class="bg-white p-4 rounded shadow-sm">
              <div class="flex items-center gap-4">
                <img src="${image}" alt="" class="w-16 h-10 object-cover rounded" />
                <div>
                  <div class="font-semibold">${title}</div>
                  <div class="text-sm text-gray-500">${instructor} · ${students} students</div>
                </div>
              </div>
            </div>
          `;
        })
        .join('\n');

      this.resultsHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    } catch (e) {
      this.resultsHtml = this.sanitizer.bypassSecurityTrustHtml('<div class="text-red-600">Error rendering results.</div>');
    }
  }
}
