import { ConnectDB } from "@/lib/ConnectDB";

export const GET = async () => {
  const db = await ConnectDB();
  const questionsCollection = db.collection("questions");
  try {
    const questions = await questionsCollection.find().toArray();
    return Response.json({ questions });
  } catch (error) {
    console.log(error);
  }
};
