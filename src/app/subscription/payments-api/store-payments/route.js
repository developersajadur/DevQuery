import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/ConnectDB';

export const POST = async (req) => {
    const db = await ConnectDB();
    const paymentsCollection = await db.collection('payments');
    
    try {
        const { amount, currency, userId, date, plan, paymentIntentId } = await req.json();
        
        if (!amount || !currency || !userId || !plan || !paymentIntentId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Save payment information to the database
        await paymentsCollection.insertOne({
            amount,
            currency,
            userId,
            paymentIntentId,
            date,
            plan,
        });

        return NextResponse.json({ message: 'Payment information saved successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error saving payment information:', error);
        return NextResponse.json({ error: 'Failed to save payment information' }, { status: 500 });
    }
};
