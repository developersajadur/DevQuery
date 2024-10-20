"use client";
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; 

const CheckoutForm = ({ userId, amount, currency, date, plan }) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter(); 
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setPaymentProcessing(true);
        setPaymentError(null);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required" 
        });

        if (error) {
            setPaymentError(error.message);
            setPaymentProcessing(false);
            return;
        }

        if (paymentIntent.status === "succeeded") {
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_WEB_URL}/subscription/payments-api/store-payments`, {
                    amount,
                    currency,
                    userId,
                    date,
                    plan,
                    paymentIntentId: paymentIntent.id, 
                });
        
                router.push("/subscription/payment-success");
            } catch (apiError) {
                console.error('Error storing payment data:', apiError);
                setPaymentError('Failed to save payment information.');
            } finally {
                setPaymentProcessing(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Complete Payment</h2>
            <PaymentElement />
            <button
                type="submit"
                disabled={!stripe || paymentProcessing}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
                {paymentProcessing ? 'Processing...' : 'Pay Now'}
            </button>

            {paymentError && <div className="text-red-500 mt-4">{paymentError}</div>}
        </form>
    );
};

export default CheckoutForm;
