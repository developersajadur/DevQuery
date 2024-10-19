"use client";
import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import CheckoutForm from '@/app/Components/Forms/CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const Payments = ({ params }) => {
    const { data: session } = useSession();
    const [clientSecret, setClientSecret] = useState('');
    const { plan } = params; // Get the plan name from route parameters
    

 useEffect(() => {
    if (!plan || !session) return;

    const dataToSend = {
        amount: 5000, // You can dynamically set the amount based on the plan
        currency: 'usd',
        userId: session?.user?.id,
        date: new Date(),
        plan: plan.toUpperCase(), // Use the plan from the route parameters
    };

    axios.post('/subscription/payments-api/post', dataToSend) // Send dataToSend directly
        .then(response => setClientSecret(response.data.clientSecret))
        .catch(error => console.error('Error fetching client secret:', error));
}, [plan, session]);

    const options = { clientSecret };

    return (
        <div className="container mx-auto p-4">
            {clientSecret && (
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    );
};

export default Payments;
