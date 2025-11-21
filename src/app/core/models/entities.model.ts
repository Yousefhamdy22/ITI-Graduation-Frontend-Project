// ============================================
// AUTH & IDENTITY ENTITIES
// ============================================

export interface AspNetUser {
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: string;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd?: Date;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface AspNetRole {
  id: string;
  name: string;
  normalizedName: string;
  concurrencyStamp: string;
}

export interface AspNetUserRole {
  userId: string;
  roleId: string;
}

export interface AspNetUserToken {
  userId: string;
  loginProvider: string;
  name: string;
  value: string;
}

export interface RefreshToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt?: Date;
  replacedByToken?: string;
  isActive: boolean;
}

// ============================================
// E-LEARNING CORE ENTITIES
// ============================================

export interface Student {
  id: string;
  userId: string;
  user?: AspNetUser;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  avatar?: string;
  bio?: string;
  enrollmentDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  
  // Navigation properties
  enrollments?: Enrollment[];
  examResults?: ExamResult[];
  studentAnswers?: StudentAnswer[];
}

export interface Instructor {
  id: string;
  userId: string;
  user?: AspNetUser;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  bio?: string;
  title?: string;
  expertise?: string;
  yearsOfExperience?: number;
  rating?: number;
  totalStudents?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  
  // Navigation properties
  courses?: Course[];
}

export interface Course {
  id: string;
  instructorId: string;
  instructor?: Instructor;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  coverImage?: string;
  promoVideoUrl?: string;
  category: string;
  level: CourseLevel;
  language: string;
  price: number;
  discountPrice?: number;
  duration: number; // in hours
  totalLectures: number;
  totalStudents: number;
  rating: number;
  totalRatings: number;
  requirements?: string;
  whatYouWillLearn?: string;
  status: CourseStatus;
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  
  // Navigation properties
  modules?: Module[];
  enrollments?: Enrollment[];
  exams?: Exam[];
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
export type CourseStatus = 'draft' | 'published' | 'archived';

export interface Module {
  id: string;
  courseId: string;
  course?: Course;
  title: string;
  description?: string;
  orderIndex: number;
  duration: number; // in minutes
  isPublished: boolean;
  createdAt: Date;
  updatedAt?: Date;
  
  // Navigation properties
  lectures?: Lecture[];
}

export interface Lecture {
  id: string;
  moduleId: string;
  module?: Module;
  title: string;
  description?: string;
  contentType: LectureContentType;
  videoUrl?: string;
  videoProvider?: VideoProvider;
  videoDuration?: number; // in seconds
  pdfUrl?: string;
  textContent?: string;
  orderIndex: number;
  duration: number; // in minutes
  isFree: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt?: Date;
  
  // Navigation properties
  progress?: LectureProgress[];
}

export type LectureContentType = 'video' | 'pdf' | 'text' | 'quiz' | 'assignment';
export type VideoProvider = 'youtube' | 'vimeo' | 'custom';

export interface Enrollment {
  id: string;
  studentId: string;
  student?: Student;
  courseId: string;
  course?: Course;
  enrolledAt: Date;
  completedAt?: Date;
  progress: number; // 0-100
  lastAccessedAt?: Date;
  status: EnrollmentStatus;
  certificateIssued: boolean;
  certificateUrl?: string;
}

export type EnrollmentStatus = 'active' | 'completed' | 'dropped' | 'expired';

export interface LectureProgress {
  id: string;
  studentId: string;
  student?: Student;
  lectureId: string;
  lecture?: Lecture;
  isCompleted: boolean;
  watchedDuration: number; // in seconds
  lastWatchedAt?: Date;
  completedAt?: Date;
}

// ============================================
// EXAM SYSTEM ENTITIES
// ============================================

export interface Exam {
  id: string;
  courseId: string;
  course?: Course;
  moduleId?: string;
  module?: Module;
  title: string;
  description?: string;
  instructions?: string;
  duration: number; // in minutes
  passingScore: number; // percentage
  totalMarks: number;
  totalQuestions: number;
  attemptLimit: number;
  isPublished: boolean;
  isRandomized: boolean;
  showResults: boolean;
  showCorrectAnswers: boolean;
  availableFrom?: Date;
  availableTo?: Date;
  createdAt: Date;
  updatedAt?: Date;
  
  // Navigation properties
  examQuestions?: ExamQuestion[];
  examResults?: ExamResult[];
}

export interface Question {
  id: string;
  instructorId: string;
  instructor?: Instructor;
  questionText: string;
  questionType: QuestionType;
  marks: number;
  difficulty: QuestionDifficulty;
  explanation?: string;
  category?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  
  // Navigation properties
  answerOptions?: AnswerOption[];
  examQuestions?: ExamQuestion[];
}

export type QuestionType = 'multiple-choice' | 'true-false' | 'multi-select' | 'short-answer' | 'essay';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface AnswerOption {
  id: string;
  questionId: string;
  question?: Question;
  optionText: string;
  isCorrect: boolean;
  orderIndex: number;
  createdAt: Date;
}

export interface ExamQuestion {
  id: string;
  examId: string;
  exam?: Exam;
  questionId: string;
  question?: Question;
  orderIndex: number;
  marks: number;
}

export interface StudentAnswer {
  id: string;
  examResultId: string;
  examResult?: ExamResult;
  questionId: string;
  question?: Question;
  answerOptionId?: string;
  answerOption?: AnswerOption;
  answerText?: string;
  isCorrect: boolean;
  marksObtained: number;
  answeredAt: Date;
}

export interface ExamResult {
  id: string;
  examId: string;
  exam?: Exam;
  studentId: string;
  student?: Student;
  attemptNumber: number;
  startedAt: Date;
  submittedAt?: Date;
  duration: number; // in seconds
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  passed: boolean;
  status: ExamStatus;
  
  // Navigation properties
  studentAnswers?: StudentAnswer[];
}

export type ExamStatus = 'in-progress' | 'submitted' | 'graded' | 'expired';

// ============================================
// DTOs & REQUEST/RESPONSE MODELS
// ============================================

export interface CourseListDto {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  coverImage?: string;
  category: string;
  level: CourseLevel;
  price: number;
  discountPrice?: number;
  rating: number;
  totalStudents: number;
  totalLectures: number;
  duration: number;
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  isFeatured: boolean;
  isPublished: boolean;
}

export interface CourseDetailDto extends Course {
  modules: ModuleWithLectures[];
  exams: Exam[];
  isEnrolled: boolean;
  progress?: number;
  totalReviews?: number;
  targetAudience?: string[];
}

export interface ModuleWithLectures extends Module {
  lectures: Lecture[];
}

export interface ExamAttemptDto {
  examId: string;
  studentId: string;
  answers: {
    questionId: string;
    answerOptionId?: string;
    answerText?: string;
  }[];
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CourseFilters {
  search?: string;
  category?: string;
  level?: CourseLevel;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  instructorId?: string;
  isFeatured?: boolean;
  pageNumber: number;
  pageSize: number;
  sortBy?: 'title' | 'price' | 'rating' | 'students' | 'created';
  sortOrder?: 'asc' | 'desc';
}
