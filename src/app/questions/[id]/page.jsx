"use client"; // Move this to the top

import { getQuestionDetail } from "@/app/Components/Questions/GetQuestions";
import Loading from "@/app/Components/Loading/Loading";
import QuestionsDetailsCard from "@/app/Components/Questions/QuestionsDetailsCard";
import { useEffect, useState } from "react";

// Dynamic metadata function; remove this if you prefer static metadata
export async function generateMetadata({ params }) {
  try {
    const data = await getQuestionDetail(params.id);
    return {
      title: data?.title || "Question Details",
      description: data?.description || "View detailed information about this question",
      keywords: `${data?.tags?.join(", ") || "questions, answers, details"}`,
    };
  } catch (error) {
    console.error("Error fetching question metadata:", error);
    return {
      title: "Question Details",
      description: "Get in-depth details of each question and answers",
    };
  }
}


const QuestionDetails = ({ params }) => {
  const [questionDetails, setQuestionDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        const data = await getQuestionDetail(params.id);
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
    return <Loading />;
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
