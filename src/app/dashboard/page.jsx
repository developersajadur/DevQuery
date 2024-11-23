"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card } from "flowbite-react";
import {
  HiUsers,
  HiQuestionMarkCircle,
  HiBriefcase,
  HiChatAlt2,
} from "react-icons/hi";
import Loading from "../Components/Loading/Loading";

const Dashboard = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      try {
        const response = await axios.get("/dashboard/api/get-users");            
        return response.data.users;
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    },
  });

  const { data: questions } = useQuery({
    queryKey: ["all-question"],
    queryFn: async () => {
      try {
        const response = await axios.get("/questions/api/allquestion");            
        return response.data.questions;
      } catch (error) {
        console.error("Error fetching questions:", error);
        return [];
      }
    },
  });

  const { data: answers } = useQuery({
    queryKey: ["all-answers"],
    queryFn: async () => {
      try {
        const response = await axios.get("/questions/api/get-all-answer");            
        return response.data.answers;
      } catch (error) {
        console.error("Error fetching answers:", error);
        return [];
      }
    },
  });

  const { data: jobs } = useQuery({
    queryKey: ["all-jobs"],
    queryFn: async () => {
      try {
        const response = await axios.get("/jobs/api/get");            
        return response.data.jobs;
      } catch (error) {
        console.error("Error fetching jobs:", error);
        return [];
      }
    },
  });

  if(isLoading){
    return <Loading/>
  }

  return (
    <div className="px-4 py-3 bg-[#F5F7F8]">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Card 1: Users */}
        <Card className="flex flex-col items-center justify-center p-4">
          <div className="flex items-center mb-2">
            <HiUsers className="text-blue-500 text-3xl md:text-4xl mr-2" />
            <h5 className="text-xl md:text-2xl font-bold">Users</h5>
          </div>
          <div className="flex justify-center items-center">
            <p className="text-2xl md:text-3xl font-semibold">{users?.length || 0}</p>
          </div>
        </Card>

        {/* Card 2: Questions */}
        <Card className="flex flex-col items-center justify-center p-4">
          <div className="flex items-center mb-2">
            <HiQuestionMarkCircle className="text-green-500 text-3xl md:text-4xl mr-2" />
            <h5 className="text-xl md:text-2xl font-bold">Questions</h5>
          </div>
          <div className="flex justify-center items-center">
            <p className="text-2xl md:text-3xl font-semibold">{questions?.length || 0}</p>
          </div>
        </Card>

        {/* Card 3: Answers */}
        <Card className="flex flex-col items-center justify-center p-4">
          <div className="flex items-center mb-2">
            <HiChatAlt2 className="text-red-500 text-3xl md:text-4xl mr-2" />
            <h5 className="text-xl md:text-2xl font-bold">Answers</h5>
          </div>
          <div className="flex justify-center items-center">
            <p className="text-2xl md:text-3xl font-semibold">{answers?.length || 0}</p>
          </div>
        </Card>

        {/* Card 4: Jobs */}
        <Card className="flex flex-col items-center justify-center p-4">
          <div className="flex items-center mb-2">
            <HiBriefcase className="text-yellow-500 text-3xl md:text-4xl mr-2" />
            <h5 className="text-xl md:text-2xl font-bold">Jobs</h5>
          </div>
          <div className="flex justify-center items-center">
            <p className="text-2xl md:text-3xl font-semibold">{jobs?.length || 0}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
