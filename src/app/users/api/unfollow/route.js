import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    const { currentUserEmail, targetEmail } = await request.json();

    if (!currentUserEmail || !targetEmail) {
      return NextResponse.json({ message: "Email parameters are missing" }, { status: 400 });
    }

    // Connect to the database
    const db = await ConnectDB();
    const usersCollections = db.collection('users');

    const currentUser = await usersCollections.findOne({ email: currentUserEmail });
    const followingUser = await usersCollections.findOne({ email: targetEmail });

    if (!currentUser || !followingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const updatedUserForFollowing = await usersCollections.updateOne(
      { email: currentUserEmail },
      { $pull: { following: targetEmail } }
    );

    const updatedUserForFollower = await usersCollections.updateOne(
      { email: targetEmail },
      { $pull: { followers: currentUserEmail } }
    );

    const changesMade = updatedUserForFollowing.modifiedCount > 0 || updatedUserForFollower.modifiedCount > 0;
    if (changesMade) {
      return NextResponse.json({ message: "Unfollowed Successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "No changes made" }, { status: 200 });
    }
  } catch (error) {
    console.error("Unfollow error:", error);
    return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
  }
};
