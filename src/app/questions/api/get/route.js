import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const db = await ConnectDB();
  const questionsCollection = db.collection("questions");

  const url = new URL(req.url);
  const search = url.searchParams.get("search");
  const filter = url.searchParams.get("filter"); // Get filter from query params

  let query = {};
  let sortOption = {}; // Sorting option

  if (search) {
    query = {
      title: { $regex: search, $options: "i" }, // Case-insensitive title search
    };
  }

  // Handle filter for likes, unlikes, and newest
  if (filter === "most_liked") {
    sortOption = { likes: -1 }; // Sort by likes in descending order
  } else if (filter === "most_unliked") {
    sortOption = { unlikes: -1 }; // Sort by unlikes in descending order
  } else if (filter === "newest") {
    sortOption = { createdAt: -1 }; // Sort by newest questions
  } else {
    // Default sort option
    sortOption = { createdAt: -1 }; // Fallback to sorting by newest if no filter is provided
  }

  try {
    const questions = await questionsCollection.find(query).sort(sortOption).toArray();
    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json({ message: "Questions not found", error });
  }
};
