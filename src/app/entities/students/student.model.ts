export interface Student {
  id: string;
  userId?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  gender?: string;
  userName?: string;
  avatar?: string;
  enrolledCourses: number;
  enrolledCourseIds?: string[];
  completedCourses?: number;
  totalProgress?: number;
  joinDate: string | Date;
}
