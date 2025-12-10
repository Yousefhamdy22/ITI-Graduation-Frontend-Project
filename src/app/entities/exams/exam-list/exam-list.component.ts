import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Exam } from '../exam.model';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent {
  @Input() exams: Exam[] = [];
  @Output() editExam = new EventEmitter<Exam>();
  @Output() deleteExam = new EventEmitter<string>();

  onEdit(exam: Exam) {
    this.editExam.emit(exam);
  }

  onDelete(examId: string) {
    if (confirm('هل أنت متأكد من حذف الاختبار؟')) {
      this.deleteExam.emit(examId);
    }
  }
}


