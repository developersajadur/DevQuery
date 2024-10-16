"use client";
import axios from 'axios';
import { Avatar, Card } from 'flowbite-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Loading from '../Loading/Loading';

const CommentCard = ({ answerId, referrer }) => {
  const [comments, setComments] = useState([]); // Store comments from the backend
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
      try {
        const response = await axios.get(`/questions/api/getcomments?answerId=${answerId}`);
        setComments(response.data.comments); // Update the state with fetched comments
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false); // Ensure loading is false after fetching
      }
    };

    if (answerId) {
      fetchComments(); // Fetch comments if answerId is provided
    } else {
      setLoading(false); // If no answerId, stop loading
    }
  }, [answerId]);

  // Loading state
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-[90%] mx-auto">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div className="relative p-6 py-8 w-full bg-white border-b border-gray-300 " key={comment._id}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
              <Avatar img={comment.image || "https://randomuser.me/api/portraits/men/3.jpg"} />
                <div className="ml-3">
                  <h4 className="text-lg font-semibold text-blue-500">{comment.user}</h4>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4"><span className="test-4xl font-bold">Comment:</span>{comment.comment}</p>

            <div className="absolute bottom-2 right-2 text-sm text-blue-500">
              {getTimeAgo(comment.createdAt)}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}

      {referrer ? (
        <div className="my-6">
          <Link
            className="border rounded-md px-4 py-2 text-xl font-semibold bg-blue-400 hover:bg-blue-600 cursor-pointer"
            href={referrer}
          >
            Back
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default CommentCard;
