import { ConnectDB } from "@/lib/ConnectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
    const db = await ConnectDB();
    const questionsCollection = db.collection("questions");
    try {
        const question = await questionsCollection.findOne({ _id: new ObjectId(params.id) });
        console.log(question);
        return NextResponse.json({ question });
    } catch (error) {
        return NextResponse.json({ massage: "question not found", error });
    }
};

export const PUT = async (request, { params }) => {
    const db = await ConnectDB();
    const questionsCollection = db.collection("questions");

    try {
        const { questionId, user } = await request.json();
        const email = user.email;

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const question = await questionsCollection.findOne({ _id: new ObjectId(params.id) });
        if (!question) {
            return NextResponse.json({ message: "Question not found" }, { status: 404 });
        }

        // Check if the user has already unliked the question
        if (question.unlikedBy && question.unlikedBy.includes(email)) {
            return NextResponse.json({ message: "User has already unliked this question" }, { status: 400 });
        }

        // If the user liked the question, remove the like first
        if (question.likedBy && question.likedBy.includes(email)) {
            await questionsCollection.updateOne(
                { _id: new ObjectId(params.id) },
                {
                    $inc: { likes: -1 },
                    $pull: { likedBy: email },
                }
            );
        }

        // Increment unlikes and add the user to unlikedBy
        const result = await questionsCollection.updateOne(
            { _id: new ObjectId(params.id) },
            {
                $inc: { unlikes: 1 },
                $push: { unlikedBy: email },
            }
        );

        if (result.modifiedCount === 1) {
            return NextResponse.json({ message: "Question unliked successfully" });
        } else {
            return NextResponse.json({ message: "Failed to update unlike" }, { status: 500 });
        }
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
    }
};

