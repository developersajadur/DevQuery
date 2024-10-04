const { ConnectDB } = require("@/lib/ConnectDB");
const { ObjectId } = require("mongodb");
const { NextResponse } = require("next/server");

export const GET = async(request, {params}) => {
    const db = await ConnectDB();
    const jobCollections = await db.collection("jobs");
    try {
        const job = await jobCollections.findOne({_id: new ObjectId(params.id)}) 
        return NextResponse.json({job})
    } catch (error) {
        return NextResponse.json({massage: "job not found", error})
    }
}