"use client"; // Indicates this is a client component
import { Avatar } from 'flowbite-react';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Loading from '../Loading/Loading';

const DEFAULT_AVATAR = "/default-avatar.png";

export default function ChatSidebar({ handleJoinRoom }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from the API on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_WEB_URL}/users/api/get`);
        setUsers(response.data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle input changes for the search bar
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter users based on the search term using useMemo
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div className="w-1/3 bg-gray-100 p-4 flex flex-col h-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Users"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border rounded-lg p-2 w-full"
        />
      </div>
      {loading && <Loading />}
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex-grow overflow-y-auto">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div 
              key={user.email}  // Use user email as key for better performance
              className={`flex items-center mb-4 p-2 cursor-pointer border-b-[1px] ${user?.active ? 'bg-blue-100' : ''}`} 
              onClick={() => handleJoinRoom(user.email, user.name, user?.image)} // Pass email instead of ID
            >
              <Avatar img={user?.image || DEFAULT_AVATAR} rounded={true} size="md" />
              <div className="ml-3">
                <p className="font-bold">{user?.name || "Unknown"}</p>
              </div>
            </div>
          ))
        ) : (
          !loading && <p>No users found.</p>
        )}
      </div>
    </div>
  );
}

// Setting a display name for easier debugging
ChatSidebar.displayName = "ChatSidebar";
