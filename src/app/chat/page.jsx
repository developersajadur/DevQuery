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
    targetUserImage: "", // Include targetUserImage in the state
  });

  const handleJoinRoom = (targetUserID, targetUserName, targetUserImage) => {
    if (userID && targetUserID) {
      const newRoom = [userID, targetUserID].sort().join("-");
      setChatDetails({
        room: newRoom,
        targetUserID,
        targetUserName,
        targetUserImage, // Set targetUserImage in the state
      });
    }
  };

  return (
    <div className="h-screen flex">
      <ChatSidebar handleJoinRoom={handleJoinRoom} className="" />
      {chatDetails.room ? (
        <ChatWindow
          room={chatDetails.room}
          currentUserID={userID}
          currentUser={user}
          targetUserName={chatDetails.targetUserName}
          targetUserImage={chatDetails.targetUserImage} // Pass targetUserImage to ChatWindow
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
