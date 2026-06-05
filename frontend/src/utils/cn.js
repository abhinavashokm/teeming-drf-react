import { twMerge } from 'tailwind-merge'
import { clsx } from 'clsx'

//tailwind helper utility function to override class names
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}