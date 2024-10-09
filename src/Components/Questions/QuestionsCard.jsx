"use client"
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FaBookmark } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";

const QuestionsCard = ({ question }) => {
  const { data: session, status } = useSession();
  const user = session?.user;
  console.log(user);
  

  const buttonForBookmark = async () => {
    const postBookmark = `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/post`;
    const bookMark = {
      email: user.email,
      id: question._id,
      title: question.title,
      image:question.image,
      description: question?.description,
      likes:question?.likes,
      unlikes: question?.unlikes

     
    }
    console.log(bookMark)
    try {
      const res = await axios.post(postBookmark, bookMark)
      console.log("success", res.data);
      if(res.status === 200){
        toast.success("Added the bookmark")
      }
      if(res.status === 404){
        toast.error("Already Added")
      }
    } catch (error) {
      console.log(error)
      
    }
    console.log(bookMark);
  }



  return (
    <div>
      <div className="px-2 md:px-6 py-3 bg-[#FDF7E7] rounded-xl">
        <div className="flex item-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold text-[#131842] hover:text-[#3FA2F6]"> <Link
            href={`questions/${question._id}`}
          >
            {question?.title}
          </Link></h1>
          <button onClick={buttonForBookmark}><FaBookmark /></button>
        </div>
        <p className="">{question?.description}</p>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-1 md:gap-4 text-xl md:text-3xl text-[#131842]">
            <button className="flex items-center">
              <AiOutlineLike className="" />
              <span className="text-base md:text-xl">{question?.likes}</span>
            </button>
            <button className="flex items-center border-[#17153B] pl-2 md:pl-4 border-l-[1px]">
              <AiOutlineDislike className=" " />
              <span className="text-base md:text-xl">{question?.unlikes}</span>
            </button>
          </div>
          <Link
            href="/"
            className="px-3 py-2 text-sm md:text-lg font-semibold border-[2px] border-[131842] rounded-xl"
          >
            You Have Answer?

          </Link>
          <button className="flex gap-1 items-center text-[#131842]">
            <RiShareForwardLine className="text-xl md:text-3xl" />
            <h5 className="text-base md:text-lg font-semibold">Share</h5>
          </button>
        </div>
      </div>
    </div>
  );
};

 
export default QuestionsCard;

