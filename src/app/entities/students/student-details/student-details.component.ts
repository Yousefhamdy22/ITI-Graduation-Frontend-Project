import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StudentService } from '../student.service';
import { Student } from '../student.model';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent {
  student: Student | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.studentService.getStudentById(id).subscribe({
      next: (s) => {
        this.student = s;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
