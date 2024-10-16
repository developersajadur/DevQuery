"use client"
import { EmailJSResponseStatus } from '@emailjs/browser';
import emailjs from '@emailjs/browser';
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
import { IoMdHome } from "react-icons/io";
import { MdDriveFileRenameOutline, MdEmail, MdOutlinePhone, MdSubject } from "react-icons/md";
import { FcBusinessContact } from "react-icons/fc";
import toast from 'react-hot-toast';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'


const Contact = () => {

  const [PhoneNumber, setPhoneNumber] = useState('')
  const [valid, setValid] = useState(true)

  const handleChange = (value) => {
    setPhoneNumber(value);
    setValid(validatePhoneNumber(value));
  }

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\d{10}$/;
    return phoneNumberPattern.test(phoneNumber)
  }

  const buttonForSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name");
    const email = form.get("email");
    const subject = form.get("subject");
    const message = form.get("message");

    // const serviceId = process.env.NEXT_SERVICE_ID
    // const templateId = process.env.NEXT_TEMPLATE_ID

    const contactInfo = {
      service_id: process.env.NEXT_PUBLIC_SERVICE_ID, // Updated
      template_id: process.env.NEXT_PUBLIC_TEMPLATE_ID, // Updated
      user_id: process.env.NEXT_PUBLIC_KEY, // Already correct
      template_params: { // Ensure this structure as previously discussed
        from_name: name,
        from_email: email,
        to_name: "DevQuery",
        from_number: PhoneNumber,
        subject: subject,
        message: message,
      },
    };

    console.log(contactInfo);

    try {
      const res = await axios.post("https://api.emailjs.com/api/v1.0/email/send", contactInfo, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res.data);
      if (res.data) {
        toast.success("Your Message has been sent")
      }
    } catch (error) {
      console.error("Error sending email:", error.response ? error.response.data : error.message);
    }
  };


  return (
    <div>
      <div className='px-4'>
        <nav aria-label="breadcrumb" className="w-full p-4 dark:bg-gray-100 dark:text-gray-800">
          <ol className="flex h-8 space-x-2">

            <li className="flex items-center">
              <IoMdHome />
              <Link href={'/'}><button rel="noopener noreferrer" className="flex items-center px-1 capitalize font-semibold">Home</button></Link>
            </li>

            <li className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" fill="currentColor" className="w-2 h-2 mt-1 transform rotate-90 fill-current dark:text-gray-400">
                <path d="M32 30.031h-32l16-28.061z"></path>
              </svg>
              <a rel="noopener noreferrer" className="flex items-center text-gray-600 px-1 capitalize cursor-default hover:text-ellipsis font-semibold">Contact Us</a>
            </li>
          </ol>
        </nav>
      </div>
      <hr />
      <div className=' bg-white mt-5 p-2'>
        <div className='pl-7'>
          <h1 className='font-bold text-xl flex gap-2 text-black items-center'><FcBusinessContact />Contact Us</h1>
          <p className='text-gray-700 text-sm'>We recognize the value of taking a comprehensive approach to every project and believe in the effectiveness of clear and straightforward communication. Should you have any questions, need assistance, or require our services, don’t hesitate to reach out. We encourage you to provide a detailed explanation of your issue so we can offer the most effective support.</p>
        </div>
        <div className='mt-5 mx-6'>
          <form onSubmit={buttonForSubmit}>
            <div className='grid grid-cols-2 gap-5'>

              {/* Name field */}
              <div>
                <label htmlFor="" className=' text-gray-700'><small>Name</small></label><br />
                <p className='absolute mt-2 pl-2 text-xl '><MdDriveFileRenameOutline /></p>
                <input type="text" name='name' required placeholder='Enter your name' className='w-full h-9 px-9 border-gray-200 rounded-sm border-[1px]' />
              </div>

              {/* Email field */}
              <div>
                <label htmlFor="" className=' text-gray-700'><small>Email</small></label><br />
                <p className='absolute mt-2 pl-2 text-xl '><MdEmail /></p>
                <input type="email" name='email' required placeholder='Enter email' className='w-full h-9 px-9 border-gray-200 rounded-sm border-[1px]' />
              </div>

              {/* Subject field */}
              <div>
                <label htmlFor="" className=' text-gray-700'><small>Subject</small></label><br />
                <p className='absolute mt-2 pl-2 text-xl '>
                  <MdSubject /></p>
                <input type="text" name='subject' required placeholder='Enter subject' className='w-full h-9 px-9 border-gray-200 rounded-sm border-[1px]' />
              </div>

              {/* Number field */}
              <div className='w-full pl-0'>
                <label htmlFor="" className=' text-gray-700'><small>Number</small></label><br />

                <PhoneInput
                  inputStyle={{ width: '100%' }}
                  onChange={handleChange}
                  country={'bd'}
                  type="number" value={PhoneNumber} inputProps={{
                    required: true
                  }} name='number' placeholder='Enter number' className='w-full border-gray-200 '
                />
              </div>

            </div>

            {/* Message field */}
            <div className='mt-4'>
              <label htmlFor="" className='text-gray-700'><small>Message</small></label><br />
              <textarea type="text" placeholder='Write the message' required name='message' rows="6" cols="88" className='w-full' />
            </div>

            <button className='bg-blue-600 p-2 text-bold w-full rounded-md'>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;