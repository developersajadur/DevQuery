"use client";

import axios from 'axios'; 
import AllQuestion from '../Components/Questions/AllQuestions/AllQuestion';
import { useQuery } from '@tanstack/react-query';
import Loading from '../Components/Loading/Loading';
import QuestionsCard from '../Components/Questions/QuestionsCard';

const Page = () => {
  const{data: questions, isLoading, error} = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      try {
        const response = await axios.get('/questions/api/allquestion');
        if (response.status === 200) {
          return response.data.questions;
        } else {
          console.log('Error fetching questions');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  })


  
  if (isLoading) return <Loading />;
  if (error) return <p>Error loading job details.</p>;

  return (
    <div>
      {questions.length > 0 ? (
        questions.map((question, index) => (
          <QuestionsCard key={index} question={question}></QuestionsCard>
          // <AllQuestion key={index} question={question}></AllQuestion>
        ))
      ) : (
        <p>No questions available</p>
      )}
    </div>
  );
};

export default Page;
