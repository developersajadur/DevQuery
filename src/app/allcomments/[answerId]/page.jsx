"use client";

import CommentCard from "@/app/Components/Questions/CommentCard";



const Page = ({ params }) => {
  const { answerId } = params; // Access answerId directly from params
     console.log("object", answerId)
  return (
    <div>
      <h1>All comments for Answer ID: {answerId}</h1>
      <CommentCard answerId={answerId} />
    </div>
  );
};

export default Page;
