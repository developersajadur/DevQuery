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
  const currentUserName = session?.user?.name || "";

  const url = usePathname();

  const timeAgo = getTimeAgo(questionDetails?.createdAt);
  const { title, description, tags, likes, unlikes } = questionDetails;
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch post user details by email
  const { data: postUser, isLoading: loadingUser, error: userError } = useQuery({
    queryKey: ['user', questionDetails?.userEmail],
    queryFn: async () => {
      if (!questionDetails?.userEmail) return null;
      const response = await axios.get(`/users/api/get-one?email=${questionDetails?.userEmail}`);
      return response.data.user;
    },
    enabled: !!questionDetails?.userEmail
  });

  // Fetch answers for the question
  const { data: answers, isLoading: answersLoading, isError, refetch } = useQuery({
    queryKey: ['answers', questionDetails._id],
    queryFn: async () => {
      const response = await axios.get(`/questions/api/getanswer?question_id=${questionDetails._id}`);
      return response.data.answers;
    },
    enabled: !!questionDetails._id
  });

  const handleLikeToggle = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleUnlikeToggle = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleAnswerSubmit = async () => {
    const plainTextAnswer = stripHtml(answer);
    const answerData = {
      ans: plainTextAnswer,
      question_id: questionDetails._id,
      userEmail: currentUserEmail,
      image: currentUserImage
    };
  
    if (!session?.user) {
      return router.push('/login');
    }
  
    if (plainTextAnswer.trim() === "") {
      toast.error("Please write an answer before submitting.");
      return;
    }
  
    try {
      const postAnswer = await axios.post('/questions/api/answeradd', answerData);
      
      const sentToData = {
        questionUserEmail: questionDetails.userEmail,
        type: "answer",
        answerBy: currentUserEmail,
        date: new Date().toISOString(),  
        content: `${currentUserName} Answered Your Question`,
        questionLink: `/questions/${questionDetails._id}`
      };
  
      // Post the notification
      const postNotification = await axios.post("/users/api/notifications/post", sentToData);
      console.log(postNotification);
      
      if (postNotification.status === 200) {
        refetch();  // Refresh the answers list
        toast.success("Answer Successfully Submitted!");
        setAnswer('');  // Clear the answer input
      }
  
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("An error occurred while submitting your answer.");
    }
  };

  const handleCommentSubmit = async (e, answerId) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const comment = formData.get('comment');

    const com = {
      comment,
      userEmail: currentUserEmail,
      image: currentUserImage,
      answerId
    };

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
          {loadingUser ? (
            <Loading />
          ) : (
            <Link href={`/users/${postUser?.email}`}>
              <Avatar img={postUser?.image} />
            </Link>
          )}
          <div className="ml-4 w-full">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="flex items-center space-x-2 mb-2">
              {tags?.map((tag, index) => (
                <Badge className="mr-2" key={index} color="info">
                  #{tag}
                </Badge>
              ))}
            </div>
            <p className="text-gray-600 mb-4">{description}</p>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <p className="text-gray-500 my-2 text-sm">Posted: {timeAgo}</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <AiOutlineLike size={20} className="text-blue-500" />
                  <span className="ml-1 text-sm">{likes} Likes</span>
                </div>
                <div className="flex items-center">
                  <AiOutlineDislike size={20} className="text-red-500" />
                  <span className="ml-1 text-sm">{unlikes} Dislikes</span>
                </div>
              </div>
            </div>

            <div className="mt-4 my-4">
              <ReactQuill
                value={answer}
                onChange={setAnswer}
                placeholder="Write your answer here..."
                theme="snow"
                className="mb-4 p-2 my-2 custom-quill"
                style={{ height: '150px' }}
              />
              <Button
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:bg-gradient-to-l text-white w-full mt-16"
                onClick={handleAnswerSubmit}
              >
                Submit Answer
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">Answers</h3>
        {answers.length > 0 ? (
          answers.map((answer) => (
            <Card
              className="mb-6 p-6 w-full bg-white shadow-lg border border-gray-200 rounded-lg"
              key={answer._id}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start w-full">
                <div className="flex items-start w-full sm:w-auto">
                  <Avatar
                    img={answer.image || "https://randomuser.me/api/portraits/women/2.jpg"}
                    className="w-14 h-14 "
                  />
                  <div className="ml-5 w-full">
                    <h4 className="font-medium text-blue-600 text-lg">{answer.userEmail}</h4>
                    <p className="text-gray-700 mb-4"><span className="text-xl font-bold">Answer: </span><span className="text-lg font-semibold text-gray">{answer.answer}</span></p>
                  </div>
                </div>
                <div className="sm:ml-auto mt-4 pt-4 sm:mt-0">
                  <p className="text-gray-500 text-sm">
                    Answered on {getTimeAgo(answer.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLikeToggle(answer._id)}
                    className={`flex items-center ${liked ? "text-blue-500" : "text-gray-500"} `}
                  >
                    <AiOutlineLike className="mr-1" size={20} />
                    <span>{answer.likes?.length || 0}</span>
                  </button>
                  <button
                    onClick={() => handleUnlikeToggle(answer._id)}
                    className={`flex items-center ${disliked ? "text-red-500" : "text-gray-500"} `}
                  >
                    <AiOutlineDislike className="mr-1" size={20} />
                    <span>{answer.unlikes?.length || 0}</span>
                  </button>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <form onSubmit={(e) => handleCommentSubmit(e, answer._id)} className="space-y-2">
                  <Textarea
                    name="comment"
                    placeholder="Add a comment..."
                    required
                    rows={2}
                  />
                  <Button type="submit" className="bg-blue-500 text-white">Submit Comment</Button>
                </form>
              </div>
            </Card>
          ))
        ) : (
          <p>No answers yet.</p>
        )}
      </div>
    </div>
  );
};

export default QuestionsDetailsCard;
