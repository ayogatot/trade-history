import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-background text-accent shadow-soft hover:shadow-soft-hover hover:text-accent/80 active:shadow-soft-inner",
    secondary: "bg-background text-secondary shadow-soft hover:shadow-soft-hover hover:text-primary active:shadow-soft-inner",
    danger: "bg-background text-danger shadow-soft hover:shadow-soft-hover hover:text-red-600 active:shadow-soft-inner",
    success: "bg-background text-success shadow-soft hover:shadow-soft-hover hover:text-green-600 active:shadow-soft-inner",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button 
      className={cn(
        "rounded-xl font-semibold transition-all duration-300 ease-out transform active:scale-[0.98] outline-none focus:ring-2 focus:ring-accent/20 border border-white/50",
        variants[variant],
        sizes[size],
        className
      )} 
      {...props}
    >
      {children}
    </button>
  );
}
