import { Button, TextInput } from "flowbite-react";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";

const Navbar = () => {
  return (
    <div className="py-4">
      <div className="flex justify-between">
        <Link href="/" className="text-3xl font-bold">
          DevQuery
        </Link>
        <div className="">
          <div className="w-96">
            <TextInput
            className="w-full"
              id="search"
              type="text"
              icon={IoSearch}
              placeholder="Search..."
              required
            />
          </div>
        </div>
        <div className="">
            <Link href="/" className="bg-blue-700 py-3 px-5 rounded-lg text-white font-semibold">Login</Link>
          </div>
      </div>
    </div>
  );
};

export default Navbar;
