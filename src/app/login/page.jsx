"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from 'flowbite-react';
import { signIn } from "next-auth/react";
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SocialSignIn from '../Components/Others/SocialSignIn';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams()
  const path = searchParams.get('redirect');

  const onSubmit = async (data) => {
    const result = await signIn("credentials", { ...data, redirect: true, callbackUrl:path ? path :"/", });  

    if (result?.error) { 
      switch (result.error) {
        case "Enter Your Email And Password":
          toast.error("Enter Your Email And Password");
          break;
        case "User Not Found":
          toast.error("User Not Found");
          break;
        case "Wrong Password":
          toast.error("Wrong Password");
          break;
        case "Your account is blocked":
          toast.error("Your account is blocked");
          break;
        default:
          toast.error("Something went wrong.");
          break;
      }
    } else if (result?.ok) {
      toast.success("Successfully Logged In!");
      router.push("/");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Log in to your account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
            <input
              type="email"
              id="email"
              className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              placeholder="name@company.com"
              {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/i })}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder="••••••••"
                {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
          </div>

          <Button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Log in
          </Button>
        </form>
        <div className="text-center text-blue-500">{"Don't "}Have An Account? <Link className='text-black font-bold' href="/register">Click Here</Link></div>
         {/* OAuth Buttons */}
      <SocialSignIn/>
      </div>
    </div>
  );
};

export default Login;
