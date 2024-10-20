import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/ConnectDB';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export const POST = async (req) => {
    const db = await ConnectDB();
    const paymentsCollection = db.collection('payments');
    const endpointSecret = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET;

    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(await req.text(), sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const { amount, currency, id: paymentIntentId, metadata } = paymentIntent;

        try {
            // Save payment information to the database
            await paymentsCollection.insertOne({
                amount,
                currency,
                userId: metadata.userId,
                paymentIntentId,
                date: new Date(),
                plan: metadata.plan,
            });
        } catch (err) {
            console.error('Error saving payment to database:', err);
            return NextResponse.json({ error: 'Failed to save payment' }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true }, { status: 200 });
};
