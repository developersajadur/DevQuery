"use client";
import { Avatar, Button, Drawer, Sidebar } from "flowbite-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { IoMenu, IoNotificationsOutline } from "react-icons/io5";
import { UserNavLinks, AdminNavLinks } from "./NavigationLinks";
import { TiMessages } from "react-icons/ti";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


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


  const handleClose = () => setIsOpen(false);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      const targetPath = pathname === "/" || pathname === "/questions" ? `${pathname}?search=${searchQuery}` : "/";
      router.push(targetPath);
      handleClose();
    }
  };


  const toggleView = () => {
    const newView = !showAdminLinks;
    setShowAdminLinks(newView);
    localStorage.setItem("showAdminLinks", JSON.stringify(newView));
    router.push(newView ? "/dashboard" : "/");
  };


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

  if (status === "loading") {
    return <div>Loading...</div>;
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
              className={`hover:text-gray-200 font-bold transition duration-300 ${
                pathname === path ? "text-blue-400" : ""
              }`}
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
                  <TiMessages className="text-2xl text-white hover:text-gray-200 transition duration-300" />
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
                        notifications
                          ?.sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((notification, index) => (
                            <div key={index} className="flex items-start space-x-3 hover:bg-[#F4F6FF] p-2 border-b last:border-none">
                              <Link href={`${process.env.NEXT_PUBLIC_WEB_URL}/${notification?.questionLink}`} className="flex-1">
                                <p className="text-sm font-semibold text-gray-700">{notification.content}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(notification.date).toLocaleString()}
                                </p>
                              </Link>
                            </div>
                          ))
                      )  : (
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
                  className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>


      {/* Mobile Navbar */}
      <div className="block md:hidden bg-gray-800 px-4 py-2">
        <div className="flex justify-between items-center">
          <Button className="bg-transparent" onClick={() => setIsOpen(true)}>
            <IoMenu className="text-white text-2xl" />
          </Button>
          <Link href="/" className="text-xl font-semibold text-white">
            DevQuery
          </Link>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href={`/users/${user._id}`}>
                  <Avatar img={user?.image || "/default-avatar.png"} />
                </Link>
                <Link href="/chat">
                  <TiMessages className="text-2xl text-white hover:text-gray-200 transition duration-300" />
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
                        notifications
                          ?.sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((notification, index) => (
                            <div key={index} className="flex items-start space-x-3 hover:bg-[#F4F6FF] p-2 border-b last:border-none">
                              <Link href={`${process.env.NEXT_PUBLIC_WEB_URL}${notification?.questionLink}`} className="flex-1">
                                <p className="text-sm font-semibold text-gray-700">{notification.content}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(notification.date).toLocaleString()}
                                </p>
                              </Link>
                            </div>
                          ))
                      )  : (
                         <p className="text-sm text-gray-500">No notifications.</p>
                       )}
                     </div>
                   </div>
                 </div>
                 
                  )}
                </div>

              </div>
            ) : (
              <Link href="/login">
                <button
                  type="button"
                  className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>


        <Drawer open={isOpen} onClose={handleClose}>
          <Drawer.Header title="MENU" />
          <Drawer.Items>
            <Sidebar aria-label="Sidebar with multi-level dropdown example">
              <div className="flex h-full flex-col justify-between py-2">
                <Sidebar.Items>
                  <Sidebar.ItemGroup>
                    <div className="text-lg font-medium mt-2">
                      {(showAdminLinks ? AdminNavLinks : UserNavLinks).map((item) => (
                        <Link
                          href={item.path}
                          key={item.path}
                          onClick={handleClose}
                          className={`flex items-center gap-2 text-black hover:bg-blue-100 transition duration-300 p-2 rounded-lg ${
                            pathname === item.path ? "bg-blue-100" : ""
                          }`}
                        >
                          {item.icon && <span>{item.icon}</span>}
                          {item.title}
                        </Link>
                      ))}
                    </div>
                    <div className="flex justify-start mt-2 px-5">
                      <Button
                        onClick={toggleView}
                        className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
                      >
                        {showAdminLinks ? "User View" : "Admin View"}
                      </Button>
                    </div>
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
              </div>
            </Sidebar>
          </Drawer.Items>
        </Drawer>


        <div className="mt-3">
          <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="search"
                id="mobile-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search Mockups, Logos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
              <button
                type="submit"
                className="text-white absolute inset-y-0 end-0 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


export default Navbar;



