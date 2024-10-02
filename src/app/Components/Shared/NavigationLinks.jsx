import Link from 'next/link';
import React from 'react';
import { FaHome, FaUsers } from "react-icons/fa";
import { BsPatchQuestionFill } from "react-icons/bs";
import { MdOutlineCardTravel } from 'react-icons/md';

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
        {
            title: "Users",
            path: "/users",
            icon: <FaUsers />
        },
        {
            title: "Jobs",
            path: "/jobs",
            icon: <MdOutlineCardTravel />
          },
    ];
    return (
        <div className=''>
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