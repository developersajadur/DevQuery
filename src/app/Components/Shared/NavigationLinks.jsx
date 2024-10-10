"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaHome, FaUsers } from "react-icons/fa";
import { BsPatchQuestionFill } from "react-icons/bs";
import { MdOutlineCardTravel, MdOutlineDashboard } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

// User and Admin navigation links
export const UserNavLinks = [
  {
    title: "Home",
    path: "/",
    icon: <FaHome />,
  },
  {
    title: "Questions",
    path: "/questions",
    icon: <BsPatchQuestionFill />,
  },
  {
    title: "Users",
    path: "/users",
    icon: <FaUsers />,
  },
  {
    title: "Jobs",
    path: "/jobs",
    icon: <MdOutlineCardTravel />,
  },
];

export const AdminNavLinks = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <MdOutlineDashboard />,
  },
  {
    title: "Manage Questions",
    path: "/manage-questions",
    icon: <BsPatchQuestionFill />,
  },
  {
    title: "Manage Users",
    path: "/manage-users",
    icon: <FaUsers />,
  },
  {
    title: "Manage Jobs",
    path: "/manage-jobs",
    icon: <MdOutlineCardTravel />,
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
    <div className="">
      <div className="text-white flex flex-col gap-2 text-xl font-medium mt-8">
        {user?.role === "user" && !showAdminLinks ? (
          UserNavLinks.map((item) => (
            <Link href={item.path} key={item.path} className="flex items-center text-black gap-2">
              {item.icon && <span>{item.icon}</span>}
              {item.title}
            </Link>
          ))
        ) : user?.role === "admin" && showAdminLinks ? (
          AdminNavLinks.map((item) => (
            <Link href={item.path} key={item.path} className="flex items-center text-black gap-2">
              {item.icon && <span>{item.icon}</span>}
              {item.title}
            </Link>
          ))
        ) : (
          UserNavLinks.map((item) => (
            <Link href={item.path} key={item.path} className="flex items-center text-black gap-2">
              {item.icon && <span>{item.icon}</span>}
              {item.title}
            </Link>
          ))
        )}
      </div>

      {/* Toggle Button */}
      {user?.role === "admin" && (
        <button
          onClick={handleToggle}
          className="block w-full md:w-auto px-3 py-2 mt-4 rounded-xl bg-blue-500 text-white text-center font-semibold"
        >
          {showAdminLinks ? "Switch to User" : "Switch to Admin"}
        </button>
      )}
    </div>
  );
};

export default NavigationLinks;
