import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet />
  `,
  styles: []
})
export class AppComponent {
  private themeService = inject(ThemeService);

  title = 'E-Learning Platform';

  constructor() {
    // Theme service initializes automatically via constructor
  }
}
