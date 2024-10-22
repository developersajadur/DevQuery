import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const participantId = searchParams.get("participantId");

  if (!userId || !participantId) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const db = await ConnectDB();
  const participantsCollection = db.collection("participants");

  try {
    const participantData = await participantsCollection.findOne({
      userId,
      "participants.participantsId": participantId,
    });

    if (!participantData) {
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    const messages = participantData.participants.find(
      (p) => p.participantsId === participantId
    )?.messages || [];

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
};
