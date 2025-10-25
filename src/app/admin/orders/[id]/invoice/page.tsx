'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, FileText, Building, User, Phone, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const invoiceData = {
  orderId: 'ORD001',
  invoiceNumber: 'INV-2025-001',
  invoiceDate: '2025-10-20',
  dueDate: '2025-11-20',
  customer: {
    name: 'John Doe',
    phone: '+91 98765 43210',
    email: 'john@example.com',
    address: '123, MG Road, Bandra West, Mumbai - 400050'
  },
  company: {
    name: 'CarWash Services',
    address: '456, Service Road, Andheri East',
    city: 'Mumbai, Maharashtra - 400069',
    phone: '+91 22 1234 5678',
    email: 'info@carwash.com',
    gst: 'GSTIN123456789'
  },
  items: [
    { id: 1, name: 'Premium Car Shampoo', quantity: 2, price: 299, total: 598 },
    { id: 2, name: 'Microfiber Cloth Set', quantity: 1, price: 199, total: 199 },
  ],
  subtotal: 797,
  discount: 100,
  tax: 0,
  total: 697,
};

export default function AdminOrderInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const handleDownload = () => {
    // PDF download logic here
    alert('Invoice download functionality');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.push(`/admin/orders/${id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Order
        </Button>
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Invoice Card */}
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-xl">
                <FileText className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">INVOICE</h1>
                <p className="text-sm text-muted-foreground">#{invoiceData.invoiceNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono font-bold text-foreground">{invoiceData.orderId}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Company & Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* From */}
            <div className="p-5 bg-muted rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Building className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">From:</h3>
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-bold text-foreground">{invoiceData.company.name}</p>
                <p className="text-muted-foreground">{invoiceData.company.address}</p>
                <p className="text-muted-foreground">{invoiceData.company.city}</p>
                <p className="text-muted-foreground flex items-center gap-2 mt-2">
                  <Phone className="h-3 w-3" />
                  {invoiceData.company.phone}
                </p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  {invoiceData.company.email}
                </p>
                <p className="text-muted-foreground mt-2 font-mono text-xs">
                  GST: {invoiceData.company.gst}
                </p>
              </div>
            </div>

            {/* To */}
            <div className="p-5 bg-muted rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">To:</h3>
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-bold text-foreground">{invoiceData.customer.name}</p>
                <p className="text-muted-foreground">{invoiceData.customer.address}</p>
                <p className="text-muted-foreground flex items-center gap-2 mt-2">
                  <Phone className="h-3 w-3" />
                  {invoiceData.customer.phone}
                </p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  {invoiceData.customer.email}
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Invoice Date</p>
              </div>
              <p className="font-semibold text-foreground">{invoiceData.invoiceDate}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Due Date</p>
              </div>
              <p className="font-semibold text-foreground">{invoiceData.dueDate}</p>
            </div>
          </div>

          <Separator />

          {/* Items Table */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Items</h3>
            <div className="border-2 border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr className="text-left">
                    <th className="px-4 py-3 text-sm font-semibold text-foreground">Item</th>
                    <th className="px-4 py-3 text-sm font-semibold text-foreground text-center">Qty</th>
                    <th className="px-4 py-3 text-sm font-semibold text-foreground text-right">Price</th>
                    <th className="px-4 py-3 text-sm font-semibold text-foreground text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={item.id} className={index !== invoiceData.items.length - 1 ? 'border-b border-border' : ''}>
                      <td className="px-4 py-4 text-sm text-foreground">{item.name}</td>
                      <td className="px-4 py-4 text-sm text-foreground text-center">{item.quantity}</td>
                      <td className="px-4 py-4 text-sm text-muted-foreground text-right">₹{item.price}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-foreground text-right">₹{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">₹{invoiceData.subtotal}</span>
              </div>
              {invoiceData.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 dark:text-green-400">Discount</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">-₹{invoiceData.discount}</span>
                </div>
              )}
              {invoiceData.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-semibold text-foreground">₹{invoiceData.tax}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between p-4 bg-primary/10 rounded-lg">
                <span className="text-lg font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">₹{invoiceData.total}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              Thank you for your business! For any queries, please contact us at {invoiceData.company.email}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
