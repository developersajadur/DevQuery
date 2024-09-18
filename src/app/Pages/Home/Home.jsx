import React from 'react';
import QuestionsCard from '../Questions/QuestionsCard';

const Home = () => {
    return (
        <div className='lg:px-4 py-3'>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <QuestionsCard/>
            <QuestionsCard/>
            <QuestionsCard/>
            <QuestionsCard/>
            <QuestionsCard/>
            </div>
            
        </div>
    );
};

export default Home;