import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Admin, CreateAdminRequest, UpdateAdminRequest, AdminResponse, AdminsListResponse } from './admin.model';

import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly BASE_URL = `${environment.apiUrl}/api/Admin`;

  constructor(private http: HttpClient) { }

  /**
   * Get all admins
   */
  getAllAdmins(): Observable<AdminsListResponse> {
    return this.http.get<AdminsListResponse>(`${this.BASE_URL}/GetAdmins`);
  }

  /**
   * Create a new admin
   */
  createAdmin(data: CreateAdminRequest): Observable<AdminResponse> {
    console.log('📝 AdminService: Creating admin', data.email);
    return this.http.post<AdminResponse>(`${this.BASE_URL}/CreateAdmin`, data);
  }

  /**
   * Update admin
   */
  updateAdmin(adminId: string, data: UpdateAdminRequest): Observable<AdminResponse> {
    console.log('✏️ AdminService: Updating admin', adminId);
    return this.http.put<AdminResponse>(`${this.BASE_URL}/UpdateAdmin/${adminId}`, data);
  }

  /**
   * Delete admin
   */
  deleteAdmin(adminId: string): Observable<AdminResponse> {
    console.log('🗑️ AdminService: Deleting admin', adminId);
    return this.http.delete<AdminResponse>(`${this.BASE_URL}/DeleteAdmin/${adminId}`);
  }
}
