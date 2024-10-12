import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import Image from "next/image";
import Link from "next/link";
import Loading from "../Loading/Loading";
import { FaBookmark } from "react-icons/fa";

// Helper function to get time ago
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
  const user = session?.user;
  const queryClient = useQueryClient();
  const questionId = question._id;

  const [liked, setLiked] = useState(false);
  const [unliked, setUnliked] = useState(false);
  const [likesCount, setLikesCount] = useState(question?.likes || 0);
  const [unlikesCount, setUnlikesCount] = useState(question?.unlikes || 0);
  
  const [likeStickerVisible, setLikeStickerVisible] = useState(false);
  const [unlikeStickerVisible, setUnlikeStickerVisible] = useState(false);
  
  useEffect(() => {
    if (session?.user) {
      const userEmail = session?.user?.email;

      if (question?.likedBy?.includes(userEmail)) {
        setLiked(true);
      }
      if (question?.unlikedBy?.includes(userEmail)) {
        setUnliked(true);
      }
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
      likeMutation.mutate();
      setLiked(false);
      setLikesCount((prev) => prev - 1);
      toast.success("Like removed!");
    } else {
      likeMutation.mutate();
      setLiked(true);
      setLikesCount((prev) => prev + 1);
      toast.success("Like added!");
      setLikeStickerVisible(true); // Show sticker animation
      setTimeout(() => setLikeStickerVisible(false), 1000); // Hide sticker after 1 second
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
    } else {
      unlikeMutation.mutate();
      setUnliked(true);
      setUnlikesCount((prev) => prev + 1);
      toast.success("Unlike added!");
      setUnlikeStickerVisible(true); // Show sticker animation
      setTimeout(() => setUnlikeStickerVisible(false), 1000); // Hide sticker after 1 second
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
      email: user.email,
      id: question._id,
      title: question.title,
    };
    try {
      const res = await axios.post(postBookmark, bookMark);
      if (res.status === 200) {
        toast.success("Added the bookmark");
      }
      if (res.status === 404) {
        toast.error("Already Added");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding bookmark");
    }
  };

  return (
    <div className="relative p-6 w-full max-w-3xl border-t border-[#A1D6B2]">
      <div className="flex items-center justify-between mb-4">
        <div className='flex justify-between'>
          <div className="flex items-center">
            <Image
              className="w-10 h-10 rounded-full"
              src={session?.user?.image || "/default-avatar.png"}
              height={40}
              width={40}
              alt="User Avatar"
            />
            <div className="ml-3">
              <Link href={`/users/${session?.user?._id}`} className="text-lg font-semibold text-blue-500">
                {session?.user?.name || "Unknown User"}
              </Link>
              <p className="text-sm text-gray-500">Asked: {getTimeAgo(question.createdAt)}</p>
            </div>
          </div>
          <div>
            <button onClick={buttonForBookmark}><FaBookmark /></button>
          </div>
        </div>
      </div>

      <Link href={`/questions/${questionId}`} className="text-xl md:text-2xl font-semibold text-[#131842] hover:text-[#3FA2F6]">
        {question?.title}
      </Link>

      <p className="text-gray-700 mb-4">
        {question.description ? question.description.slice(0, 80) : ""}...
      </p>

      <div className="flex flex-col md:flex-row gap-10 justify-between items-center">
        <div className="flex gap-5 items-center">
          <div className="flex items-center text-gray-500">
            <button 
              onClick={handleLikeToggle} 
              className={`text-blue-500 text-2xl transition-transform duration-300 ease-in-out ${liked ? 'scale-125' : 'hover:scale-110'}`}>
              {liked ? <AiFillLike className="mr-1" /> : <AiOutlineLike className="mr-1" />}
              {likesCount}
            </button>
            <button 
              onClick={handleUnlikeToggle} 
              className={`ml-4 text-red-600 text-2xl transition-transform duration-300 ease-in-out ${unliked ? 'scale-125' : 'hover:scale-110'}`}>
              {unliked ? <AiFillDislike className="mr-1" /> : <AiOutlineDislike className="mr-1" />}
              {unlikesCount}
            </button>

            {/* Like Sticker Animation with Emoji */}
            {likeStickerVisible && (
              <div className="absolute text-5xl animate-bounce transition-transform duration-1000">
                🎉
              </div>
            )}
            
            {/* Unlike Sticker Animation with Emoji */}
            {unlikeStickerVisible && (
              <div className="absolute text-5xl animate-bounce transition-transform duration-1000">
                👎
              </div>
            )}
          </div>

          {/* Add any other icons or stats you want to include */}
        </div>
      </div>
    </div>
  );
};

export default QuestionsCard;
