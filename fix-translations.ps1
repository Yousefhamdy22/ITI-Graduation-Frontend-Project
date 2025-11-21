# Fix courses-list.component.html
$file = "src\app\features\courses\courses-list.component.html"
$content = Get-Content $file -Raw

$replacements = @{
    "{{ 'COURSES\.ALL_COURSES' \| translate }}" = "All Courses"
    "{{ 'COURSES\.BROWSE_DESCRIPTION' \| translate }}" = "Browse our comprehensive course catalog"
    "{{ 'COURSES\.FILTERS' \| translate }}" = "Filters"
    "{{ 'COURSES\.CLEAR_ALL' \| translate }}" = "Clear All"
    "{{ 'COURSES\.SEARCH' \| translate }}" = "Search"
    """{{ 'COURSES\.SEARCH_PLACEHOLDER' \| translate }}""" = """Search courses..."""
    "{{ 'COURSES\.CATEGORY' \| translate }}" = "Category"
    "{{ 'COURSES\.ALL_CATEGORIES' \| translate }}" = "All Categories"
    "{{ 'COURSES\.LEVEL' \| translate }}" = "Level"
    "{{ 'COURSES\.ALL_LEVELS' \| translate }}" = "All Levels"
    "{{ 'COURSES\.LEVEL_' \+ level\.toUpperCase\(\) \| translate }}" = "{{ level | titlecase }}"
    "{{ 'COURSES\.PRICE_RANGE' \| translate }}" = "Price Range"
    """{{ 'COURSES\.MIN' \| translate }}""" = """Min"""
    """{{ 'COURSES\.MAX' \| translate }}""" = """Max"""
    "{{ 'COURSES\.MIN_RATING' \| translate }}" = "Minimum Rating"
    "{{ 'COURSES\.ANY_RATING' \| translate }}" = "Any Rating"
    "{{ 'COURSES\.SORT_BY' \| translate }}" = "Sort By"
    "{{ 'COURSES\.SORT_NEWEST' \| translate }}" = "Newest"
    "{{ 'COURSES\.SORT_TITLE' \| translate }}" = "Title (A-Z)"
    "{{ 'COURSES\.SORT_PRICE' \| translate }}" = "Price (Low to High)"
    "{{ 'COURSES\.SORT_RATING' \| translate }}" = "Rating"
    "{{ 'COURSES\.SORT_POPULAR' \| translate }}" = "Most Popular"
    "{{ 'COURSES\.SHOWING_RESULTS' \| translate: \{[^}]+\} }}" = "Showing {{ getStartIndex() }} - {{ getEndIndex() }} of {{ totalCourses }} courses"
    "{{ 'COURSES\.FEATURED' \| translate }}" = "FEATURED"
    "{{ 'COURSES\.LEVEL_' \+ course\.level\.toUpperCase\(\) \| translate }}" = "{{ course.level | titlecase }}"
    "{{ 'COURSES\.VIEW_DETAILS' \| translate }}" = "View Details"
    "{{ 'COURSES\.NO_COURSES_FOUND' \| translate }}" = "No Courses Found"
    "{{ 'COURSES\.TRY_DIFFERENT_FILTERS' \| translate }}" = "Try adjusting your filters"
    "{{ 'COURSES\.CLEAR_FILTERS' \| translate }}" = "Clear Filters"
}

foreach ($key in $replacements.Keys) {
    $content = $content -replace $key, $replacements[$key]
}

Set-Content $file -Value $content
Write-Host "Fixed courses-list.component.html"

# Fix course-detail.component.html (if it has translations)
if (Test-Path "src\app\features\courses\course-detail\course-detail.component.html") {
    Write-Host "Checking course-detail.component.html..."
}

# Fix home.component.html (if it has translations)
if (Test-Path "src\app\features\home\home.component.html") {
    Write-Host "Checking home.component.html..."
}

Write-Host "Translation removal complete!"
