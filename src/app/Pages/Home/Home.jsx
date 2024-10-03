"use client";
import Loading from "@/app/Components/Loading/Loading";
import QuestionsCard from "@/app/Components/Questions/QuestionsCard";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; 
import { useEffect, useState } from "react";

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [currentPage, setCurrentPage] = useState(1); // Current page

  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams.get("search");
  const filterQuery = searchParams.get("filter") || "newest"; 

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const url = searchQuery
          ? `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/get?search=${searchQuery}&filter=${filterQuery}&page=${currentPage}`
          : `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/get?filter=${filterQuery}&page=${currentPage}`;
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        
        const data = await res.json();
        setQuestions(data.questions);
        setTotalPages(data.totalPages); // Set the total number of pages
      } catch (err) {
        setError("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [searchQuery, filterQuery, currentPage]);

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    router.push(`/?filter=${newFilter}${searchQuery ? `&search=${searchQuery}` : ""}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      router.push(`/?page=${newPage}${filterQuery ? `&filter=${filterQuery}` : ""}${searchQuery ? `&search=${searchQuery}` : ""}`);
    }
  };

  return (
    <div className="px-2 md:px-4 py-3">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-lg md:text-3xl font-semibold mb-4 md:mb-0 text-center">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Newest Questions"}
        </h1>

        <select
          onChange={handleFilterChange}
          value={filterQuery}
          className="border p-2 rounded w-full md:w-96 mb-4 md:mb-0"
        >
          <option value="show_all">Show All</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="most_liked">Most Liked</option>
          <option value="most_unliked">Most Unliked</option>
        </select>

        <Link
          href="/makequestion"
          className="w-full md:w-auto px-3 py-2 rounded-xl bg-blue-500 text-white text-center font-semibold"
        >
          Make Question
        </Link>
      </div>

      {loading && <Loading />}
      {error && <p>{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
        {!loading && !error && questions?.map((question) => (
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
