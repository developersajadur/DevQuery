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
  
      if (question.unlikedBy && question.unlikedBy.includes(email)) {
        // If already unliked, remove unlike
        await questionsCollection.updateOne(
          { _id: new ObjectId(params.id) },
          {
            $inc: { unlikes: -1 },
            $pull: { unlikedBy: email },
          }
        );
        return NextResponse.json({ message: "Unlike removed" });
      }
  
      if (question.likedBy && question.likedBy.includes(email)) {
        // Remove like if user previously liked
        await questionsCollection.updateOne(
          { _id: new ObjectId(params.id) },
          {
            $inc: { likes: -1 },
            $pull: { likedBy: email },
          }
        );
      }
  
      // Add unlike
      await questionsCollection.updateOne(
        { _id: new ObjectId(params.id) },
        {
          $inc: { unlikes: 1 },
          $push: { unlikedBy: email },
        }
      );
  
      return NextResponse.json({ message: "Unliked successfully" });
    } catch (error) {
      return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
    }
  };
  
