import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const db = await ConnectDB();

    const questionCollection = await db.collection('questions');

    // Fetch questions from the database
    const questions = await questionCollection.find().toArray();

    // Return the questions in the response
    return NextResponse.json(
      { message: "Questions retrieved successfully", questions }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching questions:", error); // Log the error for debugging
    return NextResponse.json(
      { message: "Error fetching questions from the server" }, 
      { status: 500 }
    );
  }
};
