"use client"
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const PostBlogs = () => {
    const { data: session, status } = useSession();
  const user = session?.user;
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        author: '',
        tags: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, image, author, tags, description } = formData;
        console.log(formData);

        const blogsData = {
            title,
            image,
            author:user?.name,
            tags:[tags],
            description
        };

        try {
          if(user?.role === "admin"){
            const res = await axios.post(`${process.env.NEXT_PUBLIC_WEB_URL}/blogs/api/postBlogs`, blogsData);
            const insertData = res.data;
            if (res.data) {
                toast.success("Blog added successfully");
            }
            return insertData;
          }
          else{
            return <p>Unauthorize access</p>
          }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to add blog. Please try again.");
        }
    };

    return (
        <div className='bg-white'>
            <div className='py-10'>
                <h1 className='text-xl font-bold text-center my-5'>Add Blogs</h1>
                <form action="" onSubmit={handleSubmit}>
                    <div className='grid grid-cols-2 gap-5 mt-5 mx-5'>
                        <div>
                            <label htmlFor="">Title</label><br />
                            <input type="text" onChange={handleChange} value={formData.title} className='w-full rounded-sm h-8' name='title'/>
                        </div>
                        <div>
                            <label htmlFor="">Image</label><br />
                            <input type="text" onChange={handleChange} value={formData.image} className='w-full rounded-sm h-8' name='image'/>
                        </div>
                        <div>
                            <label htmlFor="">Author</label><br />
                            <input type="text" onChange={handleChange} value={formData.author} placeholder={user?.name} className='w-full rounded-sm h-8' name='author' disabled/>
                        </div>
                        <div>
                            <label htmlFor="">Tags</label><br />
                            <input type="text" onChange={handleChange} value={formData.tags} className='w-full rounded-sm h-8' name='tags'/>
                        </div>
                        
                    </div>
                    <div className='mx-5 mt-4'>
                        <label htmlFor="">Description</label><br />
                        <textarea name="description" id="" rows={4} cols={7} onChange={handleChange} value={formData.description} className='w-full'/>
                    <button className='w-full mt-2 h-10 bg-blue-500'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostBlogs;