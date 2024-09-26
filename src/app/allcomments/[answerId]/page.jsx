"use client";

import CommentCard from "@/app/Components/Questions/CommentCard";
import { useSearchParams } from "next/navigation";



const Page = ({ params,  }) => {
  const { answerId } = params; // Access answerId directly from params
    
  const searchParams = useSearchParams();

  // Get the referrer query parameter
  const referrer = searchParams.get('referrer');


  return (
    <div>
      <h1 className="font-bold text-[12px] lg:text-xl text-start mx-8 my-5 ">All comments</h1>
      <CommentCard referrer = {referrer} answerId={answerId} />
    </div>
  );
};

export default Page;
