import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const { searchParams } = new URL(request.url);
  const currentUserEmail = searchParams.get("currentUserEmail");
  const targetEmail = searchParams.get("targetEmail");

  try {
    // Connect to the database
    const db = await ConnectDB();
    const usersCollections = db.collection('users');

    const currentUser = await usersCollections.findOne({ email: currentUserEmail });
    const isFollowing = currentUser?.following?.includes(targetEmail) || false;

    return NextResponse.json({ isFollowing }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
  }
};
