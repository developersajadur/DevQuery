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
  // console.log(bookUser.id);


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
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="py-4 border-b-2 border-t-2 w-full px-4 flex flex-col lg:flex-row justify-between items-center">
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
        <div className="mt-5 lg:mt-0">
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
          <div>
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
        </div>
      </div>

      <div className="py-4 border-b-2 w-full px-4 grid grid-cols-2 md:grid-cols-3 gap-2">

          <div class="bg-white shadow-md rounded-lg p-6 text-center">
            <div class="text-blue-500 text-3xl mb-2">
              <i class="fas fa-book"></i>
            </div>
            <div class="text-gray-800 text-xl font-semibold">0</div>
            <div class="text-gray-600">Questions</div>
          </div>


          <div class="bg-white shadow-md rounded-lg p-6 text-center">
            <div class="text-red-500 text-3xl mb-2">
              <i class="fas fa-comment"></i>
            </div>
            <div class="text-gray-800 text-xl font-semibold">0</div>
            <div class="text-gray-600">Answers</div>
          </div>

          <div class="bg-white shadow-md rounded-lg p-6 text-center">
            <div class="text-green-500 text-3xl mb-2">
              <i class="fas fa-graduation-cap"></i>
            </div>
            <div class="text-gray-800 text-xl font-semibold">0</div>
            <div class="text-gray-600">Bookmark</div>
          </div>

          <div class="bg-white shadow-md rounded-lg p-6 text-center">
            <div class="text-green-500 text-3xl mb-2">
              <i class="fas fa-graduation-cap"></i>
            </div>
            <div class="text-gray-800 text-xl font-semibold">0</div>
            <div class="text-gray-600">Reputation</div>
          </div>

          <div class="bg-white shadow-md rounded-lg p-6 text-center">
            <div class="text-green-500 text-3xl mb-2">
              <i class="fas fa-graduation-cap"></i>
            </div>
            <div class="text-gray-800 text-xl font-semibold">0</div>
            <div class="text-gray-600">Badges</div>
          </div>


      </div>

      <div className="py-4 border-b-2 w-full px-4">
        <div class="flex space-x-4 justify-center items-center">
          
          <div class="bg-gray-100 shadow-md rounded-lg p-4 w-64 h-32">
            <div class="flex items-center space-x-2 mb-2">
              <div class="bg-gray-700 text-white p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 010 7.75M12 14.5c-2.5 0-4.71-1.23-6-3.09a9 9 0 0112 0c-1.29 1.86-3.5 3.09-6 3.09z" />
                </svg>
              </div>
              <div class="text-gray-800 font-semibold text-lg">Followers</div>
            </div>
            <div class="text-gray-600">
              User doesn't have any followers yet.
            </div>
          </div>

          
          <div class="bg-gray-100 shadow-md rounded-lg p-4 w-64 h-32">
            <div class="flex items-center space-x-2 mb-2">
              <div class="bg-gray-700 text-white p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 8a6 6 0 11-12 0 6 6 0 0112 0zM5 21h14M12 17v4" />
                </svg>
              </div>
              <div class="text-gray-800 font-semibold text-lg">Following</div>
            </div>
            <div class="text-gray-600">
              User doesn't follow anyone.
            </div>
          </div>
        </div>
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
          <div className="bg-white shadow-md w-full md:w-3/4 lg:w-full p-6 rounded-lg mt-6">
            <div className=" sm:p-4 dark:text-gray-800">
              <h2 className="text-2xl font-semibold text-center"><em>Bookmark</em></h2>
              <p className="text-center font-semibold"><em>Here are the questions you bookmarked</em></p>

              <thead className="dark:bg-gray-300">
                <tr className="text-left">
                  <th className="p-3 ">Title</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">

                  {
                    data.map(dt =>
                      <div key={dt._id} className='flex justify-between item-center hover:border-pink-600 border-[1px] border-sky-600 rounded-md bg-gray-50 my-1'>

                        <div className="w-96 ">
                          <td className="p-3">

                            <p className="text-xl font-bold">{dt.title}</p>
                          </td>
                        </div>

                        <div className="my-2">
                          <td className="p-3">
                            <Link href={`/questions/${dt.questionId}`}><button className="bg-blue-600 text-white hover:bg-sky-900 font-bold rounded-md hover:rounded-lg border-2 p-2">Details</button></Link>
                            <button onClick={() => handleForDelete(dt._id)} className="text-xl"><TiDelete /></button>
                          </td>
                        </div>

                      </div>

                    )
                  }

                </tr>
              </tbody>


            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
