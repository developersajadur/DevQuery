import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail"); // Expecting sender's email
  const participantEmail = searchParams.get("participantEmail"); // Expecting recipient's email

  // Validate the parameters
  if (!userEmail || !participantEmail) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  try {
    // Connect to the database
    const db = await ConnectDB();
    const participantsCollection = db.collection("participants");

    // Find the participant data based on userEmail and participantId
    const participantData = await participantsCollection.findOne({
      userEmail,
      "participants.participantsId": participantEmail, // Ensure correct field name
    });

    // If no participant data found, return empty messages
    if (!participantData) {
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    // Retrieve the messages for the specified participant
    const participant = participantData.participants.find(
      (p) => p.participantsId === participantEmail // Ensure correct field name
    );

    const messages = participant?.messages || []; // Handle cases where participant might not have messages

    // Return the messages
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching sender messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
};
