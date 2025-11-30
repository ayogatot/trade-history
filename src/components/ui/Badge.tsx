import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: "text-gray-600 bg-gray-200/50",
    success: "text-green-600 bg-green-100/50",
    danger: "text-red-600 bg-red-100/50",
    warning: "text-amber-600 bg-amber-100/50",
    info: "text-blue-600 bg-blue-100/50",
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-soft-sm",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
