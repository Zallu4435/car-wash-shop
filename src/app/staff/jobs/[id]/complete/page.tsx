'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, Star, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateJobStatus } from '@/api/domains/staff/queries';
import { StaffRoutes } from '@/lib/constants/routes';

export default function CompleteJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [rating, setRating] = useState(5);
  const updateJobStatus = useUpdateJobStatus();

  const handleComplete = () => {
    updateJobStatus.mutate(
      { jobId: id, input: { status: 'completed', notes } },
      {
        onSuccess: () => {
          toast.success('Job completed successfully!');
          router.push(StaffRoutes.JOBS);
        },
        onError: (err: any) => toast.error(err?.message || 'Failed to complete job'),
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-950/30 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle>Complete Job</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Job ID: {id}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Method */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 p-3 border-2 border-border rounded-xl hover:bg-muted cursor-pointer">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex-1 cursor-pointer">
                  Cash Payment
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border-2 border-border rounded-xl hover:bg-muted cursor-pointer">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online" className="flex-1 cursor-pointer">
                  Online Payment
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border-2 border-border rounded-xl hover:bg-muted cursor-pointer">
                <RadioGroupItem value="prepaid" id="prepaid" />
                <Label htmlFor="prepaid" className="flex-1 cursor-pointer">
                  Already Prepaid
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Service Rating */}
          <div className="space-y-3">
            <Label>Service Quality (Optional)</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Rate your own service performance
            </p>
          </div>

          {/* Service Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Service Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any observations, issues, or recommendations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Add any important details about this service
            </p>
          </div>

          {/* Confirmation */}
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border-2 border-green-200 dark:border-green-800">
            <p className="text-sm text-green-900 dark:text-green-100">
              <strong>Note:</strong> Make sure you have collected the balance payment before marking as complete
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleComplete} 
            className="w-full shadow-lg" 
            size="lg"
            disabled={updateJobStatus.isPending}
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            {updateJobStatus.isPending ? 'Completing...' : 'Mark as Completed'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
