import { Avatar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ChatSidebar({ handleJoinRoom }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_WEB_URL}/users/api/get`);
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on the search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-1/4 bg-gray-100 p-4 flex flex-col h-full">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Users"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg p-2 w-full"
        />
      </div>

      {/* Users List */}
      <div className="flex-grow overflow-y-auto">
        {filteredUsers?.map((user, idx) => (
          <div 
            key={idx} 
            className={`flex items-center mb-4 p-2 cursor-pointer ${user?.active ? 'bg-blue-100' : ''}`} 
            onClick={() => handleJoinRoom(user?._id, user?.name)} // Pass user ID and name
          >
            <Avatar img={user?.image} rounded={true} size="md" />
            <div className="ml-3">
              <p className="font-bold">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
