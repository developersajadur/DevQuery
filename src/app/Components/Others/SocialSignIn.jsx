"use client"
import { Button } from 'flowbite-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
const SocialSignIn = () => {
    const router = useRouter();
    const searchParams = useSearchParams()
    const path = searchParams.get('redirect');
    const handleSocialSignIn = async (provider) => {
        const res = await signIn(provider,{
          redirect: true,
          callbackUrl: path? path : '/',
        })
            }
    return (
        <div>
               <div className="mt-6 flex justify-between">
          <Button
            className="w-full text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-2.5 mr-2"
            onClick={() => handleSocialSignIn('google')}
          >
            Sign up with Google
          </Button>
          <Button
            className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2 py-2.5 ml-2"
            onClick={() => handleSocialSignIn('github')}
          >
            Sign up with GitHub
          </Button>
        </div>
        </div>
    );
};

export default SocialSignIn;