"use client"
import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import CheckoutForm from '../Components/Forms/CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const Payments = () => {
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        axios.post('/payments/api/post', { amount: 5000 })
            .then(response => setClientSecret(response.data.clientSecret))
            .catch(error => console.error('Error fetching client secret:', error));
    }, []);

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
