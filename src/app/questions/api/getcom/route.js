
import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
   
    

    // Connect to MongoDB
    const db = await ConnectDB();

    // Get the comments collection and find comments matching the answer_id
    const commentsCollection = db.collection('comments');

    // Find comments that match the answerId
    const comments = await commentsCollection.find({answer_id: "66f2645e43513acb909731f6" }).toArray();

    // Return the retrieved comments along with a success message
    return NextResponse.json({ message: "Comments retrieved successfully", comments }, { status: 200 });

  } catch (error) {
    // Handle any errors
    return NextResponse.json({ message: "Failed to retrieve comments", error: error.message }, { status: 500 });
  }
};
