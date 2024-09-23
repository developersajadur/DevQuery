"use client";
import { Avatar, Badge, Button, Card, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';

const getTimeAgo = (createdAt) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const differenceInMs = now - createdDate;

  // Calculate time differences in seconds, minutes, and hours
  const minutes = Math.floor(differenceInMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);

  const remainingMinutes = minutes % 60;

  if (hours > 0) return `${hours} hour(s) ${remainingMinutes} minutes ago`;
  return `${remainingMinutes} minutes ago`;
};

const QuestionsDetailsCard = ({ questionDetails }) => {
  const timeAgo = getTimeAgo(questionDetails?.createdAt);
  const { user, title, description, image, tags } = questionDetails;
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [answer, setAnswer] = useState("");

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
    // After submission logic (e.g., API call) can be placed here

    // Clear input after submission
    setAnswer(""); 
  };

  return (
    <div>
      <Card className="mb-6">
        <div className="flex items-start">
          <Avatar img={image} />
          <div className="ml-4 w-full">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="flex items-center space-x-2 mb-2">
              {tags?.map((tag, index) => (
                <Badge className='mr-2' key={index} color="info">{tag}</Badge> // Fixed key prop
              ))}
            </div>
            <p className="text-gray-600 mb-4">{description}</p>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <p className="text-gray-500 my-2 text-sm">Posted: {timeAgo}</p>
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
                onChange={(e) => setAnswer(e.target.value)} // Handle input change
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
