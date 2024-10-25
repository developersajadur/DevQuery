import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLinkedin, FaGithub, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Social Links */}
        <div className="flex flex-col items-start md:pl-10">
          <Link href="/" className="text-2xl lg:text-3xl font-bold">DevQuery</Link>
          <div className="mt-4 space-x-4 grid grid-cols-3 lg:grid-cols-5 gap-2">
            {/* Social media icons */}
            <Link href="https://web.facebook.com/developersajadur" aria-label="Facebook" className="hover:text-[rgb(53,114,239)] transition duration-300">
              <FaFacebook className="w-6 h-6" />
            </Link>
            <Link href="https://wa.me/+8801787448412" aria-label="Instagram" className="hover:text-[rgb(53,114,239)] transition duration-300">
              <FaWhatsapp className="w-6 h-6" />
            </Link>
            <Link href="https://x.com/devsajadur" aria-label="Twitter" className="hover:text-[rgb(53,114,239)] transition duration-300">
              <FaTwitter className="w-6 h-6" />
            </Link>
            <Link href="https://github.com/developersajadur/DevQuery" aria-label="YouTube" className="hover:text-[rgb(53,114,239)] transition duration-300">
              <FaGithub className="w-6 h-6" />
            </Link>
            <Link href="https://www.linkedin.com/in/sajadurrahman" aria-label="LinkedIn" className="hover:text-[rgb(53,114,239)] transition duration-300">
              <FaLinkedin className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* Company Section */}
        <div>
          <h3 className="text-lg font-bold">Company</h3>
          <ul className="mt-4 space-y-2">
            <li><Link href="/" className="hover:underline">DevQuery, Inc.</Link></li>
            <li><Link href="/about" className="hover:underline">About Us</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
            {/* <li><Link href="#" className="hover:underline">Investors</Link></li>
            <li><Link href="#" className="hover:underline">Press Contact</Link></li> */}
            <li><Link href="#" className="hover:underline">Blog</Link></li>
          </ul>
        </div>

        {/* Community Section */}
        <div>
          <h3 className="text-lg font-bold">Community</h3>
          <ul className="mt-4 space-y-2">
            <li><Link href="/" className="hover:underline">DevQuery.com</Link></li>
            <li><Link href="/users" className="hover:underline">DevQuery Users</Link></li>
            <li><Link href="/jobs" className="hover:underline">Find Jobs</Link></li>
            {/* <li><Link href="#" className="hover:underline">Help Center</Link></li> */}
          </ul>
        </div>

        {/* Privacy & Safety Section */}
        <div>
          <h3 className="text-lg font-bold">Important Links</h3>
          <ul className="mt-4 space-y-2">
            <li><Link href="/questions" className="hover:underline">Questions</Link></li>
            <li><Link href="/users" className="hover:underline">Users</Link></li>
            <li><Link href="/jobs" className="hover:underline">Jobs</Link></li>
            <li><Link href="/subscription" className="hover:underline">Subscription</Link></li>
            {/* <li><Link href="#" className="hover:underline">Other Terms and Policies</Link></li> */}
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-8 text-center text-sm text-gray-300">
        © 2024 DevQuery, Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
