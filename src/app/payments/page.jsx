"use client"
import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import CheckoutForm from '../Components/Forms/CheckoutForm';
import { useSession } from 'next-auth/react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const Payments = () => {
    const {data: session} = useSession()
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        const dataToSend = {
            amount: 5000, 
            currency: 'usd',
            user: session?.user?.id,
            payment_method: 'payment',
            card: 'some-card-info', // Add card information if available
            date: new Date().toISOString(), // Current date and time
            time: new Date().toLocaleTimeString(), // Time in a readable format
            plan: 'basic', // Example plan name
        };
    
        axios.post('/subscription/payments-api/post', { dataToSend })
            .then(response => setClientSecret(response.data.clientSecret))
            .catch(error => console.error('Error fetching client secret:', error));
    }, [session]);
    

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
