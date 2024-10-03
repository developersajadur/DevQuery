"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "@/app/Components/Loading/Loading";
import Link from "next/link";

const JobDetails = ({params}) => {
  const id = params.id;

  const { data: job, isLoading, error } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const response = await axios.get(`/jobs/api/${id}`);
      return response.data.job;
    },
  });

  if (isLoading) return <Loading />;
  if (error) return <p>Error loading job details.</p>;

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">{job?.position}</h1>
      <p className="text-lg text-gray-600 mb-4">{job?.company}</p>
      <p className="text-gray-500">{job?.location}</p>
      <p className="mt-2">{job?.description}</p>
      <div className="mt-4">
        <p className="font-semibold">Vacancy: {job?.vacancy}</p>
        <p className="font-semibold">Post Date: {new Date(job?.post_date).toLocaleDateString()}</p>
        <p className="font-semibold">Last Date to Apply: {new Date(job?.last_date_of_apply).toLocaleDateString()}</p>
      </div>
      <div className="mt-6">
        <Link
          href={`/jobs/apply/${job?.company_website}`} // Link to the apply page or API
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default JobDetails;
