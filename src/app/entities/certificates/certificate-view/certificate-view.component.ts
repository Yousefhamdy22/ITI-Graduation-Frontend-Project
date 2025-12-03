import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../certificate.service';
import { Certificate } from '../certificate.model';

@Component({
  selector: 'app-certificate-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificate-view.component.html',
  styleUrls: ['./certificate-view.component.css']
})
export class CertificateViewComponent implements OnInit {
  certificate: Certificate | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private certificateService: CertificateService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.certificateService.getCertificateById(id).subscribe(cert => {
        this.certificate = cert || null;
      });
    }
  }

  print() {
    window.print();
  }

  back() {
    this.router.navigate(['/certificates']);
  }
}
