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
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-8">
          <Link href="/support">
            <Button variant="ghost" className="mb-4 hover:bg-muted">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Support
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Submit a Complaint
              </h1>
              <p className="text-muted-foreground mt-1">
                We'll resolve your issue as soon as possible
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Complaint Details</CardTitle>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Please provide as much detail as possible to help us resolve your issue quickly
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Order ID */}
                  <div className="space-y-2">
                    <Label required>Order ID</Label>
                    <Input placeholder="e.g., ORD001" required />
                    <p className="text-xs text-muted-foreground">
                      You can find this in your order history
                    </p>
                  </div>

                  {/* Issue Type */}
                  <div className="space-y-2">
                    <Label required>Issue Type</Label>
                    <Select required>
                      <SelectTrigger>
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
                  <div className="space-y-2">
                    <Label required>Subject</Label>
                    <Input placeholder="Brief description of your issue" required />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label required>Description</Label>
                    <Textarea
                      placeholder="Please provide detailed information about your complaint..."
                      rows={6}
                      required
                    />
                  </div>

                  {/* Attach Image */}
                  <div className="space-y-2">
                    <Label>Attach Image (Optional)</Label>
                    <Input type="file" accept="image/*" />
                    <p className="text-xs text-muted-foreground">
                      Supported formats: JPG, PNG, GIF (Max 5MB)
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full shadow-lg" 
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
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
