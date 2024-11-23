import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from 'next/server';

// POST method to insert question data
export const POST = async (req) => {
  try {
    // Parse the request body
    const answer = await req.json();
    const {  userEmail , image, ans, question_id} = answer;

    // Connect to the MongoDB database
    const db = await ConnectDB();

    // Get the questions collection
    const questionsCollection = db.collection("answer");
    const usersCollection = db.collection("users");

    // Insert the new question document into the collection
    const result = await questionsCollection.insertOne({
      
      userEmail:userEmail,
      image:image,
      answer:ans,
      question_id:question_id,
      likes:0,
      unlikes:0,
      createdAt: new Date(),  // Optional: Add timestamp
    }, {status:201});

    const updateUser = await usersCollection.updateOne(
      { email: userEmail },
      { $inc: { reputations: 2 } }
  );

  if (updateUser.modifiedCount === 0) {
    throw new Error('Failed to update user reputation');
  }

    // Return a success response with the inserted question ID
    return NextResponse.json({
      message: 'Answered successfully',
      questionId: result.insertedId
    });

  } catch (error) {
    // Return an error response in case of failure
    return NextResponse.json({
      message: 'Failed to add answer',
      error: error.message,
    }, { status: 500 });
  }
};
