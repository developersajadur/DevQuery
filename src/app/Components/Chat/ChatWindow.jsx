"use client";
import { useEffect, useState } from "react";
import { Avatar } from "flowbite-react";
import io from "socket.io-client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "flowbite-react"; // Import Spinner from flowbite-react
import Loading from "../Loading/Loading";

let socket;

const WEB_SOCKET_API_URL = process.env.NEXT_PUBLIC_WEB_SOCKET_API_URL;
const NEXT_PUBLIC_WEB_URL = process.env.NEXT_PUBLIC_WEB_URL;

export default function ChatWindow({ currentUserID, targetUserName, targetUserID }) {
  const [room, setRoom] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (targetUserID) {
      const newRoom = generateRoomID(currentUserID, targetUserID);
      setRoom(newRoom);
    } else {
      setMessages([]);
    }
  }, [currentUserID, targetUserID]);

  useEffect(() => {
    if (!room) return;

    // Initialize socket connection
    socket = io(WEB_SOCKET_API_URL, {
      path: "/socket.io",
    });

    socket.emit("joinRoom", room);

    // Listen for incoming messages
    socket.on("message", (msgData) => {
      // Only add if it's not already present
      setMessages((prevMessages) => {
        if (!prevMessages.some(msg => msg.time === msgData.time && msg.text === msgData.text)) {
          return [...prevMessages, msgData];
        }
        return prevMessages;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [room]);

  // Fetch sender chat history
  const { data: senderChatHistory = [], isLoading: isSenderLoading } = useQuery({
    queryKey: ["senderChatHistory", room],
    queryFn: async () => {
      if (!room) return [];
      const response = await axios.get(`${NEXT_PUBLIC_WEB_URL}/chat/api/get/sender-messages`, {
        params: {
          userId: currentUserID,
          participantId: targetUserID,
        },
      });
      return response.data.messages;
    },
    enabled: !!room,
  });

  // Fetch receiver chat history
  const { data: receiverChatHistory = [], isLoading: isReceiverLoading } = useQuery({
    queryKey: ["receiverChatHistory", room],
    queryFn: async () => {
      if (!room) return [];
      const response = await axios.get(`${NEXT_PUBLIC_WEB_URL}/chat/api/get/receiver-messages`, {
        params: {
          participantId: currentUserID,
          userId: targetUserID,
        },
      });
      return response.data.messages;
    },
    enabled: !!room,
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && room) {
      const msgData = {
        room,
        text: message,
        time: new Date().toISOString(), // Use ISO format for better comparison
        sender: currentUserID,
        userId: currentUserID,
        participantId: targetUserID,
      };

      socket.emit("message", msgData);
      // Add the message to local state immediately
      setMessages((prevMessages) => [...prevMessages, msgData]);
      setMessage(""); // Clear the input field
    }
  };

  const generateRoomID = (userID1, userID2) => {
    return [userID1, userID2].sort().join("_");
  };

  // Function to format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(new Date(date));
  };

  // Function to group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = messages.reduce((acc, msg) => {
      const messageDate = new Date(msg.time).toDateString();
      if (!acc[messageDate]) {
        acc[messageDate] = { date: messageDate, messages: [] };
      }
      acc[messageDate].messages.push(msg);
      return acc;
    }, {});

    return Object.values(groups);
  };

  return (
    <div className="w-3/4 bg-white p-6 flex flex-col justify-between">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Chat with {targetUserName || "Select a user to chat"}</h2>
      </div>
      <div className="flex flex-col space-y-4 overflow-y-auto flex-grow">
        {/* Show loading spinner if either query is loading */}
        {(isSenderLoading || isReceiverLoading) && (
          <Loading/>
        )}
        {/* Group messages by date */}
        {!isSenderLoading && !isReceiverLoading && groupMessagesByDate([...senderChatHistory, ...receiverChatHistory, ...messages]).map((group, index) => (
          <div key={index}>
            <p className="text-center text-gray-500 my-2">{formatDate(group.date)}</p>
            {group.messages.map((msg, idx) => (
              <UserMessage key={`msg-${idx}`} msg={msg} currentUserID={currentUserID} />
            ))}
          </div>
        ))}
      </div>
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

function UserMessage({ msg, currentUserID }) {
  const isCurrentUser = msg.sender === currentUserID; // Check if the sender is the current user

  return (
    <div className={`flex items-start ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      {/* Render the avatar only for the other user */}
      {!isCurrentUser && <Avatar img={msg.image || "/default-avatar.png"} rounded={true} size="md" />}
      <div className={`ml-4 ${isCurrentUser ? "text-right" : ""}`}>
        <div className="flex flex-col gap-1">
          <p className="font-bold">{isCurrentUser ? "You" : msg.name || "Unknown"}</p>
          <span className="text-xs text-gray-500">{new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <p className={`text-lg ${isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200"} p-2 rounded-lg`}>
          {msg.text}
        </p>
      </div>
      {/* Render the avatar for the current user */}
      {isCurrentUser && <Avatar img={msg.image || "/default-avatar.png"} rounded={true} size="md" />}
    </div>
  );
}
