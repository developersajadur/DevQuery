"use client";
import { useForm } from "react-hook-form";
import { TextInput, Button, Drawer, Sidebar, Avatar } from "flowbite-react";
import Link from "next/link";
import { IoSearch, IoMenu } from "react-icons/io5";
import { useState } from "react";
import {
  HiChartPie,
  HiClipboard,
  HiCollection,
  HiInformationCircle,
  HiLogin,
  HiPencil,
  HiSearch,
  HiShoppingBag,
  HiUsers,
} from "react-icons/hi";
import { BsPatchQuestionFill } from "react-icons/bs";
import { FaHome } from "react-icons/fa";

const Navbar = () => {
  const { register, handleSubmit } = useForm();
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = (data) => {
    console.log("Searching for:", data.searchQuery);
  };

  const handleClose = () => setIsOpen(false);

  const navLinks = [
    {
      title: "Home",
      path: "/",
      icon: <FaHome />,
    },
    {
      title: "Questions",
      path: "/questions",
      icon: <BsPatchQuestionFill />,
    },
  ];

  return (
    <div>
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center py-5 px-2 md:px-5 lg:px-10 bg-[#F5F7F8]">
          <Link href="/" className="text-3xl font-semibold">
            DevQuery
          </Link>
          <div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex items-center"
            >
              <TextInput
                id="search"
                className="w-96"
                type="text"
                icon={IoSearch}
                placeholder="Search..."
                required
                {...register("searchQuery")}
              />
            </form>
          </div>
          <Link
            href="/login"
            className="bg-blue-500 py-3 px-5 rounded-lg text-white font-semibold"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="block md:hidden">
        <Drawer open={isOpen} onClose={handleClose}>
          <Drawer.Header title="MENU" titleIcon={() => <></>} />
          <Drawer.Items>
            <Sidebar
              aria-label="Sidebar with multi-level dropdown example"
              className="[&>div]:bg-transparent [&>div]:p-0"
            >
              <div className="flex h-full flex-col justify-between py-2">
                <div>
                  <form onSubmit={handleSubmit(onSubmit)} className="pb-3">
                    <TextInput
                      id="search"
                      type="text"
                      icon={IoSearch}
                      placeholder="Search..."
                      required
                      {...register("searchQuery")}
                    />
                  </form>
                  <Sidebar.Items>
                    <Sidebar.ItemGroup>
                      <div className="text-white flex flex-col gap-2 text-xl font-medium mt-2">
                        {navLinks.map((item) => (
                          <Link
                            href={item.path}
                            key={item.path}
                            onClick={handleClose} // Close Drawer on link click
                            className="flex items-center text-black gap-2"
                          >
                            {item.icon && <span>{item.icon}</span>}
                            {item.title}
                          </Link>
                        ))}
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
          <Link href="/" className="text-2xl lg:text-3xl font-semibold">
            DevQuery
          </Link>
          <Link href="/">
            <Avatar
              className="w-10 h-10"
              img="https://i.ibb.co.com/4g09B3N/beautiful-cat-with-fluffy-background-23-2150752750.jpg"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
