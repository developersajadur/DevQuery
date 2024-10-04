import { Avatar, Button, Card } from 'flowbite-react';
import { AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';



const AllQuestion = ({question}) => {


  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const differenceInMs = now - createdDate;
  
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
  //  console.log("quesr", question)
    return (
        <div className='my-6 max-w-[90%] mx-auto'>
        <Card className="mb-4" >
        <div className="flex items-start">
          <Avatar img={question.image || "https://randomuser.me/api/portraits/men/3.jpg"} />
          <div className="ml-4 w-full">
            <h4 className="font-medium">{question.user}</h4>
            <p className="text-gray-600 mt-1 mb-2">{question.title}</p>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <p className="text-gray-500 text-sm">Commented {getTimeAgo(question.createdAt)}</p>
              <div className="flex items-center">
                <Button.Group>
                  <Button color="light">
                    <AiOutlineLike size={20} /> {question.likes} Like
                  </Button>
                  <Button color="light">
                    <AiOutlineDislike size={20} /> {question.unlikes} Dislike
                  </Button>
                </Button.Group>
              </div>
            </div>
          </div>
        </div>
      </Card>
        </div>
    );
};

export default AllQuestion;