"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
    const router = useRouter();

    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
   
    const { data: session } = useSession();
    const user = session?.user.email;
    const image = session?.user?.image;


    const handleAddQuestion = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
    if(!session?.user){
        return router.push('/login')
    }
    
        // console.log("Form submission started");  // Add this
    
        if (tags.length === 0) {
            toast.error("Please add at least one tag before submitting!");
            setLoading(false);
            return;
        }
    
        const title = e.target.title.value;
        const description = e.target.description.value;
        const addQuestion = { title, description, user, image, tags };
    
        try {
            console.log("Sending request with data:", addQuestion);  // Add this
    
            const response = await axios.post('/questions/api/add', addQuestion);
    
            if (response.status === 200) {
                // console.log("Question added successfully:", response.data);  // Existing log
                toast.success("Your question was successfully submitted!");
                e.target.reset();
                setTags([""]);
            }
        } catch (error) {
            console.log("Error occurred:", error);  // Add this
            setError('Failed to add the question. Please try again.');
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };
    

    const handleTagsChange = (e) => {
        const inputTags = e.target.value.split(',').map(tag => tag.trim());  // Convert string to array of tags
        setTags(inputTags);
        
    }
    

    return (
        <div className="max-w-3xl mx-auto my-6">
            <h1 className="text-2xl font-bold text-center text-black">Make your Question</h1>

            <form onSubmit={handleAddQuestion} className="flex flex-col justify-center items-center gap-3 w-full">
                {/* Title input */}
                <label className="w-full mx-auto" htmlFor="title">
                    <h1 className="text-xl font-semibold my-2 p-3">Title</h1>
                    <input
                        name="title"
                        className='p-2 outline-none rounded-md w-full mx-3'
                        type="text"
                        placeholder='Title'
                        required
                    />
                </label>

                {/* Description input */}
                <label className="w-full" htmlFor="description">
                    <h1 className="text-xl font-semibold my-2 p-3">Description</h1>
                    <textarea
                        name="description"
                        placeholder="Describe your question"
                        className="p-2 rounded-md w-full mx-3"
                        required
                    />
                </label>

                {/* Tags input */}
                <label className="w-full mx-auto" htmlFor="tags">
                    <h1 className="text-xl font-semibold my-2 p-3">Tags</h1>
                    <input 
                    className='w-full p-2 border rounded-md mx-3' 
                    value={tags.join(', ')}  // Display tags as a comma-separated string
                    onChange={handleTagsChange} 
                    type="text" 
                    placeholder='Enter tags separated by commas' 
                    required
                />
                </label>

                {/* Display tags */}
               
                {/* Submit button */}
                <input
                    className="w-full border text-xl font-semibold rounded-md bg-blue-500 hover:bg-blue-600 cursor-pointer p-2 mx-3  text-white"
                    type="submit"
                    value={loading ? 'Submitting...' : 'Add question'}
                    disabled={loading}
                />
            </form>
        </div>
    );
};

export default Page;
