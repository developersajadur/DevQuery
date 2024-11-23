import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    const req = await request.json();
    const { currentUserEmail, targetEmail } = req;

    // Connect to the database
    const db = await ConnectDB();
    const usersCollections = db.collection('users');

    const updatedUserForFollowing = await usersCollections.updateOne(
      { email: currentUserEmail },
      { $addToSet: { following: targetEmail } }
    );

    const updatedUserForFollower = await usersCollections.updateOne(
      { email: targetEmail },
      { $addToSet: { followers: currentUserEmail } }
    );

    return NextResponse.json({ message: "Followed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
  }
};
