import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    // Extract userEmail from query parameters
    const userEmail = new URL(req.url).searchParams.get("userEmail");
    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    const db = await ConnectDB();
    const usersCollection = await db.collection("users");
    const user = await usersCollection.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ notifications: user.notifications || [] }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching notifications." },
      { status: 500 }
    );
  }
};
