"use client";
import { Avatar, Badge, Button, Card, Textarea } from 'flowbite-react';
import React, { useState } from 'react';
import { AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';

const QuestionsDetailsCard = ({questionDetails}) => {
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [answer, setAnswer] = useState("")

    const handleLike = () => {
        setLiked(!liked);
        if (disliked) setDisliked(false);
      };
    
      const handleDislike = () => {
        setDisliked(!disliked);
        if (liked) setLiked(false);
      };

      
  const handleAnswerSubmit = () => {
    // Handle answer submission logic
    console.log("Submitted Answer:", answer);
    setAnswer(""); // Clear input after submission
  };

    return (
        <div>
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
              I have a large-scale React application, and I want to optimize it for better performance. What are the best practices to achieve this?
            </p>
            <div className="vflex flex-col md:flex-row items-start md:items-center justify-between">
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
        </div>
    );
};

export default QuestionsDetailsCard;