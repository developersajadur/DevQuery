"use client";
import { useState, useEffect } from "react";
import ChatSidebar from "../Components/Chat/ChatSidebar";
import ChatWindow from "../Components/Chat/ChatWindow";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Chat() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email; // Use email for identification
  const user = session?.user;
  const router = useRouter();

  // Destructure and provide default values for query parameters
  const { targetUserID = "", targetUserName = "", targetUserImage = "" } = router.query || {};

  // State for chat details
  const [room, setRoom] = useState("");
  const [targetUser, setTargetUser] = useState({
    id: targetUserID,
    name: targetUserName,
    image: targetUserImage,
  });

  useEffect(() => {
    if (userEmail && targetUserID) {
      const newRoom = [userEmail, targetUserID].sort().join("-"); // Room is created using email
      setRoom(newRoom);
      setTargetUser({ id: targetUserID, name: targetUserName, image: targetUserImage });
    }
  }, [userEmail, targetUserID, targetUserName, targetUserImage]);

  return (
    <div className="h-screen flex">
      <ChatSidebar handleJoinRoom={(id, name, image) => {
        const newRoom = [userEmail, id].sort().join("-"); // Room created on user email
        setRoom(newRoom);
        setTargetUser({ id, name, image });
      }} />
      {room ? (
        <ChatWindow
          room={room}
          currentUserEmail={userEmail} // Pass email instead of ID
          currentUser={user}
          targetUserName={targetUser.name}
          targetUserImage={targetUser.image}
          targetUserID={targetUser.id}
        />
      ) : (
        <div className="w-3/4 flex items-center justify-center">
          <p>Select a user to start chatting</p>
        </div>
      )}
    </div>
  );
}
