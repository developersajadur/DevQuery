import { ConnectDB } from "@/lib/ConnectDB"
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const GET = async (request ,{params}) =>{
    const db = await ConnectDB();
    const blogsCollection = db.collection("blogs")
    try {
        const blog = await blogsCollection.findOne({_id: new ObjectId(params.id)})
        return NextResponse.json({message:"successfully get",blog}, {status:200})
    } catch (error) {
        return NextResponse.json({message:"Blogs not found"}, {status:404})
    }
} 