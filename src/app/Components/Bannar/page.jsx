import Image from 'next/image';
import React from 'react';

const Page = () => {
    return (
        <div>
            {/* Add your banner image here */}
            <div className="relative w-full h-64">
                <Image
                    src="/laptop.jpg"  // Correct path, no need to include "public"
                    alt="Banner"
                    layout="fill"  // This makes the image fill the parent container
                    objectFit="cover"  // Ensures the image covers the container proportionally
                    quality={100}  // Optional: adjust image quality
                    priority  // Ensures this image is preloaded
                />
            </div>
        </div>
    );
};

export default Page;
