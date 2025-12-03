export interface Exam {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: number;
  passingScore: number;
  questions: Question[];
  modelAnswers?: { [questionId: string]: string };
  modelAnswerSummary?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
  points?: number; // optional points assigned when used in an exam
}
