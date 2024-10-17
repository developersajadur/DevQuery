import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const db = await ConnectDB();
  const questionsCollection = db.collection("questions");

  const url = new URL(req.url);
  const search = url.searchParams.get("search");
  const filter = url.searchParams.get("filter"); // Get filter from query params
  const page = parseInt(url.searchParams.get("page")) || 1; // Current page (default to 1)
  const limit = parseInt(url.searchParams.get("limit")) || 10; // Items per page (default to 10)

  const skip = (page - 1) * limit; // Calculate how many records to skip

  let query = {};
  let sortOption = {};

  // Search query logic
  if (search) {
    query = {
      title: { $regex: search, $options: "i" }, // Case-insensitive title search
    };
  }

  // Filter options logic
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

  try {
    const totalQuestions = await questionsCollection.countDocuments(query); // Get total number of questions
    const questions = await questionsCollection
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({ questions, totalQuestions, page, totalPages: Math.ceil(totalQuestions / limit) });
  } catch (error) {
    return NextResponse.json({ message: "Questions not found", error });
  }
};
