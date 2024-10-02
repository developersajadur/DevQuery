import { ConnectDB } from "@/lib/ConnectDB"
import { NextResponse } from "next/server";

export const GET = async() => {
    const db = await ConnectDB();
    const jobCollections = await db.collection("jobs");
    try {
        const jobs = await jobCollections.find().toArray();
        return NextResponse.json({jobs});
        
    } catch (error) {
        return NextResponse.json({massage: "Jobs not found", error})
    }
}