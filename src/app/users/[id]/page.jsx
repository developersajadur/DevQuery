"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { FiMail } from "react-icons/fi";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/Components/Loading/Loading";
import axios from "axios";
import { Badge, Button } from "flowbite-react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { parseISO, isBefore } from "date-fns";
import {
  FaBookmark,
  FaFacebookSquare,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { SlUserFollowing } from "react-icons/sl";
import { RiUserFollowLine } from "react-icons/ri";
import { FaEarthAmericas } from "react-icons/fa6";
import { MdMenuBook, MdQuestionAnswer } from "react-icons/md";

const ProfilePage = ({ params }) => {
  const { data: session } = useSession();
  const sessionEmail = session?.user?.email;
  const [isFollowing, setIsFollowing] = useState(false);

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

  const userEmail = user?.email;

  // Fetch bookmarks using TanStack Query
  const { data: bookmarks, refetch } = useQuery({
    queryKey: ["bookmarks", userEmail],
    queryFn: async () => {
      const bookmarkUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/getBookmark?email=${userEmail}`;
      const response = await axios.get(bookmarkUrl);
      return response.data.bookmarks;
    },
    enabled: !!userEmail,
  });

  const { data: questions } = useQuery({
    queryKey: ["questions", userEmail],
    queryFn: async () => {
      const questionsUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/user-get-questions?email=${userEmail}`;
      const response = await axios.get(questionsUrl);
      return response.data.questions;
    },
    enabled: !!userEmail,
  });

  const { data: answers } = useQuery({
    queryKey: ["answers", userEmail],
    queryFn: async () => {
      const answersUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/user-get-answers?email=${userEmail}`;
      const response = await axios.get(answersUrl);
      return response.data.answers;
    },
    enabled: !!userEmail,
  });

  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (sessionEmail && user) {
        try {
          const sentToData = {
            currentUserEmail: sessionEmail,
            targetEmail: user.email,
          };
          const response = await axios.get(`/users/api/check-following`, {
            params: {
              currentUserEmail: sessionEmail,
              targetEmail: user.email,
            },
          });
          setIsFollowing(response.data.isFollowing);
        } catch (error) {
          console.error("Error checking following status:", error);
        }
      }
    };

    checkFollowingStatus();
  }, [sessionEmail, user]);

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
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/bookmarks/${id}`
          );
          if (response.status === 200) {
            refetch();
            toast.success(response.data.message);
          } else {
            toast.error(`Error: ${response.data.message}`);
          }
        } catch (error) {
          console.log(
            `Error: ${error.response.data.message || "Something went wrong."}`
          );
        }
      }
    });
  };

  const handleQuestionDelete = async (id) => {
    // Show SweetAlert2 confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`/manage-questions/api/delete`, {
            data: { id },
          });
          if (res?.status === 200) {
            refetch();
            toast.success(res.data.message);
            Swal.fire({
              title: "Deleted!",
              text: "The question has been deleted.",
              icon: "success",
            });
          }
        } catch (error) {
          console.error("Error deleting question:", error);
          toast.error("Failed to delete question!");
        }
      }
    });
  };

  const handleFollowToggle = async (email) => {
    try {
      const dataToSend = {
        targetEmail: email,
        currentUserEmail: sessionEmail,
      };

      const endpoint = isFollowing
        ? `${process.env.NEXT_PUBLIC_WEB_URL}/users/api/unfollow`
        : `${process.env.NEXT_PUBLIC_WEB_URL}/users/api/follow`;

      // Send `dataToSend` directly without additional wrapping
      const response = await axios.post(endpoint, dataToSend);

      if (response.status === 200) {
        toast.success(response.data.message);
        setIsFollowing(!isFollowing);
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          `Error: ${error.response.data.message || "Something went wrong."}`
        );
      } else {
        console.error("Error toggling follow status:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  // meeting expiare condition
  const isMeetingExpired = (meetingDate, meetingTime) => {
    if (!meetingDate || !meetingTime) return false;

    // Combine the date and time into a single Date object
    const meetingDateTime = new Date(`${meetingDate} ${meetingTime}`);
    const currentDateTime = new Date();

    // Compare the meeting time to the current time
    return isBefore(meetingDateTime, currentDateTime);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Profile Header */}
      <div className="py-4 border-b-[1px] w-full px-4 flex flex-col lg:flex-row justify-between items-center">
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
            <div className="flex gap-2">
            <h1 className="text-4xl font-bold text-gray-800">{user?.name}</h1>
            <Badge color="indigo">{user?.plan}</Badge>
            </div>
            <p className="flex items-center text-gray-600 mt-2 text-lg">
              <FiMail className="mr-2" /> {user?.email}
            </p>
            <div className="flex gap-2 items-center">
              <a href={user?.facebook}>
                <FaFacebookSquare className="text-2xl text-[#1877F2]" />
              </a>
              <a href={user?.linkedin}>
                <FaLinkedin className="text-2xl text-[#0A66C2]" />
              </a>
              <a href={user?.github}>
                <FaGithub className="text-2xl text-[#181717]" />
              </a>
              <a href={user?.website}>
                <FaEarthAmericas className="text-2xl text-[#343A40]" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-5 lg:mt-0">
          {sessionEmail === user?.email ? (
            <div className="flex gap-5 items-center mt-6">
              <Link
                href={`/users/edit/${user._id}`}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Update Profile
              </Link>
              <Button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className=" bg-red-600 px-6 py-1 "
              >
                LogOut
              </Button>
            </div>
          ) : (
            <div className="flex gap-6 items-center">
              <Link
                href={{
                  pathname: "/chat",
                  query: {
                    targetUserID: user._id,
                    targetUserName: user.name,
                    targetUserImage: user.image || "/default-avatar.png",
                  },
                }}
                className="border-2 border-blue-600 rounded-xl px-6 py-3 font-semibold text-xl text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
              >
                Message
              </Link>
              <button
                onClick={() => handleFollowToggle(user?.email)}
                className={`border-2 rounded-xl px-6 py-3 font-semibold text-xl transition-colors ${
                  isFollowing
                    ? "bg-red-600 text-white border-red-600 hover:bg-white hover:text-red-600"
                    : "text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="border-y-[1px] border-t-0 w-full py-4">
        <p className="text-center">{user?.bio}</p>
      </div>

      <div className="py-4 border-b-[1px] w-full px-4 grid grid-cols-2 md:grid-cols-3 gap-2">
        {/* Questions, Answers, Bookmarks, and Reputation Section */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center flex items-center justify-center gap-3">
          <div className="text-blue-500 text-3xl mb-2">
            <MdMenuBook />
          </div>
          <div>
            <div className="text-gray-800 text-xl font-semibold">
              {questions?.length || 0}
            </div>
            <div className="text-gray-600">Questions</div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center flex items-center justify-center gap-3">
          <div className="text-blue-500 text-3xl mb-2">
            <MdQuestionAnswer />
          </div>
          <div>
            <div className="text-gray-800 text-xl font-semibold">
              {answers?.length || 0}
            </div>
            <div className="text-gray-600">Answers</div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center flex items-center justify-center gap-3">
          <div className="text-blue-500 text-3xl mb-2">
            <FaBookmark />
          </div>
          <div>
            <div className="text-gray-800 text-xl font-semibold">
              {bookmarks?.length || 0}
            </div>
            <div className="text-gray-600">Bookmarks</div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center flex items-center justify-center gap-3">
          <div className="text-blue-500 text-3xl mb-2">
            <FaBookmark />
          </div>
          <div>
            <div className="text-gray-800 text-xl font-semibold">
              {user?.reputations || 0}
            </div>
            <div className="text-gray-600">Reputation</div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center flex items-center justify-center gap-3">
          <div className="text-blue-500 text-3xl mb-2">
            <RiUserFollowLine />
          </div>
          <div>
            <div className="text-gray-800 text-xl font-semibold">
              {user?.followers?.length || 0}
            </div>
            <div className="text-gray-600">Followers</div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center flex items-center justify-center gap-3">
          <div className="text-blue-500 text-3xl mb-2">
            <SlUserFollowing />
          </div>
          <div>
            <div className="text-gray-800 text-xl font-semibold">
              {user?.following?.length || 0}
            </div>
            <div className="text-gray-600">Following</div>
          </div>
        </div>
      </div>

      <Tabs className="w-full lg:w-full mt-6">
        <TabList className="flex justify-between gap-8 content-center mb-4">
          <Tab>
            <button className="text-blue-600 font-semibold text-lg">
              Questions
            </button>
          </Tab>
          {sessionEmail === user?.email && (
            <Tab>
              <button className="text-gray-500 font-semibold text-lg">
                Bookmarks
              </button>
            </Tab>
          )}
          {sessionEmail === user.email && (
            <Tab>
              <button className="text-gray-500 font-semibold text-lg">
                Meetings
              </button>
            </Tab>
          )}
        </TabList>
        {/* -------Questions-------- */}
        <TabPanel>
          <div className="w-full px-4">
            <h2 className="text-2xl font-semibold py-4">Questions</h2>
            {questions?.length === 0 ? (
              <p className="text-center">No Questions Found.</p>
            ) : (
              <div>
                <table className="min-w-full">
                  <thead className="bg-gray-200">
                    <tr className="text-left">
                      <th className="p-3 text-lg">Title</th>
                      <th className="p-3 text-lg"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions?.map((question) => (
                      <tr
                        key={question._id}
                        className="border-b border-opacity-20 hover:bg-gray-100"
                      >
                        <td className="p-3 w-3/4">
                          <p className="text-xl font-bold">{question.title}</p>
                        </td>
                        <td className="p-3 flex justify-end items-center space-x-2">
                          <Link href={`/questions/${question._id}`}>
                            <Button className="bg-blue-500 text-white hover:bg-blue-600 transition">
                              View
                            </Button>
                          </Link>
                          {sessionEmail === user.email && (
                            <Button
                              onClick={() => handleQuestionDelete(question._id)}
                              className="bg-red-500 text-white hover:bg-red-600 transition"
                            >
                              Delete
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabPanel>

        {/* ------ Bookmarks -----------*/}
        {sessionEmail === user?.email && (
          <TabPanel>
            <div className="w-full px-4">
              <h2 className="text-2xl font-semibold py-4">Bookmarks</h2>
              {bookmarks?.length === 0 ? (
                <p className="text-center">No bookmarks found.</p>
              ) : (
                <div>
                  <table className="min-w-full">
                    <thead className="bg-gray-200">
                      <tr className="text-left">
                        <th className="p-3 text-lg">Title</th>
                        <th className="p-3 text-lg"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookmarks?.map((bookData) => (
                        <tr
                          key={bookData._id}
                          className="border-b border-opacity-20 hover:bg-gray-100"
                        >
                          <td className="p-3 w-3/4">
                            <p className="text-xl font-bold">
                              {bookData.title}
                            </p>
                          </td>
                          <td className="p-3 flex justify-end items-center space-x-2">
                            <Link href={`/questions/${bookData._id}`}>
                              <Button className="bg-blue-500 text-white hover:bg-blue-600 transition">
                                View
                              </Button>
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
              )}
            </div>
          </TabPanel>
        )}

        {/* ------- meeting tab------  */}
        {sessionEmail === user?.email && (
          <TabPanel>
            <div className="w-full px-4">
              <h2 className="text-2xl font-semibold py-4">Meetings</h2>
              {user?.meetings?.length === 0 ? (
                <p className="text-center">No meetings found.</p>
              ) : (
                <div>
                  <table className="min-w-full">
                    <thead className="bg-gray-200">
                      <tr className="text-left">
                        <th className="p-3 text-lg">Meeting Title</th>
                        <th className="p-3 text-lg"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {user?.meetings?.map((meeting, i) => (
                        <tr
                          key={i}
                          className="border-b border-opacity-20 hover:bg-gray-100"
                        >
                          <td className="p-3 w-3/4">
                            <p className="text-lg font-bold">
                              You have a meeting on {meeting?.date} at{" "}
                              {meeting?.time} via {meeting?.platform}
                            </p>
                          </td>
                          <td className="p-3 flex justify-end items-center space-x-2">
                            <Link href={meeting?.meetingLink}>
                              {isMeetingExpired(
                                meeting?.date,
                                meeting?.time
                              ) ? (
                                <Button
                                  disabled
                                  className="bg-slate-400 text-blue-600"
                                >
                                  Meeting Expired
                                </Button>
                              ) : (
                                <Button className="bg-blue-500 text-white hover:bg-blue-600 transition">
                                  Join Now
                                </Button>
                              )}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabPanel>
        )}
      </Tabs>
    </div>
  );
};

export default ProfilePage;
