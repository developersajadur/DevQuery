import Link from 'next/link';
import React from 'react';
import { FaHome } from "react-icons/fa";
import { BsPatchQuestionFill } from "react-icons/bs";

const NavigationLinks = () => {
    const navLinks = [
        {
            title: "Home",
            path: "/",
            icon:  <FaHome />
        },
        {
            title: "Questions",
            path: "/questions",
            icon: <BsPatchQuestionFill />
        },
    ];
    return (
        <div className=' w-48 min-h-screen overflow-y-scroll border-r-[1px] border-blue-500'>
              <div className='text-white flex flex-col gap-2 text-xl font-medium mt-8'>
                {
                    navLinks.map((item) => (
                        <Link href={item.path} key={item.path} className=" flex items-center text-black gap-2">
                            {item.icon && <span>{item.icon}</span>}
                            {item.title}
                        </Link>
                    ))
                }
            </div>
        </div>
    );
};

export default NavigationLinks;