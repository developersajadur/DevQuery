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

    const { data: user, isLoading: loadingUser, error: userError } = useQuery({
        queryKey: ['user', question?.userId],
        queryFn: async () => {
            if (!question?.userId) return null; // Avoid unnecessary API call
            const response = await axios.get(`/users/api/get-one?userId=${question?.userId}`);
            return response.data.user;
        },
        enabled: !!question?.userId // Only fetch if userId is available
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

    // Like Mutation
    const likeMutation = useMutation({
        mutationFn: async () => {
            const url = `${process.env.NEXT_PUBLIC_WEB_URL}/Components/Questions/api/likes/${questionId}`;
            const response = await axios.put(url, { questionId, user: session?.user });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["questions", questionId]); // Update the query for questions
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
            queryClient.invalidateQueries(["questions", questionId]); // Update the query for questions
        },
        onError: () => {
            toast.error("Error while unliking the question.");
        },
    });

    const handleLikeToggle = () => {
        if (liked) {
            unlikeMutation.mutate(); // Call unlike function
            setLiked(false);
            setLikesCount((prev) => prev - 1);
            toast.success("Like removed!");
        } else {
            likeMutation.mutate(); // Call like function
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
            unlikeMutation.mutate(); // Call unlike function
            setUnliked(false);
            setUnlikesCount((prev) => prev - 1);
            toast.success("Unlike removed!");
        } else {
            likeMutation.mutate(); // Call like function
            setUnliked(true);
            setUnlikesCount((prev) => prev + 1);
            toast.success("Unlike added!");
        }

        if (liked) {
            setLiked(false);
            setLikesCount((prev) => prev - 1);
        }
    };

    if (loadingUser) {
        return <Loading />; // Show loading component while fetching user data
    }

    if (userError) {
        toast.error("Error fetching user data."); // Handle user fetch error
        return null; // Optionally handle error state
    }

    const handleBookmark = async () => {
      const postBookmarkUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/post`;
      const bookmarkData = {
        email: user.email,
        id: question._id,
        title: question.title,
        
      };
  
      try {
        const response = await axios.post(postBookmarkUrl, bookmarkData);
        if (response.status === 200) {
          console.log(response.data)
          toast.success("Added on the bookmark")
        }
        if(response.status === 404){
          toast.error("Already Added")
        }
      } catch (error) {
        console.error("Error adding bookmark:", error);
      }
    };


    return (
        <div className="p-6 w-full max-w-3xl border-t border-[#A1D6B2]">

            <div className='flex justify-between'>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <Image
                        className="w-10 h-10 rounded-full"
                        src={user?.image || "/default-avatar.png"}
                        height={40}
                        width={40}
                        alt="User Avatar"
                    />
                    <div className="ml-3">
                        <Link href={`/users/${user?._id}`} className="text-lg font-semibold text-blue-500">
                            {user?.name || "Unknown User"}
                        </Link>
                        <p className="text-sm text-gray-500">Asked: {getTimeAgo(question.createdAt)}</p>
                    </div>
                </div>
            </div>
            <div>
              <button onClick={handleBookmark}><FaBookmark /></button>
            </div>
            </div>

            <Link
                href={`/questions/${questionId}`}
                className="text-xl md:text-2xl font-semibold text-[#131842] hover:text-[#3FA2F6]"
            >
                {question?.title}
            </Link>

            <p className="text-gray-700 mb-4">
                {question.description ? question.description.slice(0, 80) : ""}...
            </p>

            <div className="flex flex-col md:flex-row gap-10 justify-between items-center">
            <div className="flex gap-5 items-center">
            <div className="flex items-center text-gray-500">
                    <button onClick={handleLikeToggle} className={`text-blue-500 text-2xl`}>
                        {liked ? <AiFillLike className="mr-1" /> : <AiOutlineLike className="mr-1" />}
                        {likesCount}
                    </button>
                    <button onClick={handleUnlikeToggle} className="ml-4 text-red-600 text-2xl">
                        {unliked ? <AiFillDislike className="mr-1" /> : <AiOutlineDislike className="mr-1" />}
                        {unlikesCount}
                    </button>
                </div>

                <div className="flex items-center">
                    <span className="mr-3">👁 {question?.views || 550} Views</span>
                    <span className="mr-3">{question?.answers || 40} Answers</span>
                </div>
            </div>
                <div className="w-full md:w-fit text-end">
                <Link href={`/questions/${questionId}`} className="bg-blue-500 w-full md:w-fit text-white px-4 py-2 rounded-md">
                        Answer
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default QuestionsCard;
