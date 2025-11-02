'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, User, Mail, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const ticket = {
  id: 'TKT001',
  customer: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 98765 43210',
  },
  subject: 'Payment Issue',
  message: 'I made a payment for my car wash service yesterday but the order status is still not updated. The payment was deducted from my account but I did not receive any confirmation email or SMS. Please help resolve this issue urgently.',
  priority: 'high',
  status: 'open',
  date: '2025-10-24',
  lastUpdated: '2025-10-24 10:30 AM',
  replies: [
    {
      id: 1,
      sender: 'Support Team',
      message: 'Thank you for reaching out. We are looking into this issue and will get back to you shortly.',
      timestamp: '2025-10-24 11:00 AM',
    }
  ],
};

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [reply, setReply] = useState('');
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);

  const handleSendReply = () => {
    if (!reply.trim()) {
      toast.error('Please enter a reply');
      return;
    }
    toast.success('Reply sent successfully!');
    setReply('');
  };

  const handleUpdateStatus = () => {
    toast.success('Ticket updated successfully!');
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <Button variant="ghost" onClick={() => router.push('/admin/tickets')} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Tickets
        </Button>
        <Button onClick={handleUpdateStatus} className="h-9 sm:h-10 text-xs sm:text-sm border-2">
          <CheckCircle className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Update Status
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 items-start">
        {/* Ticket Details */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {/* Main Ticket */}
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <Badge variant="outline" className="font-mono text-sm sm:text-base md:text-lg">{ticket.id}</Badge>
                  </div>
                  <CardTitle className="text-lg sm:text-xl md:text-2xl">{ticket.subject}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20 flex-shrink-0">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-foreground truncate">{ticket.customer.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{ticket.date}</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">{ticket.message}</p>
              </div>

              <Separator />

              {/* Replies */}
              {ticket.replies.map((reply) => (
                <div key={reply.id} className="p-3 sm:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <Badge variant="outline" className="text-[10px] sm:text-xs">Support Team</Badge>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">{reply.timestamp}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground">{reply.message}</p>
                </div>
              ))}

              <Separator />

              {/* Reply Form */}
              <div className="space-y-2 sm:space-y-3">
                <Label className="text-xs sm:text-sm">Send Reply</Label>
                <Textarea
                  placeholder="Type your response to the customer..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={4}
                  className="text-xs sm:text-sm resize-none"
                />
                <Button onClick={handleSendReply} className="w-full h-10 sm:h-11 text-xs sm:text-sm border-2">
                  <Send className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Send Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-4 sm:space-y-6">
          {/* Ticket Info */}
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-sm sm:text-base lg:text-lg">Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {/* Status & Priority */}
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <Label htmlFor="status" className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status" className="h-9 sm:h-10 text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority" className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger id="priority" className="h-9 sm:h-10 text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Customer Info */}
              <div className="space-y-2 sm:space-y-3">
                <h4 className="text-sm sm:text-base font-semibold text-foreground">Customer Details</h4>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="text-foreground truncate">{ticket.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="text-foreground truncate">{ticket.customer.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="text-foreground">{ticket.date}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="text-[10px] sm:text-xs text-muted-foreground">
                Last updated: {ticket.lastUpdated}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
