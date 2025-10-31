'use client';

// @ts-nocheck
import { use } from 'react';
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
import { completeJobSchema, CompleteJobInput } from '@/schemas/job';

export default function CompleteJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const updateJobStatus = useUpdateJobStatus();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CompleteJobInput>({
    resolver: zodResolver(completeJobSchema) as any,
    defaultValues: {
      jobId: id,
      paymentMethod: 'cash',
    },
  });

  const onSubmit = (data: CompleteJobInput) => {
    updateJobStatus.mutate(
      { jobId: id, input: { status: 'completed', notes: data.notes } },
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
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Payment Method */}
            <div className="space-y-3">
              <Label>Payment Method <span className="text-red-500">*</span></Label>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <RadioGroup value={field.value} onValueChange={field.onChange}>
                    <div className="flex items-center space-x-2 p-3 border-2 border-border rounded-xl hover:bg-muted cursor-pointer">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer">
                        💵 Cash Payment
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border-2 border-border rounded-xl hover:bg-muted cursor-pointer">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="flex-1 cursor-pointer">
                        🌐 Online Payment
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border-2 border-border rounded-xl hover:bg-muted cursor-pointer">
                      <RadioGroupItem value="prepaid" id="prepaid" />
                      <Label htmlFor="prepaid" className="flex-1 cursor-pointer">
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
              <Label htmlFor="notes">Service Notes <span className="text-xs text-muted-foreground">(Optional)</span></Label>
              <Textarea
                id="notes"
                placeholder="Any observations, issues, or recommendations..."
                {...register('notes')}
                rows={4}
              />
              {errors.notes && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.notes.message}</p>
              )}
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
              type="submit"
              className="w-full shadow-lg" 
              size="lg"
              disabled={updateJobStatus.isPending}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              {updateJobStatus.isPending ? 'Completing...' : 'Mark as Completed'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
