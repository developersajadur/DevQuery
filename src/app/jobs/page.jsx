"use client";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import Loading from "../Components/Loading/Loading";
import { FaMapMarkerAlt } from "react-icons/fa"; // You can install react-icons for location icon

const Jobs = () => {
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      try {
        const response = await axios.get("/jobs/api/get");
        return response.data.jobs;
      } catch (error) {
        console.error("Error fetching Jobs:", error);
        return [];
      }
    },
  });

  if (isLoading) return <Loading />;
  if (error) return <p>Error loading jobs.</p>;

  return (
    <div className="px-4 py-3 mt-5">
        <div className="flex flex-col md:flex-row justify-between mb-5">
        <h2 className="text-2xl font-bold mb-4">Job Listings</h2>
        <Link className="p-3 bg-blue-500 font-semibold text-white rounded-xl" href="jobs/post-job">Make A Job Post</Link>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs?.map((job) => ( // Show only the first 6 jobs
          <div
            key={job?._id}
            className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Job Image */}
            <Image
              width={400}
              height={300}
              src={job?.image}
              alt={`${job?.company} logo`}
              className="w-full h-32 object-cover rounded-t-lg"
            />

            {/* Job Info */}
            <div className="p-4 flex flex-col flex-grow">
              <Link
                href={`/jobs/${job?._id}`}
                className="font-semibold text-lg hover:text-blue-600 transition-colors duration-200 mb-1"
              >
                {job.position}
              </Link>
              <span className="text-gray-700 font-medium">{job.company}</span>
              <div className="flex items-center mt-2 text-gray-600">
                <FaMapMarkerAlt className="mr-1" />
                <span>{job.location || "Location not found"}</span>
              </div>
              <span className="text-sm text-gray-500 mt-2">
                Vacancies: {job.vacancy}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                Posted on: {new Date(job.post_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
