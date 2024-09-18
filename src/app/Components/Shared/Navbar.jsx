"use client"
import { useForm } from "react-hook-form";
import { TextInput } from "flowbite-react";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";

const Navbar = () => {
  const { register, handleSubmit } = useForm(); // Using react-hook-form

  const onSubmit = (data) => {
    console.log("Searching for:", data.searchQuery); // Log or handle the search input
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold">
          DevQuery
        </Link>
        <div className="w-96">
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              id="search"
              type="text"
              icon={IoSearch}
              placeholder="Search..."
              required
              {...register("searchQuery")} // Registering the input field
            />
          </form>
        </div>
        <div>
          <Link
            href="/"
            className="bg-blue-500 py-3 px-5 rounded-lg text-white font-semibold"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
