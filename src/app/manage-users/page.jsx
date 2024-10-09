"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "flowbite-react";
import Loading from "../Components/Loading/Loading";
import Image from "next/image";
import Link from "next/link";

const ManageUsers = () => {
  const queryClient = useQueryClient();

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
  });

  // Toggle block/active state handler
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
    const res = await axios.patch("/manage-users/api/actions", {
        status: currentStatus === "active" ? "blocked" : "active",
        userId,
      });
      if (res.status === 200) {
        // Invalidate the query to refetch users
        refetch()
        return toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  if (isLoading) {
    return <Loading />;
  } 

  return (
    <div className="px-2 md:px-4 py-3">
      <h1 className="text-2xl font-bold mb-4">Manage All Users ({users?.length})</h1>
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
          {users?.map((user, index) => (
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
              <td className="py-2 px-4 border"><Link href={`users/${user?._id}`}>{user?.name}</Link></td>
              <td className="py-2 px-4 border">{user?.email}</td>
              <td className="py-2 px-4 border">{user?.role}</td>
              <td className={`py-2 px-4 border ${user.status === "active" ? "text-green-600" : "text-red-600"}`}>
                {user.status === "active" ? "Active" : "Blocked"}
              </td>
              <td className="py-2 px-4 border">
                <Button
                  onClick={() => handleToggleStatus(user._id, user.status)}
                  className={`${
                    user.status === "active" ? "bg-red-600" : "bg-green-600"
                  } text-white`}
                >
                  {user.status === "active" ? "Block" : "Activate"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
