"use client";
import Loading from "@/app/Components/Loading/Loading";
import QuestionsCard from "@/app/Components/Questions/QuestionsCard";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // For reading and setting search params
import { useEffect, useState } from "react";

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams.get("search");
  const filterQuery = searchParams.get("filter") || "newest"; // Default filter is 'newest'

  // Fetch user questions and set users
  // useEffect(() => {
  //   const fetchUserQuestions = async () => {
  //     setLoading(true); // Set loading state
  //     try {
  //       const res = await axios.get('/questions/api/get_qs_user');
  //       setQuestions(res.data.users); // Set users directly
  //       console.log("UU", res.data); // Log the response data
  //     } catch (error) {
  //       console.error("Error fetching user questions:", error);
  //       setError("Failed to load users"); // Set error state
  //     } finally {
  //       setLoading(false); // End loading state
  //     }
  //   };

  //   fetchUserQuestions();
  // }, []);

  // Fetch questions based on search and filter
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const url = searchQuery
          ? `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/get?search=${searchQuery}&filter=${filterQuery}`
          : `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/get?filter=${filterQuery}`;
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        
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

  // Select the first user or adjust as needed based on your logic
  const currentUser = users[0]; // Example: Selecting the first user

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
      {loading && <Loading />}
      {error && <p>{error}</p>}

      {/* Display Questions */}
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
        {!loading && !error && questions?.map((question) => (
          <QuestionsCard key={question._id} 
           question={question} />
        ))}
      </div>
    </div>
  );
};

export default Home;
