"use client";
import Loading from '@/app/Components/Loading/Loading';
import PostBlogs from '@/app/postBlogs/page';
import axios from 'axios';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Swal from 'sweetalert2';

const ManageBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const getBlogs = `${process.env.NEXT_PUBLIC_WEB_URL}/blogs/api/getBlogs`;

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(getBlogs);
                if (response.status === 200) {
                    setBlogs(response.data.blogs);
                    setFilteredBlogs(response.data.blogs); // Set filtered blogs to all blogs initially
                } else {
                    console.error("Error Fetching Data");
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
                setError("An error occurred while fetching blogs.");
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, [getBlogs]);

    const handleForDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Are you sure you want to delete this Blog?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${process.env.NEXT_PUBLIC_WEB_URL}/blogs/api/deleteBlogs/${id}`);
                    if (response.status === 200) {
                        toast.success(response.data.message);
                        setBlogs((prevBlogs) => prevBlogs.filter((data) => data._id !== id));
                        setFilteredBlogs((prevBlogs) => prevBlogs.filter((data) => data._id !== id)); // Also update filtered blogs
                    } else {
                        toast.error(`Error: ${response.data.message}`);
                    }
                } catch (error) {
                    console.error("Axios error:", error);
                    if (error.response) {
                        toast.error(`Error: ${error.response.data.message || "Something went wrong."}`);
                    } else {
                        toast.error("An unexpected error occurred.");
                    }
                }
            }
        });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchClick = () => {
        if (searchQuery.trim() === '') {
            setFilteredBlogs(blogs); // Show all blogs if the search query is empty
        } else {
            const results = blogs.filter(blog =>
                blog.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredBlogs(results);
        }
    };

    if (loading) return <Loading />;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <Tabs>
                <TabList>
                    <div className=''>
                        <Tab><button className='text-xl font-bold'>Manage Blogs</button></Tab>
                        <Tab><button className='text-xl font-bold'> Post Blog</button></Tab>
                    </div>
                </TabList>
                <TabPanel>
                    <div>
                        <div className='flex'>
                            <div className='flex lg:ml-[650px]'>
                                <input
                                    type="text"
                                    placeholder="Search Blogs"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="mb-2 p-2 border border-gray-300 h-12 w-full rounded-l px-6"
                                />
                            </div>
                            <div>
                                <button onClick={handleSearchClick} className="mb-4 rounded-r bg-blue-500 h-12 font-bold text-white w-16 hover:bg-blue-600 transition">
                                    Search
                                </button>
                            </div>
                        </div>
                        <table className="min-w-full">
                            <thead className="bg-gray-200">
                                <tr className="text-left">
                                    <th className="p-3 text-lg">Title</th>
                                    <th className="p-3 text-lg"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(filteredBlogs.length > 0 ? filteredBlogs : blogs).map(blog => (
                                    <tr key={blog._id} className='border-b border-opacity-20 hover:bg-gray-100'>
                                        <td className="p-3 w-3/4">
                                            <p className="text-xl font-bold">{blog.title}</p>
                                        </td>
                                        <td className="p-3 flex justify-end items-center space-x-2">
                                            <Link href={`/blogs/${blog._id}`}>
                                                <Button className="bg-blue-500 text-white hover:bg-blue-600 transition">View</Button>
                                            </Link>
                                            <Button
                                                onClick={() => handleForDelete(blog._id)}
                                                className="bg-red-500 text-white hover:bg-red-600 transition"
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TabPanel>

                <TabPanel>
                    <PostBlogs />
                </TabPanel>
            </Tabs>
        </div>
    );
};

export default ManageBlogs;
