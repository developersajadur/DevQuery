"use client"
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from 'flowbite-react';
import Loading from '../Components/Loading/Loading';
import toast from 'react-hot-toast';

const ManageJobs = () => {


    const { data: jobs, isLoading, refetch } = useQuery({
        queryKey: ["all-jobs"],
        queryFn: async () => {
          try {
            const response = await axios.get("/jobs/api/get");            
            return response.data.jobs;
          } catch (error) {
            console.error("Error fetching jobs:", error);
            return [];
          }
        },
      });

    // Handle deleting a job
    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`/manage-jobs/api/delete`, { data: { id } });
            if (res.status === 200) {
                refetch();
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Error deleting job:", error);
            toast.error("Failed to delete job!");
        }
    };

    // Loading state
    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Manage All Jobs ({jobs?.length})</h1>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4 border">No.</th>
                        <th className="py-2 px-4 border">Company</th>
                        <th className="py-2 px-4 border">Position</th>
                        <th className="py-2 px-4 border">Location</th>
                        <th className="py-2 px-4 border">Vacancy</th>
                        <th className="py-2 px-4 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs?.map((job, index) => (
                        <tr key={job._id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border">{index}</td>
                            <td className="py-2 px-4 border">{job.company}</td>
                            <td className="py-2 px-4 border">{job.position}</td>
                            <td className="py-2 px-4 border">{job.location}</td>
                            <td className="py-2 px-4 border">{job.vacancy}</td>
                            <td className="py-2 px-4 border">
                                <Button
                                    onClick={() => handleDelete(job._id)}
                                    className="bg-red-600 text-white"
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageJobs;
