import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");
  const participantEmail = searchParams.get("participantEmail");

  if (!userEmail || !participantEmail) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  try {
    const db = await ConnectDB();
    const participantsCollection = db.collection("participants");

    // Fetch chat history from both user and participant
    const senderData = await participantsCollection.findOne({
      userEmail,
      "participants.participantsId": participantEmail,
    });

    const receiverData = await participantsCollection.findOne({
      userEmail: participantEmail,
      "participants.participantsId": userEmail,
    });

    const senderMessages = senderData?.participants.find(
      (p) => p.participantsId === participantEmail
    )?.messages || [];

    const receiverMessages = receiverData?.participants.find(
      (p) => p.participantsId === userEmail
    )?.messages || [];

    // Combine and sort messages by time
    const chatHistory = [...senderMessages, ...receiverMessages].sort(
      (a, b) => new Date(a.time) - new Date(b.time)
    );

    return NextResponse.json({ messages: chatHistory });
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve chat history" }, { status: 500 });
  }
};
