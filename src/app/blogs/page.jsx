"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Badge } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '../Components/Loading/Loading';
import { IoMdHome } from 'react-icons/io';

export const getBlogsDetails = async (id) =>{
    const fetchURL = `${process.env.NEXT_PUBLIC_WEB_URL}/blogs/api/getBlogs/${id}`
    try {
        const response = await axios.get(fetchURL)
        const details = response.data.blog;
        return details
    } catch (error) {
    console.error(error,"Error")
    return []       ; 
    }
}

const Blogs = () => {
    
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Renamed to avoid conflict and use relative path
const apiEndpoint = `${process.env.NEXT_PUBLIC_WEB_URL}/blogs/api/getBlogs`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(apiEndpoint);
                if (response.status === 200) { // Check HTTP status code
                    setBlogs(response.data.blogs);
                }
                else {
                    console.error("Failed to fetch blogs");
                    setError("Failed to fetch blogs.");
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
                setError("An error occurred while fetching blogs.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Empty dependency array

    if (loading) return <Loading/>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

   

    return (
        <div>
             <div className='px-4'>
        <nav aria-label="breadcrumb" className="w-full p-4 dark:bg-gray-100 dark:text-gray-800">
          <ol className="flex h-8 space-x-2">

            <li className="flex items-center">
              <IoMdHome/>
              <Link href={'/'}><button rel="noopener noreferrer" className="flex items-center px-1 capitalize font-semibold">Home</button></Link>
            </li>

            <li className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" fill="currentColor" className="w-2 h-2 mt-1 transform rotate-90 fill-current dark:text-gray-400">
                <path d="M32 30.031h-32l16-28.061z"></path>
              </svg>
              <a rel="noopener noreferrer" className="flex items-center text-gray-600 px-1 capitalize cursor-default hover:text-ellipsis font-semibold">Blogs</a>
            </li>
          </ol>
        </nav>
      </div>
      <hr />            
            <div  className='space-y-6 mt-5'>
                {blogs.map((blog) => (
                    <div key={blog._id} className='border-b-2 border-blue-500 pb-4'>
                    <Image
                      src={blog?.image || "/placeholder.jpg"} // Use a placeholder image if none provided
                      className='w-full h-64 object-cover mb-4' // Increased height of the image
                      alt="Description of the image"
                      width={700}
                      height={475}
                    />
                    <h2 className='text-2xl font-bold mb-2'>{blog.title}</h2>
                    <p className='text-gray-600 font-semibold mb-4'>{blog.author}</p>
                    <p className='text-gray-700 mb-4'>{blog.description}</p>
                    <Link href={`/blogs/${blog._id}`}>
                      <button className='text-blue-500 underline'>Read more</button>
                    </Link>
                    <div className='flex flex-wrap gap-2 mt-4'>
                      {blog.tags.map((tag, index) => (
                        <Badge key={index} color="info">#{tag}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

        </div>
    );
};

export default Blogs;