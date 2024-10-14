"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Footer from "../Components/Shared/Footer";
import Navbar from "../Components/Shared/Navbar";
import NavigationLinks from "../Components/Shared/NavigationLinks";
import Loading from "../Components/Loading/Loading";

const Root = ({ children }) => {
    const { status } = useSession();
    const [lastScrollPos, setLastScrollPos] = useState(0);
    const [hideNavbar, setHideNavbar] = useState(false);

    // Hide/show navbar on scroll
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;

            if (currentScrollPos > lastScrollPos) {
                // Scrolling down
                setHideNavbar(true);
            } else {
                // Scrolling up
                setHideNavbar(false);
            }

            setLastScrollPos(currentScrollPos);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollPos]);

    if (status === "loading") {
        return <Loading />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <header
                className={`border-b bg-white shadow-sm w-full z-50 rounded-b-3xl fixed top-0 transition-transform duration-300 ${
                    hideNavbar ? "-translate-y-full" : "translate-y-0"
                }`}
            >
                <Navbar />
            </header>

            {/* Main Wrapper */}
            <div
                className={`flex flex-1 pt-[30px] md:pt-[30px] transition-all duration-300 ${
                    hideNavbar ? "mt-0" : "mt-[80px] md:mt-[96px]"
                }`}
            >
                {/* Container to Center Sidebar and Main Content */}
                <div className="flex w-full max-w-7xl mx-auto">
                    {/* Enhanced Fixed Sidebar with Preferred Color Palette */}
                    <aside className="hidden lg:block fixed lg:w-64 bg-gradient-to-r from-[rgb(58,190,249)] to-[rgb(167,230,255)] text-white h-full shadow-lg rounded-lg">
                        <div
                            className={`transition-all duration-300 ${
                                hideNavbar ? "mt-[0px]" : "mt-[80px] md:mt-[96px]"
                            }`}
                        >
                            <NavigationLinks className="flex flex-col space-y-2" />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 lg:ml-64 p-4 md:p-8 bg-gray-50 min-h-screen transition-all duration-300">
                        <section className="w-full h-full">
                            {children}
                        </section>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white shadow-sm mt-auto z-50">
                <Footer />
            </footer>
        </div>
    );
};

export default Root;
