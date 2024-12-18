import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  try {
    // Parse the request body
    const { comment, currentUserEmail, answerId } = await req.json();

    // Ensure required fields are present
    if (!comment || !currentUserEmail || !answerId) { 
      return NextResponse.json({
        message: 'Missing required fields',
      }, { status: 400 });
    }

    // Connect to the MongoDB database
    const db = await ConnectDB();
    
    // Get the comments collection
    const commentsCollection = db.collection("comments");

    // Insert the new comment into the collection
    const result = await commentsCollection.insertOne({
      comment:comment,
      user: currentUserEmail,
      answer_id:answerId, 
      createdAt: new Date(),  // Add timestamp
    });

    // Return success response
    return NextResponse.json({
      message: 'Comment added successfully!',
       // Return the inserted comment's ID
    }, { status: 201 });

  } catch (error) {
    // Return error response in case of failure
    return NextResponse.json({
      message: 'Failed to add comment',
      error: error.message,
    }, { status: 500 });
  }
};
