"use client";

import Loading from "@/app/Components/Loading/Loading";
import QuestionsCard from "@/app/Components/Questions/QuestionsCard";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from '@tanstack/react-query';

const Home = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams.get("search");
  const filterQuery = searchParams.get("filter") || "newest"; 
  const currentPage = Number(searchParams.get("page")) || 1;

  // Fetch Questions
  const fetchQuestions = async () => {
    const url = searchQuery
      ? `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/get?search=${searchQuery}&filter=${filterQuery}&page=${currentPage}`
      : `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/get?filter=${filterQuery}&page=${currentPage}`;
    
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['questions', searchQuery, filterQuery, currentPage],
    queryFn: fetchQuestions,
    staleTime: 5000
  });

  const questions = data?.questions || [];
  const totalPages = data?.totalPages || 1;

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    router.push(`/?filter=${newFilter}${searchQuery ? `&search=${searchQuery}` : ""}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/?page=${newPage}${filterQuery ? `&filter=${filterQuery}` : ""}${searchQuery ? `&search=${searchQuery}` : ""}`);
    }
  };

  return (
    <div className="px-4 py-6 bg-gradient-to-r from-blue-200 to-purple-400 rounded-2xl min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-lg animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 md:mb-0 text-center">
          Trending Questions
        </h1>

        <select
          onChange={handleFilterChange}
          value={filterQuery}
          className="border font-bold p-3 rounded-lg w-full md:w-72 text-gray-700 bg-gradient-to-r from-indigo-300 to-blue-400 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:shadow-lg transition duration-300 ease-in-out"
        >
          <option className="font-bold" value="newest">Newest</option>
          <option className="font-bold" value="show_all">Show All</option>
          <option className="font-bold" value="oldest">Oldest</option>
          <option className="font-bold" value="most_liked">Most Liked</option>
          <option className="font-bold" value="most_unliked">Most Unliked</option>
        </select>

        <Link
          href="/ask-question"
          className="w-full md:w-auto px-6 py-3 mt-4 md:mt-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-center shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-pink-500 transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Ask a Question
        </Link>
      </div>

      {/* Loading and Error Handling */}
      {isLoading && <Loading />}
      {error && <p className="text-red-500 text-center">{error.message}</p>}

      {/* Questions List */}
      <div className="grid grid-cols-1  gap-6 w-full animate-slide-up">
        {!isLoading && !error && questions.map((question) => (
          <QuestionsCard key={question._id} question={question} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-8 animate-fade-in">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-6 py-2 rounded-full font-semibold transition duration-300 ease-in-out transform hover:-translate-y-1 ${currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:shadow-lg hover:from-purple-500 hover:to-blue-400"}`}
        >
          Previous
        </button>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 rounded-full font-semibold transition duration-300 ease-in-out transform hover:-translate-y-1 ${currentPage === index + 1 ? "bg-purple-500 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-lg"}`}
          >
            {index + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-6 py-2 rounded-full font-semibold transition duration-300 ease-in-out transform hover:-translate-y-1 ${currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:shadow-lg hover:from-purple-500 hover:to-blue-400"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
