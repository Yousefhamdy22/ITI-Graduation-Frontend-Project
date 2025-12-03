import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastContainerComponent } from '../../shared/toast-container/toast-container.component';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastContainerComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  user$!: Observable<any>;

constructor(private auth: AuthService, private router: Router) {}

ngOnInit() {
  this.user$ = this.auth.user$;
}


  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
