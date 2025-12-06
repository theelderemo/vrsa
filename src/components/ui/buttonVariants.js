/**
 * Button Variants
 * Shared button styles using class-variance-authority
 */

import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-indigo-600 text-white hover:bg-indigo-500",
        destructive: "bg-red-600 text-white hover:bg-red-500",
        outline: "border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800 hover:text-white",
        secondary: "bg-slate-700 text-slate-200 hover:bg-slate-600",
        ghost: "text-slate-300 hover:bg-slate-800 hover:text-white",
        link: "text-indigo-400 underline-offset-4 hover:underline hover:text-indigo-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
