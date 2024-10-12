import { ConnectDB } from "@/lib/ConnectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
    const db = await ConnectDB();
    const questionsCollection = db.collection("questions");
    try {
        const question = await questionsCollection.findOne({ _id: new ObjectId(params.id) });
        console.log(question);
        return NextResponse.json({ question });
    } catch (error) {
        return NextResponse.json({ massage: "question not found", error });
    }
};

export const PUT = async (request, { params }) => {
  const db = await ConnectDB();
  const questionsCollection = db.collection("questions");

  try {
    const { questionId, user } = await request.json();
    const email = user.email;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const question = await questionsCollection.findOne({ _id: new ObjectId(params.id) });
    if (!question) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 });
    }

    const isLiked = question.likedBy?.includes(email);
    const isUnliked = question.unlikedBy?.includes(email);

    if (isLiked) {
      // If already liked, remove the like
      await questionsCollection.updateOne(
        { _id: new ObjectId(params.id) },
        {
          $inc: { likes: -1 },
          $pull: { likedBy: email },
        }
      );
      return NextResponse.json({ message: "Like removed" });
    }

    if (isUnliked) {
      // Remove unlike if user previously unliked
      await questionsCollection.updateOne(
        { _id: new ObjectId(params.id) },
        {
          $inc: { unlikes: -1 },
          $pull: { unlikedBy: email },
        }
      );
    }

    // Add like and remove unlike (if present)
    await questionsCollection.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $inc: { likes: 1 },
        $push: { likedBy: email },
        $pull: { unlikedBy: email },
      }
    );

    return NextResponse.json({ message: "Liked successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
  }
};

  

