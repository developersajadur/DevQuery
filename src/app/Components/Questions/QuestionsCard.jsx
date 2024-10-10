import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { BsBookmarkStarFill } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";

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
  const queryClient = useQueryClient();
  const questionId = question._id;

  const [liked, setLiked] = useState(false);
  const [unliked, setUnliked] = useState(false);
  const [likesCount, setLikesCount] = useState(question?.likes || 0);
  const [unlikesCount, setUnlikesCount] = useState(question?.unlikes || 0);

  useEffect(() => {
    const userEmail = session?.user?.email;

    if (question?.likedBy?.includes(userEmail)) {
      setLiked(true);
    }
    if (question?.unlikedBy?.includes(userEmail)) {
      setUnliked(true);
    }
  }, [session?.user?.email, question]);

  // Like Mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_WEB_URL}/Components/Questions/api/likes/${questionId}`;
      const response = await axios.put(url, { questionId, user: session?.user });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["questionLikes", questionId]);
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
      queryClient.invalidateQueries(["questionLikes", questionId]);
    },
    onError: () => {
      toast.error("Error while unliking the question.");
    },
  });

  const handleLikeToggle = () => {
    if (liked) {
      // Unlike if already liked
      likeMutation.mutate();
      setLiked(false);
      setLikesCount((prev) => prev - 1);
      toast.success("Like removed!");
    } else if (!unliked) {
      // Like if not unliked
      likeMutation.mutate();
      setLiked(true);
      setLikesCount((prev) => prev + 1);
      toast.success("Like added!");
    }

    // If unliked, remove unlike
    if (unliked) {
      setUnliked(false);
      setUnlikesCount((prev) => prev - 1);
    }
  };

  const handleUnlikeToggle = () => {
    if (unliked) {
      // Remove unlike if already unliked
      unlikeMutation.mutate();
      setUnliked(false);
      setUnlikesCount((prev) => prev - 1);
      toast.success("Unlike removed!");
    } else if (!liked) {
      // Unlike if not liked
      unlikeMutation.mutate();
      setUnliked(true);
      setUnlikesCount((prev) => prev + 1);
      toast.success("Unlike added!");
    }

    // If liked, remove like
    if (liked) {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
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
              href={`/questions/${question._id}`}
              className="text-xl md:text-2xl font-semibold text-[#131842] hover:text-[#3FA2F6]"
            >
              {question?.title}
            </Link>
            <p>{question?.description ? question.description.slice(0, 80) : ""}...</p>
          </div>
        </div>
        <div>
          <button className="text-2xl text-[#17153B] hover:text-[#4a47e6]">
            <BsBookmarkStarFill />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-1 md:gap-4 text-xl md:text-3xl text-[#131842]">
          {/* Like Button */}
          <button
            onClick={handleLikeToggle}
            className={`flex items-center ${liked ? "text-blue-500" : "text-gray-500"} hover:text-blue-500`}
          >
            {liked ? <AiFillLike /> : <AiOutlineLike />}
            <span className="text-base md:text-xl ml-1">{likesCount}</span>
          </button>

          {/* Unlike Button */}
          <button
            onClick={handleUnlikeToggle}
            className={`flex items-center border-[#17153B] pl-2 md:pl-4 border-l-[1px] ${unliked ? "text-red-500" : "text-gray-500"} hover:text-red-500`}
          >
            {unliked ? <AiFillDislike /> : <AiOutlineDislike />}
            <span className="text-base md:text-xl ml-1">{unlikesCount}</span>
          </button>
        </div>

        <div>
          <h1 className="text-sm text-gray-600">Posted: {getTimeAgo(question.createdAt)}</h1>
        </div>
      </div>
    </div>
  );
};

export default QuestionsCard;
