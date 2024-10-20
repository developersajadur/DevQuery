// pages/payment-success.js

import Link from 'next/link';

const PaymentSuccess = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
                <h1 className="text-3xl font-semibold text-green-600 mb-4">Payment Successful!</h1>
                <p className="text-gray-700 mb-4">
                    Thank you for your purchase. Your payment has been processed successfully.
                </p>
                <p className="text-gray-500 mb-6">A confirmation email has been sent to your email address.</p>
                <Link href="/" passHref>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                        Go to Homepage
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
