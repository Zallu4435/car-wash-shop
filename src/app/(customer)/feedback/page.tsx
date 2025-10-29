'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateTicket } from '@/api/domains/support/queries';

export default function FeedbackPage() {
  const [selectedType, setSelectedType] = useState('');
  const [subject, setSubject] = useState('');
  const [feedback, setFeedback] = useState('');

  // API call
  const createTicketMutation = useCreateTicket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType || !subject || !feedback) {
      toast.error('Please fill in all required fields');
      return;
    }

    createTicketMutation.mutate({
      topic: 'feedback',
      subject,
      description: feedback,
      priority: selectedType === 'bug' ? 'high' : 'medium',
    });
  };

  const feedbackTypes = [
    { value: 'suggestion', label: 'Suggestion', icon: '💡' },
    { value: 'bug', label: 'Report a Bug', icon: '🐛' },
    { value: 'compliment', label: 'Compliment', icon: '⭐' },
    { value: 'other', label: 'Other', icon: '💬' },
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
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Feedback Type */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="type" className="text-xs sm:text-sm">
                      Feedback Type <span className="text-red-500">*</span>
                    </Label>
                    <Select required value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger id="type" className="h-10 sm:h-11">
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
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="subject" className="text-xs sm:text-sm">
                      Subject <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="subject"
                      placeholder="Brief description of your feedback" 
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="h-10 sm:h-11 text-xs sm:text-sm"
                    />
                  </div>

                  {/* Feedback */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="feedback" className="text-xs sm:text-sm">
                      Your Feedback <span className="text-red-500">*</span>
                    </Label>
                    <Textarea 
                      id="feedback"
                      placeholder="Tell us more about your experience..." 
                      rows={6} 
                      required
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="text-xs sm:text-sm resize-none"
                    />
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Please be as detailed as possible
                    </p>
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
