"use client";
import axios from 'axios';
import { Avatar, Button, Card, Textarea } from 'flowbite-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';
import { ThreeCircles } from 'react-loader-spinner';

const AnswerCard = ({ questionDetails }) => {
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession();
  const user = session?.user.email;
  const image = session?.user?.image;

  console.log("answer", questionDetails);
  const [comment, setComment] = useState("");
  const [answers, setAnswers] = useState([]); // Store answers


  console.log(comment);

  // Updated getTimeAgo function
  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const differenceInMs = now - createdDate;

    const minutes = Math.floor(differenceInMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;

    if (days > 0) {
      return `${days} day(s) ${remainingHours} hours ago`;
    } else if (hours > 0) {
      return `${hours} hours ${remainingMinutes} minutes ago`;
    }
    return `${remainingMinutes} minutes ago`;
  };

  
  // Fetch answers when the component mounts
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await axios.get(`/questions/api/getanswer?question_id=${questionDetails._id}`);
        setAnswers(response.data.answers); // Store the fetched answers in state
        setLoading(false)
      } catch (error) {
        console.error("Error fetching answers:", error);
      }
    };
    fetchAnswers();
  }, [questionDetails._id]);

  // Updated handleCommentSubmit function to include answerId
  const handleCommentSubmit = async (answerId) => {
    console.log("Submitted Comment:", comment);
    const com = { comment, user, image, answerId }; // Include answerId in the comment object
    console.log("com", com)
    try {
    const response =   await axios.post('/questions/api/addcomments', com); // Send the comment object to the API
      setComment(""); // Clear input after submission
   
      if(response.status === 201){
        toast.success("Comment added successfully!")
        setLoading(false)
        
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("something wrong!")
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center my-4">
        <ThreeCircles
          visible={true}
          height="50"
          width="50"
          color="#4fa94d"
          ariaLabel="three-circles-loading"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Answers</h3>

        {/* Check if there are answers and display accordingly */}
        {answers.length > 0 ? (
          answers.map((answer) => (
            <Card className="mb-4" key={answer._id}>
              <div className="flex items-start">
                <Avatar img={answer.image || "https://randomuser.me/api/portraits/women/2.jpg"} />
                <div className="ml-4 w-full">
                  <h4 className="font-medium">{answer.user}</h4>
                  <p className="text-gray-600 mt-1 mb-2">
                    {answer.answer}
                  </p>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                    <p className="text-gray-500 text-sm">Answered on {getTimeAgo(answer.createdAt)}</p>
                  
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
                    <div className='flex items-center justify-between px-2 my-3'>
                      <Button className="bg-blue-600 text-white" onClick={() => handleCommentSubmit(answer._id)}>
                        Submit Comment
                      </Button>
                      <Link
                      className='my-4 ml-5 p-2 hover:bg-gray-200 hover:shadow-lg border rounded-md hover:text-blue-600 cursor-pointer'
                      href={`/allcomments/${answer._id}`}> {/* Use answer._id as part of the URL */}
                      See all comments
                    </Link>
                    
                    </div>
                  </div>

                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 font-semibold text-center">No answers yet.</p> // Message for no answers
        )}
      </div>
    </div>
  );
};

export default AnswerCard;
