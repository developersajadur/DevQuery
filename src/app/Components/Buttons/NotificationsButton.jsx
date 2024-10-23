"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const NotificationsButton = ({ userEmail }) => {
  const { data: notifications, isLoading } = useQuery(
    ["notifications", userEmail],
    async () => {
      const response = await axios.get(`/notifications/api/get?email=${userEmail}`);
      return response.data.notifications;
    },
    { enabled: !!userEmail }
  );

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
      <div className="p-2 text-sm text-gray-700">Notifications</div>
      {isLoading ? (
        <div className="p-2">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="p-2 text-gray-500">No notifications</div>
      ) : (
        notifications.map((notification) => (
          <div key={notification.id} className="p-2 border-b last:border-b-0">
            {notification.message}
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationsButton;
