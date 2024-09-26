"use client";
import React, { useState } from "react";
import { Button, FileInput } from "flowbite-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loading from "@/app/Components/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const UserUpdateForm = ({params}) => {
//   const { data: session, update } = useSession();
  const [imageFile, setImageFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const imageHostingKey = process.env.NEXT_PUBLIC_IMAGE_HOSTING_KEY;
  const imageHostingAPIUrl = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

  const {
    data: user,
    isLoading,
  } = useQuery({
    queryKey: ["user", params.id],
    queryFn: async () => {
      const fetchUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/users/api/${params.id}`;
      const response = await axios.get(fetchUrl);
      return response.data.user;
    },
    enabled: !!params.id,
  });

  // Handle loading state for user data
  if (isLoading) {
    return <Loading />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password && (!/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/.test(password))) {
      toast.error("Password must be at least 8 characters long and include both letters and numbers.");
      return;
    }

    try {
      let imageUrl = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const imgRes = await axios.post(imageHostingAPIUrl, formData);
        if (imgRes.data.success) {
          imageUrl = imgRes.data.data.url;
        } else {
          toast.error("Failed to upload image.");
          return;
        }
      }

      const userInfo = {
        name: name || user?.name,
        email: email || user?.email,
        image: imageUrl || user?.image,
        password: password || user?.password,
        existsEmail: user?.email
      };

      const response = await axios.patch(`/users/api/patch`, userInfo);
      
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        router.push(`/users/${params.id}`); // Redirect to the user's profile page after successful update
        // Update session data in NextAuth
        update({ name: userInfo.name, email: userInfo.email, image: userInfo.image });
      } else {
        toast.error(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
    //   toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="bg-white shadow-md w-full md:w-3/4 lg:w-1/2 p-6 rounded-lg my-8">
        <h1 className="text-2xl font-bold mb-4">Update Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Profile Image Upload Input */}
          <div>
            <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900">
              Profile Image
            </label>
            <FileInput
              id="file-upload-helper-text"
              helperText="Support PNG, JPG, and JPEG Files"
              onChange={(e) => setImageFile(e.target.files[0])} // Set the selected image file
            />
          </div>

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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Must contain 8+ characters, including at least 1 letter and 1 number.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Update Profile
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserUpdateForm;
