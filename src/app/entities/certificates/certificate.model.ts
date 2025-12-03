export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  grade: number;
  issueDate: Date;
  instructorName?: string;
}
