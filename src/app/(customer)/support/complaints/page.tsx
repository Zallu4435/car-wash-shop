'use client';

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

export default function ComplaintsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Complaint submitted successfully. We will get back to you soon.');
      router.push('/support');
    }, 1500);
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
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Order ID */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm">
                      Order ID <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      placeholder="e.g., ORD001" 
                      required
                      className="h-10 sm:h-11 text-xs sm:text-sm"
                    />
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      You can find this in your order history
                    </p>
                  </div>

                  {/* Issue Type */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm">
                      Issue Type <span className="text-red-500">*</span>
                    </Label>
                    <Select required>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="service-quality">Service Quality</SelectItem>
                        <SelectItem value="staff-behavior">Staff Behavior</SelectItem>
                        <SelectItem value="payment">Payment Issue</SelectItem>
                        <SelectItem value="delivery">Delivery Issue</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm">
                      Subject <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      placeholder="Brief description of your issue" 
                      required
                      className="h-10 sm:h-11 text-xs sm:text-sm"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      placeholder="Please provide detailed information about your complaint..."
                      rows={6}
                      required
                      className="text-xs sm:text-sm resize-none"
                    />
                  </div>

                  {/* Attach Image */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm">
                      Attach Image <span className="text-xs text-muted-foreground">(Optional)</span>
                    </Label>
                    <Input 
                      type="file" 
                      accept="image/*"
                      className="h-10 sm:h-11 text-xs sm:text-sm file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-medium"
                    />
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Supported formats: JPG, PNG, GIF (Max 5MB)
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3 sm:pt-4">
                    <Button 
                      type="submit" 
                      className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
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
