import { ConnectDB } from "@/lib/ConnectDB"
import { useSession } from "next-auth/react";
import { NextResponse } from "next/server"


export const GET = async (request) => {
    const db = await ConnectDB();
    const getBook = db.collection('bookmarks');
    
    try {
        // Get the user's email from the query parameter or headers
        const email = request.nextUrl.searchParams.get("email");

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 404 });
        }

        // Fetch bookmarks where the email matches
        const books = await getBook.find({ email }).toArray();
        
        if (books.length === 0) {
            return NextResponse.json({ message: "No bookmarks found for this user" }, { status: 404 });
        }

        return NextResponse.json({ message: "Got it", books }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Not Available", error: error.message }, { status: 400 });
    }
};
