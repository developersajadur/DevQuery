import { ConnectDB } from "@/lib/ConnectDB"
import { useSession } from "next-auth/react";
import { NextResponse } from "next/server"


export const GET = async (request) => {
    const db = await ConnectDB();
    const getBook = db.collection('bookmarks');
    
    try {
        // Get the user's ID from the query parameter
        const userId = request.nextUrl.searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 404 });
        }

        // Fetch bookmarks where the user ID matches
        const books = await getBook.find({ userId }).toArray();
        
        if (books.length === 0) {
            return NextResponse.json({ message: "No bookmarks found for this user" }, { status: 404 });
        }

        return NextResponse.json({ message: "Got it", books }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Not Available", error: error.message }, { status: 400 });
    }
};
