export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  enrolledCourses: number;
  enrolledCourseIds?: string[];
  completedCourses?: number;
  totalProgress?: number;
  joinDate: string | Date;
}
