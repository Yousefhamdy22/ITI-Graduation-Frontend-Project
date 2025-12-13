import { Component, OnInit } from '@angular/core';
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
import { PublicHeaderComponent } from './public-header.component';

@Component({
  selector: 'app-role-header',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminHeaderComponent, InstructorHeaderComponent, StudentHeaderComponent, PublicHeaderComponent, ToastContainerComponent],
  templateUrl: './role-header.component.html',
  styleUrls: ['./role-header.component.css']
})
export class RoleHeaderComponent implements OnInit {
  user$!: Observable<any>;
  snapshotUser: any = null;

  constructor(private auth: AuthService, private router: Router) {
    // Initialize snapshot immediately in constructor
    this.snapshotUser = this.auth.currentUser;
  }

  ngOnInit() {
    this.user$ = this.auth.user$;

    // Subscribe to user changes and keep a snapshot
    this.auth.user$.subscribe(u => {
      this.snapshotUser = u || null;
      console.log('Header - User updated:', this.snapshotUser);
    });

    // On navigation end, update snapshot
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.snapshotUser = this.auth.currentUser;
      console.log('Header - Navigation updated:', this.snapshotUser);
    });
  }
}
