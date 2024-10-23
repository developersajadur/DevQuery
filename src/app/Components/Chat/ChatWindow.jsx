"use client";
import { useEffect, useState } from "react";
import { Avatar } from "flowbite-react";
import io from "socket.io-client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading/Loading";

let socket;

const WEB_SOCKET_API_URL = process.env.NEXT_PUBLIC_WEB_SOCKET_API_URL;
const NEXT_PUBLIC_WEB_URL = process.env.NEXT_PUBLIC_WEB_URL;

export default function ChatWindow({ currentUserEmail, targetUserName, targetUserID, targetUserImage }) {
  const [room, setRoom] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (targetUserID) {
      const newRoom = generateRoomID(currentUserEmail, targetUserID);
      setRoom(newRoom);
      setMessages([]); // Clear messages when switching users
    } else {
      setMessages([]);
    }
  }, [currentUserEmail, targetUserID]);

  useEffect(() => {
    if (!room) return;

    // Initialize socket connection
    socket = io(WEB_SOCKET_API_URL, {
      path: "/socket.io",
    });

    socket.emit("joinRoom", room);

    // Listen for incoming messages
    socket.on("message", (msgData) => {
      setMessages((prevMessages) => {
        if (!prevMessages.some(msg => msg.time === msgData.time && msg.text === msgData.text)) {
          return [...prevMessages, msgData].sort((a, b) => new Date(a.time) - new Date(b.time)); // Sort messages by time
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
          userEmail: currentUserEmail,
          participantEmail: targetUserID,
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
          participantEmail: currentUserEmail,
          userEmail: targetUserID,
        },
      });
      return response.data.messages;
    },
    enabled: !!room,
  });

  // Combine and sort sender and receiver chat histories
  useEffect(() => {
    if (!isSenderLoading && !isReceiverLoading) {
      const combinedMessages = [...senderChatHistory, ...receiverChatHistory].sort((a, b) => new Date(a.time) - new Date(b.time));
      setMessages(combinedMessages); // Set the combined and sorted messages
    }
  }, [senderChatHistory, receiverChatHistory, isSenderLoading, isReceiverLoading]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && room) {
      const msgData = {
        room,
        userEmail: currentUserEmail,
        participantEmail: targetUserID,
        text: message,
        time: new Date().toISOString(),
      };

      socket.emit("message", msgData);
      setMessages((prevMessages) => [...prevMessages, msgData].sort((a, b) => new Date(a.time) - new Date(b.time)));
      setMessage(""); // Clear the input field
    }
  };

  const generateRoomID = (userEmail1, userEmail2) => {
    return [userEmail1, userEmail2].sort().join("_");
  };

  // Format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  // Group messages by date
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
        {(isSenderLoading || isReceiverLoading) && <Loading />}
        {!isSenderLoading && !isReceiverLoading &&
          groupMessagesByDate(messages).map((group, index) => (
            <div key={index}>
              <p className="text-center text-gray-500 my-2">{formatDate(group.date)}</p>
              {group.messages.map((msg, idx) => (
                <UserMessage
                  key={`msg-${idx}`}
                  msg={msg}
                  currentUserEmail={currentUserEmail}
                  targetUserName={targetUserName}
                  targetUserImage={targetUserImage}
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

function UserMessage({ msg, currentUserEmail, targetUserName, targetUserImage }) {
  const isCurrentUser = msg.userEmail === currentUserEmail;
  const displayName = isCurrentUser ? "You" : targetUserName || "Unknown";
  const userImage = targetUserImage;

  return (
    <div className={`flex items-start ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      {!isCurrentUser && <Avatar img={userImage} rounded={true} size="md" />}
      <div className={`ml-4 ${isCurrentUser ? "text-right" : ""}`}>
        <div className="flex flex-col gap-1">
          <p className="font-bold">{displayName}</p>
          <span className="text-xs text-gray-500">{new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <p className={`text-lg ${isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200"} p-2 rounded-lg`}>
          {msg.text}
        </p>
      </div>
      {isCurrentUser && <Avatar img={userImage} rounded={true} size="md" />}
    </div>
  );
}
