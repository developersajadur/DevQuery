"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Table, Avatar, Dropdown } from "flowbite-react";
import Loading from "../Components/Loading/Loading";

const ManageUsers = () => {
  const queryClient = useQueryClient();
  
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

  if (isLoading) {
    return <Loading />;
  }

  // Toggle block/active state handler
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await axios.patch("/manage-users/api/actions", {
        status: currentStatus === "active" ? "blocked" : "active",
        userId
      });
      
      // Invalidate the query to refetch users
      queryClient.invalidateQueries(["all-users"]);
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Manage All Users: {users?.length}</h2>
      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Avatar</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {users.map((user, index) => (
              <Table.Row
                key={user.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>{index}</Table.Cell>
                <Table.Cell>
                  <Avatar img={user.image || "/default-avatar.png"} />
                </Table.Cell>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.role}</Table.Cell>
                <Table.Cell>
                  <Dropdown label={user.status === "active" ? "Active" : "Blocked"}>
                    <Dropdown.Item
                      onClick={() => handleToggleStatus(user?._id, user?.status)}
                    >
                      {user.status === "active" ? "Block" : "Activate"}
                    </Dropdown.Item>
                  </Dropdown>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default ManageUsers;
