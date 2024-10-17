import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const db = await ConnectDB();
    const questionCollection = await db.collection('questions');

    // Extract query parameters from the request URL
    const url = new URL(request.url);
    const filter = url.searchParams.get('filter'); // e.g., "newest", "most_liked", etc.
    const page = parseInt(url.searchParams.get('page')) || 1; // default to page 1
    const limit = parseInt(url.searchParams.get('limit')) || 10; // default limit of 10

    // Set up sorting and filtering logic
    let sortOption = {};
    if (filter === "most_liked") {
      sortOption = { likes: -1 };
    } else if (filter === "most_unliked") {
      sortOption = { unlikes: -1 };
    } else if (filter === "newest") {
      sortOption = { createdAt: -1 };
    } else if (filter === "oldest") {
      sortOption = { createdAt: 1 };
    } else if (filter === "show_all") {
      sortOption = {};
    } else {
      sortOption = { createdAt: -1 };
    }

    // Fetch filtered and paginated questions from the database
    const questions = await questionCollection
      .find()
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const totalQuestions = await questionCollection.countDocuments();
    const totalPages = Math.ceil(totalQuestions / limit);

    // Return the questions in the response along with pagination info
    return NextResponse.json(
      { 
        message: "Questions retrieved successfully", 
        questions, 
        totalPages, 
        currentPage: page 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { message: "Error fetching questions from the server" }, 
      { status: 500 }
    );
  }
};
