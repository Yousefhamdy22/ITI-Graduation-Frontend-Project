import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToastContainerComponent } from '../../shared/toast-container/toast-container.component';
import { AdminHeaderComponent } from './admin/admin-header.component';
import { InstructorHeaderComponent } from './instructor/instructor-header.component';
import { StudentHeaderComponent } from './student/student-header.component';

@Component({
  selector: 'app-role-header',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminHeaderComponent, InstructorHeaderComponent, StudentHeaderComponent, ToastContainerComponent],
  templateUrl: './role-header.component.html',
  styleUrls: ['./role-header.component.css']
})
export class RoleHeaderComponent {
  user$!: Observable<any>;
  snapshotUser: any = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user$ = this.auth.user$;

    // subscribe to user changes and keep a snapshot fallback
    this.auth.user$.subscribe(u => {
      // store non-null values
      if (u) {
        this.snapshotUser = u;
      } else {
        // try to recover from localStorage in case the observable temporarily emits null
        try {
          const raw = localStorage.getItem('elearning_user');
          if (raw) this.snapshotUser = JSON.parse(raw);
        } catch (e) {
          // ignore
        }
      }
    });

    // On navigation end, refresh snapshot from currentUser to catch timing issues
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      const cur = this.auth.currentUser;
      if (cur) this.snapshotUser = cur;
    });
  }
}
