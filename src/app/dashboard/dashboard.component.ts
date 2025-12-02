
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardService } from './dashboard.service';
import { StudentService } from '../entities/students/student.service';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  stats$: any;

  // students for table
  students$: Observable<any[]>;
  filteredStudents: any[] = [];

  // UI state
  query = '';
  page = 1;
  pageSize = 5;

  constructor(
    private dashboardservice: DashboardService,
    private studentService: StudentService,
    private router: Router
  ) {
    this.students$ = this.studentService.getStudents();
    this.stats$ = this.dashboardservice.stats$;
    // keep a live list for simple client-side search/pagination
    this.students$.subscribe(list => {
      this.filteredStudents = list || [];
    });
  }

  onSearch() {
    const q = (this.query || '').trim();
    this.studentService.getStudents().subscribe(list => {
      this.filteredStudents = (list || []).filter(s => {
        const term = q || '';
        return (
          !term ||
          s.name?.toLowerCase().includes(term.toLowerCase()) ||
          s.phone?.includes(term)
        );
      });
      this.page = 1;
    });
  }

  clearSearch() {
    this.query = '';
    this.onSearch();
  }

  goToStudent(id: string) {
    this.router.navigate(['/students', id]);
  }

  get pagedStudents() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredStudents.slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.max(1, Math.ceil(this.filteredStudents.length / this.pageSize));
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  nextPage() {
    if (this.page < this.totalPages()) this.page++;
  }
}
