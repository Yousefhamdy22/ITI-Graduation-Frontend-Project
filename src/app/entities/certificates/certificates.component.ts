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
  ) { }

  ngOnInit() {
    // Get my certificates
    this.certificateService.getMyCertificates().subscribe((list: Certificate[]) => {
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
