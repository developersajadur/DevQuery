"use client";
import { useState, useEffect } from "react";
import ChatSidebar from "../Components/Chat/ChatSidebar";
import ChatWindow from "../Components/Chat/ChatWindow";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Chat() {
  const { data: session } = useSession();
  const userID = session?.user?.id;
  const user = session?.user;
  const router = useRouter();

  // Destructure and provide default values for query parameters
  const { targetUserID = "", targetUserName = "", targetUserImage = "" } = router.query || {};

  const [chatDetails, setChatDetails] = useState({
    room: "",
    targetUserID: "",
    targetUserName: "",
    targetUserImage: "",
  });

  useEffect(() => {
    if (userID && targetUserID) {
      handleJoinRoom(targetUserID, targetUserName, targetUserImage);
    }
  }, [userID, targetUserID, targetUserName, targetUserImage]);

  const handleJoinRoom = (targetUserID, targetUserName, targetUserImage) => {
    const newRoom = [userID, targetUserID].sort().join("-");
    setChatDetails({
      room: newRoom,
      targetUserID,
      targetUserName,
      targetUserImage,
    });
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
          targetUserImage={chatDetails.targetUserImage}
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
