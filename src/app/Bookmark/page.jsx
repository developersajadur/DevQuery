"use client"
import QuestionsCard from '@/Components/Questions/QuestionsCard';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const [data, setData] = useState([])

  useEffect(()=>{
   const fetchBook = async () =>{
    try {
      const response = await axios.get('http://localhost:3000/questions/api/getBook')
     if(response.status === 200){
      setData(response.data.books)
      console.log(response.data.books);
     }    else {
      console.error('Error fetching')
     }
      
    } catch (error) {
      console.error("Error", error)
    }
   }
   fetchBook()
  },[])

  return (
    <div>
      {data.map(dt=><QuestionsCard key={dt._id} question={dt}/>)}
    </div>
  );
};

export default Page;