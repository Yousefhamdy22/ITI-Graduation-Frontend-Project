import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ToastComponent } from '@shared/components/toast/toast.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, ToastComponent],
  template: `
    <div class="min-h-screen bg-neutral-50 dark:bg-gray-900 flex flex-col">
      <app-header />
      
      <main class="container-custom py-8 flex-1">
        <router-outlet />
      </main>
      
      <app-footer />
      <app-toast />
    </div>
  `,
  styles: []
})
export class MainLayoutComponent {}
