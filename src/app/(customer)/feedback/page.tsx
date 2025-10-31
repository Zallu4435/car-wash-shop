'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateTicket } from '@/api/domains/support/queries';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { feedbackSchema, FeedbackInput } from '@/schemas/support';

export default function FeedbackPage() {
  // API call
  const createTicketMutation = useCreateTicket();

  // Form with validation
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema) as any,
    defaultValues: {
      category: 'suggestion',
    },
  });

  const onSubmit = (data: FeedbackInput) => {
    createTicketMutation.mutate(
      {
        topic: 'feedback',
        subject: data.subject,
        description: data.description,
        priority: data.category === 'bug_report' ? 'high' : 'medium',
      },
      {
        onSuccess: () => {
          toast.success('Feedback submitted successfully!');
          reset();
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to submit feedback');
        },
      }
    );
  };

  const feedbackTypes = [
    { value: 'suggestion', label: 'Suggestion', icon: '💡' },
    { value: 'bug_report', label: 'Report a Bug', icon: '🐛' },
    { value: 'feature_request', label: 'Feature Request', icon: '✨' },
    { value: 'general', label: 'General Feedback', icon: '💬' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Responsive */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
              <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground truncate">
                Send Feedback
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
                We'd love to hear from you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">Share Your Thoughts</CardTitle>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2">
                  Your feedback helps us improve our service
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                  {/* Feedback Type */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="category" className="text-xs sm:text-sm">
                      Feedback Type <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="category" className="h-10 sm:h-11">
                            <SelectValue placeholder="Select feedback type" />
                          </SelectTrigger>
                          <SelectContent>
                            {feedbackTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <span className="text-base">{type.icon}</span>
                                  <span className="text-sm">{type.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.category && (
                      <p className="text-xs text-red-600 dark:text-red-400">{String(errors.category.message)}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="subject" className="text-xs sm:text-sm">
                      Subject <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="subject"
                      placeholder="Brief description of your feedback" 
                      {...register('subject')}
                      className="h-10 sm:h-11 text-xs sm:text-sm"
                    />
                    {errors.subject && (
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.subject.message}</p>
                    )}
                  </div>

                  {/* Feedback */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="description" className="text-xs sm:text-sm">
                      Your Feedback <span className="text-red-500">*</span>
                    </Label>
                    <Textarea 
                      id="description"
                      placeholder="Tell us more about your experience..." 
                      rows={6} 
                      {...register('description')}
                      className="text-xs sm:text-sm resize-none"
                    />
                    {errors.description && (
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.description.message}</p>
                    )}
                    {!errors.description && (
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Please provide at least 20 characters (maximum 2000)
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base" 
                    size="lg"
                    disabled={createTicketMutation.isPending}
                  >
                    {createTicketMutation.isPending ? (
                      'Submitting...'
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="mt-4 sm:mt-6 border-2 bg-primary/5">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1.5 sm:mb-2">
                      What happens next?
                    </h3>
                    <ul className="text-xs sm:text-sm text-muted-foreground space-y-0.5 sm:space-y-1 leading-relaxed">
                      <li>• Our team reviews all feedback within 24-48 hours</li>
                      <li>• For bug reports, we'll investigate and update you</li>
                      <li>• Suggestions help shape our future features</li>
                      <li>• We appreciate every compliment!</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
