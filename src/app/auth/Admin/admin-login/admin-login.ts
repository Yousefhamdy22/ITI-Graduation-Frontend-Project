import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService, Role} from '../../auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLogin {
  name = 'مستخدم';
  role: Role = 'admin';
  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
  }

  loginAs(role: Role) {
    if (role === 'admin') {
      this.auth.loginAs('admin', 'Admin');
      this.router.navigate(['/dashboard']);
      return;
    }
  }

  login() {
    const user = this.auth.loginAs(this.role, this.name);
    if (user.role === 'admin') this.router.navigate(['/dashboard']);
    else this.router.navigate(['/home']);
  }


}
