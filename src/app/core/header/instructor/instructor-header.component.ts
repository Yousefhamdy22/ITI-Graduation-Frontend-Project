import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-instructor-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './instructor-header.component.html',
  styleUrls: ['./instructor-header.component.css']
})
export class InstructorHeaderComponent {
  @Input() user: any = null;
  searchQuery = '';

  constructor(private auth: AuthService, private router: Router) { }

  search() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  ngOnInit() {
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
