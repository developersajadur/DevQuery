import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { RiBookMarkedFill } from "react-icons/ri";


const getTimeAgo = (createdAt) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const differenceInMs = now - createdDate;

  // Calculate time differences in seconds, minutes, and hours
  const minutes = Math.floor(differenceInMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingMinutes = minutes % 60;
  const remainingHours = hours % 24;

  if (days > 0) {
    return `${days} day(s) ${remainingHours} hours ago`;
  } else if (hours > 0) {
    return `${hours} hours ${remainingMinutes} minutes ago`;
  }
  return `${remainingMinutes} minutes ago`;
};

const QuestionsCard = ({ question }) => {
  console.log("user-det", question)
  const { data: session, status } = useSession();
  const user = session?.user;
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
        alert("Success")
      }
    } catch (error) {
      console.log(error)
      
    }
    console.log(bookMark);
  }

  const timeAgo = getTimeAgo(question?.createdAt);
  return (
    <div>
      <div className="px-2 md:px-6 py-3 bg-[#d6d6d6] h-[150px] shadow-lg rounded-xl">
         <div className="flex justify-between">
         <div className="flex items-center gap-3">
         <Image className="rounded-xl  border-2 " src={question.image} height={10} width={40} alt="question image" />
 
          <div className="flex flex-col gap-2 items-start">
          <Link
          href={`questions/${question._id}`}
          className="text-xl md:text-2xl font-semibold text-[#131842] hover:text-[#3FA2F6]"
        >
          {question?.title}
        </Link> 
        
       <p className="">{question?.description.slice(0, 80)}..</p>

          </div>
         </div>
         <div>
          <button onClick={buttonForBookmark}><RiBookMarkedFill/></button>
         </div>
         </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-1 md:gap-4 text-xl md:text-3xl text-[#131842]">
            <button className="flex items-center">
              <AiOutlineLike className=" " />
              <span className="text-base md:text-xl">{question?.likes}</span>
            </button>
            <button className="flex items-center border-[#17153B] pl-2 md:pl-4 border-l-[1px]">
              <AiOutlineDislike className=" " />
              <span className="text-base md:text-xl">{question?.unlikes}</span>
            </button>
          </div>
                
               <div>
                  <h1 className="text-sm text-gray-600">Posted: {timeAgo}</h1>
               </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsCard;
