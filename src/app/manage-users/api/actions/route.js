import { ConnectDB } from "@/lib/ConnectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const PATCH = async (request) => {
  try {
    // Parse the request body
    const req = await request.json();
    const { userId, status } = req;

    // Connect to the database
    const db = await ConnectDB();
    const usersCollection = await db.collection("users");

    // Ensure userId is a valid ObjectId
    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    // Find the user and update the status field
    const updatedUser = await usersCollection.updateOne(
      { _id: new ObjectId(userId) }, // Use userId instead of _id
      { $set: { status: status } }
    );

    // Check if the update was successful
    if (updatedUser.modifiedCount > 0) {
      return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "No changes made or user not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
  }
};
