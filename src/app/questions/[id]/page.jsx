"use client";
import Loading from "@/app/Components/Loading/Loading";
import { getQuestionDetail } from "@/app/Components/Questions/GetQuestions";
import QuestionsDetailsCard from "@/app/Components/Questions/QuestionsDetailsCard";
import { useEffect, useState } from "react";

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
    return <Loading/>
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Question Section */}
      <QuestionsDetailsCard questionDetails={questionDetails} />

      {/* Answer Section */}
   
    </div>
  );
};

export default QuestionDetails;
