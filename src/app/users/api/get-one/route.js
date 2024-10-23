import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

// Change to GET to handle requests that fetch user data
export const GET = async (request) => {  
  // Extract email from the query parameters
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get("email"); // Get email from query parameters
  // console.log("user Email:", userEmail);
  

  const db = await ConnectDB();
  const usersCollection = db.collection("users");

  try {
    // Validate userEmail
    if (!userEmail) {
      return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }

    // Fetch the user from the database
    const user = await usersCollection.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    // Return user data
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching user", error: error.message }, { status: 500 });
  }
};
