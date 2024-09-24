import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const GET = async () => {
  const db = await ConnectDB();
  const questionsCollection = db.collection("questions");
  try {
    const questions = await questionsCollection.find().toArray();
    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json({massage: "question not found", error})
  }
};
