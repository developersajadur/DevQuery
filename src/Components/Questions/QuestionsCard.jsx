import Link from "next/link";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { RiShareForwardLine } from "react-icons/ri";

const QuestionsCard = ({ question }) => {
  return (
    <div>
      <div className="px-2 md:px-6 py-3 bg-[#FDF7E7] rounded-xl">
        <Link
          href="/"
          className="text-xl md:text-2xl font-semibold text-[#131842] hover:text-[#3FA2F6]"
        >
          {question?.title}
        </Link>
        <p className="">{question?.description}</p>
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
