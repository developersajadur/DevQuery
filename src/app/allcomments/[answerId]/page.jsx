"use client";

import CommentCard from "@/app/Components/Questions/CommentCard";



const Page = ({ params }) => {
  const { answerId } = params; // Access answerId directly from params
     
  return (
    <div>
      <h1 className="font-bold text-start mx-8 my-5 ">All comments</h1>
      <CommentCard answerId={answerId} />
    </div>
  );
};

export default Page;
