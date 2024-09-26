"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";

const getTimeAgo = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const differenceInMs = now - createdDate;

    // Calculate time differences in seconds, minutes, and hours
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

const QuestionsCard = ({ question }) => {
    console.log("user-det", question);
    const timeAgo = getTimeAgo(question?.createdAt);

    // like unlike system

    const { data: session } = useSession();
    const questionId = question._id;
    const [liked, setLiked] = useState(false);
    const [unliked, setUnliked] = useState(false);

    useEffect(() => {
        const userEmail = session?.user?.email;

        if (question?.likedBy?.includes(userEmail)) {
            setLiked(true);
        } else {
            setLiked(false);
            setUnliked(false);
        }
    }, [session?.user?.email, question]);

    useEffect(() => {
        const userEmail = session?.user?.email;

        if (question?.unlikedBy?.includes(userEmail)) {
            setUnliked(true);
        } else {
            setLiked(false);
            setUnliked(false);
        }
    }, [session?.user?.email, question]);

    const likeBtn = async () => {
        const user = session?.user;
        // console.log(question, user);

        const url = `${process.env.NEXT_PUBLIC_WEB_URL}/Components/Questions/api/likes/${questionId}`;

        try {
            const response = await axios.put(url, {
                questionId,
                user,
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Error liking the question:", error);
            return { error: error.response?.data?.message || "An error occurred" };
        }
    };

    const unlikeBtn = async () => {
        const user = session?.user;
        // console.log(question, user);

        const url = `${process.env.NEXT_PUBLIC_WEB_URL}/Components/Questions/api/unlikes/${questionId}`;

        try {
            const response = await axios.put(url, {
                questionId,
                user,
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Error liking the question:", error);
            return { error: error.response?.data?.message || "An error occurred" };
        }
    };

    return (
        <div>
            <div className="px-2 md:px-6 py-3 bg-[#d6d6d6] h-[150px] shadow-lg rounded-xl">
                <div className="flex items-center gap-3">
                    <Image className="rounded-xl  border-2 " src={question.image} height={10} width={40} alt="question image" />

                    <div className="flex flex-col gap-2 items-start">
                        <Link href={`questions/${question._id}`} className="text-xl md:text-2xl font-semibold text-[#131842] hover:text-[#3FA2F6]">
                            {question?.title}
                        </Link>
                        <p className="">{question?.description.slice(0, 80)}..</p>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-1 md:gap-4 text-xl md:text-3xl text-[#131842]">
                        <button onClick={likeBtn} className="flex items-center">
                            {liked ? <AiFillLike /> : <AiOutlineLike />}
                            <span className="text-base md:text-xl">{question?.likes}</span>
                        </button>
                        <button onClick={unlikeBtn} className="flex items-center border-[#17153B] pl-2 md:pl-4 border-l-[1px]">
                            {unliked ? <AiFillDislike /> : <AiOutlineDislike />}
                            <span className="text-base md:text-xl">{question?.unlikes}</span>
                        </button>
                    </div>

                    <div>
                        <h1 className="text-sm text-gray-600">Posted: {timeAgo}</h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionsCard;
