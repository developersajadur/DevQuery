"use client";

import CommentCard from "@/app/Components/Questions/CommentCard";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from 'axios';
import Loading from "@/app/Components/Loading/Loading"; 
import { useSession } from "next-auth/react";

const AllComments = ({ params }) => {
  const { answerId } = params; 
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const currentUserEmail = session?.user?.email;

  // Get the referrer query parameter
  const referrer = searchParams.get('referrer');

  // State to hold comments and loading state
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to calculate time ago from a date
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

  useEffect(() => {
    const fetchComments = async () => {
      if (!answerId) return; // If no answerId, skip fetching

      try {
        const response = await axios.get(`/questions/api/getcomments?answerId=${answerId}`);
        // Calculate time ago for each comment and update the state
        const commentsWithTime = response.data.comments.map(comment => ({
          ...comment,
          timeAgo: getTimeAgo(comment.createdAt),
        }));
        setComments(commentsWithTime); // Update the state with fetched comments
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false); // Ensure loading is false after fetching
      }
    };

    fetchComments(); // Fetch comments when component mounts or answerId changes
  }, [answerId]);

  // Loading state
  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1 className="font-bold text-[12px] lg:text-xl text-start mx-8 my-5">All comments</h1>
      {
        comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard 
              key={comment._id} // Use the comment ID as the key
              referrer={referrer}
              comment={comment}
              time={comment.timeAgo}
              currentUserEmail={currentUserEmail} 
            />
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )
      }
    </div>
  );
};

export default AllComments;
