import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    const userData = await request.json();
    const db = await ConnectDB();
    const usersCollection =await db.collection("users");
    try {
    const user = await usersCollection.findOne({ email: userData.userEmail });
        // Check if the user exists
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
          }

          if (!Array.isArray(user.meetings)) {
            await usersCollection.updateOne(
              { email: userData.userEmail},
              { $set: { meetings: [] } }
            );
          }

          await usersCollection.updateOne(
            { email: userData.userEmail },
            { $push: { meetings: userData } }
          );

          return NextResponse.json({ message: "Meeting added successfully." }, { status: 200 });
    } catch (error) {
        
    }
}