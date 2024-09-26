import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from 'next/server';

// POST method to insert question data
export const POST = async (req) => {
  try {
    // Parse the request body
    const question = await req.json();
    const { title, description, user, image, tags} = question;

    // Connect to the MongoDB database
    const db = await ConnectDB();

    // Get the questions collection
    const questionsCollection = db.collection("questions");

    // Insert the new question document into the collection
    const result = await questionsCollection.insertOne({
      title: title,
      user: user,
      image: image,
      description: description,
      tags: tags,
      likes:0,
      unlikes:0,
      createdAt: new Date(),  // Optional: Add timestamp
    }, {status:201});

    // Return a success response with the inserted question ID
    return NextResponse.json({
      message: 'Question added successfully',
      questionId: result.insertedId
    });

  } catch (error) {
    // Return an error response in case of failure
    return NextResponse.json({
      message: 'Failed to add question',
      error: error.message,
    }, { status: 500 });
  }
};
