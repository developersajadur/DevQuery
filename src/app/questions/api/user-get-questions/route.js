import { ConnectDB } from "@/lib/ConnectDB"
import { NextResponse } from "next/server"


export const GET = async (request) => {
    const db = await ConnectDB();
    const questionsCollection = await db.collection('questions');  
    
    try {
        // Get the user's ID from the query parameter
        const email = request.nextUrl.searchParams.get("email");
        // console.log(email);
        

        if (!email) {
            return NextResponse.json({ message: "User email is required" }, { status: 404 });
        }

        // Fetch bookmarks where the user ID matches
        const questions = await questionsCollection.find({ userEmail: email }).toArray();
        return NextResponse.json({ message: "questions got it", questions }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Not Available", error: error.message }, { status: 400 });
    }
};