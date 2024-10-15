"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Footer from "../Components/Shared/Footer";
import Navbar from "../Components/Shared/Navbar";
import NavigationLinks from "../Components/Shared/NavigationLinks";
import Loading from "../Components/Loading/Loading";
import Bannar from "../Components/Bannar/page.jsx";

const Root = ({ children }) => {
    const { status } = useSession();
    const [isSidebarFixed, setIsSidebarFixed] = useState(false);

    // Function to check if the screen is large
    const isLargeScreen = () => window.innerWidth >= 1024;

    // Fix sidebar when banner finishes scrolling (only for large screens)
    useEffect(() => {
        const handleScroll = () => {
            if (isLargeScreen()) {
                const currentScrollPos = window.scrollY;
                const bannerHeight = 250; // Adjust this value based on your banner's height

                if (currentScrollPos > bannerHeight) {
                    setIsSidebarFixed(true);
                } else {
                    setIsSidebarFixed(false);
                }
            }
        };

        const handleResize = () => {
            // Reset sidebar state on window resize if not a large screen
            if (!isLargeScreen()) {
                setIsSidebarFixed(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    if (status === "loading") {
        return <Loading />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header (Navbar) */}
            <header className="border-b bg-gray-800 shadow-sm w-full z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Navbar />
                </div>
            </header>

            {/* Full-width Banner */}
            <div className="mt-0 w-full bg-gradient-to-r from-[rgb(58,190,249)] to-[rgb(167,230,255)]">
                <Bannar />
            </div>

            {/* Main Wrapper */}
            <div className="flex flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Sidebar (will be sticky or fixed when scrolling only on large screens) */}
                <aside
                    className={`hidden lg:block lg:w-64 text-white border-r-2 border-gray-200`}
                    style={{
                        position: isSidebarFixed ? "fixed" : "sticky",
                        top: "0", // Set to 0 for sticky behavior
                        height: "100vh", // Ensure the sidebar is full height
                    }}
                >
                    <NavigationLinks className="flex flex-col space-y-2 p-4" />
                </aside>

                {/* Main Content */}
                <main
                    className={`flex-1 p-4 md:p-8 bg-gray-50 min-h-screen ${
                        isSidebarFixed ? "lg:ml-64" : ""
                    }`}
                >
                    <section className="w-full h-full">{children}</section>
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white shadow-sm mt-auto z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Footer />
                </div>
            </footer>
        </div>
    );
};

export default Root;
