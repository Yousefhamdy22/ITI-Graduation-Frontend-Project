export interface Course {
  id: string;
  title: string;

  subtitle?: string;
  description?: string;
  categoryKey?: string;
  level?: string;

  hours?: number;

  duration?: number;

  lessonsCount?: number;

  price?: number;
  oldPrice?: number;

  rating?: number;

reviews?: number;
reviewsCount?: number;
studentsCount?: number;

  image?: string;
  promoVideoUrl?: string;

  instructorId?: string;
  instructorName?: string;
  instructorAvatar?: string;

  isBestseller?: boolean;

  updatedAt?: string | Date;
  createdAt?: string | Date;
}

