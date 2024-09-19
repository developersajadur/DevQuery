import { ConnectDB } from "@/lib/ConnectDB";
import { ObjectId } from "mongodb";

export const GET = async (request, {params}) => {
  const db = await ConnectDB();
  const questionsCollection = db.collection("questions");
  try {
    const question = await questionsCollection.findOne({ _id: new ObjectId(params.id)});
    return Response.json({ question });
  } catch (error) {
    console.log(error);
  }
};
