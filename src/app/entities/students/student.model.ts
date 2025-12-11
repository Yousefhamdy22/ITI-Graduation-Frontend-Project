export interface Student {
  id: string;
  userId: string;
  gender: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  phoneNumber?: string;
  // Frontend convenience fields (mapped from enrollments)
  enrolledCourseIds?: string[];
}

export interface CreateStudent {
  firstName: string;
  lastName: string;
  email: string;
}

export interface StudentWithEnrollments extends Student {
  enrollments: any[]; // Course objects
}

export interface StudentAnswer {
  questionId: string;
  selectedAnswerId: string;
}

export interface StudentEnrollmentTable {
  studentId: string;
  fullName?: string;
  gender?: string;
  phoneNumber?: string;
  courseTitle?: string;
  joinDate?: Date;
}

export interface StudentCourseLectures {
  courseId: string;
  courseTitle: string;
  modules: ModuleLectures[];
}

export interface ModuleLectures {
  moduleId: string;
  moduleTitle: string;
  lectures: any[]; // LectureDto objects
}
