"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { FiMail } from "react-icons/fi";
import Link from "next/link"; // Import Link for routing
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/Components/Loading/Loading";
import axios from "axios";
import { Button } from "flowbite-react";

const ProfilePage = ({ params }) => {
  const { data: session } = useSession();
  const sessionEmail = session?.user?.email;

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", params.id],
    queryFn: async () => {
      const fetchUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/users/api/${params.id}`;
      const response = await axios.get(fetchUrl);
      return response.data.user;
    },
    enabled: !!params.id,
  });

  // Handle loading state for user data
  if (isLoading) {
    return <Loading />;
  }

  // Handle error state for user data
  if (isError) {
    return <div>Error loading user data.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Profile Header */}
      <div className="bg-white shadow-md w-full md:w-3/4 lg:w-1/2 p-6 rounded-lg my-8">
        <div className="flex items-center space-x-6">
          {/* Image with fallback */}
          {user?.image ? (
            <Image
              className="rounded-full"
              height={100}
              width={100}
              alt={user?.name || "Profile Picture"}
              src={user?.image}
            />
          ) : (
            <div
              className="rounded-full bg-gray-300"
              style={{ height: 100, width: 100 }}
            ></div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="flex items-center text-gray-400 mt-2">
              <FiMail className="mr-2" /> {user?.email}
            </p>
          </div>
        </div>
        <div className="flex mt-4 space-x-4">
          <div>
            <p className="text-gray-500">Reputation</p>
            <p className="text-xl font-semibold">1,250</p>
          </div>
          <div>
            <p className="text-gray-500">Badges</p>
            <p className="text-xl font-semibold">
              Gold: 3, Silver: 7, Bronze: 10
            </p>
          </div>
        </div>
        {/* Update Profile Button */}
        {sessionEmail && user?.email && sessionEmail === user?.email && (
            <div className="flex gap-5 items-center">
          <div className="mt-6">
            <Link
              href={`/users/edit/${user._id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Update Profile
            </Link>
          </div>
          <Button onClick={() => signOut()} className="mt-6">
            LogOut
          </Button>
            </div>

        )}
      </div>

      {/* Profile Navigation Tabs */}
      <div className="bg-white shadow-md w-full md:w-3/4 lg:w-1/2 p-4 rounded-lg flex justify-around">
        <button className="text-blue-600 border-b-2 border-blue-600 pb-2">
          Questions
        </button>
        <button className="text-gray-500">Answers</button>
        <button className="text-gray-500">Bookmarks</button>
      </div>

      {/* Activity/Content Section */}
      <div className="bg-white shadow-md w-full md:w-3/4 lg:w-1/2 p-6 rounded-lg mt-6">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <div className="mt-4 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold">
              What is the difference between JavaScript and TypeScript?
            </h3>
            <p className="text-sm text-gray-500">Asked on September 22, 2024</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold">
              How to implement authentication in Next.js?
            </h3>
            <p className="text-sm text-gray-500">
              Answered on September 20, 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
