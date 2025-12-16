'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, ArrowLeft, XCircle, Banknote, Smartphone, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useStaffJobDetail } from '@/api/domains/staff/staff-jobs/queries';
import { StaffRoutes } from '@/lib/constants/routes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { completeJobSchema, CompleteJobInput } from '@/schemas/staff/job';
import { useConfirmation } from '@/hooks/useConfirmation';
import { apiClient } from '@/api/client';

export default function CompleteJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: job, isLoading: isLoadingJob } = useStaffJobDetail(id);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'online' | null>(null);
  const { confirm, ConfirmDialog } = useConfirmation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteJobInput>({
    resolver: zodResolver(completeJobSchema) as any,
    defaultValues: {
      jobId: id,
    },
  });

  // Check if the job is already fully paid (prepaid)
  const isFullyPrepaid = job?.paymentType === 'full' && job?.paymentStatus === 'paid';
  const balanceAmount = job ? (job.totalAmount || job.amount || 0) - (job.advanceAmount || 0) : 0;

  const handleCouldntReach = async () => {
    const confirmed = await confirm({
      title: 'Mark as Couldn\'t Reach',
      description: 'Are you sure you couldn\'t reach the customer location? This will mark the job as "Couldn\'t Reach".',
      confirmText: 'Yes, Mark as Couldn\'t Reach',
      cancelText: 'Cancel',
      type: 'warning',
    });

    if (!confirmed) return;

    try {
      setIsProcessingPayment(true);
      const response = await apiClient.post(`/staff/jobs/${id}/couldnt-reach`, {
        notes: 'Staff member could not reach the customer location',
      });

      if (response.data.success) {
        toast.success('Job marked as couldn\'t reach');
        router.push(StaffRoutes.JOBS);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || err?.message || 'Failed to update job status');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const onSubmit = async (data: CompleteJobInput) => {
    try {
      // For non-prepaid orders, require payment method selection
      if (!isFullyPrepaid && !selectedPaymentMethod) {
        toast.error('Please select how you received the payment');
        return;
      }

      setIsProcessingPayment(true);

      // For non-prepaid orders, confirm payment collection
      if (!isFullyPrepaid) {
        const paymentConfirmed = await confirm({
          title: 'Confirm Payment Collection',
          description: `You are about to mark this job as complete.\n\nPayment collected: ₹${balanceAmount.toLocaleString('en-IN')}\nPayment method: ${selectedPaymentMethod === 'cash' ? 'Cash' : 'Online (GPay/UPI)'}`,
          confirmText: 'Yes, Complete Job',
          cancelText: 'Cancel',
          type: 'warning',
        });

        if (!paymentConfirmed) {
          setIsProcessingPayment(false);
          return;
        }
      }

      const response = await apiClient.patch(`/staff/jobs/${id}`, {
        status: 'completed',
        paymentMethod: isFullyPrepaid ? undefined : selectedPaymentMethod,
        notes: data.notes,
      });

      if (response.data.success) {
        toast.success('Job completed successfully!');
        router.push(StaffRoutes.JOBS);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || error?.message || 'Failed to complete job');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoadingJob) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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

            {/* Payment Status Info */}
            {isFullyPrepaid ? (
              <div className="p-3 sm:p-4 bg-green-500/10 rounded-lg sm:rounded-xl border border-green-500/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <p className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300">
                    Fully Paid Online
                  </p>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  This customer has already paid the full amount (₹{(job?.totalAmount || job?.amount || 0).toLocaleString('en-IN')}) online. No payment collection needed.
                </p>
              </div>
            ) : (
              <>
                {/* Payment Collection Required */}
                <div className="p-3 sm:p-4 bg-amber-500/10 rounded-lg sm:rounded-xl border border-amber-500/20">
                  <p className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-300">
                    Balance to Collect: ₹{balanceAmount.toLocaleString('en-IN')}
                  </p>
                  {job?.advanceAmount && job.advanceAmount > 0 && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                      Advance paid: ₹{job.advanceAmount.toLocaleString('en-IN')} | Total: ₹{(job.totalAmount || job.amount || 0).toLocaleString('en-IN')}
                    </p>
                  )}
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">How was payment received?</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('cash')}
                      className={`relative p-4 rounded-xl border-2 transition-all ${selectedPaymentMethod === 'cash'
                        ? 'border-green-500 bg-green-500/20 ring-2 ring-green-500/30'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                    >
                      {selectedPaymentMethod === 'cash' && (
                        <div className="absolute top-2 right-2 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}
                      <Banknote className={`h-6 w-6 mx-auto mb-2 ${selectedPaymentMethod === 'cash' ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                        }`} />
                      <p className={`text-xs sm:text-sm font-medium ${selectedPaymentMethod === 'cash' ? 'text-green-700 dark:text-green-300' : 'text-foreground'
                        }`}>
                        Cash
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Paid in cash
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('online')}
                      className={`relative p-4 rounded-xl border-2 transition-all ${selectedPaymentMethod === 'online'
                        ? 'border-green-500 bg-green-500/20 ring-2 ring-green-500/30'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                    >
                      {selectedPaymentMethod === 'online' && (
                        <div className="absolute top-2 right-2 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}
                      <Smartphone className={`h-6 w-6 mx-auto mb-2 ${selectedPaymentMethod === 'online' ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                        }`} />
                      <p className={`text-xs sm:text-sm font-medium ${selectedPaymentMethod === 'online' ? 'text-green-700 dark:text-green-300' : 'text-foreground'
                        }`}>
                        Online / UPI
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        GPay, PhonePe, etc.
                      </p>
                    </button>
                  </div>
                </div>
              </>
            )}

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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full shadow-lg h-10 sm:h-11 lg:h-12 text-xs sm:text-sm lg:text-base border-2"
              size="lg"
              disabled={isProcessingPayment || (!isFullyPrepaid && !selectedPaymentMethod)}
            >
              <CheckCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {isProcessingPayment ? 'Processing...' : 'Mark as Completed'}
            </Button>
          </form>

          {/* Couldn't Reach Button */}
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleCouldntReach}
              className="w-full h-10 sm:h-11 text-xs sm:text-sm border-2 border-destructive/20 text-destructive hover:bg-destructive/10"
              disabled={isProcessingPayment}
            >
              <XCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Couldn't Reach Customer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmDialog />
    </div>
  );
}
