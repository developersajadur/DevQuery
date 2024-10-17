// app/api/blogs/getBlogs/route.js
import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const db = await ConnectDB();
        const blogsCollection = db.collection('blogs');

        const blogs = await blogsCollection.find().toArray();

        return NextResponse.json(
            { status: 200, blogs, message: "Successfully retrieved blog data." },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json(
            { status: 500, message: "Internal Server Error" },
            { status: 500 }
        );
    }
};
