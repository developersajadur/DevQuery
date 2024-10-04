import { ConnectDB } from "@/lib/ConnectDB"
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const GET = async (request, {params}) => {
    const db = await ConnectDB();
    const usersCollection = await db.collection("users");
    try {
        const user = await usersCollection.findOne({_id: new ObjectId(params.id)})
        return NextResponse.json({user})
    } catch (error) {
        return NextResponse.json({massage: "question not found", error})
    }

}