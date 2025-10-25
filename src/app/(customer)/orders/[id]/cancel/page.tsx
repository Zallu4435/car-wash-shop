'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function CancelOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Order cancelled successfully');
    router.push('/orders');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-red-50 to-background dark:from-red-950/20 border-b border-border">
        <div className="container-custom py-8">
          <Link href={`/orders/${id}`}>
            <Button variant="ghost" className="mb-4 hover:bg-muted">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Order
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 dark:bg-red-950/30 rounded-xl">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Cancel Order</h1>
              <p className="text-muted-foreground mt-1">Order #{id}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-950/30 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle>Confirm Cancellation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCancel} className="space-y-6">
                  {/* Warning */}
                  <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                          Warning: This action cannot be undone
                        </p>
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          Are you sure you want to cancel this order? Your refund will be processed within 5-7 business days.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reason Input */}
                  <div className="space-y-2">
                    <Label required>Reason for Cancellation</Label>
                    <Textarea 
                      placeholder="Please tell us why you're cancelling this order..." 
                      rows={5}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Your feedback helps us improve our service
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1" 
                      onClick={() => router.back()}
                    >
                      Keep Order
                    </Button>
                    <Button 
                      type="submit" 
                      variant="destructive" 
                      className="flex-1 shadow-lg"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel Order
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
