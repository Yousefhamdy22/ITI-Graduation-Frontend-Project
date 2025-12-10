import {Component, OnInit} from '@angular/core';
import {HomeComponent} from "../../../home/home.component";
import {CommonModule} from "@angular/common";
import {AuthService} from '../../auth.service';
import {Router, RouterModule} from '@angular/router';
import {RoleHeaderComponent} from '../../../core/header/role-header.component';
import {FooterComponent} from '../../../core/footer/footer.component';

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule, RouterModule, HomeComponent, RoleHeaderComponent, FooterComponent],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss',
})
export class StudentDashboard implements OnInit {
  user: any = null;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.user = this.auth.currentUser;
    if (!this.user) return;
  }
}
