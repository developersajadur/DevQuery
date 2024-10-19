"use client";
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setPaymentProcessing(true);
        setPaymentError(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${process.env.NEXT_PUBLIC_WEB_URL}/payments/payment-success/`,
            },
        });
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
