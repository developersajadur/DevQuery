"use client"
import Image from "next/image";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import Loading from "../Components/Loading/Loading";

const Users = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await axios.get("/users/api/get");
        return response.data.users;
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    },
  });

  if (isLoading) return <Loading/>;
  if (error) return <p>Error loading users.</p>;

  return (
    <div className="px-2 md:px-4 py-3 mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users?.map((user) => (
          <div
            key={user._id}
            className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md"
          >
            {/* User Avatar */}
            <Image
              width={400}
              height={300}
              src={user?.image}
              alt={`${user?.name}'s avatar`}
              className="w-16 h-16 rounded-full object-cover"
            />

            {/* User Info */}
            <div className="flex flex-col">
              <Link
                href={`/users/${user._id}`}
                className="font-semibold text-lg hover:text-blue-500"
              >
                {user?.name}
              </Link>
              <span className="text-gray-500">
                {user.location || "location not found"}
              </span>

              {/* Skills */}
              <div className="flex gap-2 mt-2">
                {user?.skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
