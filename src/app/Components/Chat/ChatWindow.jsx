"use client";
import { useEffect, useState } from 'react';
import { Avatar } from 'flowbite-react';
import io from 'socket.io-client';
import axios from 'axios';

let socket; // Declare the socket variable

export default function ChatWindow({ room, currentUserID, currentUser, targetUserName }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Initialize socket and join room
  useEffect(() => {
    if (!room) return;

    // Establish the socket connection
    socket = io(`${process.env.NEXT_PUBLIC_WEB_SOCKET_API_URL}`, {
      path: "/socket.io",
    });

    // Join the specified room
    socket.emit("joinRoom", room);

    // Fetch message history from the server when the room changes
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages?room=${room}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Listen for new messages from the server
    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Clean up when the component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [room]);

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const msgData = {
        room,
        text: message,
        time: new Date(),
        senderID: currentUserID,
        sender: currentUser,
      };

      // Emit the message to the server via socket
      socket.emit("message", msgData);

      // Clear the input field after sending the message
      setMessage('');
    }
  };

  return (
    <div className="w-3/4 bg-white p-6 flex flex-col justify-between">
      {/* Chat Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Chat with {targetUserName}</h2>
      </div>

      {/* Message Display */}
      <div className="flex flex-col space-y-4 overflow-y-auto flex-grow">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start ${msg.senderID === currentUserID ? 'justify-end' : ''}`}>
            <div className={`flex ${msg.senderID === currentUserID ? 'flex-row-reverse' : ''}`}>
              <Avatar img="https://via.placeholder.com/150" rounded={true} size="md" />
              <div className={`ml-4 ${msg.senderID === currentUserID ? 'text-right' : ''}`}>
                <div className="flex flex-col gap-1">
                  <p className="font-bold">{msg.sender?.name || "not find name"}</p>
                  <span className="text-xs text-gray-500">{new Date(msg.time).toLocaleString()}</span>
                </div>
                <p className='text-lg'>{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <form className="mt-4 flex" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="flex-grow border rounded-lg p-2"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white rounded-lg p-2 ml-2">
          Send
        </button>
      </form>
    </div>
  );
}
