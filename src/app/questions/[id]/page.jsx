"use client";
import AnswerCard from "@/app/Components/Questions/AnswerCard";
import { getQuestionDetail } from "@/app/Components/Questions/GetQuestions";
import QuestionsDetailsCard from "@/app/Components/Questions/QuestionsDetailsCard";
import { useEffect, useState } from "react";
import { ThreeCircles } from "react-loader-spinner";

const QuestionDetails = ({ params }) => {
  const [questionDetails, setQuestionDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        const data = await getQuestionDetail(params.id); // Assuming this is an API call
        setQuestionDetails(data);
      } catch (error) {
        console.error("Error fetching question details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ThreeCircles
          visible={true}
          height="100"
          width="100"
          color="#0000FF" // Red color for loader
          ariaLabel="three-circles-loading"
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Question Section */}
      <QuestionsDetailsCard questionDetails={questionDetails} />

      {/* Answer Section */}
      <AnswerCard questionDetails={questionDetails} />
    </div>
  );
};

export default QuestionDetails;
