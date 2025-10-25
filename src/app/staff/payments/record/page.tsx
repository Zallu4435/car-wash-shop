'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, IndianRupee, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

export default function RecordPaymentPage() {
  const router = useRouter();
  const [jobId, setJobId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Payment recorded successfully!');
    router.push('/staff/payments');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push('/staff/payments')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payments
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-950/30 rounded-xl">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle>Record Payment</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Add payment details to your records
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job ID */}
              <div className="space-y-2">
                <Label htmlFor="jobId">Job ID</Label>
                <Input
                  id="jobId"
                  placeholder="Enter job ID (e.g., BK001)"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  required
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount Collected (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount collected"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Payment Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Payment Type</Label>
                <Select value={paymentType} onValueChange={setPaymentType} required>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balance">Balance Payment</SelectItem>
                    <SelectItem value="full">Full Payment</SelectItem>
                    <SelectItem value="advance">Advance Payment</SelectItem>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <Label>Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-3 border-2 border-border rounded-xl hover:bg-muted cursor-pointer">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      💵 Cash
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border-2 border-border rounded-xl hover:bg-muted cursor-pointer">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer">
                      📱 UPI / PhonePe / Google Pay
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border-2 border-border rounded-xl hover:bg-muted cursor-pointer">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      💳 Card Payment
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border-2 border-border rounded-xl hover:bg-muted cursor-pointer">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex-1 cursor-pointer">
                      🌐 Online Transfer
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">
                  Additional Notes <span className="text-xs text-muted-foreground">(Optional)</span>
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional details about this payment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Note:</strong> This payment will be recorded in your earnings and added to the admin dashboard for verification.
                </p>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full shadow-lg" size="lg">
                <IndianRupee className="mr-2 h-5 w-5" />
                Record Payment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
