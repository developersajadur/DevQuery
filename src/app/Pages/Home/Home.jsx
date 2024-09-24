import { getQuestions } from "@/app/Components/Questions/GetQuestions";
import QuestionsCard from "@/app/Components/Questions/QuestionsCard";
import Link from "next/link";

const Home = async () => {
  const questions = await getQuestions();
  return (
    <div className="lg:px-4 py-3">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl md:text-3xl font-semibold">Newest Questions</h1>
        <Link
          href="/makequestion"
          className="px-3 py-2 rounded-xl bg-blue-500 text-white font-semibold"
        >
          Make Question
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {questions.map((question) => (
          <QuestionsCard key={question._id} question={question} />
        ))}
      </div>
    </div>
  );
};

export default Home;
