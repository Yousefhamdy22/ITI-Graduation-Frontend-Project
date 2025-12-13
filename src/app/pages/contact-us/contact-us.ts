import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../shared/toast.service';
import { RoleHeaderComponent } from '../../core/header/role-header.component';
import { FooterComponent } from '../../core/footer/footer.component';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule, RoleHeaderComponent, FooterComponent],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.scss'
})
export class ContactUs {
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  subject = '';
  message = '';

  constructor(private toast: ToastService) { }

  sendMessage() {
    if (this.firstName && this.email && this.message) {
      this.toast.show('Thank you! Your message has been sent.', 'success');
      // Reset form
      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.phone = '';
      this.subject = '';
      this.message = '';
    } else {
      this.toast.show('Please fill in all required fields.', 'error');
    }
  }
}
