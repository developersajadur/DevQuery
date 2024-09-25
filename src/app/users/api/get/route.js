import { ConnectDB } from "@/lib/ConnectDB"
import { NextResponse } from "next/server";

export const GET = async() => {
    const db = await ConnectDB();
    const usersCollection = await db.collection("users");
    try {
        const users = await usersCollection.find().toArray();
        return NextResponse.json({users});
    } catch (error) {
        return NextResponse.json({massage: "Users not found", error})
    }

}