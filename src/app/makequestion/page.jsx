"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tagInput, setTagInput] = useState(""); // State for tag input
    const { data: session } = useSession();
    const user = session?.user.email;
    const image = session?.user?.image;

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Check if tags array is empty
        if (tags.length === 0) {
            toast.error("Please add at least one tag before submitting!");
            setLoading(false);
            return;
        }

        const title = e.target.title.value;
        const description = e.target.description.value;
        const addQuestion = { title, description, user, image, tags };

        try {
            // Send POST request to your backend API
            const response = await axios.post('/questions/api/add', addQuestion);

            if (response.status === 201) {
                console.log("Question added successfully:", response.data);
                toast.success("Your question was successfully submitted!");
                e.target.reset(); // Reset the entire form
                setTags([]); // Clear tags after submission
                setTagInput(""); // Clear the tag input field
            }
        } catch (error) {
            setError('Failed to add the question. Please try again.');
            toast.error("Something went wrong!");
            console.error("Error adding question:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTagInputKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent form submission on Enter
            const newTag = tagInput.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]); // Add tag to the array
                setTagInput(""); // Clear input field
            }
        }
    };

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
                        className='p-2 outline-none rounded-md w-full mx-3'
                        name="tags"
                        type="text"
                        placeholder="Type a tag and press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)} // Update tag input state
                        onKeyDown={handleTagInputKeyDown} // Handle Enter key
                    />
                </label>

                {/* Display tags */}
                <div className="flex flex-wrap gap-2 my-2">
                    {tags.map((tag, index) => (
                        <span key={index} className="bg-blue-200 p-2 rounded-md">
                            {tag}
                            <button
                                type="button"
                                onClick={() => setTags(tags.filter((_, i) => i !== index))} // Remove tag
                                className="ml-2 text-red-500"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>

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
