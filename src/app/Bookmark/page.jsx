"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import QuestionsCard from '../Components/Questions/QuestionsCard';
import { useSession } from 'next-auth/react';

const BookPage = () => {
  const [data, setData] = useState([]);
  const { data: session, status } = useSession();
  const user = session?.user;

  useEffect(() => {
    const fetchBook = async () => {
      if (user?.email) {  // Make sure the user is logged in and email is available
        try {
          const response = await axios.get(`http://localhost:3000/questions/api/getBook?email=${user.email}`);
          
          if (response.status === 200) {
            setData(response.data.books);
            // console.log(response.data.books);
          } else {
            console.error('Error fetching');
          }
        } catch (error) {
          console.error("Error", error);
        }
      }
    };

    fetchBook();
  }, [user]); // Re-fetch if the user changes

  return (
    <div>
      {data.map(dt =>
        <div key={dt._id}>
          <QuestionsCard key={dt._id} question={dt} />
        </div>
      )}
    </div>
  );
};

export default BookPage;
