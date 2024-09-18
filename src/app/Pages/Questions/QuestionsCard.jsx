import Link from "next/link";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { RiShareForwardLine } from "react-icons/ri";

const QuestionsCard = () => {
  return (
    <div>
      <div className="lg:px-6 py-3 bg-[#FDF7E7] rounded-xl">
        <Link href="/" className="text-2xl font-semibold text-[#131842] hover:text-[#3FA2F6]">
          Here Add Question Title
        </Link>
        <p className="">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi
          tempore tenetur, similique iure quam voluptatem.
        </p>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-4 text-3xl text-[#131842]">
            <button className="flex items-center">
              <AiOutlineLike className=" " />
              <span className="text-xl">10k</span>
            </button>
            <button className="flex items-center border-[#17153B] pl-4 border-l-[1px]">
              <AiOutlineDislike className=" " />
              <span className="text-xl">5</span>
            </button>
          </div>
          <Link href="/" className="px-3 py-2 text-lg font-semibold border-[2px] border-[131842] rounded-xl">
            You Have Answer?
          </Link>
          <button className="flex gap-1 items-center text-[#131842]">
          <RiShareForwardLine className="text-3xl" />
          <h5 className="text-lg font-semibold">Share</h5>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionsCard;
