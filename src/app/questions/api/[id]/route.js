import { ConnectDB } from "@/lib/ConnectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const GET = async (request, {params}) => {
  const db = await ConnectDB();
  const questionsCollection = db.collection("questions");
  try {
    const question = await questionsCollection.findOne({ _id: new ObjectId(params.id)});
    return NextResponse.json({ question });
  } catch (error) {
    return NextResponse.json({massage: "question not found", error})
  }
};
