import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const participantId = searchParams.get("participantId");

  // Validate the parameters
  if (!userId || !participantId) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  try {
    // Connect to the database
    const db = await ConnectDB();
    const participantsCollection = db.collection("participants");

    // Find the participant data based on userId and participantId
    const participantData = await participantsCollection.findOne({
      userId,
      "participants.participantsId": participantId,
    });

    if (!participantData) {
      // If no data found, return an empty array of messages
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    // Retrieve the messages for the specified participant
    const messages = participantData.participants.find(
      (p) => p.participantsId === participantId
    )?.messages || [];

    // Return the messages
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    // Return an error response if something goes wrong
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
};
