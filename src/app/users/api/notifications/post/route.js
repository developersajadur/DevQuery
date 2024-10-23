import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  let newNotification;

  // Check if request body is valid JSON
  try {
    newNotification = await request.json();
  } catch (error) {
    console.error("Invalid JSON format:", error);
    return NextResponse.json({ error: "Invalid JSON format." }, { status: 400 });
  }

  const db = await ConnectDB();

  try {
    const usersCollection = await db.collection("users");
    
    // Fetch the user document based on the provided email
    const user = await usersCollection.findOne({ email: newNotification.questionUserEmail });
    
    // Check if the user exists
    if (!user) {
      console.log("User not found:", newNotification.questionUserEmail);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Ensure the notifications field is an array
    if (!Array.isArray(user.notifications)) {
      // Initialize notifications as an empty array if it's not already
      await usersCollection.updateOne(
        { email: newNotification.questionUserEmail },
        { $set: { notifications: [] } }
      );
    }
    
    // Push the new notification into the notifications array
    await usersCollection.updateOne(
      { email: newNotification.questionUserEmail },
      { $push: { notifications: newNotification } }
    );

    console.log("Notification added successfully.");
    return NextResponse.json({ message: "Notification added successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error adding notification:", error);
    return NextResponse.json({ error: "An error occurred while adding the notification." }, { status: 500 });
  }
};
