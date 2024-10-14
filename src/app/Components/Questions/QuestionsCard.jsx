"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import Image from "next/image";
import Link from "next/link";
import Loading from "../Loading/Loading";
import { FaBookmark } from "react-icons/fa";

const getTimeAgo = (createdAt) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const differenceInMs = now - createdDate;
  
  const minutes = Math.floor(differenceInMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day(s) ${hours % 24} hour(s) ago`;
  } else if (hours > 0) {
    return `${hours} hour(s) ${minutes % 60} minute(s) ago`;
  }
  return `${minutes % 60} minute(s) ago`;
};

const QuestionsCard = ({ question }) => {
  const { data: session, status } = useSession();
  const currentUser = session?.user;
  const queryClient = useQueryClient();
  const questionId = question._id;

  const [liked, setLiked] = useState(false);
  const [unliked, setUnliked] = useState(false);
  const [likesCount, setLikesCount] = useState(question?.likes || 0);
  const [unlikesCount, setUnlikesCount] = useState(question?.unlikes || 0);

  // Fetch user data using Tanstack Query
  const { data: user } = useQuery({
    queryKey: ['user', question.userId],
    queryFn: () => axios.get(`/users/api/get-one?userId=${question?.userId}`).then(res => res.data.user),
    enabled: !!question.userId
  });

  useEffect(() => {
    if (session?.user) {
      const userEmail = session?.user?.email;
      setLiked(question?.likedBy?.includes(userEmail));
      setUnliked(question?.unlikedBy?.includes(userEmail));
    }
  }, [session?.user, question]);

  // Like Mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_WEB_URL}/Components/Questions/api/likes/${questionId}`;
      const response = await axios.put(url, { questionId, user: session?.user });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionLikes", questionId] });
    },
    onError: () => {
      toast.error("Error while liking the question.");
    },
  });

  // Unlike Mutation
  const unlikeMutation = useMutation({
    mutationFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_WEB_URL}/Components/Questions/api/unlikes/${questionId}`;
      const response = await axios.put(url, { questionId, user: session?.user });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionLikes", questionId] });
      
    },
    onError: () => {
      toast.error("Error while unliking the question.");
    },
  });

  const handleLikeToggle = () => {
    if (liked) {
      likeMutation.mutate();
      setLiked(false);
      setLikesCount((prev) => prev - 1);
      toast.success("Like removed!");
    } else if (!unliked) {
      likeMutation.mutate();
      setLiked(true);
      setLikesCount((prev) => prev + 1);
      toast.success("Like added!");
    }

    if (unliked) {
      setUnliked(false);
      setUnlikesCount((prev) => prev - 1);
    }
  };

  const handleUnlikeToggle = () => {
    if (unliked) {
      unlikeMutation.mutate();
      setUnliked(false);
      setUnlikesCount((prev) => prev - 1);
      toast.success("Unlike removed!");
    } else if (!liked) {
      unlikeMutation.mutate();
      setUnliked(true);
      setUnlikesCount((prev) => prev + 1);
      toast.success("Unlike added!");
    }

    if (liked) {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    }
  };

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "error") {
    toast.error("Error fetching user data.");
    return null;
  }

  const buttonForBookmark = async () => {
    const postBookmark = `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/post`;
    const bookMark = {
      email: currentUser.email,
      userId: currentUser.id,
      questionId: question?._id,
      title: question?.title,
    }
  
    try {
      const res = await axios.post(postBookmark, bookMark);
      if (res.status === 200) {
        toast.success("Added the bookmark");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
         toast.error("Already bookmarked");
        } else if (error.response.status === 400) {
          toast.error("Please try again");
        } else {
          toast.success("Added to the bookmark");
        }
      }
    }
  };

  return (
    <div className="flex justify-center py-6">
      <div className="p-6 w-full max-w-3xl border border-gray-200 rounded-lg shadow-lg bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex justify-between">
            <div className="flex items-center">
              <Image
                className="w-10 h-10 rounded-full"
                src={user?.image || "/default-avatar.png"}
                height={40}
                width={40}
                alt="User Avatar"
              />
              <div className="ml-3">
                <Link href={`/users/${user?._id}`} className="text-lg font-semibold text-blue-500 hover:underline">
                  {user?.name || "Unknown User"}
                </Link>
                <p className="text-sm text-gray-500">Asked: {getTimeAgo(question.createdAt)}</p>
              </div>
            </div>
            <div>
              <button onClick={buttonForBookmark}>
                <FaBookmark className="text-gray-500 hover:text-blue-500 transition-colors duration-200" />
              </button>
            </div>
          </div>
        </div>

        <Link href={`/questions/${questionId}`} className="text-2xl font-bold text-[#131842] hover:text-[#3FA2F6] transition-colors duration-200">
          {question?.title}
        </Link>

        <p className="text-gray-700 mb-4 text-lg font-medium">
          {question.description ? question.description.slice(0, 80) : ""}...
        </p>

        <div className="flex flex-col md:flex-row gap-10 justify-between items-center">
          <div className="flex gap-5 items-center">
            <div className="flex items-center">
              <button
                onClick={handleLikeToggle}
                className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-semibold transition-transform duration-300 ease-in-out ${
                  liked ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-blue-500 hover:bg-blue-600'
                }`}
                aria-label={liked ? "Unlike" : "Like"}>
                {liked ? <AiFillLike className="text-2xl" /> : <AiOutlineLike className="text-2xl" />}
                <span className="ml-2">{likesCount}</span>
              </button>
            </div>

            <div className="flex items-center">
              <button
                onClick={handleUnlikeToggle}
                className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-semibold transition-transform duration-300 ease-in-out ${
                  unliked ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-red-500 hover:bg-red-600'
                }`}
                aria-label={unliked ? "Remove Unlike" : "Unlike"}>
                {unliked ? <AiFillDislike className="text-2xl" /> : <AiOutlineDislike className="text-2xl" />}
                <span className="ml-2">{unlikesCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsCard;
