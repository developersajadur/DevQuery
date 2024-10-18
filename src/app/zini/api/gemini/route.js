
import { GoogleGenerativeAI } from "@google/generative-ai";
export const POST = async(req, res) => {
  const { prompt } = await req.json(); // Get the prompt from the request body
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text(); // Extract the response text
    return new Response(JSON.stringify({ response: responseText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return new Response(JSON.stringify({ error: "Failed to generate content." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}