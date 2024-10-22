import { Avatar, Button, Drawer, Sidebar } from "flowbite-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { IoMenu, IoNotificationsOutline } from "react-icons/io5";
import { UserNavLinks, AdminNavLinks } from "./NavigationLinks";
import { TiMessages } from "react-icons/ti";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../Loading/Loading";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;
  const [showAdminLinks, setShowAdminLinks] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch user by email
  const { data: user } = useQuery({
    queryKey: ["user", userEmail],
    queryFn: () =>
      axios.get(`/users/api/get-one?email=${userEmail}`).then((res) => res.data.user),
    enabled: !!userEmail,
  });

  // Fetch notifications when dropdown is open
  const { data: notifications, error, isLoading } = useQuery({
    queryKey: ["notifications", userEmail, isDropdownOpen],
    queryFn: () =>
      axios.get(`/users/api/notifications/get?userEmail=${userEmail}`).then((res) => res.data.notifications),
    enabled: !!userEmail && isDropdownOpen,
  });


  // Handle closing of the mobile drawer
  const handleClose = () => setIsOpen(false);

  // Toggle the dropdown for notifications
  const toggleNotificationsDropdown = () => setIsDropdownOpen((prev) => !prev);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search submission
  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim() !== "") {
        const targetPath = pathname === "/" || pathname === "/questions" ? `${pathname}?search=${searchQuery}` : "/";
        router.push(targetPath);
        handleClose();
      }
    },
    [searchQuery, pathname, router]
  );

  // Toggle between Admin and User views
  const toggleView = () => {
    const newView = !showAdminLinks;
    setShowAdminLinks(newView);
    localStorage.setItem("showAdminLinks", JSON.stringify(newView));
    router.push(newView ? "/dashboard" : "/");
  };

  // Load saved view on component mount
  useEffect(() => {
    if (status === "authenticated") {
      const savedView = localStorage.getItem("showAdminLinks");
      if (savedView !== null) {
        setShowAdminLinks(JSON.parse(savedView));
      } else {
        setShowAdminLinks(user?.role === "admin");
      }
    }
  }, [user, status]);

  if (status === "loading") {
    return <Loading/>;
  }

  return (
    <div>
      {/* Desktop & Tablet Navbar */}
      <div className="hidden md:flex justify-between items-center py-3 px-10 relative h-20 bg-gray-800">
        <Link href="/" className="text-2xl font-bold text-white hover:text-gray-200 transition duration-300">
          DevQuery
        </Link>
        <div className="hidden lg:flex items-center gap-6 absolute left-[20%] text-lg text-white">
          {["/", "/about", "/blogs", "/contact", "/subscription"].map((path, index) => (
            <Link
              href={path}
              key={index}
              className={`hover:text-gray-200 font-bold transition duration-300 ${pathname === path ? "text-blue-400" : ""}`}
            >
              {path === "/" ? "Home" : path.substring(1).charAt(0).toUpperCase() + path.substring(2)}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto">
            <div className="relative lg:w-60">
              <input
                type="search"
                id="default-search"
                className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
              <button
                type="submit"
                className="text-white absolute inset-y-0 end-0 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg lg:rounded-l-none text-sm px-4 py-2"
              >
                Search
              </button>
            </div>
          </form>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/chat">
                  <TiMessages className="text-2xl text-white  hover:text-red-600  transition duration-300" />
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleNotificationsDropdown}
                    className="rounded-full p-1 hover:border-red-600 transition duration-300"
                  >
                    <IoNotificationsOutline className="text-2xl text-white hover:text-red-600 transition duration-300" />
                  </button>
                  {isDropdownOpen && (
                   <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-10">
                   <div className="p-4">
                     <h3 className="text-lg font-medium text-gray-700">Notifications</h3>
                     <div className="mt-4 space-y-3 max-h-72 overflow-y-auto"> {/* Tailwind classes for fixed height and scroll */}
                       {isLoading ? (
                         <p className="text-sm text-gray-500">Loading notifications...</p>
                       ) : error ? (
                         <p className="text-sm text-red-500">Error loading notifications.</p>
                       ) : notifications?.length > 0 ? (
                         notifications?.map((notification, index) => (
                           <div key={index} className="flex items-start space-x-3 hover:bg-[#F4F6FF] p-2 border-b last:border-none">
                             <Link href={`${process.env.NEXT_PUBLIC_WEB_URL}/${notification?.questionLink}`} className="flex-1">
                               <p className="text-sm font-semibold text-gray-700">{notification.content}</p>
                               <p className="text-xs text-gray-500">
                                 {new Date(notification.date).toLocaleString()}
                               </p>
                             </Link>
                           </div>
                         ))
                       ) : (
                         <p className="text-sm text-gray-500">No notifications.</p>
                       )}
                     </div>
                   </div>
                 </div>
                 
                  )}
                </div>
                <Link href={`/users/${user._id}`}>
                  <Avatar img={user?.image || "/default-avatar.png"} />
                </Link>
              </div>
            ) : (
              <Link href="/login">
                <button
                  type="button"
                  className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-300"
                >
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-between items-center h-20 bg-gray-800 px-4">
        <Link href="/" className="text-xl font-bold text-white hover:text-gray-200 transition duration-300">
          DevQuery
        </Link>
        <button onClick={() => setIsOpen(true)} className="text-white">
          <IoMenu className="text-2xl" />
        </button>
        <Drawer show={isOpen} onClose={handleClose}>
          <div className="flex flex-col items-start p-4">
            {["/", "/about", "/blogs", "/contact", "/subscription"].map((path, index) => (
              <Link
                href={path}
                key={index}
                className={`block py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-300 ${pathname === path ? "bg-gray-700 text-blue-500" : ""}`}
                onClick={handleClose}
              >
                {path === "/" ? "Home" : path.substring(1).charAt(0).toUpperCase() + path.substring(2)}
              </Link>
            ))}
            <form onSubmit={handleSearchSubmit} className="w-full mt-4">
              <input
                type="search"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
              <button type="submit" className="mt-2 w-full bg-blue-500 text-white rounded-lg p-2">
                Search
              </button>
            </form>
            <div className="mt-4">
              {user ? (
                <Link href={`/users/${user._id}`} onClick={handleClose}>
                  <Avatar img={user?.image || "/default-avatar.png"} />
                </Link>
              ) : (
                <Link href="/login" onClick={handleClose}>
                  <button className="w-full bg-purple-600 text-white rounded-lg p-2">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default Navbar;
