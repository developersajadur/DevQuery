"use client"

import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {data: session} = useSession();
    const user = session?.user.email;
    const image = session?.user?.image;
    
    const handleAddQuestion = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const title = e.target.title.value;
        const description = e.target.description.value;
        const addQuestion = { title, description, user, image };
        console.log("user", user)

        try {
            // Send POST request to your backend API
            const response = await axios.post('/questions/api/add', addQuestion);
            
            if (response.status === 201) {
                console.log("Question added successfully:", response.data);
                toast.success("your Question Successfully Submitted!")
                // You can reset the form or show a success message
                e.target.reset();
            }
        } catch (error) {
            // Handle error and show a message to the user
            setError('Failed to add the question. Please try again.');
            toast.error("Something wrong!")
            console.error("Error adding question:", error);
        } finally {
            setLoading(false);
        }
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
                    <h1 className="text-xl  font-semibold my-2 p-3">Description</h1>
                    <textarea
                        name="description"
                        placeholder="Describe your question"
                        className="p-2 rounded-md w-full mx-3"
                        required
                    />
                </label>

                {/* Submit button */}
                <input
                    className="w-full border text-xl font-semibold rounded-md bg-blue-500 hover:bg-blue-600 cursor-pointer p-2 text-white"
                    type="submit"
                    value={loading ? 'Submitting...' : 'Add question'}
                    disabled={loading}
                />
            </form>
        </div>
    );
};

export default Page;
