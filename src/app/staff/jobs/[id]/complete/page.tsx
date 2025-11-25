'use client';

// @ts-nocheck
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, ArrowLeft, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateJobStatus } from '@/api/domains/staff/queries';
import { StaffRoutes } from '@/lib/constants/routes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { completeJobSchema, CompleteJobInput } from '@/schemas/staff/job';
import { useConfirmation } from '@/hooks/useConfirmation';
import { apiClient } from '@/api/client';

export default function CompleteJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const updateJobStatus = useUpdateJobStatus();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
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
      setIsProcessingPayment(true);

      const paymentReceived = await confirm({
        title: 'Payment Confirmation',
        description: 'Have you received the payment from the customer?',
        confirmText: 'Yes, Payment Received',
        cancelText: 'No, Not Received',
        type: 'warning',
      });

      if (!paymentReceived) {
        setIsProcessingPayment(false);
        toast.info('Please collect the payment before marking the job as completed.');
        return;
      }

      const response = await apiClient.patch(`/staff/jobs/${id}`, {
        status: 'completed',
        paymentReceived: true,
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
              disabled={isProcessingPayment || updateJobStatus.isPending}
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
