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
      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-0.5">Coupon Applied</p>
            <span className="font-mono font-bold text-green-900 dark:text-green-100">{appliedCode}</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRemove}
          className="h-9 w-9 hover:bg-green-100 dark:hover:bg-green-900/30"
        >
          <X className="h-4 w-4 text-green-600 dark:text-green-400" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && handleApply()}
          className="pl-10"
        />
      </div>
      <Button 
        onClick={handleApply} 
        disabled={!code || isLoading}
        className="px-6"
      >
        {isLoading ? 'Applying...' : 'Apply'}
      </Button>
    </div>
  );
}
