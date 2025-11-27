import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  constructor(private instructorService: InstructorService) {}

  ngOnInit(): void {
    this.loadInstructors();
  }

  loadInstructors() {
    this.loading = true;
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
      result = result.filter(i =>
        i.name?.toLowerCase().includes(term) ||
        i.expertise?.some(e => e.toLowerCase().includes(term))
      );
    }

    this.filteredInstructors = result;
  }

  onSearch() {
    this.filterInstructors();
  }
}
