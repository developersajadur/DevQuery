// "use client"; // This is a client component


// import React, { useEffect, useState } from 'react';
// import Loading from '@/app/Components/Loading/Loading';
// import { IoMdHome } from 'react-icons/io';
// import Link from 'next/link';
// import Image from 'next/image';
// import { Badge } from 'flowbite-react';


// const BlogsDetails = ({params}) => {
//     const [detailsOfBlogs, setDetailsOfBlogs] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(()=>{
//    const fetchBlogDetails = async ()=>{
//     try {
//         const data = await getBlogsDetails(params.id)
//         setDetailsOfBlogs(data)
//     } catch (error) {
//         console.error(error, "Error fetching data")
//     } finally{
//         setLoading(false)
//     }
//    }
//    fetchBlogDetails();
//   },[params.id])

//   if(loading){
//     return <Loading/>
//   }
//     return (
//         <div>
//           <div className='px-4'>
//         <nav aria-label="breadcrumb" className="w-full p-4 dark:bg-gray-100 dark:text-gray-800">
//           <ol className="flex h-8 space-x-2">

//             <li className="flex items-center">
//               <IoMdHome/>
//               <Link href={'/'}><button rel="noopener noreferrer" className="flex items-center px-1 capitalize font-semibold">Home</button></Link>
//             </li>

//             <li className="flex items-center space-x-2">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" fill="currentColor" className="w-2 h-2 mt-1 transform rotate-90 fill-current dark:text-gray-400">
//                 <path d="M32 30.031h-32l16-28.061z"></path>
//               </svg>
//              <Link href={'/blogs'}><button rel="noopener noreferrer" className="flex items-center px-1 capitalize hover:text-ellipsis font-semibold">Blogs</button></Link>
//             </li>
//             <li className="flex items-center space-x-2">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" fill="currentColor" className="w-2 h-2 mt-1 transform rotate-90 fill-current dark:text-gray-400">
//                 <path d="M32 30.031h-32l16-28.061z"></path>
//               </svg>
//               <a rel="noopener noreferrer" className="flex small items-center text-gray-600 px-1 capitalize cursor-default hover:text-ellipsis font-semibold">{detailsOfBlogs.title}</a>
//             </li>
//           </ol>
//         </nav>
//       </div>
//    <hr />
//       <div className='mt-10'>
//           <h1 className='text-xl text-center font-bold'>{detailsOfBlogs.title}</h1>
//            <p className='text-center my-4 font-semibold text-blue-600'>{detailsOfBlogs.author}</p>
//            <Image src={detailsOfBlogs?.image || "Not support"} 
//                         className='text-center'
//                           alt="Description of the image"
//                           width={700}
//                           height={475}
//                           style={{ width: '100%',}} // Replace with the actual height of the image
//                         />
//                          <div className='flex mt-3 items-center gap-4'>
//                             {detailsOfBlogs.tags.map((tag,index)=>
//                             (
//                                <Badge key={index}>#{tag}</Badge>
//                             )
//                             )}
//                         </div>
//                         <p className='mt-4'>{detailsOfBlogs.description}</p>

                    
//       </div>
//         </div>
//     );
// };

// export default BlogsDetails;














// import axios from 'axios';
// import React from 'react';

// export const GetBlog = async () => {
//     const fetch = `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/getBlogs`
//     try {
//         const response = await axios.get(fetch)
//         const getBlogs = response?.data.blogs;
//         return getBlogs
//     } catch (error) {
//         console.error('Error details', error)
//         return [];
//     }
// }
// export const getBlogsDetails = async (id) =>{
//     const fetchURL = `${process.env.NEXT_PUBLIC_WEB_URL}/questions/api/getBlogs/${id}`
//     try {
//         const response = await axios.get(fetchURL)
//         const details = response.data.blog;
//         return details
//     } catch (error) {
//     console.error(error,"Error")
//     return []       ; 
//     }
// };

// export default GetBlog;


import React from 'react';

const BlogsDetails = () => {
  return (
    <div>
      details
    </div>
  );
};

export default BlogsDetails;