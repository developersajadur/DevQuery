
import { getQuestionDetail } from "@/app/Components/Questions/GetQuestions";
import QuestionsDetailsCard from "@/app/Components/Questions/QuestionsDetailsCard";
import AnswerCard from "@/app/Components/Questions/AnswerCard";

const QuestionDetails = ({ params }) => {
  const questionDetails = getQuestionDetail(params.id);


  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Question Section */}
    <QuestionsDetailsCard questionDetails={questionDetails}/>

      {/* Answer Section */}
      <AnswerCard/>
      
    </div>
  );
};

export default QuestionDetails;
