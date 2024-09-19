// In components/QuestionDetails.js
"use client";
import React, { useState } from "react";
import { Button, Avatar, Textarea, Card, Badge } from "flowbite-react";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

const QuestionDetails = ({ questionDetails }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [answer, setAnswer] = useState("");
  const [comment, setComment] = useState("");

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleAnswerSubmit = () => {
    console.log("Submitted Answer:", answer);
    setAnswer(""); // Clear input after submission
  };

  const handleCommentSubmit = () => {
    console.log("Submitted Comment:", comment);
    setComment(""); // Clear input after submission
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Question Section */}
      <Card className="mb-6">
        <div className="flex items-start">
          <Avatar img="https://randomuser.me/api/portraits/men/1.jpg" />
          <div className="ml-4 w-full">
            <h2 className="text-xl font-semibold">{questionDetails.title}</h2>
            <div className="flex items-center space-x-2 mb-2">
              <Badge color="info">React</Badge>
              <Badge color="gray">Optimization</Badge>
              <Badge color="success">Performance</Badge>
            </div>
            <p className="text-gray-600 mb-4">
              {questionDetails.description}
            </p>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <p className="text-gray-500 text-sm">Posted by John Doe on Sep 19, 2024</p>
              <div className="flex items-center">
                <Button.Group>
                  <Button color="light" onClick={handleLike}>
                    <AiOutlineLike size={20} className={`${liked ? "text-blue-500" : ""}`} /> Like
                  </Button>
                  <Button color="light" onClick={handleDislike}>
                    <AiOutlineDislike size={20} className={`${disliked ? "text-red-500" : ""}`} /> Dislike
                  </Button>
                </Button.Group>
              </div>
            </div>

            {/* Add Answer Section */}
            <div className="mt-4">
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your answer here..."
                rows={4}
                className="mb-4"
              />
              <Button className="bg-blue-600 text-white w-full" onClick={handleAnswerSubmit}>
                Submit Answer
              </Button>
            </div>

          </div>
        </div>
      </Card>

      {/* Answer Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Answers</h3>
        <Card className="mb-4">
          <div className="flex items-start">
            <Avatar img="https://randomuser.me/api/portraits/women/2.jpg" />
            <div className="ml-4 w-full">
              <h4 className="font-medium">Jane Smith</h4>
              <p className="text-gray-600 mt-1 mb-2">
                You can use tools like React.memo, React.lazy, and useMemo to optimize your React application. Also, be mindful of unnecessary re-renders and ensure your state management is efficient.
              </p>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <p className="text-gray-500 text-sm">Answered on Sep 19, 2024</p>
                <div className="flex items-center">
                  <Button.Group>
                    <Button color="light">
                      <AiOutlineLike size={20} /> Like
                    </Button>
                    <Button color="light">
                      <AiOutlineDislike size={20} /> Dislike
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

      </div>
    </div>
  );
};

export default QuestionDetails;
