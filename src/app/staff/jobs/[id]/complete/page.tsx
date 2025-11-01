'use client';

// @ts-nocheck
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateJobStatus } from '@/api/domains/staff/queries';
import { StaffRoutes } from '@/lib/constants/routes';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { completeJobSchema, CompleteJobInput } from '@/schemas/staff/job';
import { useRazorpay } from '@/hooks/useRazorpay';

export default function CompleteJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const updateJobStatus = useUpdateJobStatus();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Razorpay integration
  const { processPayment, isLoading: isRazorpayLoading } = useRazorpay({
    onSuccess: (response) => {
      toast.success('Payment successful!');
      // Complete the job after successful payment
      updateJobStatus.mutate(
        { jobId: id, input: { status: 'completed', notes: 'Payment collected via Razorpay' } },
        {
          onSuccess: () => {
            toast.success('Job completed successfully!');
            router.push(StaffRoutes.JOBS);
          },
          onError: (err: any) => toast.error(err?.message || 'Failed to complete job'),
        }
      );
      setIsProcessingPayment(false);
    },
    onFailure: () => {
      toast.error('Payment failed. Please try again.');
      setIsProcessingPayment(false);
    },
    onDismiss: () => {
      setIsProcessingPayment(false);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CompleteJobInput>({
    resolver: zodResolver(completeJobSchema) as any,
    defaultValues: {
      jobId: id,
      paymentMethod: 'cash',
    },
  });

  const paymentMethod = watch('paymentMethod');

  const onSubmit = async (data: CompleteJobInput) => {
    try {
      setIsProcessingPayment(true);

      // Handle prepaid or cash payment
      if (data.paymentMethod === 'prepaid' || data.paymentMethod === 'cash') {
        updateJobStatus.mutate(
          { jobId: id, input: { status: 'completed', notes: data.notes } },
          {
            onSuccess: () => {
              toast.success('Job completed successfully!');
              router.push(StaffRoutes.JOBS);
            },
            onError: (err: any) => toast.error(err?.message || 'Failed to complete job'),
            onSettled: () => {
              setIsProcessingPayment(false);
            },
          }
        );
        return;
      }

      // Handle online payment with Razorpay
      if (data.paymentMethod === 'online') {
        // Get customer details (in real app, fetch from job details)
        const customerEmail = 'customer@example.com'; // TODO: Get from job
        const customerName = 'Customer'; // TODO: Get from job
        const customerPhone = '+919876543210'; // TODO: Get from job
        const jobAmount = 599; // TODO: Get from job details

        await processPayment({
          amount: jobAmount,
          description: `Payment for Job #${id}`,
          bookingId: id,
          userEmail: customerEmail,
          userName: customerName,
          userPhone: customerPhone,
          notes: {
            jobId: id,
            paymentMethod: 'online',
            collectedBy: 'staff',
          },
        });
      }
    } catch (error: any) {
      toast.error(error?.message || 'An error occurred');
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="h-9 sm:h-10 text-xs sm:text-sm border-2">
          <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back
        </Button>
      </div>

      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <CardTitle className="text-sm sm:text-base lg:text-lg">Complete Job</CardTitle>
              <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mt-0.5 sm:mt-1">Job ID: {id}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Payment Method */}
            <div className="space-y-2 sm:space-y-3">
              <Label className="text-xs sm:text-sm">Payment Method <span className="text-red-500">*</span></Label>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <RadioGroup value={field.value} onValueChange={field.onChange}>
                    <div className="flex items-center space-x-2 p-2.5 sm:p-3 border-2 border-border rounded-lg sm:rounded-xl hover:bg-muted cursor-pointer">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer text-xs sm:text-sm">
                        💵 Cash Payment
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2.5 sm:p-3 border-2 border-border rounded-lg sm:rounded-xl hover:bg-muted cursor-pointer">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="flex-1 cursor-pointer text-xs sm:text-sm">
                        🌐 Online Payment
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2.5 sm:p-3 border-2 border-border rounded-lg sm:rounded-xl hover:bg-muted cursor-pointer">
                      <RadioGroupItem value="prepaid" id="prepaid" />
                      <Label htmlFor="prepaid" className="flex-1 cursor-pointer text-xs sm:text-sm">
                        ✅ Already Prepaid
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.paymentMethod && (
                <p className="text-xs text-red-600 dark:text-red-400">{String(errors.paymentMethod.message)}</p>
              )}
            </div>

              {/* Service Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-xs sm:text-sm">Service Notes <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span></Label>
              <Textarea
                id="notes"
                placeholder="Any observations, issues, or recommendations..."
                {...register('notes')}
                rows={4}
                className="text-xs sm:text-sm border-2"
              />
              {errors.notes && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.notes.message}</p>
              )}
              <p className="text-[10px] sm:text-xs text-muted-foreground">
              Add any important details about this service
            </p>
          </div>

          {/* Confirmation */}
          <div className="p-3 sm:p-4 bg-primary/5 rounded-lg sm:rounded-xl border border-primary/20">
            <p className="text-xs sm:text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> Make sure you have collected the balance payment before marking as complete
            </p>
          </div>

            {/* Submit Button */}
            <Button 
              type="submit"
              className="w-full shadow-lg h-10 sm:h-11 lg:h-12 text-xs sm:text-sm lg:text-base border-2" 
              size="lg"
              disabled={isProcessingPayment || isRazorpayLoading || updateJobStatus.isPending}
            >
              <CheckCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {isProcessingPayment || isRazorpayLoading ? 'Processing...' : 
               paymentMethod === 'online' ? 'Collect Payment & Complete' : 
               'Mark as Completed'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
