'use client';

// @ts-nocheck
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useCreateTicket } from '@/api/domains/support/queries';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { complaintSchema, ComplaintInput } from '@/schemas/support';

export default function ComplaintsPage() {
  const router = useRouter();

  // API call
  const createTicketMutation = useCreateTicket();

  // Form with validation
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ComplaintInput>({
    resolver: zodResolver(complaintSchema) as any,
    defaultValues: {
      priority: 'medium',
    },
  });

  // Watch complaint category to show/hide conditional fields
  const complaintCategory = watch('complaintCategory');

  const onSubmit = (data: ComplaintInput) => {
    // Build description based on category
    let fullDescription = `Complaint Category: ${data.complaintCategory}\n`;
    if (data.complaintCategory === 'order' && data.orderId) {
      fullDescription += `Order ID: ${data.orderId}\n`;
    } else if (data.complaintCategory === 'service' && data.serviceId) {
      fullDescription += `Service ID: ${data.serviceId}\n`;
    } else if (data.complaintCategory === 'booking' && data.bookingId) {
      fullDescription += `Booking ID: ${data.bookingId}\n`;
    }
    fullDescription += `Issue Type: ${data.issueType}\n\nDescription: ${data.description}`;

    createTicketMutation.mutate(
      {
        topic: 'complaint',
        subject: data.subject,
        description: fullDescription,
        priority: data.priority,
      },
      {
        onSuccess: () => {
          toast.success('Complaint submitted successfully! We will get back to you soon.');
          router.push('/support/complaints/list');
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to submit complaint');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Responsive */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8">
          <Link href="/support">
            <Button variant="ghost" className="mb-3 sm:mb-4 hover:bg-muted h-9 sm:h-10">
              <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Back to Support</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-red-50 dark:bg-red-950/30 rounded-lg sm:rounded-xl flex-shrink-0">
              <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-red-600 dark:text-red-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground truncate">
                Submit a Complaint
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
                We'll resolve your issue as soon as possible
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-base sm:text-lg md:text-xl">Complaint Details</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2 leading-relaxed">
                  Please provide as much detail as possible to help us resolve your issue quickly
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                  {/* Complaint Category */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm">
                      Complaint About <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="complaintCategory"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-10 sm:h-11">
                            <SelectValue placeholder="What is your complaint about?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="order">Order Issue</SelectItem>
                            <SelectItem value="service">Service Issue</SelectItem>
                            <SelectItem value="booking">Booking Issue</SelectItem>
                            <SelectItem value="payment">Payment Issue</SelectItem>
                            <SelectItem value="staff">Staff Behavior</SelectItem>
                            <SelectItem value="product">Product Issue</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.complaintCategory && (
                      <p className="text-xs text-red-600 dark:text-red-400">{String(errors.complaintCategory.message)}</p>
                    )}
                  </div>

                  {/* Order ID - Show only if order is selected */}
                  {complaintCategory === 'order' && (
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm">
                        Order ID <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        placeholder="e.g., ORD001" 
                        {...register('orderId')}
                        className="h-10 sm:h-11 text-xs sm:text-sm"
                      />
                      {errors.orderId && (
                        <p className="text-xs text-red-600 dark:text-red-400">{errors.orderId.message}</p>
                      )}
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        You can find this in your order history
                      </p>
                    </div>
                  )}

                  {/* Service ID - Show only if service is selected */}
                  {complaintCategory === 'service' && (
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm">
                        Service ID <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        placeholder="e.g., SRV001" 
                        {...register('serviceId')}
                        className="h-10 sm:h-11 text-xs sm:text-sm"
                      />
                      {errors.serviceId && (
                        <p className="text-xs text-red-600 dark:text-red-400">{errors.serviceId.message}</p>
                      )}
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Which service are you complaining about?
                      </p>
                    </div>
                  )}

                  {/* Booking ID - Show only if booking is selected */}
                  {complaintCategory === 'booking' && (
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm">
                        Booking ID <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        placeholder="e.g., BK001" 
                        {...register('bookingId')}
                        className="h-10 sm:h-11 text-xs sm:text-sm"
                      />
                      {errors.bookingId && (
                        <p className="text-xs text-red-600 dark:text-red-400">{errors.bookingId.message}</p>
                      )}
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        You can find this in your booking history
                      </p>
                    </div>
                  )}

                  {/* Issue Type */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm">
                      Issue Type <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="issueType"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-10 sm:h-11">
                            <SelectValue placeholder="Select issue type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quality">Service Quality</SelectItem>
                            <SelectItem value="delay">Delay/Late Service</SelectItem>
                            <SelectItem value="cancellation">Cancellation Issue</SelectItem>
                            <SelectItem value="refund">Refund Issue</SelectItem>
                            <SelectItem value="behavior">Staff Behavior</SelectItem>
                            <SelectItem value="pricing">Pricing Issue</SelectItem>
                            <SelectItem value="damage">Damage/Loss</SelectItem>
                            <SelectItem value="missing_items">Missing Items</SelectItem>
                            <SelectItem value="wrong_service">Wrong Service</SelectItem>
                            <SelectItem value="payment_issue">Payment Issue</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.issueType && (
                      <p className="text-xs text-red-600 dark:text-red-400">{String(errors.issueType.message)}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm">
                      Subject <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      placeholder="Brief description of your issue" 
                      {...register('subject')}
                      className="h-10 sm:h-11 text-xs sm:text-sm"
                    />
                    {errors.subject && (
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.subject.message}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      placeholder="Please provide detailed information about your complaint..."
                      rows={6}
                      {...register('description')}
                      className="text-xs sm:text-sm resize-none"
                    />
                    {errors.description && (
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.description.message}</p>
                    )}
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Minimum 20 characters required
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3 sm:pt-4">
                    <Button 
                      type="submit" 
                      className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base"
                      size="lg"
                      disabled={createTicketMutation.isPending}
                    >
                      {createTicketMutation.isPending ? (
                        <>Submitting...</>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Complaint
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Important Notice */}
                  <div className="pt-3 sm:pt-4 border-t border-border">
                    <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                      <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">Note:</strong> We take all complaints seriously and aim to respond within 24-48 hours. For urgent matters, please call our support hotline.
                      </p>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
