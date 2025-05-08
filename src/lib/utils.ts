import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type SpanCol = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

// a map to col span values
export const colSpanMap = {
  0: {
    sm: '',
    md: '',
    lg: '',
  },
  1: {
    sm: 'col-span-1',
    md: 'md:col-span-1',
    lg: 'lg:col-span-1',
  },
  2: {
    sm: 'col-span-2',
    md: 'md:col-span-2',
    lg: 'lg:col-span-2',
  },
  3: {
    sm: 'col-span-3',
    md: 'md:col-span-3',
    lg: 'lg:col-span-3',
  },
  4: {
    sm: 'col-span-4',
    md: 'md:col-span-4',
    lg: 'lg:col-span-4',
  },
  5: {
    sm: 'col-span-5',
    md: 'md:col-span-5',
    lg: 'lg:col-span-5',
  },
  6: {
    sm: 'col-span-6',
    md: 'md:col-span-6',
    lg: 'lg:col-span-6',
  },
  7: {
    sm: 'col-span-7',
    md: 'md:col-span-7',
    lg: 'lg:col-span-7',
  },
  8: {
    sm: 'col-span-8',
    md: 'md:col-span-8',
    lg: 'lg:col-span-8',
  },
  9: {
    sm: 'col-span-9',
    md: 'md:col-span-9',
    lg: 'lg:col-span-9',
  },
  10: {
    sm: 'col-span-10',
    md: 'md:col-span-10',
    lg: 'lg:col-span-10',
  },
  11: {
    sm: 'col-span-11',
    md: 'md:col-span-11',
    lg: 'lg:col-span-11',
  },
  12: {
    sm: 'col-span-12',
    md: 'md:col-span-12',
    lg: 'lg:col-span-12',
  },
} as const