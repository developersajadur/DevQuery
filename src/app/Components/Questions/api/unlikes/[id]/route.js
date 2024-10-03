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
        // console.log(questionId, user);
        const email = user.email;
        // console.log(email);

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const question = await questionsCollection.findOne({ _id: new ObjectId(params.id) });
        if (!question) {
            return NextResponse.json({ message: "Question not found" }, { status: 404 });
        }

        if (question.unlikedBy && question.unlikedBy.includes(email)) {
            const result2 = await questionsCollection.updateOne(
                { _id: new ObjectId(params.id) },
                {
                    $inc: { unlikes: -1 },
                    $pull: { unlikedBy: email },
                }
            );
            return NextResponse.json({ message: "User has already unlikes this question" }, { status: 400 });
        }

        if (question.unlikedBy && question.unlikedBy.includes(!email)) {
            const result2 = await questionsCollection.updateOne(
                { _id: new ObjectId(params.id) },
                {
                    $inc: { unlikes: 1 },
                    $push: { unlikedBy: email },
                }
            );

            if (question.likedBy && question.likedBy.includes(email) && likes > 0) {
                const result2 = await questionsCollection.updateOne(
                    { _id: new ObjectId(params.id) },
                    {
                        $inc: { likes: -1 },
                        $pull: { likedBy: email },
                    }
                );
            }
        }

        const result = await questionsCollection.updateOne(
            { _id: new ObjectId(params.id) },
            {
                $inc: { unlikes: 1 },
                $push: { unlikedBy: email },
            }
        );

        if (result.modifiedCount === 1) {
            return NextResponse.json({ message: "Question unlikes successfully" });
        } else {
            return NextResponse.json({ message: "Failed to update unlikes" }, { status: 500 });
        }
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
    }
};
