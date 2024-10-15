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
    staleTime: 5000,
    retry: 2,
  });

  const questions = data?.questions || [];
  const totalPages = data?.totalPages || 1;

  const handleFilterChange = (newFilter) => {
    router.push(`/?filter=${newFilter}${searchQuery ? `&search=${searchQuery}` : ""}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/?page=${newPage}${filterQuery ? `&filter=${filterQuery}` : ""}${searchQuery ? `&search=${searchQuery}` : ""}`);
    }
  };

  return (
    <div className="px-4 py-6 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-lg animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 md:mb-0 text-center">
          Trending Questions
        </h1>

        {/* Updated Ask a Question Button */}
        <Link href="/ask-question">
          <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Ask a Question
            </span>
          </button>
        </Link>
      </div>

      {/* Tab Filter Section */}
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          {["newest", "show_all", "oldest", "most_liked", "most_unliked"].map((filter) => (
            <li className="me-2 lg:font-bold lg:text-lg" key={filter}>
              <button
                onClick={() => handleFilterChange(filter)}
                className={`inline-block p-4 border-b-2 rounded-t-lg font-bold transition duration-300 ease-in-out ${
                  filterQuery === filter
                    ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                    : "border-transparent text-gray-500 hover:text-blue-600 hover:border-gray-300"
                }`}
                aria-current={filterQuery === filter ? "page" : undefined}
              >
                {filter.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Loading and Error Handling */}
      {isLoading && <Loading />}
      {error && <p className="text-red-500 text-center">Failed to load questions. Please try again later.</p>}

      {/* Questions List */}
      <div className="grid grid-cols-1 w-full">
        {!isLoading && !error && questions.map((question) => (
          <QuestionsCard key={question._id} question={question} />
        ))}
      </div>

      {/* Enhanced Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8 animate-fade-in">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-6 py-2 rounded-full font-semibold transition duration-300 ease-in-out transform hover:-translate-y-1 ${currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-[rgb(5,12,156)] to-[rgb(58,190,249)] text-white hover:shadow-lg"}`}
            aria-label="Previous Page"
          >
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
            .map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-full font-semibold transition duration-300 ease-in-out transform hover:-translate-y-1 ${page === currentPage ? "bg-[rgb(5,12,156)] text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-lg"}`}
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            ))}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-6 py-2 rounded-full font-semibold transition duration-300 ease-in-out transform hover:-translate-y-1 ${currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-[rgb(5,12,156)] to-[rgb(58,190,249)] text-white hover:shadow-lg"}`}
            aria-label="Next Page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
