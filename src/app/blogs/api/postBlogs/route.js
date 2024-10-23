import { ConnectDB } from "@/lib/ConnectDB"
import { NextResponse } from "next/server"

export const POST = async (request) =>{
    const db = await ConnectDB(); 
    
    
    try {
         const blogsData = await request.json()
        const blogsCollection = db.collection('blogs')
        const insertBlog = await blogsCollection.insertOne(blogsData)

        return NextResponse.json({message:"Insert a data successfully", insertBlog}, {status:200})
     } catch (error) {
        return NextResponse.json({message:"Failed to insert", error}, {status:404})
     }
}