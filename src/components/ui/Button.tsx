import React, { ReactNode } from 'react';
import { cn } from '../../utils/helpers';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'text';
  children: ReactNode;
}

export const Button = ({ variant = 'primary', className, disabled, children, ...props }: ButtonProps) => {
  const baseStyles = 'transition-all active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed';
  
  return (
    <button 
      className={cn(
        baseStyles,
        variant === 'primary' && 'btn-primary hover:opacity-90',
        variant === 'outline' && 'btn-outline hover:opacity-90',
        variant === 'text' && 'text-teal font-bold px-4 py-2 hover:opacity-80',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
