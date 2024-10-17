"use client";

import axios from 'axios'; 
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Loading from '../Components/Loading/Loading';
import QuestionsCard from '../Components/Questions/QuestionsCard';

const Page = () => {
  const [filterQuery, setFilterQuery] = useState("show_all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Number of items per page

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`/questions/api/allquestion?filter=${filterQuery}&page=${currentPage}&limit=${limit}`);
      if (response.status === 200) {
        setTotalPages(response.data.totalPages);
        return response.data.questions;
      } else {
        console.log('Error fetching questions');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const { data: questions, isLoading, error } = useQuery({
    queryKey: ['questions', filterQuery, currentPage],
    queryFn: fetchQuestions
  });

  const handleFilterChange = (newFilter) => {
    setFilterQuery(newFilter);
    setCurrentPage(1); // Reset to the first page when filter changes
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) return <Loading />;
  if (error) return <p>Error loading questions.</p>;

  return (
    <div>
      {/* Tab Filter Section */}
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          {["show_all","newest",  "oldest", "most_liked", "most_unliked"].map((filter) => (
            <li className="me-2 " key={filter}>
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
      {questions?.length > 0 ? (
        questions.map((question, index) => (
          <QuestionsCard key={index} question={question} />
        ))
      ) : (
        <p>No questions available</p>
      )}

      {/* Enhanced Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8 animate-fade-in">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-6 py-2 rounded-full font-semibold transition duration-300 ease-in-out transform hover:-translate-y-1 ${currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-[rgb(5,12,156)] to-[rgb(58,190,249)] text-white hover:shadow-lg"}`}
            aria-label="Previous Page"
          >
            Previous
          </button>

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

export default Page;
