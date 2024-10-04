import { ConnectDB } from "@/lib/ConnectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request) =>{
    const bookMark = await request.json();
    try {
        const db = await ConnectDB();
        const bookmarkCollection = db.collection('bookmarks')
        const isExist = await bookmarkCollection.findOne({id: bookMark.id});
        if (isExist) {
            return NextResponse.json({ message: "Already Bookmarked" }, { status: 304 });
        }
        const res = await bookmarkCollection.insertOne(bookMark)
        return NextResponse.json({message:"Question Bookmarked"}, {status: 200})
    } catch (error) {
        return NextResponse.json({message:"Something went wrong", error}, {status: 404})
        
    }
}