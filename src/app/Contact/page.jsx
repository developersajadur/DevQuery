"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { IoMdHome } from "react-icons/io";
import { MdDriveFileRenameOutline, MdEmail, MdOutlinePhone, MdSubject } from "react-icons/md";
import { FcBusinessContact } from "react-icons/fc";
import toast from 'react-hot-toast';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FaSpinner } from "react-icons/fa"; // Spinner Icon for loader

const Contact = () => {
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [valid, setValid] = useState(true);
  const [loading, setLoading] = useState(false); // Loading state for button

  const handleChange = (value) => {
    setPhoneNumber(value);
    setValid(validatePhoneNumber(value));
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\d{10}$/;
    return phoneNumberPattern.test(phoneNumber);
  };

  const buttonForSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loader
    const form = new FormData(e.currentTarget);
    const name = form.get("name");
    const email = form.get("email");
    const subject = form.get("subject");
    const message = form.get("message");

    const contactInfo = {
      service_id: process.env.NEXT_PUBLIC_SERVICE_ID,
      template_id: process.env.NEXT_PUBLIC_TEMPLATE_ID,
      user_id: process.env.NEXT_PUBLIC_KEY,
      template_params: {
        from_name: name,
        from_email: email,
        to_name: "DevQuery",
        from_number: PhoneNumber,
        subject: subject,
        message: message,
      },
    };

    try {
      const res = await axios.post("https://api.emailjs.com/api/v1.0/email/send", contactInfo, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data) {
        toast.success("Your Message has been sent");
        setLoading(false); // Stop loader
      }
    } catch (error) {
      console.error("Error sending email:", error.response ? error.response.data : error.message);
      toast.error("Failed to send your message. Please try again.");
      setLoading(false); // Stop loader
    }
  };

  return (
    <div>
      <div className='px-4'>
        <nav aria-label="breadcrumb" className="w-full p-4 dark:bg-gray-100 dark:text-gray-800">
          <ol className="flex h-8 space-x-2">
            <li className="flex items-center">
              <IoMdHome />
              <Link href={'/'}>
                <button className="flex items-center px-1 capitalize font-semibold">Home</button>
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" fill="currentColor" className="w-2 h-2 mt-1 transform rotate-90 fill-current dark:text-gray-400">
                <path d="M32 30.031h-32l16-28.061z"></path>
              </svg>
              <span className="flex items-center text-gray-600 px-1 capitalize font-semibold">Contact Us</span>
            </li>
          </ol>
        </nav>
      </div>
      <hr />
      <div className='bg-white mt-5 p-6 rounded-lg shadow-md'>
        <div className='pl-7'>
          <h1 className='font-bold text-2xl flex gap-2 items-center text-black'><FcBusinessContact />Contact Us</h1>
          <p className='text-gray-700 mt-2'>We value clear and straightforward communication. Feel free to reach out with any questions or support needs. Provide a detailed explanation so we can assist you effectively.</p>
        </div>
        <div className='mt-5 mx-6'>
          <form onSubmit={buttonForSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              {/* Name field */}
              <div>
                <label className='text-gray-700'><small>Name</small></label>
                <div className="relative">
                  <MdDriveFileRenameOutline className="absolute top-3 left-2 text-xl text-gray-600" />
                  <input type="text" name='name' required placeholder='Enter your name' className='w-full h-10 pl-9 pr-4 border-gray-200 rounded-sm border-[1px]' />
                </div>
              </div>

              {/* Email field */}
              <div>
                <label className='text-gray-700'><small>Email</small></label>
                <div className="relative">
                  <MdEmail className="absolute top-3 left-2 text-xl text-gray-600" />
                  <input type="email" name='email' required placeholder='Enter email' className='w-full h-10 pl-9 pr-4 border-gray-200 rounded-sm border-[1px]' />
                </div>
              </div>

              {/* Subject field */}
              <div>
                <label className='text-gray-700'><small>Subject</small></label>
                <div className="relative">
                  <MdSubject className="absolute top-3 left-2 text-xl text-gray-600" />
                  <input type="text" name='subject' required placeholder='Enter subject' className='w-full h-10 pl-9 pr-4 border-gray-200 rounded-sm border-[1px]' />
                </div>
              </div>

              {/* Number field */}
              <div>
                <label className='text-gray-700'><small>Phone Number</small></label>
                <PhoneInput
                  inputStyle={{ width: '100%', height: '40px' }}
                  onChange={handleChange}
                  country={'bd'}
                  value={PhoneNumber}
                  inputProps={{ required: true }}
                />
              </div>
            </div>

            {/* Message field */}
            <div className='mt-4'>
              <label className='text-gray-700'><small>Message</small></label>
              <textarea placeholder='Write your message' required name='message' rows="5" className='w-full h-28 p-3 border-gray-200 rounded-sm border-[1px]' />
            </div>

            <button className='bg-blue-600 text-white font-bold p-2 w-full mt-5 rounded-md flex justify-center items-center'>
              {loading ? <FaSpinner className="animate-spin mr-2" /> : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
