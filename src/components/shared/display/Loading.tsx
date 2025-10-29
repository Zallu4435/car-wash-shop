import { Loader2 } from 'lucide-react';
import React from 'react';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({ 
  text = 'Loading...', 
  fullScreen = true,
  size = 'lg'
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  };

  const paddingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16'
  };

  return (
    <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen bg-background' : paddingClasses[size]}`}>
      <div className={`flex flex-col items-center ${gapClasses[size]}`}>
        {/* Spinner */}
        <Loader2 className={`${sizeClasses[size]} text-primary animate-spin`} />
        {/* Loading Text */}
        <div className="text-center">
          <p className={`${textSizeClasses[size]} font-medium text-foreground`}>{text}</p>
        </div>
      </div>
    </div>
  );
}
