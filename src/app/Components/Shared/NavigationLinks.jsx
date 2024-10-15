"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaHome, FaUsers } from "react-icons/fa";
import { BsPatchQuestionFill } from "react-icons/bs";
import { MdOutlineCardTravel, MdOutlineDashboard } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

// User and Admin navigation links with stickers
export const UserNavLinks = [
  {
    title: "Home",
    path: "/",
    icon: <FaHome className="text-xl text-blue-500" />, // Add color
  },
  {
    title: "Questions",
    path: "/questions",
    icon: <BsPatchQuestionFill className="text-xl text-green-500" />, // Add color
  },
  {
    title: "Users",
    path: "/users",
    icon: <FaUsers className="text-xl text-red-500" />, // Add color
  },
  {
    title: "Jobs",
    path: "/jobs",
    icon: <MdOutlineCardTravel className="text-xl text-yellow-500" />, // Add color
  },
];

export const AdminNavLinks = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <MdOutlineDashboard className="text-xl text-purple-500" />, // Add color
  },
  {
    title: "Manage Questions",
    path: "/manage-questions",
    icon: <BsPatchQuestionFill className="text-xl text-green-500" />, // Add color
  },
  { 
    title: "Manage Users",
    path: "/manage-users",
    icon: <FaUsers className="text-xl text-red-500" />, // Add color
  },
  {
    title: "Manage Jobs",
    path: "/manage-jobs",
    icon: <MdOutlineCardTravel className="text-xl text-yellow-500" />, // Add color
  },
];

const NavigationLinks = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter(); // Initialize the router

  // Get initial state from localStorage (persist toggle)
  const [showAdminLinks, setShowAdminLinks] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("showAdminLinks") === "true";
    }
    return false;
  });

  // Effect to save toggle state in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("showAdminLinks", showAdminLinks.toString());
    }
  }, [showAdminLinks]);

  const handleToggle = () => {
    const newShowAdminLinks = !showAdminLinks;
    setShowAdminLinks(newShowAdminLinks);
    if (newShowAdminLinks) {
      router.push("/dashboard"); // Redirect to the dashboard when switching to admin
    } else {
      router.push("/"); // Redirect to home when switching to user
    }
  };

  return (
    <div className="p-6">
      <div className="text-black flex flex-col gap-4 text-lg font-medium mt-8">
        {user?.role === "user" && !showAdminLinks ? (
          UserNavLinks.map((item) => (
            <Link href={item.path} key={item.path} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-200 transition-all duration-300">
              {item.icon && <span className="bg-white rounded-full p-2 shadow">{item.icon}</span>}
              <span className="hover:text-blue-600">{item.title}</span>
            </Link>
          ))
        ) : user?.role === "admin" && showAdminLinks ? (
          AdminNavLinks.map((item) => (
            <Link href={item.path} key={item.path} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-200 transition-all duration-300">
              {item.icon && <span className="bg-white rounded-full p-2 shadow">{item.icon}</span>}
              <span className="hover:text-blue-600">{item.title}</span>
            </Link>
          ))
        ) : (
          UserNavLinks.map((item) => (
            <Link href={item.path} key={item.path} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-200 transition-all duration-300">
              {item.icon && <span className="bg-white rounded-full p-2 shadow">{item.icon}</span>}
              <span className="hover:text-blue-600">{item.title}</span>
            </Link>
          ))
        )}
      </div>

      {/* Toggle Button */}
      {user?.role === "admin" && (
        <button
          onClick={handleToggle}
          className="block w-full md:w-auto px-4 py-2 mt-6 rounded-full bg-gradient-to-r from-teal-500 to-pink-500 text-white font-semibold shadow-lg hover:from-pink-500 hover:to-teal-500 transition-all duration-300"
        >
          {showAdminLinks ? "Switch to User" : "Switch to Admin"}
        </button>
      )}
    </div>
  );
};

export default NavigationLinks;