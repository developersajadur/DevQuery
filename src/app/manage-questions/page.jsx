"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "flowbite-react";
import Loading from "../Components/Loading/Loading";
import toast from "react-hot-toast";
import Link from "next/link";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useEffect, useState } from "react";

const ManageQuestions = () => {
  const [searchQuery , setSearchQuery] = useState('')
  const [filteredQuestion , setFilteredQuestion] = useState([])

  const { data: questions, isLoading, refetch } = useQuery({
    queryKey: ["all-question"],
    queryFn: async () => {
      try {
        const response = await axios.get("/questions/api/allquestion");
        return response.data.questions;
      } catch (error) {
        console.error("Error fetching questions:", error);
        return [];
      }
    },

    onSuccess: (questionData) =>{
      setFilteredQuestion(questionData)
    }
  });

  useEffect(()=>{
     if(questions){
      setFilteredQuestion(questions)
     }
  },[questions])
     if(isLoading){return <Loading/>}
  const handleSearch = (e) =>{
    e.preventDefault();
    if(searchQuery.trim() === ""){
      setFilteredQuestion(questions)
    }else{
      const filtered = questions.filter(
        (question) =>
          question.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredQuestion(filtered)
      // refetch()
    }
  }

  const handleDelete = async (id) => {
    // Show SweetAlert2 confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`/manage-questions/api/delete`, {
            data: { id },
          });
          if (res?.status === 200) {
            refetch();
            toast.success(res.data.message);
            Swal.fire({
              title: "Deleted!",
              text: "The question has been deleted.",
              icon: "success",
            });
          }
        } catch (error) {
          console.error("Error deleting question:", error);
          toast.error("Failed to delete question!");
        }
      }
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="px-2 md:px-4 py-3 ">
       <div className="mb-4 flex lg:ml-[600px]">
        <input
          type="text"
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
          className="px-3 py-2 border border-gray-300 rounded-l"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-r"
        >
          Search
        </button>
      </div>

      {/* <h1 className="text-2xl font-bold mb-4">
        Manage All Questions ({questions?.length})
      </h1> */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Question Title</th>
            <th className="py-2 px-4 border">Post By</th>
            <th className="py-2 px-4 border">Likes</th>
            <th className="py-2 px-4 border">UnLikes</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuestion?.map((question) => (
            <tr key={question._id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border">
                <Link href={`questions/${question._id}`}>
                  {question?.title}
                </Link>
              </td>
              <td className="py-2 px-4 border">{question?.user}</td>
              <td className="py-2 px-4 border">{question?.likes}</td>
              <td className="py-2 px-4 border">{question?.unlikes}</td>
              <td className="py-2 px-4 border">
                <Button
                  onClick={() => handleDelete(question._id)}
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

export default ManageQuestions;
