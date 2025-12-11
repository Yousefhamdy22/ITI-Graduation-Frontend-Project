export interface Instructor {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  title: string;
}

export interface CreateInstructor {
  firstName: string;
  lastName: string;
  email: string;
}
