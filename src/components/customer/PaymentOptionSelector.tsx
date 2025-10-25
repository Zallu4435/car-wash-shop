'use client';

import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Banknote, Wallet, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PaymentOptionSelectorProps {
  value: string;
  onChange: (value: string) => void;
  codFee?: number;
}

const paymentOptions = [
  {
    id: 'online',
    name: 'Pay Online',
    description: 'Credit/Debit Card, UPI, Net Banking',
    icon: CreditCard,
    recommended: true,
  },
  {
    id: 'wallet',
    name: 'Digital Wallet',
    description: 'Paytm, PhonePe, Google Pay',
    icon: Wallet,
  },
  {
    id: 'cod',
    name: 'Cash on Service',
    description: 'Pay when service is completed',
    icon: Banknote,
  },
];

export function PaymentOptionSelector({ value, onChange, codFee = 0 }: PaymentOptionSelectorProps) {
  return (
    <div className="space-y-6">
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="grid gap-4">
          {paymentOptions.map((option) => {
            const OptionIcon = option.icon;
            const isCOD = option.id === 'cod';
            const isSelected = value === option.id;

            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all border-2 hover:shadow-lg relative ${
                  isSelected
                    ? 'ring-2 ring-primary border-primary bg-primary/5'
                    : 'border-border'
                }`}
                onClick={() => onChange(option.id)}
              >
                {option.recommended && (
                  <Badge className="absolute -top-3 left-4 bg-green-500 hover:bg-green-600">
                    Recommended
                  </Badge>
                )}
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <RadioGroupItem value={option.id} id={option.id} className="mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={option.id} className="cursor-pointer">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div
                              className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ${
                                isSelected ? 'bg-primary/10' : 'bg-muted'
                              }`}
                            >
                              <OptionIcon
                                className={`h-5 w-5 sm:h-6 sm:w-6 ${
                                  isSelected ? 'text-primary' : 'text-muted-foreground'
                                }`}
                              />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-base sm:text-lg text-foreground">
                                {option.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                {option.description}
                              </p>
                            </div>
                          </div>
                          {isCOD && codFee > 0 && (
                            <Badge variant="secondary" className="flex-shrink-0">
                              +₹{codFee} fee
                            </Badge>
                          )}
                        </div>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </RadioGroup>

      {/* COD Fee Notice */}
      {value === 'cod' && codFee > 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
              Cash on Service Fee
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-200 mt-1">
              An additional ₹{codFee} fee will be added for cash on service option.
            </p>
          </div>
        </div>
      )}

      {/* Online Payment Benefits */}
      {value === 'online' && (
        <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
          <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              Benefits of Online Payment
            </p>
            <ul className="text-xs text-green-700 dark:text-green-200 mt-1 space-y-1">
              <li>• No additional fees</li>
              <li>• Instant confirmation</li>
              <li>• Secure payment gateway</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
