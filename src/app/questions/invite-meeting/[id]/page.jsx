"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Loading from "@/app/Components/Loading/Loading";

const InviteMeeting = ({ params }) => {
  const { data: session } = useSession();
  const currentUser = session?.user || {};
  const questionId = params?.id;

  // Fetch question by id
  const {
    data: question,
    isError: questionError,
    isLoading: questionLoading,
  } = useQuery({
    queryKey: ["question", questionId],
    queryFn: () =>
      axios
        .get(`/questions/api/get-a-question?id=${questionId}`)
        .then((res) => res.data.question),
    enabled: !!questionId,
  });

  const questionUserEmail = question?.userEmail;

  // Fetch user by email
  const {
    data: user,
    isError: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["user", questionUserEmail],
    queryFn: () =>
      axios
        .get(`/users/api/get-one?email=${questionUserEmail}`)
        .then((res) => res.data.user),
    enabled: !!questionUserEmail,
  });

  // Sample time slots
  const timeSlots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "8:00 PM",
    "9:00 PM",
  ];

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // On form submit handler
  const onSubmit = async (data) => {
    if (!selectedTime) {
      toast.error("Please select a time slot for the meeting.");
      return;
    }
  
    const formData = {
      ...data,
      date: selectedDate.toLocaleDateString(),
      time: selectedTime,
      toName: user?.name || "DevQuery",
      sendingEmail: user?.email,
    };
  
    try {
      // Send data to the server-side endpoint
      const res = await axios.post("/questions/invite-meeting/api/send-invitation", formData);
  
      if (res.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your Invitation has been sent successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
  
        await reset();
        setSelectedTime(null);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send invitation. Please try again later.");
    }
  };
  

  if (questionLoading || userLoading) {
    return <Loading/>;
  }

  if (questionError) {
    return <div>Error fetching question: {questionError.message}</div>;
  }

  if (userError) {
    return <div>Error fetching user: {userError.message}</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-5">
      {/* Left Side: User Info, Calendar, and Time Slots */}
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md">
        {/* User Info */}
        <h2 className="text-xl font-bold mb-4">Take A Meeting With</h2>
        {user && (
          <div className="flex items-center mb-6">
            <Image
              width={400}
              height={400}
              src={user.image}
              alt="User"
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <Link
                href={`/users/${user?._id}`}
                className="text-lg font-bold"
              >
                {user.name}
              </Link>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
        )}

        {/* Calendar */}
        <h2 className="text-xl font-bold mb-4">Select Date</h2>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="mb-6"
        />

        {/* Time Slots */}
        <h2 className="text-xl font-bold mt-6 mb-3">Select a Time Slot</h2>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`py-2 px-3 rounded-md border transition duration-200 ${
                selectedTime === time
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Right Side Form */}
      <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Meeting Invitation</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              defaultValue={currentUser.name || ""}
              id="name"
              {...register("name", { required: "Name is required" })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              defaultValue={currentUser.email || ""}
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Select Meeting Platform */}
          <div>
            <label htmlFor="platform" className="block mb-2">
              Select Meeting Platform
            </label>
            <select
              id="platform"
              {...register("platform", {
                required: "Platform selection is required",
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option disabled selected value="">
                Select a Platform
              </option>
              <option value="Google Meet">Google Meet</option>
              <option value="Zoom">Zoom</option>
              <option value="Microsoft Teams">Microsoft Teams</option>
              <option value="Skype">Skype</option>
              <option value="Cisco Webex">Cisco Webex</option>
              <option value="Other Platform">Other Platform</option>
            </select>
            {errors.platform && (
              <span className="text-red-500 text-sm">
                {errors.platform.message}
              </span>
            )}
          </div>

          {/* Meeting Link Input */}
          <div>
            <label htmlFor="meetingLink" className="block mb-2">
              Meeting Link
            </label>
            <input
              type="url"
              placeholder="Paste the meeting link here"
              id="meetingLink"
              {...register("meetingLink", {
                required: "Meeting link is required",
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.meetingLink && (
              <span className="text-red-500 text-sm">
                {errors.meetingLink.message}
              </span>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label htmlFor="description" className="block mb-2">
              Short Description
            </label>
            <textarea
              id="description"
              placeholder="Explain the purpose of the meeting"
              rows="4"
              {...register("description", {
                required: "Description is required",
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.description && (
              <span className="text-red-500 text-sm">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Send Invitation
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteMeeting;
