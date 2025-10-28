// PaymentOptionSelector.tsx
'use client';

import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Wallet, Banknote } from 'lucide-react';

interface PaymentOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface PaymentOptionSelectorProps {
  value: string;
  onChange: (value: string) => void;
  codFee?: number;
}

export function PaymentOptionSelector({ value, onChange, codFee = 0 }: PaymentOptionSelectorProps) {
  const options: PaymentOption[] = [
    {
      id: 'online',
      label: 'Online Payment',
      description: 'Pay securely using UPI, Card, or Wallet',
      icon: <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />,
    },
    {
      id: 'advance',
      label: 'Pay Advance (30%)',
      description: 'Pay 30% now, rest after service',
      icon: <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />,
    },
    {
      id: 'cod',
      label: `Cash on Delivery ${codFee > 0 ? `(+₹${codFee})` : ''}`,
      description: 'Pay when you receive',
      icon: <Banknote className="h-4 w-4 sm:h-5 sm:w-5" />,
    },
  ];

  return (
    <RadioGroup value={value} onValueChange={onChange} className="space-y-2.5 sm:space-y-3">
      {options.map((option) => (
        <Card
          key={option.id}
          className={`cursor-pointer transition-all duration-200 border-2 hover:border-primary/50 hover:shadow-md ${
            value === option.id 
              ? 'border-primary bg-primary/5 shadow-md' 
              : 'border-border'
          }`}
          onClick={() => onChange(option.id)}
        >
          <div className="p-3 sm:p-4 flex items-start gap-3 sm:gap-4">
            <RadioGroupItem value={option.id} id={option.id} className="mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <Label 
                htmlFor={option.id} 
                className="cursor-pointer flex items-center gap-2 font-semibold text-foreground text-sm sm:text-base mb-0.5 sm:mb-1"
              >
                <div className={`p-1 sm:p-1.5 rounded-lg flex-shrink-0 ${
                  value === option.id ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  {option.icon}
                </div>
                <span className="truncate">{option.label}</span>
              </Label>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {option.description}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </RadioGroup>
  );
}
