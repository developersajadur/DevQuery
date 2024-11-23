"use client";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "flowbite-react";
import Loading from "../Components/Loading/Loading";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2"; // Import SweetAlert2
import toast from "react-hot-toast"; // Ensure you import toast if not already

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState(""); // State to store search input
  const [filteredUsers, setFilteredUsers] = useState([]); // State to store filtered users

  const { data: users, isLoading, refetch } = useQuery({
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
    onSuccess: (usersData) => {
      setFilteredUsers(usersData); // Set default users when data is fetched
    },
  });

  useEffect(() => {
    if (users) {
      setFilteredUsers(users);
    }
  }, [users]);

  // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      // If search input is empty, show all users
      setFilteredUsers(users);
    } else {
      // Filter users based on the search term (by name or email)
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  // Toggle block/active state handler with confirmation
  const handleToggleStatus = async (userId, newStatus) => {
    const action = newStatus === "active" ? "activate" : "block";

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${action} this user.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action} it!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.patch("/manage-users/api/actions", {
            status: newStatus,
            userId,
          });
          if (res?.status === 200) {
            queryClient.invalidateQueries(["all-users"]); // Refetch updated data
            toast.success(res.data.message);
            Swal.fire({
              title: "Success!",
              text: `User has been ${newStatus === "active" ? "activated" : "blocked"}.`,
              icon: "success",
            });
          }
        } catch (error) {
          console.error("Error toggling status:", error);
          toast.error("Failed to toggle user status!");
        }
      }
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="px-2 md:px-4 py-3">
      <h1 className="text-2xl font-bold mb-4">Manage All Users ({filteredUsers?.length})</h1>
      <div className="mb-4 flex lg:ml-[600px]">
        <input
          type="text"
          className="border py-2 px-3 rounded-l w-full"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-r" onClick={handleSearch}>Search</button>
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Avatar</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Role</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers?.map((user, index) => (
            <tr key={user._id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border">{index + 1}</td>
              <td className="py-2 px-4 border">
                <Image
                  width="480"
                  height={480}
                  src={user.image || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <td className="py-2 px-4 border">
                <Link href={`users/${user?._id}`}>{user?.name}</Link>
              </td>
              <td className="py-2 px-4 border">{user?.email}</td>
              <td className="py-2 px-4 border">{user?.role}</td>
              <td className={`py-2 px-4 border ${user.status === "active" ? "text-green-600" : "text-red-600"}`}>
                {user.status === "active" ? "Active" : "Blocked"}
              </td>
              <td className="py-2 px-4 border">
                <select
                  value={user.status} // Set the dropdown value to the current user status
                  onChange={(e) => handleToggleStatus(user._id, e.target.value)}
                  className={`${
                    user.status === "active" ? "bg-red-600" : "bg-green-600"
                  } text-white p-2 rounded`}
                >
                  <option value="active" className="text-black bg-white">
                    Active
                  </option>
                  <option value="blocked" className="text-black bg-white">
                    Block
                  </option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
