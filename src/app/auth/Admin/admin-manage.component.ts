import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminService } from '../../entities/admin/admin.service';
import { Admin, AdminResponse } from '../../entities/admin/admin.model';
import { ToastService } from '../../shared/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-manage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-manage.component.html',
  styleUrls: ['./admin-manage.component.css']
})
export class AdminManageComponent implements OnInit, OnDestroy {
  admins: Admin[] = [];
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private adminService: AdminService = inject(AdminService),
    private toast: ToastService = inject(ToastService),
    private router: Router = inject(Router)
  ) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
          
          if (error.status === 401) {
            this.toast.show('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى', 'error');
            setTimeout(() => this.router.navigate(['/admin/login']), 2000);
          } else {
            this.toast.show('خطأ في تحميل الـ admins', 'error');
          }
          
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
}
