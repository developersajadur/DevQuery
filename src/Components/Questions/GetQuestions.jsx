import axios from "axios";
// const url = process.env.WEB_URL;

// This function will fetch the questions using axios
export const getQuestions = async () => {
  try {
    const response = await axios.get("/questions/api/get");
    const questions = response?.data?.questions;
    return questions;
  } catch (error) {
    console.error("Error details:", error); // Log the error details
    throw new Error("Error fetching questions");
  }
};
