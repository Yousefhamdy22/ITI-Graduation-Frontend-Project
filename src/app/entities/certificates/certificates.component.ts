import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CertificateService } from '../certificates/certificate.service';
import { Certificate } from './certificate.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent implements OnInit {
  certificates: Certificate[] = [];

  constructor(
    private certificateService: CertificateService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const user = this.auth.currentUser;
    if (user && user.role === 'student') {
      this.certificateService.getCertificatesByStudent(user.id).subscribe(list => this.certificates = list || []);
      return;
    }

    this.certificateService.getCertificates().subscribe(list => {
      this.certificates = list || [];
    });
  }

  viewCertificate(id: string) {
    this.router.navigate(['/certificates', id]);
  }

  createNew() {
    this.router.navigate(['/certificates/new']);
  }
}
