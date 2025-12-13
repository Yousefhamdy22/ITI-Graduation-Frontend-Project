import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isAdmin = false;
  isStudent = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    const user = this.auth.currentUser;
    if (user) {
      this.isAdmin = user.role === 'admin';
      this.isStudent = user.role === 'student';
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
