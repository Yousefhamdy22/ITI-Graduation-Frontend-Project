import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { InstructorService } from './instructor.service';
import { Instructor } from './instructor.model';

@Component({
  selector: 'app-instructors',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.css']
})
export class InstructorsComponent implements OnInit {
  instructors: Instructor[] = [];
  filteredInstructors: Instructor[] = [];
  loading = true;

  query = { search: '' };

  constructor(private instructorService: InstructorService, private router: Router) {}

  ngOnInit(): void {
    this.loadInstructors();
  }

  loadInstructors() {
    this.loading = true;

    // Avoid calling secured API when there's no auth token to prevent 401s
    let token: string | null = null;
    try { token = typeof window !== 'undefined' ? localStorage.getItem('token') : null; } catch {}
    if (!token) {
      console.warn('Skipping instructors fetch: no auth token present');
      this.loading = false;
      this.instructors = [];
      this.filteredInstructors = [];
      return;
    }

    this.instructorService.getInstructors().subscribe({
      next: (instructors) => {
        console.log('✅ المدربين وصلوا:', instructors);
        this.instructors = instructors;
        this.filteredInstructors = instructors;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ خطأ:', err);
        this.loading = false;
      }
    });
  }

  filterInstructors() {
    let result = [...this.instructors];

    if (this.query.search) {
      const term = this.query.search.toLowerCase();
      result = result.filter(i => {
        const fullName = `${i.firstName} ${i.lastName}`.toLowerCase();
        return fullName.includes(term) || i.email?.toLowerCase().includes(term) || i.title?.toLowerCase().includes(term);
      });
    }

    this.filteredInstructors = result;
  }

  onSearch() {
    this.filterInstructors();
  }

  navigateToInstructor(id?: string, event?: Event) {
    if (!id) return;
    if (event) { event.preventDefault(); }
    this.router.navigate(['/instructors', id]);
  }
}
