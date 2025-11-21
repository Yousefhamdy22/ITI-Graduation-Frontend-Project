import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between px-4 py-3 sm:px-6">
      <!-- Mobile view -->
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          (click)="onPageChange(currentPage - 1)"
          [disabled]="!hasPrevious"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          (click)="onPageChange(currentPage + 1)"
          [disabled]="!hasNext"
          class="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      <!-- Desktop view -->
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-neutral-700 dark:text-neutral-300">
            Showing
            <span class="font-medium">{{ startItem }}</span>
            to
            <span class="font-medium">{{ endItem }}</span>
            of
            <span class="font-medium">{{ totalItems }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <!-- Previous button -->
            <button
              (click)="onPageChange(currentPage - 1)"
              [disabled]="!hasPrevious"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-neutral-400 ring-1 ring-inset ring-neutral-300 dark:ring-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Page numbers -->
            @for (page of pageNumbers; track page) {
              @if (page === '...') {
                <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 ring-1 ring-inset ring-neutral-300 dark:ring-neutral-700">
                  ...
                </span>
              } @else {
                <button
                  (click)="onPageChange(page)"
                  [class.bg-primary-600]="page === currentPage"
                  [class.text-white]="page === currentPage"
                  [class.hover:bg-neutral-50]="page !== currentPage"
                  [class.dark:hover:bg-neutral-700]="page !== currentPage"
                  [class.text-neutral-900]="page !== currentPage"
                  [class.dark:text-neutral-100]="page !== currentPage"
                  class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-neutral-300 dark:ring-neutral-700 focus:z-20 focus:outline-offset-0"
                >
                  {{ page }}
                </button>
              }
            }

            <!-- Next button -->
            <button
              (click)="onPageChange(currentPage + 1)"
              [disabled]="!hasNext"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-neutral-400 ring-1 ring-inset ring-neutral-300 dark:ring-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() hasPrevious: boolean = false;
  @Input() hasNext: boolean = false;

  @Output() pageChange = new EventEmitter<number>();

  get startItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  get pageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Maximum number of page buttons to show

    if (this.totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show subset with ellipsis
      pages.push(1);

      if (this.currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(this.totalPages - 1, this.currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (this.currentPage < this.totalPages - 2) {
        pages.push('...');
      }

      pages.push(this.totalPages);
    }

    return pages;
  }

  onPageChange(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
