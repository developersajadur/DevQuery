"use client";
import { Avatar, Button, Drawer, Sidebar, TextInput } from "flowbite-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMenu, IoNotificationsOutline, IoSearch } from "react-icons/io5";
import { UserNavLinks, AdminNavLinks } from "./NavigationLinks";
import { TiMessages } from "react-icons/ti";

const Navbar = () => {
  const router = useRouter();
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
      {/* Desktop Navbar */}
      <div className="hidden md:flex justify-between items-center py-2 px-2 md:px-3 lg:px-4 bg-gradient-to-r from-blue-200 to-purple-400 shadow-lg rounded-b-3xl">
        <Link href="/" className="text-2xl font-semibold text-black hover:text-gray-200 transition duration-300">
          DevQuery
        </Link>
        <div className="flex items-center gap-4 lg:gap-10">
          <div className="hidden lg:block">
            <div className="flex items-center gap-4 font-semibold text-lg text-black">
              <Link href="/" className="hover:text-gray-200 transition duration-300">Home</Link>
              <Link href="#" className="hover:text-gray-200 transition duration-300">About Us</Link>
              <Link href="#" className="hover:text-gray-200 transition duration-300">Blogs</Link>
              <Link href="#" className="hover:text-gray-200 transition duration-300">Contact Us</Link>
            </div>
          </div>
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <TextInput
              id="search"
              className="lg:w-96 bg-white text-black border-2 border-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent shadow-md"
              type="text"
              icon={IoSearch}
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        {/* User actions */}
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
            <Link
              href="/login"
              className="flex gap-2 items-center bg-white rounded-lg px-3 py-1 hover:bg-gray-100 transition duration-300"
            >
              <h5 className="text-md text-blue-500 font-semibold">Login</h5>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="block md:hidden">
        <Drawer open={isOpen} onClose={handleClose}>
          <Drawer.Header title="MENU" />
          <Drawer.Items>
            <Sidebar aria-label="Sidebar with multi-level dropdown example">
              <div className="flex h-full flex-col justify-between py-2">
                <div>
                  <Sidebar.Items>
                    <Sidebar.ItemGroup>
                      <div className="text-lg font-medium mt-2">
                        {(showAdminLinks ? AdminNavLinks : UserNavLinks).map((item) => (
                          <Link
                            href={item.path}
                            key={item.path}
                            onClick={handleClose}
                            className="flex items-center gap-2 text-black hover:bg-blue-100 transition duration-300 p-2 rounded-lg"
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
              </div>
            </Sidebar>
          </Drawer.Items>
        </Drawer>
        <div className="">
          <div className="flex justify-between items-center py-2 px-2 bg-gradient-to-r from-blue-400 to-purple-500">
            <Button className="bg-transparent" onClick={() => setIsOpen(true)}>
              <IoMenu className="text-white text-2xl" />
            </Button>
            <Link href="/" className="text-xl font-semibold text-white">
              DevQuery
            </Link>
            <div>
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
                <Link
                  href="/login"
                  className="flex gap-2 items-center bg-white rounded-lg px-4 py-1 hover:bg-gray-100 transition duration-300"
                >
                  <h5 className="text-md text-blue-500 font-semibold">Login</h5>
                </Link>
              )}
            </div>
          </div>
          <form onSubmit={handleSearchSubmit} className="flex-grow mx-2">
            <TextInput
              id="search"
              type="text"
              icon={IoSearch}
              placeholder="Search..."
              required
              className="border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
