import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

/**
 * Visitor Header Component
 * Displays navigation for guest/visitor users who are browsing without full registration
 * Shows limited options with prompts to sign up or log in
 */
@Component({
    selector: 'app-visitor-header',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './visitor-header.component.html',
    styleUrls: ['./visitor-header.component.css']
})
export class VisitorHeaderComponent {
    @Input() user: any;
    searchQuery = '';

    constructor(private auth: AuthService, private router: Router) { }

    search() {
        if (this.searchQuery.trim()) {
            this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
        }
    }

    logout() {
        this.auth.logout();
        this.router.navigate(['/']);
    }
}
