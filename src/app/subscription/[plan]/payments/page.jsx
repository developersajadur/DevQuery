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
    const [price, setPrice] = useState(null);
    const { plan } = params;

    useEffect(() => {
        if (plan === "basic") {
            setPrice(20);
        } else if (plan === "standard") {
            setPrice(80);
        } else if (plan === "premium") {
            setPrice(120);
        }
    }, [plan]);

    useEffect(() => {
        if (!plan || !session || !price) return;

        const dataToSend = {
            amount: price * 100, // Convert price to cents
            currency: 'usd',
        };

        axios.post('/subscription/payments-api/post', dataToSend)
            .then(response => setClientSecret(response.data.clientSecret))
            .catch(error => console.error('Error fetching client secret:', error));
    }, [plan, session, price]);

    const options = { clientSecret };

    return (
        <div className="container mx-auto p-4">
            {clientSecret && (
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm 
                        userId={session?.user?.id}
                        amount={price * 100}
                        currency="usd"
                        date={new Date()}
                        plan={plan.toLowerCase()}
                    />
                </Elements>
            )}
        </div>
    );
};

export default Payments;
