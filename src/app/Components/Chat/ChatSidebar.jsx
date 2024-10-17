"use client"
import { Avatar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../Loading/Loading';

export default function ChatSidebar({ handleJoinRoom }) {
  const [state, setState] = useState({
    users: [],
    searchTerm: "",
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_WEB_URL}/users/api/get`);
        setState((prevState) => ({
          ...prevState,
          users: response.data.users,
          loading: false,
        }));
      } catch (err) {
        console.error("Error fetching users:", err);
        setState((prevState) => ({
          ...prevState,
          error: "Failed to fetch users.",
          loading: false,
        }));
      }
    };
    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      searchTerm: e.target.value,
    }));
  };

  const filteredUsers = state.users.filter(user =>
    user.name?.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  return (
    <div className="w-1/3 bg-gray-100 p-4 flex flex-col h-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Users"
          value={state.searchTerm}
          onChange={handleSearchChange}
          className="border rounded-lg p-2 w-full"
        />
      </div>
      {state.loading && <Loading/>}
      {state.error && <p className="text-red-500">{state.error}</p>}
      <div className="flex-grow overflow-y-auto">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, idx) => (
            <div 
              key={idx} 
              className={`flex items-center mb-4 p-2 cursor-pointer border-b-[1px] ${user?.active ? 'bg-blue-100' : ''}`} 
              onClick={() => handleJoinRoom(user._id, user.name, user?.image)}
            >
              <Avatar img={user?.image || "/default-avatar.png"} rounded={true} size="md" />
              <div className="ml-3">
                <p className="font-bold">{user?.name || "Unknown"}</p>
                {/* <p className="text-sm text-gray-500">{user?.lastMessage || "No recent messages"}</p> */}
              </div>
            </div>
          ))
        ) : (
          !state.loading && <p>No users found.</p>
        )}
      </div>
    </div>
  );
}
