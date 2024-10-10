"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Page = () => {
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);  // Error state added
  
  const { data: session } = useSession();
  const userId = session?.user.id;

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Handle question submission
  const handleAddQuestion = async (data) => {
    // Validate tags
    if (tags.length === 0) {
      toast.error("Please add at least one tag before submitting!");
      return;
    }

    const { title, description } = data; // Get data from react-hook-form
    const addQuestion = { title, description, userId, tags };

    try {
      const response = await axios.post('/ask-question/api/post', addQuestion);

      if (response.status === 200) {
        toast.success("Your question was successfully submitted!");
        reset(); // Reset form after successful submission
        setTags([]); // Reset tags
      }
    } catch (error) {
      console.log("Error occurred:", error);
      setError("Something went wrong! Please try again.");  // Error set here
      toast.error("Something went wrong!");
    }
  };

  // Handle tags input
  const handleTagsChange = (e) => {
    const inputTags = e.target.value.split(',').map(tag => tag.trim());  // Convert string to array of tags
    setTags(inputTags);
  };

  return (
    <div className="w-[90%] lg:max-w-3xl mx-auto my-6 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center text-black mb-6">
        Ask Your Question
      </h1>

      <form onSubmit={handleSubmit(handleAddQuestion)} className="flex flex-col gap-4">
        {/* Title Input */}
        <div className="w-full">
          <label htmlFor="title" className="block text-xl font-semibold mb-2">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter your question title"
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-500" : ""
            }`}
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description Input */}
        <div className="w-full">
          <label htmlFor="description" className="block text-xl font-semibold mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe your question in detail"
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : ""
            }`}
            {...register("description", { required: "Description is required" })}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Tags Input */}
        <div className="w-full">
          <label htmlFor="tags" className="block text-xl font-semibold mb-2">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            placeholder="Enter tags separated by commas"
            value={tags.join(', ')} // Display tags as a comma-separated string
            onChange={handleTagsChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white text-xl font-semibold p-3 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Submit Question
        </button>
      </form>

      {/* Error message display */}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default Page;
