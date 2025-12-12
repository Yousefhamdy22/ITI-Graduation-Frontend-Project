import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminService } from '../../entities/admin/admin.service';
import { Admin, CreateAdminRequest, AdminResponse } from '../../entities/admin/admin.model';
import { ToastService } from '../../shared/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-manage.component.html',
  styleUrls: ['./admin-manage.component.css']
})
export class AdminManageComponent implements OnInit, OnDestroy {
  admins: Admin[] = [];
  isLoading = false;
  showForm = false;
  editingAdminId: string | null = null;
  form!: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(
    private adminService: AdminService = inject(AdminService),
    private toast: ToastService = inject(ToastService),
    private router: Router = inject(Router),
    private fb: FormBuilder = inject(FormBuilder)
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadAdmins();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    });
  }

  loadAdmins(): void {
    this.isLoading = true;
    this.adminService.getAllAdmins()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.admins = response.value || [];
          console.log('✅ Admins loaded:', this.admins.length);
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('❌ Error loading admins:', error);
          this.toast.show('خطأ في تحميل الـ admins', 'error');
          this.isLoading = false;
        }
      });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.editingAdminId = null;
    this.form.reset();
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.toast.show('يرجى ملء جميع الحقول بشكل صحيح', 'error');
      return;
    }

    const data: CreateAdminRequest = this.form.value;
    this.isLoading = true;

    this.adminService.createAdmin(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: AdminResponse) => {
          if (response.isSuccess) {
            this.toast.show('تم إضافة الـ Admin بنجاح', 'success');
            this.form.reset();
            this.showForm = false;
            this.loadAdmins();
          } else {
            this.toast.show(response.message || 'حدث خطأ', 'error');
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('❌ Error creating admin:', error);
          this.toast.show(error?.error?.message || 'خطأ في إنشاء الـ Admin', 'error');
          this.isLoading = false;
        }
      });
  }

  deleteAdmin(adminId: string, adminEmail: string): void {
    if (!confirm(`هل تريد حذف الـ Admin: ${adminEmail}؟`)) {
      return;
    }

    if (this.admins.length === 1) {
      this.toast.show('لا يمكن حذف آخر Admin', 'error');
      return;
    }

    this.adminService.deleteAdmin(adminId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: AdminResponse) => {
          if (response.isSuccess) {
            this.toast.show('تم حذف الـ Admin بنجاح', 'success');
            this.loadAdmins();
          } else {
            this.toast.show(response.message || 'حدث خطأ', 'error');
          }
        },
        error: (error: any) => {
          console.error('❌ Error deleting admin:', error);
          this.toast.show(error?.error?.message || 'خطأ في حذف الـ Admin', 'error');
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  get emailError(): string {
    const control = this.form.get('email');
    if (control?.hasError('required')) return 'البريد الإلكتروني مطلوب';
    if (control?.hasError('email')) return 'البريد الإلكتروني غير صحيح';
    return '';
  }

  get passwordError(): string {
    const control = this.form.get('password');
    if (control?.hasError('required')) return 'كلمة المرور مطلوبة';
    if (control?.hasError('minlength')) return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    return '';
  }

  get firstNameError(): string {
    const control = this.form.get('firstName');
    if (control?.hasError('required')) return 'الاسم الأول مطلوب';
    return '';
  }

  get lastNameError(): string {
    const control = this.form.get('lastName');
    if (control?.hasError('required')) return 'الاسم الأخير مطلوب';
    return '';
  }
}
