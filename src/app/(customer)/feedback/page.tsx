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

export default function FeedbackPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      toast.success('Thank you for your feedback!');
      setIsLoading(false);
      // Reset form
      setSelectedType('');
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  const feedbackTypes = [
    { value: 'suggestion', label: 'Suggestion', icon: '💡' },
    { value: 'bug', label: 'Report a Bug', icon: '🐛' },
    { value: 'compliment', label: 'Compliment', icon: '⭐' },
    { value: 'other', label: 'Other', icon: '💬' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-8 lg:py-12">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Send Feedback</h1>
              <p className="text-muted-foreground mt-1">We'd love to hear from you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Share Your Thoughts</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Your feedback helps us improve our service
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Feedback Type */}
                  <div className="space-y-2">
                    <Label htmlFor="type">Feedback Type</Label>
                    <Select required value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select feedback type" />
                      </SelectTrigger>
                      <SelectContent>
                        {feedbackTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <span>{type.icon}</span>
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject"
                      placeholder="Brief description of your feedback" 
                      required 
                    />
                  </div>

                  {/* Feedback */}
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Your Feedback</Label>
                    <Textarea 
                      id="feedback"
                      placeholder="Tell us more about your experience..." 
                      rows={6} 
                      required 
                    />
                    <p className="text-xs text-muted-foreground">
                      Please be as detailed as possible
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full shadow-lg" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
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
            <Card className="mt-6 border-2 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">What happens next?</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
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
