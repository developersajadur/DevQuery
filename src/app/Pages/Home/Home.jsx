"use client";

import Loading from "@/app/Components/Loading/Loading";
import QuestionsCard from "@/app/Components/Questions/QuestionsCard";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from '@tanstack/react-query'; 
import axios from "axios"; 

const fetchQuestions = async (searchQuery, filterQuery) => {
  const url = searchQuery
    ? `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/get?search=${searchQuery}&filter=${filterQuery}`
    : `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/get?filter=${filterQuery}`;
  const { data } = await axios.get(url); 
  return data.questions;
};

const Home = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams.get("search");
  const filterQuery = searchParams.get("filter") || "newest"; 

  // Use useQuery to fetch questions with react-query
  const { data: questions, isLoading, error } = useQuery({
    queryKey: ['questions', searchQuery, filterQuery],
    queryFn: () => fetchQuestions(searchQuery, filterQuery), 
    staleTime: 5000,
  });

  // Function to handle filter changes
  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    router.push(`/?filter=${newFilter}${searchQuery ? `&search=${searchQuery}` : ""}`);
  };

  return (
    <div className="px-2 md:px-4 py-3">
      {/* Navbar - Responsive */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-lg md:text-3xl font-semibold mb-4 md:mb-0 text-center">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Newest Questions"}
        </h1>

        {/* Filter dropdown */}
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

      {/* Loading and Error States */}
      {isLoading && <Loading />}
      {error && <p>Error loading questions</p>}

      {/* Display Questions */}
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
        {!isLoading && !error && questions?.map((question) => (
          <QuestionsCard key={question._id} question={question} />
        ))}
      </div>
    </div>
  );
};

export default Home;
