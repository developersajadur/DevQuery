"use client";

import { useQuery } from '@tanstack/react-query';
import { Avatar } from 'flowbite-react';
import Link from 'next/link';

const CommentCard = ({ comment, referrer, time, currentUserEmail }) => {
  // Fetch user by email
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', currentUserEmail],
    queryFn: () => axios.get(`/users/api/get-one?email=${currentUserEmail}`).then(res => res.data.user),
    enabled: !!currentUserEmail
  });

  return (
    <div className="max-w-[90%] mx-auto">
      {!isLoading ? ( // Ensure loading state is handled
        <div className="relative p-6 py-8 w-full bg-white border-b border-gray-300">
          <div className="flex items-center justify-between mb-4">
            <Link href={`${process.env.NEXT_PUBLIC_WEB_URL}/users/${user._id}`} className="flex items-center">
              <Avatar img={user?.image} />
              <div className="ml-3">
                <h4 className="text-lg font-semibold text-blue-500">{user?.name || "Unknown User"}</h4>
              </div>
            </Link>
          </div>

          <p className="text-gray-700 mb-4">
            <span className="text-xl font-bold">Comment: </span>
            <span className="text-lg font-semibold text-gray">{comment.comment}</span>
          </p>

          <div className="absolute bottom-2 right-2 text-sm text-blue-500">
            {time} {/* Display the calculated time ago */}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading user...</p> // Provide a loading message for the user
      )}

      {referrer && (
        <div className="my-6">
          <Link
            className="border rounded-md px-4 py-2 text-xl font-semibold bg-blue-400 hover:bg-blue-600 cursor-pointer"
            href={referrer}
          >
            Back
          </Link>
        </div>
      )}
    </div>
  );
};

export default CommentCard;
