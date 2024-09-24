"use client";
import { TextInput, Drawer, Sidebar, Avatar, Dropdown } from "flowbite-react";
import Link from "next/link";
import { IoSearch, IoMenu } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // for navigation
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState(""); // manage the search query state
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;
  const router = useRouter(); // next/navigation hook for client-side routing

  useEffect(() => {
    // Redirect to the homepage with or without a search query
    if (searchQuery.trim() === "") {
      // If search query is empty, show all data
      router.push(`/`);
    } else {
      // If search query exists, show filtered data
      router.push(`/?search=${searchQuery}`);
    }
  }, [searchQuery, router]);

  return (
    <div>
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center py-5 px-2 md:px-5 lg:px-10 bg-[#F5F7F8]">
          <Link href="/" className="text-3xl font-semibold">
            DevQuery
          </Link>
          <div className="flex items-center">
            <TextInput
              id="search"
              className="w-96"
              type="text"
              icon={IoSearch}
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // trigger search on typing
            />
          </div>
          {/* Auth logic */}
          {status === "loading" ? (
            <div>Loading...</div>
          ) : user ? (
            <Dropdown
              label={
                <div className="flex gap-2 items-center bg-transparent">
                  <Avatar img={user?.image} />
                  <h5 className="text-base font-semibold">{user?.name}</h5>
                </div>
              }
              dismissOnClick={false}
              className="flex gap-2 items-center"
            >
              <Dropdown.Item>Dashboard</Dropdown.Item>
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Item>Earnings</Dropdown.Item>
              <Dropdown.Item onClick={() => signOut()}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link href="/login" className="flex gap-2 items-center bg-blue-500 rounded-xl px-4 py-2">
              <h5 className="text-lg text-white font-semibold">Login</h5>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
