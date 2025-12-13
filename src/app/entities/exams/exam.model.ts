export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  points: number;
  imageUrl?: string;
  answerOptions: AnswerOption[];
}

export interface Exam {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  durationMinutes: number;
  passingScore: number;
  startDate: string;
  endDate: string;
  questions: Question[];
}

export interface ExamResult {
  id: string;
  studentId: string;
  examId: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  status: string;
  startedAt?: string;
  submittedAt?: string;
  duration?: string;
  studentAnswers: StudentAnswer[];
}

export interface StudentAnswer {
  questionId: string;
  selectedAnswerId?: string;
}

export interface ExamResultDetail {
  id: string;
  studentId: string;
  examId: string;
  examTitle: string;
  studentName: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  status: string;
  startedAt?: string;
  submittedAt?: string;
  duration?: string;
  studentAnswers: StudentAnswerDetail[];
}

export interface StudentAnswerDetail {
  questionId: string;
  questionText: string;
  selectedAnswerId?: string;
  selectedAnswerText?: string;
  isCorrect: boolean;
  correctAnswers: AnswerOption[];
  questionPoints: number;
  pointsAwarded: number;
}
