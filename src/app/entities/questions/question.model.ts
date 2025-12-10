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
}

export interface CreateQuestionPayload {
  text: string;
  points: number;
  imageUrl: string | null;
  answerOptions: AnswerOption[];
}

export interface ServerResponse<T> {
  value: T;
  isSuccess: boolean;
  status: number;
  successMessage: string | null;
  errors: string[];
  validationErrors: any[];
}