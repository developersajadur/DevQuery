import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export const POST = async (req) => {
    try {
        const { amount, currency} = await req.json();

        // console.log('Received data:', { amount, currency});

        if (!amount || !currency) {
            console.error('Missing required fields:', { amount, currency });
            return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card', 'klarna', 'afterpay_clearpay', 'affirm'],
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret }, { status: 200 });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
    }
};
