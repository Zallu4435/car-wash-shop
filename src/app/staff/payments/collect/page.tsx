'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IndianRupee, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function CollectPaymentPage() {
  const router = useRouter();
  const [jobId, setJobId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleCollect = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Payment collected successfully!');
    router.push('/staff/payments');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-950/30 rounded-xl">
                <IndianRupee className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle>Collect Payment</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Record payment received from customer
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCollect} className="space-y-5">
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
                <Label htmlFor="amount">Amount to Collect</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="online">Online Payment</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Note:</strong> Make sure to verify the job details before collecting payment
                </p>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full shadow-lg" size="lg">
                <CheckCircle className="mr-2 h-5 w-5" />
                Confirm Collection
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
