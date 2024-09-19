import { getQuestionDetail } from '@/Components/Questions/GetQuestions';
import React from 'react';

const QusetionDetails = async ({params}) => {
    const questionDetails =await getQuestionDetail(params.id)
    
    return (
        <div>
            <h1 className="text-black text-4xl">{questionDetails.title}</h1>
        </div>
    );
};

export default QusetionDetails;