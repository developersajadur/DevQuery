"use client";
import axios from 'axios';
import { Avatar, Button, Card, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';

const AnswerCard = ({ questionDetails }) => {
  console.log("answer", questionDetails);
  const [comment, setComment] = useState("");
  const [answers, setAnswers] = useState([]); // Store answers

  // Define the getTimeAgo function before using it
  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const differenceInMs = now - createdDate;

    const minutes = Math.floor(differenceInMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) return `${hours} hour(s) ${remainingMinutes} minutes ago`;
    return `${remainingMinutes} minutes ago`;
  };

  // Fetch answers when the component mounts
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await axios.get(`/questions/api/getanswer?question_id=${questionDetails._id}`); // Change to GET request
        setAnswers(response.data.answers); // Store the fetched answers in state
      } catch (error) {
        console.error("Error fetching answers:", error);
      }
    };
    fetchAnswers();
  }, [questionDetails._id]); // Add questionDetails._id as a dependency to refetch if it changes

  const handleCommentSubmit = () => {
    console.log("Submitted Comment:", comment);
    setComment(""); // Clear input after submission
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Answers</h3>

        {/* Dynamically render each answer */}
        {answers.map((answer) => (
          <Card className="mb-4" key={answer._id}>
            <div className="flex items-start">
              <Avatar img={answer.image || "https://randomuser.me/api/portraits/women/2.jpg"} />
              <div className="ml-4 w-full">
                <h4 className="font-medium">{answer.user}</h4>
                <p className="text-gray-600 mt-1 mb-2">
                  {answer.answer}
                </p>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <p className="text-gray-500 text-sm">Answered on {getTimeAgo(answer.createdAt)}</p> {/* Use answer's createdAt */}
                  <div className="flex items-center">
                    <Button.Group>
                      <Button color="light">
                        <AiOutlineLike size={20} /> {answer.likes} Like
                      </Button>
                      <Button color="light">
                        <AiOutlineDislike size={20} /> {answer.unlikes} Dislike
                      </Button>
                    </Button.Group>
                  </div>
                </div>

                {/* Add Comment Section for Each Answer */}
                <div className="mt-4">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment here..."
                    rows={2}
                    className="mb-4"
                  />
                  <Button className="bg-blue-600 text-white" onClick={handleCommentSubmit}>
                    Submit Comment
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {/* Comment Card */}
        
      </div>
    </div>
  );
};

export default AnswerCard;
