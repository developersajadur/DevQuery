import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export const POST = async (req) => {
    try {
        // Parse request JSON
        const { amount, currency, userId, plan } = await req.json();

        // Log the received data for debugging
        console.log('Received data:', { amount, currency, userId, plan });

        // Check for missing fields
        if (!amount || !currency || !userId || !plan) {
            console.error('Missing required fields:', { amount, currency, userId, plan });
            return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card', 'klarna', 'afterpay_clearpay', 'affirm'],
            metadata: {
                userId: userId,
                plan: plan.toLowerCase(),
            },
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret }, { status: 200 });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
    }
};
