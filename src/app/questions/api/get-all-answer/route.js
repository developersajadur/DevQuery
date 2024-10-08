import { ConnectDB } from "@/lib/ConnectDB"
import { NextResponse } from "next/server";

export const GET = async() => {
    const db = await ConnectDB();
    const answerCollection = await db.collection("answer");
    try {
        const answers = await answerCollection.find().toArray(); 
        return NextResponse.json({answers});
    } catch (error) {
        return NextResponse.json({massage: "answers not found", error})
    }

} 