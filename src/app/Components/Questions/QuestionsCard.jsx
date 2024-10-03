"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AiFillDislike,
  AiFillLike,
  AiOutlineDislike,
  AiOutlineLike,
} from "react-icons/ai";
import { BsBookmarkStarFill } from "react-icons/bs";

// Helper function to get time ago
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
    return `${days} day(s) ${remainingHours} hour(s) ago`;
  } else if (hours > 0) {
    return `${hours} hour(s) ${remainingMinutes} minute(s) ago`;
  }
  return `${remainingMinutes} minute(s) ago`;
};

const QuestionsCard = ({ question }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const queryClient = useQueryClient();
  const questionId = question._id;

  // Bookmark Function
  const handleBookmark = async () => {
    const postBookmarkUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/post`;
    const bookmarkData = {
      email: user.email,
      id: question._id,
      title: question.title,
      image: question.image,
      description: question?.description,
      likes: question?.likes,
      unlikes: question?.unlikes,
    };

    try {
      const response = await axios.post(postBookmarkUrl, bookmarkData);
      if (response.status === 200) {
        alert("Bookmark added successfully!");
      }
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };

  const timeAgo = getTimeAgo(question?.createdAt);

  const [liked, setLiked] = useState(false);
  const [unliked, setUnliked] = useState(false);

  // Fetch likes and unlikes
  const { data: questionData, isLoading } = useQuery({
    queryKey: ["questionLikes", questionId],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/${questionId}`);
      return res.data;
    },
  });

  useEffect(() => {
    const userEmail = session?.user?.email;

    if (question?.likedBy?.includes(userEmail)) {
      setLiked(true);
    }
    if (question?.unlikedBy?.includes(userEmail)) {
      setUnliked(true);
    }
  }, [session?.user?.email, question]);

  // Mutation for liking the question
  const likeMutation = useMutation({
    mutationFn: async () => {
      const user = session?.user;
      const url = `${process.env.NEXT_PUBLIC_WEB_URL}/Components/Questions/api/likes/${questionId}`;
      const response = await axios.put(url, { questionId, user });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["questionLikes", questionId]);
    },
  });

  // Mutation for unliking the question
  const unlikeMutation = useMutation({
    mutationFn: async () => {
      const user = session?.user;
      const url = `${process.env.NEXT_PUBLIC_WEB_URL}/Components/Questions/api/unlikes/${questionId}`;
      const response = await axios.put(url, { questionId, user });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["questionLikes", questionId]);
    },
  });

  const handleLike = () => {
    if (!liked) {
      likeMutation.mutate();
    }
  };

  const handleUnlike = () => {
    if (!unliked) {
      unlikeMutation.mutate();
    }
  };

  return (
    <div className="px-2 md:px-6 py-3 bg-[#d6d6d6] h-auto shadow-lg rounded-xl">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <Image
            className="rounded-xl border-2"
            src={question.image}
            height={40}
            width={40}
            alt="question image"
          />

          <div className="flex flex-col gap-2 items-start">
            <Link
              href={`questions/${question._id}`}
              className="text-xl md:text-2xl font-semibold text-[#131842] hover:text-[#3FA2F6]"
            >
              {question?.title}
            </Link>

            <p className="">
              {question?.description ? question.description.slice(0, 80) : ""}...
            </p>
          </div>
        </div>

        <div>
          <button onClick={handleBookmark} className="text-2xl text-[#17153B] hover:text-[#3FA2F6]">
            <BsBookmarkStarFill />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-1 md:gap-4 text-xl md:text-3xl text-[#131842]">
          <button onClick={handleLike} className="flex items-center">
            {liked ? <AiFillLike /> : <AiOutlineLike />}
            <span className="text-base md:text-xl">{questionData?.likes}</span>
          </button>

          <button onClick={handleUnlike} className="flex items-center border-[#17153B] pl-2 md:pl-4 border-l-[1px]">
            {unliked ? <AiFillDislike /> : <AiOutlineDislike />}
            <span className="text-base md:text-xl">{questionData?.unlikes}</span>
          </button>
        </div>

        <div>
          <h1 className="text-sm text-gray-600">Posted: {timeAgo}</h1>
        </div>
      </div>
    </div>
  );
};

export default QuestionsCard;
