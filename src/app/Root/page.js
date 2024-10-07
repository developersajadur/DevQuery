"use client"
import { useSession } from "next-auth/react";
import Footer from "../Components/Shared/Footer";
import Navbar from "../Components/Shared/Navbar";
import NavigationLinks from "../Components/Shared/NavigationLinks";
import Loading from "../Components/Loading/Loading";

const Root = ({children}) => {
    const { status } = useSession();
if(status === "loading"){
    return <Loading/>; 
}
    return (
        <div>
                      {/* Wrapping the app with React Query Provider */}
                      <div className="flex flex-col min-h-screen">
              {/* Navbar */}
              <header className="border-b-[#A1D6B2] border-b-[1px] rounded-b-xl">
                <Navbar />
              </header>

              {/* Main Content */}
              <main className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="md:w-52 hidden md:block min-h-screen overflow-y-auto border-r pl-4 border-[#A1D6B2]">
                  <NavigationLinks />
                </aside>

                {/* Main content */}
                <section className="w-full h-full overflow-y-auto">
                  {children}
                </section>
              </main>

              {/* Footer */}
              <footer className="mt-auto">
                <Footer />
              </footer>
            </div>
        </div>
    );
};

export default Root;