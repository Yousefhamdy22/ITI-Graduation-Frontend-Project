// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { HeaderComponent } from './core/header/header.component';
// import { FooterComponent } from './core/footer/footer.component';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, HeaderComponent, FooterComponent],
//   templateUrl: './app.html',
//   styleUrl: './app.scss',
// })
// export class AppComponent {}

import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {RoleHeaderComponent} from './core/header/role-header.component';
import {FooterComponent} from './core/footer/footer.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RoleHeaderComponent, FooterComponent],
  templateUrl: './app.html'
  ,
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AppComponent {
}

export const App = AppComponent;
