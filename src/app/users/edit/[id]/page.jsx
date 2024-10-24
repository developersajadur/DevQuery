"use client";
import React, { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loading from "@/app/Components/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FaUser, FaMapMarkerAlt, FaCity, FaPhone, FaGlobe, FaEnvelope, FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';
import { UploadDropzone } from "@/utils/uploadthing";

const UserUpdateForm = ({ params }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const router = useRouter();

  // Fetch user data with react-query
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", params.id],
    queryFn: async () => {
      const fetchUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/users/api/${params.id}`;
      const response = await axios.get(fetchUrl);
      return response.data.user;
    },
    enabled: !!params.id,
  });

  // Pre-fill form when user data is loaded
  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("country", user.country);
      setValue("city", user.city);
      setValue("phone", user.phone);
      setValue("gender", user.gender);
      setValue("website", user.website);
      setValue("facebook", user.facebook);
      setValue("github", user.github);
      setValue("linkedin", user.linkedin);
      setValue("bio", user.bio);
      setImageUrl(user.image); // Set the initial image if it exists
    }
  }, [user, setValue]);

  if (isLoading) {
    return <Loading />;
  }

  const onSubmit = async (data) => {
    try {
      const userInfo = {
        name: data.name,
        email: data.email,
        image: imageUrl || user?.image, // Use the uploaded image URL or fallback to existing
        password: data.password || user?.password,
        existsEmail: user?.email,
        country: data.country,
        city: data.city,
        phone: data.phone,
        gender: data.gender,
        website: data.website,
        facebook: data.facebook,
        github: data.github,
        linkedin: data.linkedin,
        bio: data.bio,
      }; 

      const response = await axios.patch(`${process.env.NEXT_PUBLIC_WEB_URL}/users/api/patch`, userInfo);

      if (response.status === 200) {
        // toast.success("Profile updated successfully!");
        router.push(`/users/${params.id}`);
        router.reload(); // This reloads the current page
      } else {
        toast.error(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      // toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="bg-white shadow-md w-full md:w-3/4 lg:w-1/2 p-6 rounded-lg my-8">
        <h1 className="text-2xl font-bold mb-4">Update Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Image Upload Input */}
          <div>
            <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900">
              Profile Image
            </label>
            <UploadDropzone
              className="cursor-pointer"
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res.length > 0) {
                  setImageUrl(res[0].url); // Set the image URL from UploadThing response
                  toast.success("Image uploaded successfully!");
                }
              }}
              onUploadError={(error) => {
                toast.error(`ERROR! ${error.message}`);
              }}
            />
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-gray-600 mb-1">Display Name</label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <FaUser className="text-xl w-10 text-gray-400" />
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-2 outline-none rounded-r-md"
                {...register("name", { required: "Name is required" })}
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Country Field */}
          <div>
            <label className="block text-gray-600 mb-1">Country</label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <span className="px-3 text-gray-400">
                <FaMapMarkerAlt />
              </span>
              <input
                type="text"
                placeholder="Country"
                className="w-full p-2 outline-none rounded-r-md"
                {...register("country")}
              />
            </div>
          </div>

          {/* City Field */}
          <div>
            <label className="block text-gray-600 mb-1">City</label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <span className="px-3 text-gray-400">
                <FaCity />
              </span>
              <input
                type="text"
                placeholder="City"
                className="w-full p-2 outline-none rounded-r-md"
                {...register("city")}
              />
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-gray-600 mb-1">Phone</label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <span className="px-3 text-gray-400">
                <FaPhone />
              </span>
              <input
                type="text"
                placeholder="Phone"
                className="w-full p-2 outline-none rounded-r-md"
                {...register("phone")}
              />
            </div>
          </div>

          {/* Gender Field */}
          <div>
            <label className="block text-gray-600 mb-1">Gender</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input type="radio" value="male" {...register("gender")} className="mr-2" />
                Male
              </label>
              <label className="flex items-center">
                <input type="radio" value="female" {...register("gender")} className="mr-2" />
                Female
              </label>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-600 mb-1">E-Mail <span className="text-red-500">*</span></label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <span className="px-3 text-gray-400">
                <FaEnvelope />
              </span>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 outline-none rounded-r-md"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter your password"
                {...register("password", {
                  minLength: { value: 8, message: "Password must be at least 8 characters" }
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>



          {/* Social Links */}
          <div className="flex flex-col space-y-4">
                      {/* Website Field */}
          <div>
            <label className="block text-gray-600 mb-1">Website</label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <span className="px-3 text-gray-400">
                <FaGlobe />
              </span>
              <input
                type="url"
                placeholder="Website"
                className="w-full p-2 outline-none rounded-r-md"
                {...register("website")}
              />
            </div>
          </div>
          {/* facebook */}
            <div>
              <label className="block text-gray-600 mb-1">Facebook</label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <span className="px-3 text-gray-400">
                  <FaFacebook />
                </span>
                <input
                  type="url"
                  placeholder="Facebook Link"
                  className="w-full p-2 outline-none rounded-r-md"
                  {...register("facebook")}
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">GitHub</label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <span className="px-3 text-gray-400">
                  <FaGithub />
                </span>
                <input
                  type="url"
                  placeholder="GitHub Link"
                  className="w-full p-2 outline-none rounded-r-md"
                  {...register("github")}
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">LinkedIn</label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <span className="px-3 text-gray-400">
                  <FaLinkedin />
                </span>
                <input
                  type="url"
                  placeholder="LinkedIn Link"
                  className="w-full p-2 outline-none rounded-r-md"
                  {...register("linkedin")}
                />
              </div>
            </div>
          </div>

          {/* Bio Field */}
          <div>
            <label className="block text-gray-600 mb-1">Bio</label>
            <textarea
              placeholder="Write something about yourself..."
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
              {...register("bio")}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-4">Update Profile</Button>
        </form>
      </div>
    </div>
  );
};

export default UserUpdateForm;
