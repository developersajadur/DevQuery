"use client";
import axios from 'axios';
import { Avatar, Badge, Button, Card } from 'flowbite-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const stripHtml = (html) => {
  if (typeof window === "undefined") return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

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

const QuestionsDetailsCard = ({ questionDetails }) => {
  const router = useRouter();
  const { data: session } = useSession();
  console.log("question",questionDetails)
  const currentUserEmail = session?.user?.email || "";
  const currentUserImage = session?.user?.image || "";

 

  const timeAgo = getTimeAgo(questionDetails?.createdAt);
  const { title, description, tags } = questionDetails;
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

  const handleAnswerSubmit = async () => {
    const plainTextAnswer = stripHtml(answer);
    const answerData = {ans: plainTextAnswer,question_id:questionDetails._id, user: currentUserEmail, image: currentUserImage };
    if(!session?.user){
      return router.push('/login')
    }
    setAnswer(""); // Clear input after submission

    try {
      const response = await axios.post('/questions/api/answeradd', answerData);

      if (response.status === 200) {
        toast.success("Your answer has been successfully submitted!");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("An error occurred while submitting your answer.");
    }
  };

  return (
    <div>
      <Card className="mb-6">
        <div className="flex items-start">
          <Avatar img={questionDetails.image} />
          <div className="ml-4 w-full">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="flex items-center space-x-2 mb-2">
              {tags?.map((tag, index) => (
                <Badge className="mr-2" key={index} color="info">#{tag}</Badge>
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

            {/* Add Answer Section with React Quill */}
            <div className="mt-4">
              <ReactQuill
                value={answer}
                onChange={setAnswer} 
                placeholder="Write your answer here..."
                theme="snow"
                className="mb-4 p-2"
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
