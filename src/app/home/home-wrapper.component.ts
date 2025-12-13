import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RoleHeaderComponent } from '../core/header/role-header.component';
import { FooterComponent } from '../core/footer/footer.component';

@Component({
  selector: 'app-home-wrapper',
  standalone: true,
  imports: [CommonModule, HomeComponent, RoleHeaderComponent, FooterComponent],
  template: `
    <div class="min-h-screen">
      <div class="pt-6">
        <app-home></app-home>
      </div>
      <app-footer></app-footer>
    </div>
  `
})
export class HomeWrapperComponent {}
