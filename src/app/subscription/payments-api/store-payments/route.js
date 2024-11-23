import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/ConnectDB';

export const POST = async (req) => {
    const db = await ConnectDB();
    const paymentsCollection = db.collection('payments');
    const usersCollection = db.collection('users');

    try {
        // Parse request body
        const { amount, currency, userEmail, date, plan, paymentIntentId, expDate, reputations } = await req.json();
        
        // Validate the required fields
        if (!amount || !currency || !userEmail || !plan || !paymentIntentId || !expDate || !reputations) {
            console.error('Validation Error: Missing required fields', { amount, currency, userEmail, plan, paymentIntentId });
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Save payment information to the database
        const paymentResult = await paymentsCollection.insertOne({
            amount,
            currency,
            userEmail,
            paymentIntentId,
            date: new Date(date), // Ensure the date is correctly formatted
            plan,
            expDate,
        });


        // Log the inserted payment data for debugging
        console.log('Payment saved successfully:', paymentResult);

        // Update the user's subscription status in the database
        const updateUser = await usersCollection.updateOne(
            { email: userEmail },
            { $set: { plan: plan, reputations: reputations } }
        );

        if (updateUser.modifiedCount === 0) {
            console.error('Database Error: User update failed or user not found', { userEmail, plan });
            return NextResponse.json({ error: 'User not found or plan not updated' }, { status: 404 });
        }

        // Log successful user update
        console.log('User updated successfully:', { userEmail, plan });

        // If everything is successful
        return NextResponse.json({ message: 'Payment information saved successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error saving payment information:', error);
        return NextResponse.json({ error: 'Failed to save payment information', details: error.message }, { status: 500 });
    }
};
