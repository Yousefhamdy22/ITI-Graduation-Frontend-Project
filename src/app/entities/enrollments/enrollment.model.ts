export interface Enrollment {
    id: string;
    studentId: string;
    courseId: string;
    enrollmentDate: string;
}

export interface EnrollmentDetails extends Enrollment {
    status: string;
    student?: {
        id: string;
        userId: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
        gender?: string;
        dateOfBirth?: string;
        address?: string;
        city?: string;
        country?: string;
        createdAt: string;
    };
    course?: {
        id: string;
        title: string;
        description?: string;
        typeStatus: string;
        startDate?: string;
        endDate?: string;
        price: number;
        instructorId?: string;
    };
}
