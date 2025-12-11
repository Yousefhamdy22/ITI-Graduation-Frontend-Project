export interface Course {
  id: string;
  title: string;

  subtitle?: string;
  description?: string;
  categoryKey?: string;
  category?: string;
  level?: string;

  hours?: number;
  duration?: number;
  lecturesCount?: number;

  price?: number;
  oldPrice?: number;

  rating?: number;
  reviews?: number;
  reviewsCount?: number;
  studentsCount?: number;

  image?: string;
  promoVideoUrl?: string;

  learningObjectives?: string[];

  instructorId?: string;
  instructorName?: string;
  instructorTitle?: string;
  instructorAvatar?: string;

  isBestseller?: boolean;

  updatedAt?: string | Date;
  createdAt?: string | Date;
}
