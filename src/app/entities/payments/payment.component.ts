import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../enrollments/enrollment.service';
import { AuthService } from '../../auth/auth.service';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  courseId: string | null = null;
  price: number | null = null;

  // simple form model
  payerName = '';
  cardNumber = '';
  expiry = '';
  cvv = '';
  processing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private enrollmentService: EnrollmentService,
    public auth: AuthService,
    private toast: ToastService
  ) {
    this.route.queryParamMap.subscribe(m => {
      this.courseId = m.get('courseId');
      const p = m.get('price');
      this.price = p ? Number(p) : null;
    });
  }

  cancel() {
    this.router.navigate(['/courses', this.courseId || '']);
  }

  submitPayment() {
    if (!this.courseId) return;
    if (!this.auth.currentUser || this.auth.currentUser.role !== 'student') {
      this.toast.show('Please login as a student to complete payment', 'warning');
      this.router.navigate(['/login']);
      return;
    }

    // Basic client-side validation (fake payment)
    if (!this.payerName || !this.cardNumber || !this.expiry || !this.cvv) {
      this.toast.show('Please fill all payment fields', 'warning');
      return;
    }

    this.processing = true;

    // Simulate payment delay then create enrollment
    setTimeout(() => {
      // If user is a student, create enrollment; otherwise just acknowledge payment
      if (this.auth.currentUser && this.auth.currentUser.role === 'student') {
        const studentId = this.auth.currentUser.id;
        this.enrollmentService.createEnrollment(studentId, this.courseId!).subscribe({
          next: () => {
            this.processing = false;
            this.toast.show('Payment successful — you are now enrolled!', 'success');
            this.router.navigate(['/courses', this.courseId]);
          },
          error: (err) => {
            this.processing = false;
            console.error('Enrollment after payment failed', err);
            this.toast.show('Payment succeeded but enrollment failed. Contact support.', 'error');
          }
        });
      } else {
        this.processing = false;
        this.toast.show('Payment simulated — thank you!', 'success');
        this.router.navigate(['/courses', this.courseId]);
      }
    }, 1200);
  }
}
