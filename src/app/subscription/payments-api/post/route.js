import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/ConnectDB';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export const POST = async (req) => {
    const db = await ConnectDB();
    const paymentsCollection = db.collection('payments');
    try {
        // Parse request JSON
        const { amount, currency, userId, date, plan } = await req.json();

        // Log the received data for debugging
        console.log('Received data:', { amount, currency, userId, date, plan });

        // Check for missing fields
        if (!amount || !currency || !userId || !plan) {
            console.error('Missing required fields:', { amount, currency, userId, plan });
            return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
        }

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card', 'klarna', 'afterpay_clearpay', 'affirm'],
        });

        // Save payment information to the database
        await paymentsCollection.insertOne({
            amount,
            currency,
            userId,
            paymentIntentId: paymentIntent.id,
            date,
            plan,
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret }, { status: 200 });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
    }
};
