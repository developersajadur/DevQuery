"use client";
import { useForm } from "react-hook-form";
import { TextInput, Button, Drawer, Sidebar, Avatar, Dropdown } from "flowbite-react";
import Link from "next/link";
import { IoSearch, IoMenu } from "react-icons/io5";
import { useState } from "react";
import { BsPatchQuestionFill } from "react-icons/bs";
import { FaHome } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const route = useRouter();
  const { register, handleSubmit } = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;
  // console.log(user);


  const onSubmit = (data) => {
    console.log("Searching for:", data.searchQuery);
  };

  const handleClose = () => setIsOpen(false);

  const handleProfile = () => {
    route.push('/profile')
  }


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
            <form onSubmit={handleSubmit(onSubmit)} className="flex items-center">
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
              <Dropdown.Item onClick={handleProfile}>Profile</Dropdown.Item>
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

      {/* Mobile Navbar */}
      <div className="block md:hidden">
        <Drawer open={isOpen} onClose={handleClose}>
          <Drawer.Header title="MENU" titleIcon={() => <></>} />
          <Drawer.Items>
            <Sidebar aria-label="Sidebar with multi-level dropdown example">
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
          <Button className="w-fit bg-transparent" onClick={() => setIsOpen(true)}>
            <IoMenu className="text-black text-3xl" />
          </Button>
          <Link href="/" className="text-2xl lg:text-3xl font-semibold">
            DevQuery
          </Link>
          <Link href="/">
            <Avatar
              className="w-10 h-10"
              img="https://i.ibb.co/4g09B3N/beautiful-cat-with-fluffy-background-23-2150752750.jpg"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
