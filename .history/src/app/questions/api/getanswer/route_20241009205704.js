import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    // Extract the `question_id` from query parameters
    const questionId = req.nextUrl.searchParams.get("question_id");

    if (!questionId) {
      return NextResponse.json({ message: "Question ID is required" }, { status: 400 });
    }

    // Connect to MongoDB
    const db = await ConnectDB();

    // Get the answer collection and find answers matching the `question_id`
    const answerCollection = db.collection('answer');

    // Find answers that match the question_id
    const answers = await answerCollection.find({ question_id: questionId }).toArray(); 

    // Return the retrieved answers along with a success message
    return NextResponse.json({ message: "Answers retrieved successfully", answers }, { status: 200 });

  } catch (error) {
    // Handle any errors
    return NextResponse.json({ message: "Failed to retrieve answers", error: error.message }, { status: 500 });
  }
};
