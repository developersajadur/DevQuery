import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike, AiOutlineEye } from "react-icons/ai";
import Image from "next/image";
import Link from "next/link";
import Loading from "../Loading/Loading";
import { FaBookmark } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

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
  const userId = session?.user?.id
  const userEmail = session?.user?.email;
  const questionId = question._id;
 
  const [liked, setLiked] = useState(false);
  const [unliked, setUnliked] = useState(false);
  const [likesCount, setLikesCount] = useState(question?.likes || 0);
  const [unlikesCount, setUnlikesCount] = useState(question?.unlikes || 0);
  // const [viewCount, setViewCount] = useState(question?.views || 0);

  // Fetch user by email
  const { data: user2, isLoading } = useQuery({
    queryKey: ['user', question.userEmail],
    queryFn: () => axios.get(`/users/api/get-one?email=${question?.userEmail}`).then(res => res.data.user),
    enabled: !!question.userEmail
  });

  useEffect(() => {
    if (session?.user) { 
      setLiked(question?.likedBy?.includes(userEmail));
      setUnliked(question?.unlikedBy?.includes(userEmail));
    }
  }, [session?.user, question, userEmail]);


  const handleLikeToggle = async () => {
    const isCurrentlyLiked = liked;
    const newLikesCount = isCurrentlyLiked ? likesCount - 1 : likesCount + 1;

    setLiked(!liked);
    setUnliked(false);
    setLikesCount(newLikesCount);
    if (unliked) setUnlikesCount(unlikesCount - 1);

    try {
      const url = `${process.env.NEXT_PUBLIC_WEB_URL}/Components/Questions/api/likes/${questionId}`;
      await axios.put(url, { questionId, user: session?.user });
      toast.success(isCurrentlyLiked ? "Like removed!" : "Like added!");
    } catch (error) {
      setLiked(isCurrentlyLiked);
      setLikesCount(likesCount);
      toast.error("Error while liking the question.");
    }
  };

  const handleUnlikeToggle = async () => {
    const isCurrentlyUnliked = unliked;
    const newUnlikesCount = isCurrentlyUnliked ? unlikesCount - 1 : unlikesCount + 1;

    setUnliked(!unliked);
    setLiked(false);
    setUnlikesCount(newUnlikesCount);
    if (liked) setLikesCount(likesCount - 1);

    try {
      const url = `${process.env.NEXT_PUBLIC_WEB_URL}/Components/Questions/api/unlikes/${questionId}`;
      await axios.put(url, { questionId, user: session?.user });
      toast.success(isCurrentlyUnliked ? "Unlike removed!" : "Unlike added!");
    } catch (error) {
      setUnliked(isCurrentlyUnliked);
      setUnlikesCount(unlikesCount);
      toast.error("Error while unliking the question.");
    }
  };

  if (status === "loading" || isLoading) {
    return <Loading />;
  }

  if (status === "error") {
    toast.error("Error fetching user data.");
    return null;
  }


  const buttonForBookmark = async () => {
    const postBookmark = `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/post`;
    const bookMark = {
      userId,
      email: userEmail,
      questionId: question?._id,
      title: question?.title,
    };

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
          toast.error("Error adding bookmark");
        }
      }
    }
  };

  return (
    <div className="flex justify-center ">
      <div className="relative p-6 py-16 w-full bg-white border-b border-gray-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Image
              className="w-12 h-12 rounded-full border-2 border-blue-500"
              src={user2?.image || "/default-avatar.png"}
              height={48}
              width={48}
              alt="User Avatar"
            />
            <div className="ml-3">
              <Link href={`/users/${user2?._id}`} className="text-lg font-semibold text-blue-500 hover:underline transition-colors duration-200">
                {user2?.name || "Unknown User"}
              </Link>
              <p className="text-sm text-gray-500">Asked: {getTimeAgo(question.createdAt)}</p>
            </div>
          </div>
          <button onClick={buttonForBookmark} className="bg-blue-500 text-white rounded-lg px-3 py-2 hover:bg-blue-600 transition-colors duration-200">
            <FaBookmark size={20} />
          </button>
        </div>

        <Link href={`/questions/${questionId}`} className="text-2xl font-bold text-[#131842] hover:text-[#3FA2F6] transition-colors duration-200">
          {question?.title}
        </Link>

        <p className="text-gray-700 mb-4 text-lg font-semibold">
          {question.description ? question.description.slice(0, 80) : ""}...
        </p>

        <div className="flex flex-col md:flex-row gap-10 justify-between items-center">
          <div className="flex gap-5 items-center">
            <button
              onClick={handleLikeToggle}
              className={`flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg px-4 py-2 transition-transform duration-300 ease-in-out 
                ${liked ? 'opacity-100' : 'hover:opacity-80'}`}>
              {liked ? <AiFillLike className="mr-1" /> : <AiOutlineLike className="mr-1" />}
              <span className="font-semibold">{likesCount}</span>
            </button>

            <button
              onClick={handleUnlikeToggle}
              className={`flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg px-4 py-2 transition-transform duration-300 ease-in-out 
                ${unliked ? 'opacity-100' : 'hover:opacity-80'}`}>
              {unliked ? <AiFillDislike className="mr-1" /> : <AiOutlineDislike className="mr-1" />}
              <span className="font-semibold">{unlikesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsCard;
