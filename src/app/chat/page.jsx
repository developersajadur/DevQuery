"use client";
import { useState } from "react";
import ChatSidebar from "../Components/Chat/ChatSidebar";
import ChatWindow from "../Components/Chat/ChatWindow";
import { useSession } from "next-auth/react";

export default function Chat() {
  const { data: session } = useSession();
  const userID = session?.user?.id;
  const user = session?.user;

  const [chatDetails, setChatDetails] = useState({
    room: "",
    targetUserID: "",
    targetUserName: "",
  });

  const handleJoinRoom = (targetUserID, targetUserName) => {
    if (userID && targetUserID) {
      const newRoom = [userID, targetUserID].sort().join("-");
      setChatDetails({
        room: newRoom,
        targetUserID,
        targetUserName,
      });
    }
  };

  return (
    <div className="h-screen flex">
      <ChatSidebar handleJoinRoom={handleJoinRoom} />
      {chatDetails.room ? (
        <ChatWindow
          room={chatDetails.room}
          currentUserID={userID}
          currentUser={user}
          targetUserName={chatDetails.targetUserName}
          targetUserID={chatDetails.targetUserID}
        />
      ) : (
        <div className="w-3/4 flex items-center justify-center">
          <p>Select a user to start chatting</p>
        </div>
      )}
    </div>
  );
}
