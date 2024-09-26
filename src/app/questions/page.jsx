"use client";

import axios from 'axios'; // Make sure axios is imported
import { useEffect, useState } from 'react';
import AllQuestion from '../Components/Questions/AllQuestions/AllQuestion';

const Page = () => {
  const [questions, setQuestions] = useState([]); // Initialize state for questions
  
  // Use useEffect to handle side effects like API calls
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/questions/api/allquestion'); // API call to fetch questions
        if (response.status === 200) { // Check for a 200 OK status
          setQuestions(response.data.questions); // Set state with the questions array
          // console.log(response.data.questions); // Log questions to verify
        } else {
          console.log("Error fetching questions"); // Log if there's an unexpected status code
        }
      } catch (error) {
        console.error("Error:", error); // Log any errors that occur
      }
    };

    fetchQuestions(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array to run only once

  return (
    <div>
      {questions.length > 0 ? (
        questions.map((question, index) => (
          <AllQuestion key={index} question={question}></AllQuestion>
        ))
      ) : (
        <p>No questions available</p> // Fallback message if no questions
      )}
    </div>
  );
};

export default Page;
