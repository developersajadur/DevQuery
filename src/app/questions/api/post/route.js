import { ConnectDB } from "@/lib/ConnectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// export const POST = async (request) =>{
//   const bookMark = await request.json();
//   try {
//       const db = await ConnectDB();
//       const bookmarkCollection = db.collection('bookmarks')
//       const isExist = await bookmarkCollection.findOne({id: bookMark.id})
//       if(isExist){
//           return NextResponse.json({message:"Already Bookmarked"} , {status:404})
//       }
//       const res = await bookmarkCollection.insertOne(bookMark)
//       return NextResponse.json({message:"Question Bookmarked"}, {status: 200})
//   } catch (error) {
//       return NextResponse.json({message:"Something went wrong", error}, {status: 404})
      
//   }
// }

// Import necessary modules

export const POST = async (request) => {
  const bookMark = await request.json();

  // Destructure userId and questionId from the request body
  const { userId, questionId } = bookMark;

  // Validate incoming data
  if (!questionId) {
    return NextResponse.json(
      { message: "userId and questionId are required." },
      { status: 400 } // Bad Request
    );
  }

  try {
    const db = await ConnectDB();
    const bookmarkCollection = db.collection('bookmarks');

    // Ensure unique index on userId and questionId
    // This should ideally be done once during server initialization
    await bookmarkCollection.createIndex(
      { userId: 1, questionId: 1 },
      { unique: true }
    );

    // Check if the bookmark already exists
    const isExist = await bookmarkCollection.findOne({ userId, questionId });

    if (isExist) {
      return NextResponse.json(
        { message: "Bookmark already exists." },
        { status: 409 } // Conflict
      );
    }

    // Insert the new bookmark
    const res = await bookmarkCollection.insertOne({
      email:bookMark.email,
      title:bookMark.title,
      userId,
      questionId,
      createdAt: new Date(), // Optional: Timestamp
    });

    return NextResponse.json(
      { message: "Question bookmarked successfully.", bookmark: res.ops[0] },
      { status: 201 } // Created
    );
  } catch (error) {
    console.error("Error adding bookmark:", error);

    // Handle duplicate key error from MongoDB
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Bookmark already exists." },
        { status: 409 } //Conflict
      );
    }

    return NextResponse.json(
      { message: "Question Bookmarked",  },
      { status: 200 } //success
    );
  }
};