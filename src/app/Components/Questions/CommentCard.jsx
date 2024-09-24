"use client";
import { Avatar, Button, Card, Textarea } from 'flowbite-react';
import React, { useState } from 'react';
import { AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';

const CommentCard = () => {
    const [comment, setComment] = useState("");
      
  const handleCommentSubmit = () => {
    // Handle comment submission logic
    console.log("Submitted Comment:", comment);
    setComment(""); // Clear input after submission
  };
    return (
        <div>
              <Card className="mb-4">
          <div className="flex items-start">
            <Avatar img="https://randomuser.me/api/portraits/men/3.jpg" />
            <div className="ml-4 w-full">
              <h4 className="font-medium">Mark Johnson</h4>
              <p className="text-gray-600 mt-1 mb-2">
                One more suggestion is to avoid prop drilling and use context or state management libraries like Redux or Zustand for global state management.
              </p>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <p className="text-gray-500 text-sm">Commented on Sep 20, 2024</p>
                <div className="flex items-center">
                  <Button.Group>
                    <Button color="light">
                      <AiOutlineLike size={20} /> Like
                    </Button>
                    <Button color="light">
                      <AiOutlineDislike size={20} /> Dislike
                    </Button>
                  </Button.Group>
                </div>
              </div>

              {/* Add Comment Section for Each Answer */}
              <div className="mt-4">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your comment here..."
                  rows={2}
                  className="mb-4"
                />
                <Button className="bg-blue-600 text-white" onClick={handleCommentSubmit}>
                  Submit Comment
                </Button>
              </div>
            </div>
          </div>
        </Card>
        </div>
    );
};

export default CommentCard;