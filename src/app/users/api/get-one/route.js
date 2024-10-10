import { ConnectDB } from "@/lib/ConnectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// Change to GET to handle requests that fetch user data
export const GET = async (request) => {
  // Extract userId from the query parameters
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId"); // Get userId from query parameters

  const db = await ConnectDB();
  const usersCollection = db.collection("users");

  try {
    // Validate userId
    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    // Fetch the user from the database
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    // Return user data
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching user", error: error.message }, { status: 500 });
  }
};
