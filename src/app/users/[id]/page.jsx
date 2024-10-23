"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { FiMail } from "react-icons/fi";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/Components/Loading/Loading";
import axios from "axios";
import { Button } from "flowbite-react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import React, { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const ProfilePage = ({ params }) => {
  const { data: session } = useSession();
  const sessionEmail = session?.user?.email;
  const [data, setData] = useState([]);
  const bookUser = session?.user;
  // console.log(bookUser?.email);
  

  useEffect(() => {
    const fetchBook = async () => {
      if (bookUser?.id) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/getBook?userId=${bookUser.id}`);
          if (response.status === 200) {
            setData(response.data.books);
          } else {
            console.error('Error fetching');
          }
        } catch (error) {
          console.error("Error", error);
        }
      }
    };

    fetchBook();
  }, [bookUser]);


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

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Error loading user data.</div>;
  }

  const handleForDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this bookmark?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/bookmarks/${id}`);
          if (response.status === 200) {
            toast.success(response.data.message);
            setData((prevBookmarks) => prevBookmarks.filter((data) => data._id !== id));
          } else {
            toast.error(`Error: ${response.data.message}`);
          }
        } catch (error) {
          if (error.response) {
            toast.error(`Error: ${error.response.data.message || "Something went wrong."}`);
          } else {
            console.error("Error deleting bookmark:", error);
            toast.error("An unexpected error occurred.");
          }
        }
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="bg-white shadow-lg w-full lg:w-full p-8 rounded-lg my-8 mx-auto">
        <div className="flex items-center space-x-6">
          {user?.image ? (
            <Image
              className="rounded-full"
              height={100}
              width={100}
              alt={user?.name || "Profile Picture"}
              src={user?.image}
            />
          ) : (
            <div className="rounded-full bg-gray-300 h-24 w-24 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{user?.name}</h1>
            <p className="flex items-center text-gray-600 mt-2 text-lg">
              <FiMail className="mr-2" /> {user?.email}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <button className="bg-blue-600 rounded-xl px-6 py-3 font-semibold text-xl text-white transition-transform transform hover:scale-105">Follow</button>
        </div>
        <div className="flex items-center mt-6 space-x-4">
          <div>
            <p className="text-gray-500">Reputation</p>
            <p className="text-xl font-semibold">1,250</p>
          </div>
          <div>
            <p className="text-gray-500">Badges</p>
            <p className="text-xl font-semibold">Gold: 3, Silver: 7, Bronze: 10</p>
          </div>
          <div>
            <Link
              href={{
                pathname: "/chat",
                query: {
                  targetUserID: user._id,
                  targetUserName: user.name,
                  targetUserImage: user.image || "/default-avatar.png", // Use a default avatar if no image
                },
              }}
              className="border-2 border-blue-600 rounded-xl px-6 py-3 font-semibold text-xl text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
            >
              Message
            </Link>
          </div>
        </div>
        {sessionEmail && user?.email && sessionEmail === user?.email && (
          <div className="flex gap-5 items-center mt-6">
            <Link
              href={`/users/edit/${user._id}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Update Profile
            </Link>
            <Button onClick={() => signOut({ callbackUrl: "/login" })} className=" bg-red-600 px-6 py-1 ">
              LogOut
            </Button>
          </div>
        )}
      </div>

      <Tabs className="w-full lg:w-full mt-6">
        <TabList className="flex justify-between gap-8 content-center mb-4">
          <Tab><button className="text-blue-600 font-semibold text-lg">Questions</button></Tab>
          <Tab><button className="text-gray-500 font-semibold text-lg">Answers</button></Tab>
          <Tab><button className="text-gray-500 font-semibold text-lg">Bookmarks</button></Tab>
        </TabList>

        <TabPanel>
          <div className="bg-white shadow-lg w-full p-6 rounded-lg mt-6">
            <h2 className="text-2xl font-semibold">Recent Activity</h2>
            <div className="mt-4 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg">What is the difference between JavaScript and TypeScript?</h3>
                <p className="text-sm text-gray-500">Asked on September 22, 2024</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg">How to implement authentication in Next.js?</h3>
                <p className="text-sm text-gray-500">Answered on September 20, 2024</p>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="bg-white shadow-lg w-full p-6 rounded-lg mt-6">
            <h2 className="text-2xl font-semibold">Answers</h2>
            {/* Add content for answers here */}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="bg-white shadow-lg w-full p-6 rounded-lg mt-6">
            <h2 className="text-2xl font-semibold text-center"><em>Bookmark</em></h2>
            <p className="text-center font-semibold"><em>Here are the questions you bookmarked</em></p>
            <div className="mt-4">
              <table className="min-w-full">
                <thead className="bg-gray-200">
                  <tr className="text-left">
                    <th className="p-3 text-lg">Title</th>
                    <th className="p-3 text-lg"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(dt => (
                    <tr key={dt._id} className='border-b border-opacity-20 hover:bg-gray-100'>
                      <td className="p-3 w-3/4">
                        <p className="text-xl font-bold">{dt.title}</p>
                      </td>
                      <td className="p-3 flex justify-end items-center space-x-2">
                        <Link href={`/questions/${dt.questionId}`}>
                          <Button className="bg-blue-500 text-white hover:bg-blue-600 transition">View</Button>
                        </Link>
                        <Button
                          onClick={() => handleForDelete(dt._id)}
                          className="bg-red-500 text-white hover:bg-red-600 transition"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
