"use client";
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; 

const CheckoutForm = ({ userEmail, amount, currency, date, plan, expDate, reputations }) => {
    // Stripe hooks for payment processing
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    
    // State for tracking payment processing status and errors
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    // Handle payment form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Ensure Stripe and Elements are loaded
        if (!stripe || !elements) return;

        setPaymentProcessing(true);
        setPaymentError(null);

        // Confirm the payment with Stripe
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required" // No redirect, stay on the same page
        });

        if (error) {
            // Display payment error if any
            setPaymentError(error.message);
            setPaymentProcessing(false);
            return;
        }

        // Check if payment was successful
        if (paymentIntent.status === "succeeded") {
            try {
                // Store payment data on your server
                await axios.post(`${process.env.NEXT_PUBLIC_WEB_URL}/subscription/payments-api/store-payments`, {
                    amount,
                    currency,
                    userEmail,
                    date,
                    plan,
                    expDate,
                    reputations,
                    paymentIntentId: paymentIntent.id, 
                });
                
                // Navigate to the payment success page
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
            
            {/* Stripe's PaymentElement handles the entire payment form UI */}
            <PaymentElement />
            
            <button
                type="submit"
                disabled={!stripe || paymentProcessing}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
                {paymentProcessing ? 'Processing...' : 'Pay Now'}
            </button>

            {/* Display payment errors if any */}
            {paymentError && <div className="text-red-500 mt-4">{paymentError}</div>}
        </form>
    );
};

export default CheckoutForm;
