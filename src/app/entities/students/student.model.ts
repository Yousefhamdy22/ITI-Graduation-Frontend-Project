export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  enrolledCourses: number;
  completedCourses?: number;
  totalProgress?: number;
  joinDate: string | Date;
}
