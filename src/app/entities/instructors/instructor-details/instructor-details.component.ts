import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InstructorService } from '../instructor.service';
import { Instructor } from '../instructor.model';

@Component({
  selector: 'app-instructor-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './instructor-details.component.html',
  styleUrls: ['./instructor-details.component.css']
})
export class InstructorDetailsComponent {
  instructor: Instructor | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private instructorService: InstructorService
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.instructorService.getInstructorById(id).subscribe({
      next: (i) => {
        this.instructor = i;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
