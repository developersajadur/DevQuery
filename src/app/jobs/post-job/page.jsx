"use client";
import React, { useState } from "react";
import { Button, FileInput } from "flowbite-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const JobPost = () => {
  const { data: session } = useSession();
  const user = session?.user?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [imageFile, setImageFile] = useState(null); // State for image file
  const router = useRouter();

  const imageHostingKey = process.env.NEXT_PUBLIC_IMAGE_HOSTING_KEY;
  const imageHostingAPIUrl = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;
  const fetchUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/jobs/post-job/api/post`; // Adjust the API endpoint as needed

  const onSubmit = async (data) => {
    // If no image is uploaded
    if (!imageFile) {
      toast.error("Job image is required.");
      return;
    }

    try {
      // Upload image to ImgBB
      const formData = new FormData();
      formData.append('image', imageFile); // Pass the selected image file

      const imgRes = await axios.post(imageHostingAPIUrl, formData);

      if (imgRes.data.success) {
        const imageUrl = imgRes.data.data.url; // Get the image URL

        // Submit the form with image URL
        const jobData = {
          postBy: user,
          company: data.company,
          position: data.position,
          location: data.location,
          vacancy: data.vacancy,
          last_date: data.last_date_of_apply,
          post_date: formData(new Date()),
          image: imageUrl,
          description: data.description,
        };
        

        const res = await axios.post(fetchUrl, jobData);

        if (res) {
          toast.success("Job posted successfully!");
          reset();
          router.push("/jobs");
        }
      }
    } catch (error) {
        toast.error("Failed to post job. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10">
      <h1 className="text-2xl font-bold mb-5">Post a New Job</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        {/* Image Upload Input */}
        <div>
          <label htmlFor="image" className="block mb-2">
            Job Image
          </label>
          <FileInput
            id="image-upload"
            helperText="Support PNG, JPG, and JPEG Files"
            onChange={(e) => setImageFile(e.target.files[0])} // Set the selected image file
          />
          {errors.image && (
            <span className="text-red-500 text-sm">{errors.image.message}</span>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-2">
            Job Description
          </label>
          <textarea
            id="description"
            rows="4"
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.description && (
            <span className="text-red-500 text-sm">{errors.description.message}</span>
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
