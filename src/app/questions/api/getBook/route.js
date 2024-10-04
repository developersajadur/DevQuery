import { ConnectDB } from "@/lib/ConnectDB"
import { useSession } from "next-auth/react";
import { NextResponse } from "next/server"


export const GET = async (request) => {
    const db = await ConnectDB();
    const getBook = db.collection('bookmarks');
    
    try {
        // Get the user's _id from the query parameter or headers
        const id = request.nextUrl.searchParams.get("_id");

        if (!id) {
            return NextResponse.json({ message: "_id is required" }, { status: 404 });
        }

        // Fetch bookmarks where the _id matches
        const books = await getBook.find({ id }).toArray();
        
        if (books.length === 0) {
            return NextResponse.json({ message: "No bookmarks found for this user" }, { status: 404 });
        }

        return NextResponse.json({ message: "Got it", books }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Not Available", error: error.message }, { status: 400 });
    }
};
