import { ConnectDB } from "@/lib/ConnectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const { searchParams } = new URL(request.url);
  const questionId = searchParams.get("id");

  const db = await ConnectDB();
  const questionsCollection = db.collection("questions");
 
  try {
    if (!questionId) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    // Fix the query to use ObjectId correctly
    const question = await questionsCollection.findOne({ _id: new ObjectId(questionId) });
    if (!question) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ question }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching question", error: error.message }, { status: 500 });
  }
};
