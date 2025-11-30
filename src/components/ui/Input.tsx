import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ className, label, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-500 ml-1">
          {label}
        </label>
      )}
      <input 
        id={id}
        className={cn(
          "bg-background rounded-xl shadow-soft-inner px-4 py-3 outline-none focus:ring-2 focus:ring-accent/20 transition-all text-primary placeholder-gray-400 border border-transparent focus:border-accent/30",
          className
        )} 
        {...props}
      />
    </div>
  );
}
