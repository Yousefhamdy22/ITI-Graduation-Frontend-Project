# Quick Reference: Remaining Translation Replacements

## Files Completed ✅
1. app.config.ts
2. app.component.ts
3. layout/header/header.component.ts
4. auth/login/login.component.ts
5. auth/register/register.component.ts
6. pagination/pagination.component.ts
7. home/home.component.ts
8. home/home.component.html
9. courses-list.component.ts (TranslateModule removed)

## Priority Files to Complete (In Order)

### 1. courses-list.component.html (High Priority)
Replace these translation keys with their English equivalents:
```typescript
'COURSES.ALL_COURSES' → "All Courses"
'COURSES.BROWSE_DESCRIPTION' → "Browse our comprehensive collection of courses"
'COURSES.FILTERS' → "Filters"
'COURSES.CLEAR_ALL' → "Clear All"
'COURSES.SEARCH' → "Search"
'COURSES.SEARCH_PLACEHOLDER' → "Search courses..."
'COURSES.CATEGORY' → "Category"
'COURSES.ALL_CATEGORIES' → "All Categories"
'COURSES.LEVEL' → "Level"
'COURSES.ALL_LEVELS' → "All Levels"
'COURSES.LEVEL_BEGINNER' → "Beginner"
'COURSES.LEVEL_INTERMEDIATE' → "Intermediate"
'COURSES.LEVEL_ADVANCED' → "Advanced"
'COURSES.PRICE_RANGE' → "Price Range"
'COURSES.MIN' → "Min"
'COURSES.MAX' → "Max"
'COURSES.MIN_RATING' → "Minimum Rating"
'COURSES.ANY_RATING' → "Any Rating"
'COURSES.SORT_BY' → "Sort By"
'COURSES.SORT_NEWEST' → "Newest First"
'COURSES.SORT_TITLE' → "Title"
'COURSES.SORT_PRICE' → "Price"
'COURSES.SORT_RATING' → "Rating"
'COURSES.SORT_POPULAR' → "Most Popular"
'COURSES.SHOWING_RESULTS' → "Showing {from} to {to} of {total} results"
'COURSES.FEATURED' → "Featured"
'COURSES.VIEW_DETAILS' → "View Details"
'COURSES.NO_COURSES_FOUND' → "No courses found"
'COURSES.TRY_DIFFERENT_FILTERS' → "Try adjusting your filters"
'COURSES.CLEAR_FILTERS' → "Clear Filters"
```

### 2. course-detail.component.ts & .html (High Priority)
Remove TranslateModule and replace:
```typescript
'COURSES.ALL_COURSES' → "All Courses"
'COURSES.LEVEL_' + level → Use level directly: "Beginner", "Intermediate", "Advanced"
'COURSES.FEATURED' → "Featured"
'COURSES.INSTRUCTOR' → "Instructor"
'COURSES.ENROLL_NOW' → "Enroll Now"
'COURSES.CONTINUE_LEARNING' → "Continue Learning"
'COURSES.ADD_TO_WISHLIST' → "Add to Wishlist"
'COURSES.INCLUDES' → "This course includes"
'COURSES.LIFETIME_ACCESS' → "Lifetime Access"
'COURSES.MOBILE_ACCESS' → "Mobile Access"
'COURSES.CERTIFICATE' → "Certificate of Completion"
'COURSES.TAB_OVERVIEW' → "Overview"
'COURSES.TAB_CURRICULUM' → "Curriculum"
'COURSES.TAB_INSTRUCTOR' → "Instructor"
'COURSES.TAB_REVIEWS' → "Reviews"
'COURSES.ABOUT_COURSE' → "About this course"
'COURSES.WHAT_YOU_LEARN' → "What you'll learn"
'COURSES.REQUIREMENTS' → "Requirements"
'COURSES.TARGET_AUDIENCE' → "Who this course is for"
'COURSES.COURSE_CONTENT' → "Course Content"
'COURSES.FREE_PREVIEW' → "Free Preview"
'COURSES.STUDENT_FEEDBACK' → "Student Feedback"
'COURSES.NO_REVIEWS_YET' → "No reviews yet"
'COURSES.RELATED_COURSES' → "Related Courses"
'COURSES.NO_RELATED_COURSES' → "No related courses available"
'common.loading' → "Loading..."
```

### 3. lecture-player.component.ts & .html
Remove TranslateModule and replace:
```typescript
'LECTURE.BACK_TO_COURSE' → "Back to Course"
'LECTURE.PREVIOUS' → "Previous"
'LECTURE.NEXT' → "Next"
'LECTURE.UNSUPPORTED_CONTENT' → "Unsupported content type"
'LECTURE.MARK_COMPLETE' → "Mark as Complete"
'LECTURE.COURSE_CONTENT' → "Course Content"
'LECTURE.PROGRESS' → "Progress"
'common.loading' → "Loading..."
```

### 4. dashboard.component.ts
Remove TranslateModule and replace:
```typescript
'dashboard.welcome' → "Welcome"
'dashboard.totalCourses' → "Total Courses"
'dashboard.totalStudents' → "Total Students"
'dashboard.activeStudents' → "Active Students"
'dashboard.totalRevenue' → "Total Revenue"
'dashboard.enrolledCourses' → "Enrolled Courses"
'dashboard.completedCourses' → "Completed Courses"
'dashboard.recentCourses' → "Recent Courses"
```

### 5. student-dashboard.component.ts & .html
Remove TranslateModule and replace:
```typescript
'DASHBOARD.MY_LEARNING' → "My Learning"
'DASHBOARD.TRACK_PROGRESS' → "Track your progress and continue learning"
'DASHBOARD.TOTAL_COURSES' → "Total Courses"
'DASHBOARD.ACTIVE_COURSES' → "Active Courses"
'DASHBOARD.COMPLETED_COURSES' → "Completed Courses"
'DASHBOARD.AVG_PROGRESS' → "Avg. Progress"
'DASHBOARD.MY_COURSES' → "My Courses"
'DASHBOARD.BROWSE_MORE' → "Browse More"
'DASHBOARD.ALL' → "All"
'DASHBOARD.ACTIVE' → "Active"
'DASHBOARD.COMPLETED' → "Completed"
'ENROLLMENT.' + status → Map: "ACTIVE" → "Active", "COMPLETED" → "Completed", "DROPPED" → "Dropped"
'DASHBOARD.PROGRESS' → "Progress"
'DASHBOARD.CONTINUE_LEARNING' → "Continue Learning"
'DASHBOARD.VIEW_CERTIFICATE' → "View Certificate"
'DASHBOARD.LAST_ACCESSED' → "Last Accessed"
'DASHBOARD.NO_COURSES' → "No courses yet"
'DASHBOARD.START_LEARNING' → "Start your learning journey today"
'DASHBOARD.EXPLORE_COURSES' → "Explore Courses"
'DASHBOARD.COMPLETE' → "Complete"
'DASHBOARD.CONTINUE' → "Continue"
'DASHBOARD.QUICK_STATS' → "Quick Stats"
'DASHBOARD.TIME_SPENT' → "Time Spent"
'DASHBOARD.CERTIFICATES' → "Certificates"
'DASHBOARD.RECOMMENDED' → "Recommended for You"
'DASHBOARD.NO_RECOMMENDATIONS' → "No recommendations available"
```

### 6. instructor-dashboard.component.ts & .html
Remove TranslateModule and replace all INSTRUCTOR.* keys with their English equivalents.

### 7. instructor-courses.component.ts
Remove TranslateModule and replace all INSTRUCTOR.* keys.

### 8. instructor-course-form.component.ts
Remove TranslateModule and replace all INSTRUCTOR.* and COURSES.* keys.

### 9. course-students.component.ts
Remove TranslateModule and replace all INSTRUCTOR.* keys.

### 10. profile.component.ts
Remove TranslateModule and replace:
```typescript
'profile.editProfile' → "Edit Profile"
'profile.myProfile' → "My Profile"
'auth.email' → "Email"
'profile.bio' → "Bio"
```

## Pattern for Replacements

1. **Import removal:**
```typescript
// Remove this line
import { TranslateModule } from '@ngx-translate/core';
```

2. **Imports array update:**
```typescript
// Remove TranslateModule from imports array
imports: [
    CommonModule,
    // ... other imports
    // TranslateModule,  ← Remove this
],
```

3. **Template interpolation:**
```html
<!-- Before -->
{{ 'key' | translate }}
<!-- After -->
English Text
```

4. **Property binding:**
```html
<!-- Before -->
[label]="'key' | translate"
<!-- After -->
label="English Text"
```

5. **Dynamic translations (special cases):**
```html
<!-- Before -->
{{ 'COURSES.LEVEL_' + level.toUpperCase() | translate }}
<!-- After -->
{{ level }} or use a method to capitalize: {{ capitalizeLevel(level) }}

<!-- Before -->
{{ 'ENROLLMENT.' + enrollment.status.toUpperCase() | translate }}
<!-- After -->
{{ enrollment.status | titlecase }} or {{ formatStatus(enrollment.status) }}
```

## After All Replacements

1. Test each page/component
2. Check for any remaining translation pipes using search: `| translate`
3. Remove unused files:
   - `src/assets/i18n/en.json` (if still exists)
   - `src/app/core/services/language.service.ts` (optional)
4. Uninstall packages:
   ```bash
   npm uninstall @ngx-translate/core @ngx-translate/http-loader
   ```
5. Update package.json and package-lock.json

## Testing Checklist

- [ ] Login page displays correctly
- [ ] Register page displays correctly
- [ ] Home page displays correctly
- [ ] Course list page displays correctly
- [ ] Course detail page displays correctly
- [ ] Lecture player displays correctly
- [ ] Student dashboard displays correctly
- [ ] Instructor dashboard displays correctly
- [ ] Instructor course management displays correctly
- [ ] Profile page displays correctly
- [ ] All buttons and labels are in English
- [ ] No translation keys visible (e.g., "COURSES.TITLE")
- [ ] No console errors related to translations

## Estimated Time to Complete
- Remaining files: ~4-6 hours of careful, systematic work
- Testing: ~1-2 hours
- **Total: 5-8 hours**

## Notes
- Work on one component at a time
- Test after each component
- Use Find & Replace (Ctrl+H) to speed up repetitive replacements
- Keep this reference open while working
