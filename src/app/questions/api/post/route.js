import { ConnectDB } from "@/lib/ConnectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    const bookMark = await request.json();
  
    try {
      const db = await ConnectDB();
      const bookmarkCollection = db.collection('bookmarks');
  
      // Check if the card is already bookmarked
      const isExist = await bookmarkCollection.findOne({ id: bookMark.id });
  
      if (isExist) {
        return NextResponse.json(
          { message: "Already Bookmarked" },
          { status: 404 } // 409 Conflict status code is more appropriate here
        );
      }
  
      // If not, insert the bookmark
      const res = await bookmarkCollection.insertOne(bookMark);
      return NextResponse.json(
        { message: "Question Bookmarked" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Something went wrong", error: error.message },
        { status: 500 } // Use 500 for server errors
      );
    }
  };