"use client";

import Loading from "@/app/Components/Loading/Loading";
import QuestionsCard from "@/app/Components/Questions/QuestionsCard";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; 
import { useQuery } from '@tanstack/react-query'; // Make sure to import from the correct package

const Home = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams.get("search");
  const filterQuery = searchParams.get("filter") || "newest"; 
  const currentPage = Number(searchParams.get("page")) || 1; // Get current page from URL

  // Define fetch function
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

  // Use useQuery hook with object-based syntax
  const { data, isLoading, error } = useQuery({
    queryKey: ['questions', searchQuery, filterQuery, currentPage],
    queryFn: fetchQuestions,
    staleTime: 5000 // Adjust stale time as needed
  });

  const questions = data?.questions || [];
  const totalPages = data?.totalPages || 1; // Total number of pages

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
    <div className="px-2 md:px-4 py-3">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-lg md:text-3xl font-semibold mb-4 md:mb-0 text-center">
          Questions
        </h1>

        <select
          onChange={handleFilterChange}
          value={filterQuery}
          className="border p-2 rounded w-full md:w-96 mb-4 md:mb-0"
        >
          <option value="newest">Newest</option>
          <option value="show_all">Show All</option>
          <option value="oldest">Oldest</option>
          <option value="most_liked">Most Liked</option>
          <option value="most_unliked">Most Unliked</option>
        </select>

        <Link
          href="/ask-question"
          className="w-full md:w-auto px-3 py-2 rounded-xl bg-blue-500 text-white text-center font-semibold"
        >
          Ask Question
        </Link>
      </div>

      {isLoading && <Loading />}
      {error && <p>{error.message}</p>}

      <div className="grid grid-cols-1 gap-4 w-full">
        {!isLoading && !error && questions.map((question) => (
          <QuestionsCard key={question._id} question={question} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-2 mt-6">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1} // Disable if on the first page
          className={`px-4 py-2 border ${currentPage === 1 ? "bg-gray-200" : "bg-blue-500 text-white"}`}
        >
          Previous
        </button>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 border ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {index + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages} // Disable if on the last page
          className={`px-4 py-2 border ${currentPage === totalPages ? "bg-gray-200" : "bg-blue-500 text-white"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
