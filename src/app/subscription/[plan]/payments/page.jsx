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
    const [reputations, setReputations] = useState(null);
    const [expDate, setExpDate] = useState(null);
    const { plan } = params;

    useEffect(() => {
        if (plan === "basic") {
            setPrice(50);
            setReputations(50);
            setExpDate(new Date(new Date().setMonth(new Date().getMonth() + 3))); 
        } else if (plan === "standard") {
            setPrice(100);
            setReputations(100);
            setExpDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
        } else if (plan === "premium") {
            setPrice(120);
            setReputations(200);
            setExpDate('Lifetime');
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
                        userEmail={session?.user?.email}
                        amount={price * 100}
                        reputations={reputations}
                        currency="usd"
                        date={new Date()}
                        expDate={expDate}
                        plan={plan.toLowerCase()}
                    />
                </Elements>
            )}
        </div>
    );
};

export default Payments;
