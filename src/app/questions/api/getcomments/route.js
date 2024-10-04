import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    // Extract the answerId from the URL parameters
    const { searchParams } = new URL(req.url); // Get search parameters from the request URL
    const answerId = searchParams.get('answerId'); // Get the answerId from search parameters
    // console.log("object", answerId); // Log the answerId for debugging

    if (!answerId) {
      return NextResponse.json({ message: "Answer ID is required" }, { status: 400 });
    }

    // Connect to MongoDB
    const db = await ConnectDB();

    // Get the comments collection and find comments matching the answer_id
    const commentsCollection = db.collection('comments');

    // Find comments that match the answerId
    const comments = await commentsCollection.find({ answer_id: answerId }).toArray();

    // Return the retrieved comments along with a success message
    return NextResponse.json({ message: "Comments retrieved successfully", comments }, { status: 200 });

  } catch (error) {
    // Handle any errors
    return NextResponse.json({ message: "Failed to retrieve comments", error: error.message }, { status: 500 });
  }
};
