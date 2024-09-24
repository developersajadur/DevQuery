"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // For reading and setting search params
import QuestionsCard from "@/app/Components/Questions/QuestionsCard";
import { getQuestions } from "@/app/Components/Questions/GetQuestions";
import Link from "next/link";

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams.get("search");
  const filterQuery = searchParams.get("filter") || "newest"; // Default filter is 'newest'

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const url = searchQuery
          ? `http://localhost:3000/questions/api/get?search=${searchQuery}&filter=${filterQuery}`
          : `http://localhost:3000/questions/api/get?filter=${filterQuery}`;
        
        const res = await fetch(url);
        const data = await res.json();
        setQuestions(data.questions);
      } catch (err) {
        setError("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [searchQuery, filterQuery]);

  // Function to handle filter changes
  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    router.push(`/?filter=${newFilter}${searchQuery ? `&search=${searchQuery}` : ""}`);
  };

  return (
    <div className="px-2 md:px-4 py-3">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl md:text-3xl font-semibold">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Newest Questions"}
        </h1>

        {/* Filter dropdown */}
        <select onChange={handleFilterChange} value={filterQuery} className="border p-2 rounded md:w-96 ">
          <option value="newest">Newest</option>
          <option value="most_liked">Most Liked</option>
          <option value="most_unliked">Most Unliked</option>
        </select>
        <Link
          href="/makequestion"
          className="px-3 py-2 rounded-xl bg-blue-500 text-white font-semibold"
        >
          Make Question
        </Link>
      </div>

      {/* Loading and Error States */}
      {loading && <p>Loading questions...</p>}
      {error && <p>{error}</p>}

      {/* Display Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {!loading && !error && questions.map((question) => (
          <QuestionsCard key={question._id} question={question} />
        ))}
      </div>
    </div>
  );
};

export default Home;
