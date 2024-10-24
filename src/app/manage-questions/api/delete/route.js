const { ConnectDB } = require("@/lib/ConnectDB");
const { ObjectId } = require("mongodb");
const { NextResponse } = require("next/server");

export const DELETE = async (request) => {
  try {
    const { id } = await request.json(); 
     
    if (!id) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const db = await ConnectDB();
    const questionsCollection = db.collection("questions");

    // Delete question by its ObjectId
    const result = await questionsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Question deleted successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Question not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
  }
};
