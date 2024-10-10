"use client";
import { Avatar, Button, Drawer, Sidebar, TextInput } from "flowbite-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // for navigation
import { useEffect, useState } from "react";
import { IoMenu, IoSearch } from "react-icons/io5";
import { UserNavLinks, AdminNavLinks } from "./NavigationLinks";

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session, status } = useSession(); // Check loading status
  const user = session?.user;
  const [showAdminLinks, setShowAdminLinks] = useState(false); // Initially false

  const handleClose = () => setIsOpen(false);

  // Handle search submission for mobile
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      router.push(`/?search=${searchQuery}`);
      handleClose(); // Close the drawer after search
    }
  };

  // Toggle between user and admin views and store the preference in localStorage
  const toggleView = () => {
    const newView = !showAdminLinks;
    setShowAdminLinks(newView);
    localStorage.setItem("showAdminLinks", JSON.stringify(newView)); // Store the new state
    
    // Redirect based on the new view
    if (newView) {
      router.push("/dashboard"); // Redirect to dashboard when switching to admin
    } else {
      router.push("/"); // Redirect to home when switching to user
    }
  };

  useEffect(() => {
    // Set the default role-based view after fetching session data
    if (status === "authenticated") {
      const savedView = localStorage.getItem("showAdminLinks");
      if (savedView !== null) {
        // If a preference exists in localStorage, use it
        setShowAdminLinks(JSON.parse(savedView));
      } else {
        // Otherwise, set based on the user's role
        setShowAdminLinks(user?.role === "admin");
      }
    }
  }, [user, status]);

  useEffect(() => {
    // Debounce search input changes for desktop
    if (searchQuery.trim() !== "") {
      const delayDebounceFn = setTimeout(() => {
        router.push(`/?search=${searchQuery}`);
      }, 500); // Debouncing for 500ms

      return () => clearTimeout(delayDebounceFn); // Cleanup on unmount or re-run
    }
  }, [searchQuery, router]);

  if (status === "loading") {
    return <div>Loading...</div>; // Show loading while session is being fetched
  }

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
          {user ? (
            <Link href={`/users/${user.id}`} className="">
              <Avatar img={user?.image || "/default-avatar.png"} />
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex gap-2 items-center bg-blue-500 rounded-xl px-4 py-2"
            >
              <h5 className="text-lg text-white font-semibold">Login</h5>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="block md:hidden">
        <Drawer open={isOpen} onClose={handleClose}>
          <Drawer.Header title="MENU" titleIcon={() => <></>} />
          <Drawer.Items>
            <Sidebar aria-label="Sidebar with multi-level dropdown example">
              <div className="flex h-full flex-col justify-between py-2">
                <div>
                  <Link href="/" className="text-2xl lg:text-3xl font-semibold">
                    DevQuery
                  </Link>
                  <Sidebar.Items>
                    <Sidebar.ItemGroup>
                      <div className="text-white flex flex-col gap-2 text-xl font-medium mt-2">
                        {(showAdminLinks ? AdminNavLinks : UserNavLinks).map(
                          (item) => (
                            <Link
                              href={item.path}
                              key={item.path}
                              onClick={handleClose} // Close Drawer on link click
                              className="flex items-center text-black gap-2"
                            >
                              {item.icon && <span>{item.icon}</span>}
                              {item.title}
                            </Link>
                          )
                        )}
                      </div>
                      <div className="flex justify-start mt-2 px-5">
                        <Button onClick={toggleView} className="bg-gray-500">
                          {showAdminLinks
                            ? "Switch to User"
                            : "Switch to Admin"}
                        </Button>
                      </div>
                    </Sidebar.ItemGroup>
                  </Sidebar.Items>
                </div>
              </div>
            </Sidebar>
          </Drawer.Items>
        </Drawer>

        <div className="flex justify-between items-center py-5 px-2 md:px-5 lg:px-10 bg-[#F5F7F8]">
          <Button
            className="w-fit bg-transparent"
            onClick={() => setIsOpen(true)}
          >
            <IoMenu className="text-black text-3xl" />
          </Button>
          {/* Mobile Search Form */}
          <form onSubmit={handleSearchSubmit} className="pb-3">
            <TextInput
              id="search"
              type="text"
              icon={IoSearch}
              placeholder="Search..."
              required
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          {/* Mobile Avatar */}
          <Link href="/">
            <Avatar
              className="w-10 h-10"
              img={
                user?.image ||
                "https://i.ibb.co/4g09B3N/beautiful-cat-with-fluffy-background-23-2150752750.jpg"
              }
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
