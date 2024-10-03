import { ConnectDB } from "@/lib/ConnectDB"
import { NextResponse } from "next/server";

export const POST = async(request) => {
    const newJob = await request.json();
    const db = await ConnectDB();
    const jobCollections = await db.collection("jobs");
    try {
        const result = await jobCollections.insertOne(newJob);
        return NextResponse.json({massage: "Job Post Succesfully"})
    } catch (error) {
        console.error("Error inserting job posting:", error); 

        return NextResponse.json({
          message: 'Failed to post for the job',
          error: error.message,
        }, { status: 500 });
    }


}