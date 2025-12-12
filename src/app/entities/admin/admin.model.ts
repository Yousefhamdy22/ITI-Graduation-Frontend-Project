export interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAdminRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateAdminRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

export interface AdminResponse {
  isSuccess: boolean;
  message: string;
  admin?: Admin;
}

export interface AdminsListResponse {
  value: Admin[];
  count: number;
}
