"use client";
import React, { useState } from "react";
import { Button } from "flowbite-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SocialSignIn from "../Components/Others/SocialSignIn";

const Register = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const fetchUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/register/api/post`;
  const defaultAvatar = "https://utfs.io/f/hl2tjro0eLTjUOYjocZdrVH9uezq0pt8Dgh6JUfQFEbXyNi4";

  // Password validation function
  const validatePassword = (password) => {
    const minLength = 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= minLength && hasLetter && hasNumber;
  };

  const onSubmit = async (data) => {
    if (!validatePassword(data.password)) {
      toast.error("Password must be strong (at least 8 characters, 1 letter, and 1 number).");
      return;
    }

    try {
      // Submit the form data
      const userInfo = {
        email: data.email,
        name: data.name,
        password: data.password,
        createdAt: new Date(),
        image:defaultAvatar,
        role: "user",
        status: "active",
        country: "",
        city: "",
        phone: "",
        gender: "",
        website: "",
        facebook: "",
        github: "",
        linkedin: "",
        bio: "",
      };

      const res = await axios.post(fetchUrl, userInfo);

      if (res.status === 200) {
        toast.success("Successfully registered!");
        reset();
        router.push("/login");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("User already exists.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-4 md:py-10">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Create your account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Your Full Name"
              {...register('name', { required: true })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">Name is required</p>}
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="name@company.com"
              {...register('email', { required: true })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">Email is required</p>}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="••••••••"
                {...register('password', { required: true })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">Password is required</p>}
            <p className="mt-2 text-xs text-gray-600">
              Must contain 8+ characters, including at least 1 letter and 1 number.
            </p>
          </div>

          {/* Sign Up Button */}
          <Button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Sign up
          </Button>
        </form>
        <div className="text-center text-blue-500">
          Already Have An Account? <Link className="text-black font-bold" href="/login">Click Here</Link>
        </div>

        {/* OAuth Buttons */}
        <SocialSignIn />
      </div>
    </div>
  );
};

export default Register;
