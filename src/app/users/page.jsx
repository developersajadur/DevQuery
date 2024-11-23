"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import Loading from "../Components/Loading/Loading";

const Users = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users

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
    onSuccess: (usersData) => {
      setFilteredUsers(usersData); // Set filteredUsers to all users initially
    },
  });

  // Ensure that users are shown by default when data is fetched
  useEffect(() => {
    if (users) {
      setFilteredUsers(users); // Set filteredUsers to all users when data is fetched
    }
  }, [users]);

  if (isLoading) return <Loading />;
  if (error) return <p>Error loading users.</p>;

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      setFilteredUsers(users); // Reset to show all users if search query is empty
    } else {
      const filtered = users?.filter((user) =>
        user?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  return (
    <div className="px-2 md:px-4 py-3 mt-5">
      {/* Search Bar */}
      <div className="mb-4 flex lg:ml-[600px]">
        <input
          type="text"
          placeholder="Search by user name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
          className="px-3 py-2 border border-gray-300 rounded-l"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-r"
        >
          Search
        </button>
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers?.map((user) => (
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
