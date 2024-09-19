import axios from "axios";
const url = process.env.NEXT_PUBLIC_WEB_URL;

// This function will fetch the questions using axios
export const getQuestions = async () => {
  const fetchUrl = `${url}/questions/api/get`
  try {
    const response = await axios.get(fetchUrl);
    const questions = response?.data?.questions;
    return questions;
  } catch (error) {
    console.error("Error details:", error); // Log the error details
    throw new Error("Error fetching questions");
  }
};
