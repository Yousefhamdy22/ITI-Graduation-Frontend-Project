export type QuestionType = 'mcq' | 'tf' | 'text';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // for mcq
  correctOptionIndex?: number; // for mcq
  correctBoolean?: boolean; // for tf
  createdBy?: string; // instructor id
  createdAt?: Date;
  courseId?: string; // which course this question belongs to
}
