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
import { FaBookmark, FaFacebookSquare, FaGithub, FaLinkedin } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import { MdMenuBook, MdQuestionAnswer } from "react-icons/md";

const ProfilePage = ({ params }) => {
  const { data: session } = useSession();
  const sessionEmail = session?.user?.email;
  const [data, setData] = useState([]);
  const bookUser = session?.user;
  console.log(bookUser.email);
  

  useEffect(() => {
    const fetchBook = async () => {
      if (bookUser?.email) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/getBook?email=${bookUser?.email}`);
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
              className="rounded  -full"
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
            <div className="flex gap-2 items-center">
              <a href=""><FaFacebookSquare className="text-2xl text-[#1877F2]" /></a>
              <a href=""><FaLinkedin className="text-2xl text-[#0A66C2]" /></a>
              <a href=""><FaGithub className="text-2xl text-[#181717]" /></a>
              <a href=""><FaEarthAmericas className="text-2xl text-[#343A40]" /></a>
            </div>
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
      <div className="border-y-2 border-t-0 w-full py-4">
        <p className="text-center">Bio</p>
      </div>

      <div className="py-4 border-b-2 w-full px-4 grid grid-cols-2 md:grid-cols-3 gap-2">

        <div class="bg-white shadow-md rounded-lg p-6 text-center flex items-center justify-center gap-3">
          <div class="text-blue-500 text-3xl mb-2">
            <MdMenuBook />
          </div>
          <div>
            <div class="text-gray-800 text-xl font-semibold">0</div>
            <div class="text-gray-600">Questions</div>
          </div>
        </div>


        <div class="bg-white shadow-md rounded-lg p-6 text-center flex items-center justify-center gap-3">
          <div class="text-red-500 text-3xl mb-2">
            <MdQuestionAnswer />
          </div>
          <div>
            <div class="text-gray-800 text-xl font-semibold">0</div>
            <div class="text-gray-600">Answers</div>
          </div>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6 text-center flex items-center justify-center gap-3">
          <div class="text-green-400 text-3xl mb-2">
            <FaBookmark />
          </div>
          <div>
            <div class="text-gray-800 text-xl font-semibold">0</div>
            <div class="text-gray-600">Questions</div>
          </div>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6 text-center flex items-center justify-center gap-3">
          <div class="text-green-400 text-3xl mb-2">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#28A745" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 7l-6 6-3-3 1.41-1.41L11 12.17l4.59-4.59L17 9z" />
            </svg>
          </div>
          <div>
            <div class="text-gray-800 text-xl font-semibold">0</div>
            <div class="text-gray-600">Reputation</div>
          </div>
        </div>


      </div>

      <div className="py-4 border-b-2 w-full px-4">
        <div class="flex space-x-4 justify-center items-center">

          <div class="bg-gray-100 shadow-md rounded-lg p-4 w-64 h-32">
            <div class="flex items-center space-x-2 mb-2">
              <div class="bg-gray-700 text-white p-2 rounded">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="#007BFF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14c-2.67 0-5.33-1.34-7-4 0-2.67 5.33-4 7-4s7 1.33 7 4c-1.67 2.66-4.33 4-7 4z" />
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
                <svg width="30" height="30" viewBox="0 0 24 24" fill="#FF9800" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
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
              {/* <h2 className="text-2xl font-semibold text-center"><em>Bookmark</em></h2>
              <p className="text-center font-semibold"><em>Here are the questions you bookmarked</em></p> */}
        <TabPanel>
        <div>
                        <table className="min-w-full">
                            <thead className="bg-gray-200">
                                <tr className="text-left">
                                    <th className="p-3 text-lg">Title</th>
                                    <th className="p-3 text-lg"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(bookData => (
                                    <tr key={bookData._id} className='border-b border-opacity-20 hover:bg-gray-100'>
                                        <td className="p-3 w-3/4">
                                            <p className="text-xl font-bold">{bookData.title}</p>
                                        </td>
                                        <td className="p-3 flex justify-end items-center space-x-2">
                                            <Link href={`/questions/${bookData._id}`}>
                                                <Button className="bg-blue-500 text-white hover:bg-blue-600 transition">View</Button>
                                            </Link>
                                            <Button
                                                onClick={() => handleForDelete(bookData._id)}
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
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
