"use client";
import { useEffect, useState, useRef } from "react";
import { Avatar } from "flowbite-react";
import io from "socket.io-client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading/Loading";
import Link from "next/link";
import { useSession } from "next-auth/react";

const WEB_SOCKET_API_URL = process.env.NEXT_PUBLIC_WEB_SOCKET_API_URL;
const NEXT_PUBLIC_WEB_URL = process.env.NEXT_PUBLIC_WEB_URL;

export default function ChatWindow({ currentUserID, targetUserName, targetUserID, targetUserImage }) {
  const [room, setRoom] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    if (targetUserID) {
      const newRoom = generateRoomID(currentUserID, targetUserID);
      setRoom(newRoom);
      setMessages([]); // Clear messages when switching users
    }
  }, [currentUserID, targetUserID]);

  useEffect(() => {
    if (!room) return;

    // Initialize socket connection
    socketRef.current = io(WEB_SOCKET_API_URL, { path: "/socket.io" });
    socketRef.current.emit("joinRoom", room);

    // Listen for incoming messages
    socketRef.current.on("message", (msgData) => {
      setMessages((prevMessages) => {
        if (!prevMessages.some(msg => msg.time === msgData.time && msg.text === msgData.text)) {
          return [...prevMessages, msgData];
        }
        return prevMessages;
      });
    });

    return () => {
      socketRef.current.emit("leaveRoom", room); // Emit leaveRoom event
      socketRef.current.disconnect();
      socketRef.current = null; // Clear the socket reference
    };
  }, [room]);

  // Fetch chat history
  const { data: chatHistory = [], isLoading, error } = useQuery({
    queryKey: ["chatHistory", room],
    queryFn: async () => {
      if (!room) return [];
      const senderResponse = await axios.get(`${NEXT_PUBLIC_WEB_URL}/chat/api/get/sender-messages`, {
        params: {
          userId: currentUserID,
          participantId: targetUserID,
        },
      });
      const receiverResponse = await axios.get(`${NEXT_PUBLIC_WEB_URL}/chat/api/get/receiver-messages`, {
        params: {
          participantId: currentUserID,
          userId: targetUserID,
        },
      });
      return [...senderResponse.data.messages, ...receiverResponse.data.messages];
    },
    enabled: !!room,
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && room) {
      const msgData = {
        room,
        text: message,
        time: new Date().toISOString(),
        sender: currentUserID,
        userId: currentUserID,
        participantId: targetUserID,
      };

      socketRef.current.emit("message", msgData);
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
    <div className="w-full bg-white p-6 flex flex-col justify-between">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Chat with {targetUserName || "Select a user to chat"}</h2>
      </div>
      <div className="flex flex-col space-y-4 overflow-y-auto flex-grow">
        {isLoading && <Loading />}
        {error && <p className="text-red-500">Error loading chat history. Please try again later.</p>}
        {!isLoading && !error && messages.length === 0 && (
          <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
        )}
        {!isLoading && !error &&
          groupMessagesByDate(chatHistory).map((group, index) => (
            <div key={index}>
              <p className="text-center text-gray-500 my-2">{formatDate(group.date)}</p>
              {group.messages.map((msg, idx) => (
                <UserMessage
                  key={`msg-${idx}`}
                  msg={msg}
                  currentUserID={currentUserID}
                  targetUserName={targetUserName}
                  targetUserImage={targetUserImage}
                  targetUserID={targetUserID}
                />
              ))}
            </div>
          ))
        }
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

// UserMessage component for displaying individual messages
function UserMessage({ msg, currentUserID, targetUserName, targetUserImage, targetUserID }) {
  const { data: session } = useSession();
  const currentUserImage = session?.user?.image || "/default-avatar.png";
  const url = process.env.NEXT_PUBLIC_WEB_URL;
  const isCurrentUser = msg.sender === currentUserID;
  const displayName = isCurrentUser ? "You" : targetUserName || "Unknown";
  const userImage = isCurrentUser ? currentUserImage : targetUserImage || "/default-avatar.png";
  const userLink = isCurrentUser ? `${url}/users/${currentUserID}` : `${url}/users/${targetUserID}`;

  return (
    <div className={`flex items-start ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      {!isCurrentUser && <Avatar img={userImage} rounded={true} size="md" />}
      <div className={`ml-4 ${isCurrentUser ? "text-right" : ""}`}>
        <div className="flex flex-col gap-1">
          <Link href={userLink}>
            <p className="font-bold">{displayName}</p>
          </Link>
          <span className="text-xs text-gray-500">
            {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className={`text-lg ${isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200"} p-2 rounded-lg`}>
          {msg.text}
        </p>
      </div>
      {isCurrentUser && <Avatar img={userImage} rounded={true} size="md" />}
    </div>
  );
}

// Set a display name for easier debugging
ChatWindow.displayName = "ChatWindow";
UserMessage.displayName = "UserMessage";
