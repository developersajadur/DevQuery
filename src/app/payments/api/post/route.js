import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/ConnectDB';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export const POST = async (req) => {
    const db = await ConnectDB();
    const paymentsCollection = db.collection('payments');
    try {
        const { amount } = await req.json(); 

        if (!amount) {
            return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card', 'klarna', 'afterpay_clearpay', 'affirm'],
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret }, { status: 200 });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
    }
};
