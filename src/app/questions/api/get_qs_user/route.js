import { ConnectDB } from "@/lib/ConnectDB";
import { ObjectId } from "mongodb"; // Import ObjectId
import { NextResponse } from "next/server";

export const GET = async () => {
  const db = await ConnectDB();
  const questionsCollection = await db.collection('questions');
  const usersCollection = await db.collection('users');

  // Fetch all questions
  const questions = await questionsCollection.find({}).toArray();

  // Fetch user data for each question
  const questionsWithUsers = await Promise.all(questions.map(async (question) => {
    const userId = question.user_id; // The user ID from the question
    console.log("Fetching user for question with user ID:", userId); // Log the user_id
    const user = await usersCollection.findOne({ _id: ObjectId(userId) }); // Convert to ObjectId if necessary
    console.log("Fetched user:", user); // Log the fetched user object
    return {
      ...question,
      user: user ? { id: user._id, name: user.name, image: user.image } : null,
    };
  }));

  return NextResponse.json({ questions: questionsWithUsers }, { status: 200 });
};
