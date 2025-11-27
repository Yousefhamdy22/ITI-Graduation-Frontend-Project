export interface Exam {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: number;
  passingScore: number;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
}
