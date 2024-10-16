"use client";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Avatar, Badge, Button, Card, Textarea } from 'flowbite-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '/src/app/globals.css';
import Loading from '../Loading/Loading';

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
  const days = Math.floor(hours / 24);
  const remainingMinutes = minutes % 60;
  const remainingHours = hours % 24;

  if (days > 0) {
    return `${days} day(s) ${remainingHours} hours ago`;
  } else if (hours > 0) {
    return `${hours} hours ${remainingMinutes} minutes ago`;
  }
  return `${remainingMinutes} minutes ago`;
};

const QuestionsDetailsCard = ({ questionDetails }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const currentUserEmail = session?.user?.email || "";
  const currentUserImage = session?.user?.image || "";
  const user = session?.user.email;
  const image = session?.user?.image;

  const url = usePathname();

  const timeAgo = getTimeAgo(questionDetails?.createdAt);
  const { title, description, tags } = questionDetails;
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch post user details
  const { data: postUser, isLoading: loadingUser, error: userError } = useQuery({
    queryKey: ['user', questionDetails?.userId], // Fixed reference to questionDetails
    queryFn: async () => {
      if (!questionDetails?.userId) return null; // Avoid unnecessary API call
      const response = await axios.get(`/users/api/get-one?userId=${questionDetails?.userId}`);
      return response.data.user;
    },
    enabled: !!questionDetails?.userId // Only fetch if userId is available
  });

  // Fetch answers for the question
  const { data: answers, isLoading: answersLoading, isError, refetch } = useQuery({
    queryKey: ['answers', questionDetails._id],
    queryFn: async () => {
      const response = await axios.get(`/questions/api/getanswer?question_id=${questionDetails._id}`);
      return response.data.answers;
    },
    enabled: !!questionDetails._id, // Enable the query only if questionDetails._id is available
  });

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
    const answerData = { ans: plainTextAnswer, question_id: questionDetails._id, user: currentUserEmail, image: currentUserImage };

    if (!session?.user) {
      return router.push('/login');
    }

    if (plainTextAnswer.trim() === "") {
      toast.error("Please write an answer before submitting.");
      return;
    }

    try {
      await axios.post('/questions/api/answeradd', answerData);
      refetch(); 
      toast.success("Your answer has been successfully submitted!");
      setAnswer('');
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("An error occurred while submitting your answer.");
    }
  };

  const handleCommentSubmit = async (e, answerId) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const comment = formData.get('comment');

    const com = { comment, user, image, answerId }; 

    try {
      const response = await axios.post('/questions/api/addcomments', com);
      if (response.status === 201) {
        toast.success("Comment added successfully!");
        e.target.reset(); 
        setLoading(false);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Something went wrong!");
    }
  };

  if (isError) {
    return <div>Error loading answers.</div>;
  }

  if (answersLoading || loadingUser) {
    return <Loading />;
  }

  return (
    <div>
      <Card className="mb-6">
        <div className="flex items-start">
          {loadingUser ? <Loading /> :<Link href={`/users/${postUser?._id}`}> <Avatar img={postUser?.image} /> </Link>}
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

            {/* Add Answer Section */}
            <div className="mt-4 my-4">
              <ReactQuill
                value={answer}
                onChange={setAnswer}
                placeholder="Write your answer here..."
                theme="snow"
                className="mb-4 p-2 my-2 custom-quill"
                style={{ height: '150px' }}
              />
              <Button className="bg-blue-600 mt-4 text-white w-full" onClick={handleAnswerSubmit}>
                Submit Answer
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Answers</h3>
          {answers.length > 0 ? (
            answers.map((answer) => (
              <Card className="mb-4" key={answer._id}>
                <div className="flex items-start">
                  <Avatar img={answer.image || "https://randomuser.me/api/portraits/women/2.jpg"} />
                  <div className="ml-4 w-full">
                    <h4 className="font-medium">{answer.user}</h4>
                    <p className="text-gray-600 mt-1 mb-2">{answer.answer}</p>
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
                      <form onSubmit={(e) => handleCommentSubmit(e, answer._id)}>
                        <Textarea
                          name="comment"
                          placeholder="Write your comment here..."
                          rows={2}
                          className="mb-4"
                        />
                        <div className='flex items-center justify-between px-2 my-3'>
                          <Button type="submit" className="bg-blue-600 text-white">
                            Submit Comment
                          </Button>
                          <Link
                            href={{ pathname: `/allcomments/${answer._id}`}}
                          >
                            <p className='underline'>All comments</p>
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p>No answers yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionsDetailsCard;
