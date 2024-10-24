"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { UploadButton } from "@uploadthing/react"; // Import UploadThing's UploadButton component
import "@uploadthing/react/styles.css"; // Import UploadThing's styles if necessary
import { UploadDropzone } from "@/utils/uploadthing";

const JobPost = () => {
  const { data: session } = useSession();
  const user = session?.user?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const router = useRouter();

  const fetchUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/jobs/post-job/api/post`; 

  const onSubmit = async (data) => {
    // If no image is uploaded
    if (!imageUrl) {
      toast.error("Job image is required.");
      return;
    }

    try {
      // Submit the form with image URL
      const jobData = {
        postBy: user,
        company: data.company,
        company_website: data.company_website,
        position: data.position,
        location: data.location,
        vacancy: data.vacancy,
        last_date: data.last_date_of_apply,
        post_date: new Date().toISOString(),
        image: imageUrl,
      };

      const res = await axios.post(fetchUrl, jobData);

      if (res) {
        toast.success("Job posted successfully!");
        reset();
        router.push("/jobs");
      }
    } catch (error) {
      toast.error("Failed to post job. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10">
      <h1 className="text-2xl font-bold mb-5">Post a New Job</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
         {/* Image Upload Input using UploadThing */}
         <div>
          <label htmlFor="image-upload" className="block mb-2">
            Job Image
          </label>
          <UploadDropzone
             className="cursor-pointer"
              endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res && res.length > 0) {
                setImageUrl(res[0].url); // Set the uploaded image URL
                toast.success("Image uploaded successfully!");
              }
            }}
            onUploadError={() => {
              toast.error("Failed to upload image. Please try again.");
            }}
          />
        </div>
        {/* Company Name */}
        <div>
          <label htmlFor="company" className="block mb-2">
            Company Name
          </label>
          <input
            type="text"
            id="company"
            {...register("company", { required: "Company name is required" })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.company && (
            <span className="text-red-500 text-sm">{errors.company.message}</span>
          )}
        </div>
        {/* Company website */}
        <div>
          <label htmlFor="company_website" className="block mb-2">
            Company Website
          </label>
          <input
            type="text"
            id="company_website"
            {...register("company_website", { required: "Company Website is required" })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.company_website && (
            <span className="text-red-500 text-sm">{errors.company_website.message}</span>
          )}
        </div>

        {/* Position */}
        <div>
          <label htmlFor="position" className="block mb-2">
            Position
          </label>
          <input
            type="text"
            id="position"
            {...register("position", { required: "Position is required" })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.position && (
            <span className="text-red-500 text-sm">{errors.position.message}</span>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            {...register("location", { required: "Location is required" })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.location && (
            <span className="text-red-500 text-sm">{errors.location.message}</span>
          )}
        </div>

        {/* Vacancy */}
        <div>
          <label htmlFor="vacancy" className="block mb-2">
            Number of Vacancies
          </label>
          <input
            type="number"
            id="vacancy"
            {...register("vacancy", {
              required: "Vacancy count is required",
              valueAsNumber: true,
            })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.vacancy && (
            <span className="text-red-500 text-sm">{errors.vacancy.message}</span>
          )}
        </div>

        {/* Last Date to Apply */}
        <div>
          <label htmlFor="last_date_of_apply" className="block mb-2">
            Last Date to Apply
          </label>
          <input
            type="date"
            id="last_date_of_apply"
            {...register("last_date_of_apply", {
              required: "Last date to apply is required",
            })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.last_date_of_apply && (
            <span className="text-red-500 text-sm">{errors.last_date_of_apply.message}</span>
          )}
        </div>


        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit Job Post
        </button>
      </form>
    </div>
  );
};

export default JobPost;
