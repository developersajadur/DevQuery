"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaHome, FaUsers } from "react-icons/fa";
import { BsPatchQuestionFill } from "react-icons/bs";
import { MdOutlineCardTravel, MdOutlineDashboard } from "react-icons/md";
import { useSession } from "next-auth/react";
import { TbLogs } from "react-icons/tb";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import axios from "axios"; // Ensure axios is imported
import { useQuery } from "@tanstack/react-query";
import { GrCode } from "react-icons/gr";

export const UserNavLinks = [
  {
    title: "Home",
    path: "/",
    icon: <FaHome className="text-xl text-blue-500" />,
  },
  {
    title: "Questions",
    path: "/questions",
    icon: <BsPatchQuestionFill className="text-xl text-green-500" />,
  },
  {
    title: "Users",
    path: "/users",
    icon: <FaUsers className="text-xl text-red-500" />,
  },
  {
    title: "Jobs",
    path: "/jobs",
    icon: <MdOutlineCardTravel className="text-xl text-yellow-500" />,
  },
  {
    title: "Playground",
    path: "/code-editor",
    icon: <GrCode className="text-xl text-red-500"/>
  }
];

export const AdminNavLinks = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <MdOutlineDashboard className="text-xl text-purple-500" />,
  },
  {
    title: "Manage Questions",
    path: "/manage-questions",
    icon: <BsPatchQuestionFill className="text-xl text-green-500" />,
  },
  {
    title: "Manage Users",
    path: "/manage-users",
    icon: <FaUsers className="text-xl text-red-500" />,
  },
  {
    title: "Manage Jobs",
    path: "/manage-jobs",
    icon: <MdOutlineCardTravel className="text-xl text-yellow-500" />,
  },
  {
    title: "Manage Blogs",
    path:'/blogs/manage-blogs',
    icon: <TbLogs/>
  }
];

const NavigationLinks = () => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const router = useRouter();

  // Fetch user by email using react-query
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userEmail],
    queryFn: () => axios.get(`/users/api/get-one?email=${userEmail}`).then(res => res.data.user),
    enabled: !!userEmail,
  });

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
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  const renderNavLinks = () => {
    const navLinks = user?.role === "admin" && showAdminLinks ? AdminNavLinks : UserNavLinks;

    return navLinks.map((item) => (
      <Link href={item.path} key={item.path} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-200 transition-all duration-300">
        {item.icon && <span className="bg-white rounded-full p-2 shadow">{item.icon}</span>}
        <span className="hover:text-blue-600">{item.title}</span>
      </Link>
    ));
  };

  return (
    <div className="p-6">
      <div className="text-black flex flex-col gap-4 text-lg font-medium mt-8">
        {renderNavLinks()}
      </div>

      {/* Toggle Button */}
      {user?.role === "admin" && (
        <button
          onClick={handleToggle}
          className="mt-10 ml-3 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          {showAdminLinks ? "Switch to User" : "Switch to Admin"}
        </button>
      )}
    </div>
  );
};

export default NavigationLinks;
