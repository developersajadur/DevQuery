import { getQuestions } from "../Components/Questions/GetQuestions";

const Questions = async () => {
  const questions = await getQuestions();
  return (
    <div>
      {questions?.map((question) => (
        <div key={question._id}>
          <h2>{question.title}</h2>
          <p>{question.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Questions;
