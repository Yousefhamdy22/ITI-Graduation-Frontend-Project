// Answer Option Interface containing text and correctness status
export interface AnswerOption {
  id?: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id?: string;
  text: string;
  points: number;
  imageUrl?: string | null;
  answerOptions: AnswerOption[];
  courseId?: string;
}

export interface CreateQuestionRequest {
  text: string;
  points: number;
  image?: File;
  imageUrl?: string;
  answerOptions: AnswerOption[];
  courseId?: string;
}

export interface UpdateQuestionRequest {
  id: string;
  text: string;
  points: number;
  image?: File;
  imageUrl?: string;
  answerOptions: AnswerOption[];
  courseId?: string;
}

export interface ServerResponse<T> {
  value: T;
  isSuccess: boolean;
  status: number;
  successMessage: string | null;
  errors: string[];
  validationErrors: any[];
}