export interface Enrollment {
    id: string;
    studentId: string;
    courseId: string;
    enrollmentDate: string;
    status?: string;
    student?: any;
    course?: any;
}
