import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { RAZORPAY_CONFIG } from '@/lib/payment/razorpay-config';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: RAZORPAY_CONFIG.KEY_ID,
  key_secret: RAZORPAY_CONFIG.KEY_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt, notes } = body;

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount), // Amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
