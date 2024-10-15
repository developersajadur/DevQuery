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
import { TiDelete } from "react-icons/ti";
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

  const handleForDelete = async (id) =>{
    // NEXT_PUBLIC_WEB_URL
    // const confirmed = window.confirm("Are you sure you want to delete this bookmark?");
    // if (!confirmed) return;
    Swal.fire({
      title: "Are you sure?",
      text: "Are you want to delete this bookmark?",
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
            // Remove the deleted bookmark from the state to update the UI
            setData((prevBookmarks) => prevBookmarks.filter((data) => data._id !== id));
          } else {
            toast.error(`Error: ${response.data.message}`);
          }
        } catch (error) {
          if (error.response) {
            // Server responded with a status other than 2xx
            toast.error(`Error: ${error.response.data.message || "Something went wrong."}`);
          } else {
            // Network or other errors
            console.error("Error deleting bookmark:", error);
            toast.error("An unexpected error occurred.");
          }
        }
      }
    });

  }
  
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="bg-white shadow-md w-full md:w-3/4 lg:w-1/2 p-6 rounded-lg my-8">
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
            <div className="rounded-full bg-gray-300" style={{ height: 100, width: 100 }}></div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="flex items-center text-gray-400 mt-2">
              <FiMail className="mr-2" /> {user?.email}
            </p>
          </div>
        </div>
        <div className="">
          <button className="bg-blue-500 rounded-xl px-4 py-2 font-semibold text-xl text-white">Follow</button>
        </div>
        <div className="flex items-center mt-4 space-x-4">
          <div>
            <p className="text-gray-500">Reputation</p>
            <p className="text-xl font-semibold">1,250</p>
          </div>
          <div>
            <p className="text-gray-500">Badges</p>
            <p className="text-xl font-semibold">Gold: 3, Silver: 7, Bronze: 10</p>
          </div>
          <div className="">
            <Link href="#" className="border-[2px] border-blue-500 rounded-xl px-4 py-2 font-semibold text-xl text-blue-500">Message</Link>
          </div>
        </div>
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
            <Button onClick={() => signOut({ callbackUrl: "/login" })} className="mt-6">
              LogOut
            </Button>
          </div>
        )}
      </div>

      <Tabs>
        <div className="w-full">
          <TabList className="flex justify-between gap-8 content-center mb-9">
            <Tab><button>Questions</button></Tab>
            <Tab><button className="text-gray-500">Answers</button></Tab>
            <Tab><button className="text-gray-500">Bookmarks</button></Tab>
          </TabList>
        </div>

        <TabPanel>
          <div className="bg-white shadow-md w-full md:w-3/4 lg:w-full p-6 rounded-lg mt-6">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <div className="mt-4 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold">What is the difference between JavaScript and TypeScript?</h3>
                <p className="text-sm text-gray-500">Asked on September 22, 2024</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold">How to implement authentication in Next.js?</h3>
                <p className="text-sm text-gray-500">Answered on September 20, 2024</p>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="bg-white shadow-md w-full md:w-3/4 lg:w-full p-6 rounded-lg mt-6">
            <h2 className="text-xl font-semibold">Answers</h2>
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
        data.map(dt=>
      <div key={dt._id} className='flex justify-between item-center hover:border-pink-600 border-[1px] border-sky-600 rounded-md bg-gray-50 my-1'>

        <div className="w-96 ">
        <td className="p-3">
            
						<p className="text-xl font-bold">{dt.title}</p>
					</td>
        </div>
              
					<div className="my-2">
          <td className="p-3">
						<Link href={`/questions/${dt.questionId}`}><button className="bg-blue-600 text-white hover:bg-sky-900 font-bold rounded-md hover:rounded-lg border-2 p-2">Details</button></Link>
          <button onClick={()=>handleForDelete(dt._id)} className="text-xl"><TiDelete /></button>
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
