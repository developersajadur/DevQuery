"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { FiMail } from "react-icons/fi";
import Link from "next/link"; // Import Link for routing
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/Components/Loading/Loading";
import axios from "axios";
import { Button } from "flowbite-react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import BookPage from "@/app/Bookmark/page";
import React, { useEffect, useState } from 'react';
import QuestionsCard from "../../Components/Questions/QuestionsCard";
import { useRouter } from "next/router";

const ProfilePage = ({ params }) => {
  const { data: session } = useSession();
  const sessionEmail = session?.user?.email;
  const [data, setData] = useState([]);
  // const { data: session, status } = useSession();
  const bookUser = session?.user;

  useEffect(() => {
    const fetchBook = async () => {
      if (bookUser?.email) {  // Make sure the bookUser is logged in and email is available
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/getBook?email=${bookUser.email}`);
          
          if (response.status === 200) {
            setData(response.data.books);
            // console.log(response.data.books);
          } else {
            console.error('Error fetching');
          }
        } catch (error) {
          console.error("Error", error);
        }
      }
    };

    fetchBook();
  }, [bookUser]); // Re-fetch if the user changes

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

  // const goToBookmark = (e) =>{
  //     console.log(e,"Hello");
      
  // }
  
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
    <Button onClick={() => signOut({ callbackUrl: "/login" })} className="mt-6">
        LogOut
    </Button>
</div>

        )}
      </div>

      {/* Profile Navigation Tabs */}
      <Tabs>
      <div className="w-full">
    <TabList className="flex justify-between gap-10 mb-9">
      <Tab><button className="">
          Questions
        </button></Tab>
      <Tab><button className="text-gray-500">Answers</button></Tab>
      <Tab><button className="text-gray-500">Bookmarks</button></Tab>
    </TabList>
    </div>

    <TabPanel>
    <div className="bg-white shadow-md w-full md:w-3/4 lg:w-full p-6 rounded-lg mt-6">
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
    </TabPanel>
    <TabPanel>
    <div className="bg-white shadow-md w-full md:w-3/4 lg:w-full p-6 rounded-lg mt-6">
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
    </TabPanel>

    <TabPanel> 
        <div className=" bg-white mb-4">
      {data.map(dt =>
        <div className="w-full md:w-3/4 lg:w-full mx-4 rounded-lg " key={dt._id}>

<div className="container p-2 mx-auto sm:p-4 dark:text-gray-800">
	<h2 className=" text-2xl font-bold text-center"><em>Your Bookmark</em></h2>
  <p className='text-center'><em>The data that you have bookmarked is here.</em></p>
	<div className="overflow-x-auto">
		<table className="w-full text-xs">
			
			<thead className="dark:bg-gray-300">
				<tr className="text-left">
					<th className="p-3">Title</th>
					<th className="p-3"></th>
				</tr>
			</thead>

			<tbody>
			
				<tr className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
				
        {data.map(dt=>

					<div key={dt._id} className='flex justify-between w-full rounded-md bg-slate-100 border-blue-600 border-2'>

          <div className='w-96 '>
          <td className="p-3">
						<p className='text-xl font-bold'>{dt.title}</p>
					</td>
          </div>
					<div className="">
          <td className="p-3 text-right">
						<Link href={`/questions/${dt.id}`}><button className='bg-blue-700 text-white font-bold rounded-md p-2 my-4'>Details</button></Link>
					</td>
          </div>

          </div>
        )}
					
				</tr>
			
				
			</tbody>
		</table>
	</div>
</div>
         
        </div>
      )}
    </div>
    </TabPanel>
  </Tabs>
      
        
        
        
     

      {/* Activity/Content Section */}
      
    </div>
  );
};

export default ProfilePage;
