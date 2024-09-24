import axios from "axios";

// This function will fetch the questions using axios
export const getQuestions = async () => {
  const fetchUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/get`
  try {
    const response = await axios.get(fetchUrl);
    const questions = response?.data?.questions;
    return questions;
  } catch (error) {
    console.error("Error details:", error); // Log the error details
    return [];
  }
};

export const getQuestionDetail = async (id) => {
  const detailsFetchUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/${id}`
  try {
    const response = await axios.get(detailsFetchUrl);
    const questionDetail = response?.data?.question;
    
    return questionDetail;
  } catch (error) {
    console.error("Error details:", error); // Log the error details
    return [];
  }
}
