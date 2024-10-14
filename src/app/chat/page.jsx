"use client";
import { useEffect, useState } from "react";
import ChatSidebar from "../Components/Chat/ChatSidebar";
import ChatWindow from "../Components/Chat/ChatWindow";
import { useSession } from "next-auth/react";

export default function Chat() {
  const { data: session } = useSession();
  const userID = session.user.id;
  const user = session?.user // Get current user's name

  const [room, setRoom] = useState("");
  const [targetUserName, setTargetUserName] = useState("");
  const [targetUserID, setTargetUserID] = useState("");

  const handleJoinRoom = (targetUserID, targetUserName) => {
    if (userID && targetUserID) {
      // Create a consistent room ID based on both user IDs
      const newRoom = [userID, targetUserID].sort().join("-");
      setRoom(newRoom);
      setTargetUserName(targetUserName);
      setTargetUserID(targetUserID);
    }
  };

  return (
    <div className="h-screen flex">
      <ChatSidebar handleJoinRoom={handleJoinRoom} />
      <ChatWindow room={room} currentUserID={userID} currentUser={user} targetUserName={targetUserName} targetUserID={targetUserID} />
    </div>
  );
}
