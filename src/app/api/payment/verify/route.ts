import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { RAZORPAY_CONFIG } from '@/lib/payment/razorpay-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create signature for verification
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', RAZORPAY_CONFIG.KEY_SECRET)
      .update(text)
      .digest('hex');

    // Verify signature
    const isValid = generated_signature === razorpay_signature;

    if (isValid) {
      // TODO: Update payment status in database
      // await updatePaymentStatus(razorpay_payment_id, 'paid');

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid payment signature',
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Payment verification failed',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
