"use client"
import React from 'react';

const Contact = () => {

    const buttonForSubmit = (e) =>{
      e.preventDefault()
      const form =new FormData(e.currentTarget);
      const name = form.get("name");
      const email = form.get("email");
      const number = form.get("number")
      const subject = form.get("subject");
      const message = form.get("message")
      const contactInfo = { name,email,number,subject,message }
      console.log(contactInfo);
      
            
      
      
    }
    return (
        <div>

            <div className='mx-4'>
                <h1 className=' font-bold'>We recognize the value of taking a comprehensive approach to every project and believe in the effectiveness of clear and straightforward communication. Should you have any questions, need assistance, or require our services, don’t hesitate to reach out. We encourage you to provide a detailed explanation of your issue so we can offer the most effective support.</h1>
                <div className='mt-5 mx-6'>
                <form onSubmit={buttonForSubmit}>
                    <div className='grid grid-cols-2'>
                    <div>
                        <label htmlFor="" className='font-bold text-opacity-80'><small>Name</small></label><br />
                        <input type="text" name='name' placeholder='' className='w-80 h-7' />
                    </div>
                    <div>
                        <label htmlFor="" className='font-bold text-opacity-60'><small>Email</small></label><br />
                        <input type="email" name='email' placeholder='' className='w-80 h-7' />
                    </div>
                    <div>
                        <label htmlFor="" className='font-bold text-opacity-80'><small>Phone</small></label><br />
                        <input type="number" name='number'  placeholder='' className='w-80 h-7' />
                    </div>
                    <div>
                        <label htmlFor="" className='font-bold text-opacity-80'><small>Subject</small></label><br />
                        <input type="text" name='subject' placeholder='' className='w-80 h-7' />
                    </div>
                    </div>
                    <div>
                        <label htmlFor="" className='font-bold text-opacity-80'><small>Message</small></label><br />
                        <textarea type="text" name='message' rows="6" cols="88" className='' />
                    </div>

                    <button className='bg-blue-600 p-2 text-bold rounded-lg'>Submit</button>
                </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;