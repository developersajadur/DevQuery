"use client";
import axios from 'axios';
import { Avatar, Button, Card } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';
import { ThreeCircles } from 'react-loader-spinner';
;

const CommentCard = ({ answerId }) => {
  const [comments, setComments] = useState([]); // Store comments from the backend
  const [loading, setLoading] = useState(true);
  

  // Function to calculate time ago from a date
  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt); // Use the createdAt parameter
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
        // Fetch comments using GET and pass the answerId as a query parameter
        const response = await axios.get(`/questions/api/getcomments?answerId=${answerId}`);
        // Assuming you updated the API route
        setComments(response.data.comments); // Update the state with fetched comments
        console.log("Fetched comments:", response.data.comments); // Log the fetched comments
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
    return (
      <div className="flex justify-center items-center mt-24">
        <ThreeCircles
          visible={true}
          height="50"
          width="50"
          color="#4fa94d"
          ariaLabel="three-circles-loading"
        />
      </div>
    );
  }

  return (
    <div className='max-w-[90%] mx-auto'>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Card className="mb-4" key={comment._id}>
            <div className="flex items-start">
              <Avatar img={comment.image || "https://randomuser.me/api/portraits/men/3.jpg"} />
              <div className="ml-4 w-full">
                <h4 className="font-medium">{comment.user}</h4>
                <p className="text-gray-600 mt-1 mb-2">{comment.comment}</p>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <p className="text-gray-500 text-sm">Commented {getTimeAgo(comment.createdAt)}</p>
                  <div className="flex items-center">
                    <Button.Group>
                      <Button color="light">
                        <AiOutlineLike size={20} /> {comment.likes} Like
                      </Button>
                      <Button color="light">
                        <AiOutlineDislike size={20} /> {comment.unlikes} Dislike
                      </Button>
                    </Button.Group>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}
    </div>
  );
};

export default CommentCard;
