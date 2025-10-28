// components/shared/pricing/CouponInput.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tag, X, Check } from 'lucide-react';

interface CouponInputProps {
  onApply: (code: string) => void;
  onRemove: () => void;
  appliedCode?: string;
  isLoading?: boolean;
}

export function CouponInput({ onApply, onRemove, appliedCode, isLoading }: CouponInputProps) {
  const [code, setCode] = useState('');

  const handleApply = () => {
    if (code.trim()) {
      onApply(code.trim().toUpperCase());
      setCode('');
    }
  };

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between p-3 sm:p-4 bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800 rounded-lg sm:rounded-xl">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900/30 rounded-lg flex-shrink-0">
            <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-medium text-green-600 dark:text-green-400 mb-0.5">
              Coupon Applied
            </p>
            <span className="font-mono font-bold text-xs sm:text-sm text-green-900 dark:text-green-100 break-all">
              {appliedCode}
            </span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRemove}
          className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-green-100 dark:hover:bg-green-900/30 flex-shrink-0"
        >
          <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
        <Input
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && handleApply()}
          className="pl-9 sm:pl-10 h-10 sm:h-11 text-xs sm:text-sm"
        />
      </div>
      <Button 
        onClick={handleApply} 
        disabled={!code || isLoading}
        className="px-6 h-10 sm:h-11 text-xs sm:text-sm w-full sm:w-auto"
      >
        {isLoading ? 'Applying...' : 'Apply'}
      </Button>
    </div>
  );
}
