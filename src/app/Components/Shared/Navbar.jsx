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
    const { data: session, status } = useSession();
    const user = session?.user;

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAdminLinks, setShowAdminLinks] = useState(false);

    // Fetch initial admin/user view state from local storage
    useEffect(() => {
        if (status === "authenticated") {
            const savedView = localStorage.getItem("showAdminLinks");
            setShowAdminLinks(savedView ? JSON.parse(savedView) : user?.role === "admin");
        }
    }, [user, status]);

    // Handle search functionality with debounce
    useEffect(() => {
        if (searchQuery.trim() !== "") {
            const delayDebounceFn = setTimeout(() => {
                router.push(`/?search=${searchQuery}`);
            }, 500);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [searchQuery, router]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/?search=${searchQuery}`);
            setIsOpen(false);
        }
    };

    const toggleView = () => {
        const newView = !showAdminLinks;
        setShowAdminLinks(newView);
        localStorage.setItem("showAdminLinks", JSON.stringify(newView));
        router.push(newView ? "/dashboard" : "/");
    };

    const handleClose = () => setIsOpen(false);

    if (status === "loading") return <div>Loading...</div>;

    return (
        <div>
            {/* Desktop Navbar */}
            <div className="hidden md:flex justify-between items-center py-2 px-2 md:px-3 lg:px-4 bg-gradient-to-r from-[rgb(5,12,156)] to-[rgb(53,114,239)] shadow-lg rounded-b-3xl">
                <Link href="/" className="text-2xl font-semibold text-white hover:text-gray-200 transition duration-300">
                    DevQuery
                </Link>
                <div className="flex items-center gap-4 lg:gap-10">
                    <nav className="hidden lg:flex items-center gap-4 text-white">
                        {["Home", "About Us", "Blogs", "Contact Us"].map((text) => (
                            <Link key={text} href="#" className="hover:text-gray-200 transition duration-300">
                                {text}
                            </Link>
                        ))}
                    </nav>
                    <form onSubmit={handleSearchSubmit} className="flex items-center">
                        <TextInput
                            id="search"
                            type="text"
                            icon={IoSearch}
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="lg:w-96 bg-white text-black border-2 border-[rgb(58,190,249)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(58,190,249)]"
                        />
                    </form>
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link href="/chat">
                                <TiMessages className="text-2xl text-white hover:text-gray-200 transition duration-300" />
                            </Link>
                            <button className="hover:bg-[rgb(167,230,255)] rounded-full p-1 transition duration-300">
                                <IoNotificationsOutline className="text-2xl text-white hover:text-gray-200 transition duration-300" />
                            </button>
                            <Link href={`/users/${user.id}`} className="flex">
                                <Avatar img={user?.image || "/default-avatar.png"} />
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login" className="flex gap-2 items-center bg-white rounded-lg px-3 py-1 hover:bg-[rgb(167,230,255)] transition duration-300">
                            <h5 className="text-md text-[rgb(5,12,156)] font-semibold">Login</h5>
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Navbar */}
            <div className="block md:hidden">
                <Drawer open={isOpen} onClose={handleClose}>
                    <Drawer.Header title="MENU" />
                    <Drawer.Items>
                        <Sidebar aria-label="Sidebar with links">
                            <div className="flex h-full flex-col justify-between py-2">
                                <Sidebar.Items>
                                    <Sidebar.ItemGroup>
                                        <nav className="text-lg font-medium mt-2">
                                            {(showAdminLinks ? AdminNavLinks : UserNavLinks).map((item) => (
                                                <Link
                                                    href={item.path}
                                                    key={item.path}
                                                    onClick={handleClose}
                                                    className="flex items-center gap-2 text-black hover:bg-[rgb(58,190,249)] transition duration-300 p-2 rounded-lg"
                                                >
                                                    {item.icon && <span>{item.icon}</span>}
                                                    {item.title}
                                                </Link>
                                            ))}
                                        </nav>
                                        <Button onClick={toggleView} className="bg-[rgb(5,12,156)] text-white hover:bg-[rgb(53,114,239)] transition duration-300 mt-2">
                                            {showAdminLinks ? "Switch to User" : "Switch to Admin"}
                                        </Button>
                                    </Sidebar.ItemGroup>
                                </Sidebar.Items>
                            </div>
                        </Sidebar>
                    </Drawer.Items>
                </Drawer>
                <div className="flex justify-between items-center py-2 px-2 bg-gradient-to-r from-[rgb(5,12,156)] to-[rgb(53,114,239)]">
                    <Button className="bg-transparent" onClick={() => setIsOpen(true)}>
                        <IoMenu className="text-white text-2xl" />
                    </Button>
                    <Link href="/" className="text-xl font-semibold text-white">
                        DevQuery
                    </Link>
                    <div className="flex items-center">
                        {user ? (
                            <>
                                <Link href={`/users/${user.id}`} className="flex">
                                    <Avatar img={user?.image || "/default-avatar.png"} />
                                </Link>
                                <TiMessages className="text-xl text-white hover:text-gray-200 transition duration-300 ml-2" />
                                <IoNotificationsOutline className="text-xl text-white hover:text-gray-200 transition duration-300 ml-2" />
                            </>
                        ) : (
                            <Link href="/login" className="flex items-center bg-white rounded-lg px-4 py-1 hover:bg-[rgb(167,230,255)] transition duration-300">
                                <h5 className="text-md text-[rgb(5,12,156)] font-semibold">Login</h5>
                            </Link>
                        )}
                    </div>
                </div>
                <form onSubmit={handleSearchSubmit} className="mx-2 mt-2">
                    <TextInput
                        id="search"
                        type="text"
                        icon={IoSearch}
                        placeholder="Search..."
                        className="w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(58,190,249)]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
            </div>
        </div>
    );
};

export default Navbar;
