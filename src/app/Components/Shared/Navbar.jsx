"use client";
import { Avatar, Button, Drawer, Sidebar } from "flowbite-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMenu, IoNotificationsOutline } from "react-icons/io5";
import { UserNavLinks, AdminNavLinks } from "./NavigationLinks";
import { TiMessages } from "react-icons/ti";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session, status } = useSession();
  const user = session?.user;
  const [showAdminLinks, setShowAdminLinks] = useState(false);

  const handleClose = () => setIsOpen(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      if (pathname === "/" || pathname === "/questions") {
        router.push(`${pathname}?search=${searchQuery}`);
      }
      handleClose();
    }
  };

  const toggleView = () => {
    const newView = !showAdminLinks;
    setShowAdminLinks(newView);
    localStorage.setItem("showAdminLinks", JSON.stringify(newView));

    if (newView) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
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
        <div className="hidden lg:flex items-center gap-6  absolute  left-[20%] text-lg text-white">
          <Link href="/" className={`hover:text-gray-200 font-bold transition duration-300 ${pathname === "/" ? "text-blue-400" : ""}`}>
            Home
          </Link>
          <Link href="/about" className={`hover:text-gray-200 font-bold transition duration-300 ${pathname === "/about" ? "text-blue-400" : ""}`}>
            About Us
          </Link>
          <Link href="/blogs" className={`hover:text-gray-200 font-bold transition duration-300 ${pathname === "/blogs" ? "text-blue-400" : ""}`}>
            Blogs
          </Link>
          <Link href="/contact" className={`hover:text-gray-200 font-bold transition duration-300 ${pathname === "/contact" ? "text-blue-400" : ""}`}>
            Contact Us
          </Link>
          <Link href="/payments" className={`hover:text-gray-200 font-bold transition duration-300 ${pathname === "/contact" ? "text-blue-400" : ""}`}>
            Query Pro
          </Link>
        </div>
        <div className="flex items-center gap-6">
     <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto">
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative lg:w-60">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
              <button type="submit" className="text-white absolute inset-y-0 end-0 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg lg:rounded-l-none text-sm px-4 py-2">Search</button>
            </div>
          </form>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/chat">
                  <TiMessages className="text-2xl text-white hover:text-gray-200 transition duration-300" />
                </Link>
                <button className="hover:bg-gray-200 rounded-full p-1 transition duration-300">
                  <IoNotificationsOutline className="text-2xl text-white hover:text-gray-200 transition duration-300" />
                </button>
                <Link href={`/users/${user.id}`} className="flex">
                  <Avatar img={user?.image || "/default-avatar.png"} />
                </Link>
              </div>
            ) : (
              <Link href="/login">
                <button
                  type="button"
                  className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
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
                <Link href={`/users/${user.id}`} className="flex">
                  <Avatar img={user?.image || "/default-avatar.png"} />
                </Link>
                <button className="hover:bg-gray-200 rounded-full p-1 transition duration-300">
                  <TiMessages className="text-xl text-white hover:text-gray-200 transition duration-300" />
                </button>
                <button className="hover:bg-gray-200 rounded-full p-1 transition duration-300">
                  <IoNotificationsOutline className="text-xl text-white hover:text-gray-200 transition duration-300" />
                </button>
              </div>
            ) : (
              <Link href="/login">
                <button
                  type="button"
                  className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
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
                          className={`flex items-center gap-2 text-black hover:bg-blue-100 transition duration-300 p-2 rounded-lg ${pathname === item.path ? "bg-blue-100" : ""}`}
                        >
                          {item.icon && <span>{item.icon}</span>}
                          {item.title}
                        </Link>
                      ))}
                    </div>
                    <div className="flex justify-start mt-2 px-5">
                      <Button onClick={toggleView} className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300">
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
            <label htmlFor="mobile-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
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
              <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
