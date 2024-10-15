"use client";
import { Avatar, Button, Drawer, Sidebar, TextInput } from "flowbite-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMenu, IoNotificationsOutline, IoSearch } from "react-icons/io5";
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
      router.push(`/?search=${searchQuery}`);
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

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const delayDebounceFn = setTimeout(() => {
        router.push(`/?search=${searchQuery}`);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Desktop & Tablet Navbar */}
      <div className="hidden md:flex justify-between items-center py-3 px-2 h-20 bg-gray-800">
        <Link href="/" className="text-2xl font-bold text-white hover:text-gray-200 transition duration-300">
          DevQuery
        </Link>
        <div className="hidden lg:flex items-center gap-6 text-lg text-white">
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
        </div>
        <div className="flex items-center gap-6">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <TextInput
              id="search"
              className="w-64 bg-white text-black border-2 border-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent shadow-md"
              type="text"
              icon={IoSearch}
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
                        {showAdminLinks ? "Switch to User" : "Switch to Admin"}
                      </Button>
                    </div>
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
              </div>
            </Sidebar>
          </Drawer.Items>
        </Drawer>

        <form onSubmit={handleSearchSubmit} className="mt-2">
          <TextInput
            id="search"
            type="text"
            icon={IoSearch}
            placeholder="Search..."
            required
            className="border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default Navbar;
