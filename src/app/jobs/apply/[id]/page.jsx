"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Apply = (props) => {
  const jobId = props?.params?.id; // Get the job ID from the props
//   console.log(jobId);

  // Initialize React Hook Form
  const { register, handleSubmit,reset, formState: { errors } } = useForm();

  const onSubmit = async(data) => {
    const sendData = {
        data,
        jobId: jobId,
    }
    const res = await axios.post("/jobs/apply/api/post", sendData)
    if(res.status === 200){
      reset()
      return toast.success(res.data.message)
    }
    
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Apply </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Name is required" })}
            className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded-md`}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2" htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
            className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded-md`}
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2" htmlFor="phone">Your Phone Number</label>
          <input
            type="tel"
            id="phone"
            {...register("phone", { required: "Phone number is required" })}
            className={`border ${errors.phone ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded-md`}
          />
          {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2" htmlFor="address">Your Address</label>
          <input
            type="text"
            id="address"
            {...register("address", { required: "Address is required" })}
            className={`border ${errors.address ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded-md`}
          />
          {errors.address && <p className="text-red-500">{errors.address.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2" htmlFor="resumeLink">Resume Link</label>
          <input
            type="text"
            id="resumeLink"
            {...register("resumeLink", { required: "Resume link is required" })}
            className={`border ${errors.resumeLink ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded-md`}
            placeholder="Paste your resume link here"
          />
          {errors.resumeLink && <p className="text-red-500">{errors.resumeLink.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2" htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="4"
            {...register("description", { required: "Description is required" })}
            className={`border ${errors.description ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded-md`}
            placeholder="Briefly describe your qualifications and why you're a good fit for this job"
          />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default Apply;
