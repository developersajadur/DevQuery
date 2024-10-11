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
      <div className="hidden md:flex justify-between items-center py-5 px-2 md:px-5 lg:px-10 bg-[#F5F7F8]">
        <Link href="/" className="text-3xl font-semibold">
          DevQuery
        </Link>
        <div className="flex items-center gap-4 lg:gap-20">
          <div className="hidden lg:block">
            <div className="flex items-center gap-4 font-semibold text-xl">
              <Link href="/">Home</Link>
              <Link href="#">About Us</Link>
              <Link href="#">Blogs</Link>
              <Link href="#">Contact Us</Link>
            </div>
          </div>
          <TextInput
            id="search"
            className="lg:w-96"
            type="text"
            icon={IoSearch}
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* User actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href={`/users/${user.id}`} className="flex">
                <Avatar img={user?.image || "/default-avatar.png"} />
              </Link>
              <Link href="/chat">
                <TiMessages className="text-3xl" />
              </Link>
              <button>
                <IoNotificationsOutline className="text-3xl" />
              </button>
            </div>
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
          <Drawer.Header title="MENU" />
          <Drawer.Items>
            <Sidebar aria-label="Sidebar with multi-level dropdown example">
              <div className="flex h-full flex-col justify-between py-2">
                <div>
                  {/* <Link href="/" className="text-2xl lg:text-3xl font-semibold">
                    DevQuery
                  </Link> */}
                  <Sidebar.Items>
                    <Sidebar.ItemGroup>
                      <div className="text-xl font-medium mt-2">
                        {(showAdminLinks ? AdminNavLinks : UserNavLinks).map(
                          (item) => (
                            <Link
                              href={item.path}
                              key={item.path}
                              onClick={handleClose}
                              className="flex items-center gap-2 text-black"
                            >
                              {item.icon && <span>{item.icon}</span>}
                              {item.title}
                            </Link>
                          )
                        )}
                      </div>
                      <div className="flex justify-start mt-2 px-5">
                        <Button onClick={toggleView}>
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
        <div className="flex justify-between items-center py-5 px-2 bg-[#F5F7F8]">
          <Button className="bg-transparent" onClick={() => setIsOpen(true)}>
            <IoMenu className="text-black text-3xl" />
          </Button>
           <Link href="/" className="text-2xl font-semibold">
          DevQuery
        </Link>
          <div>
            {user ? (
                 <div className="flex items-center gap-3">
                 <Link href={`/users/${user.id}`} className="flex">
                   <Avatar img={user?.image || "/default-avatar.png"} />
                 </Link>
                 <button>
                   <TiMessages className="text-2xl" />
                 </button>
                 <button>
                   <IoNotificationsOutline className="text-2xl" />
                 </button>
               </div>
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
        <form onSubmit={handleSearchSubmit} className="flex-grow mx-2">
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
        </div>
      </div>
    </div>
  );
};

export default Navbar;
