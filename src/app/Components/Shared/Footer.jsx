import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[rgb(58,190,249)] to-[rgb(167,230,255)] rounded-t-3xl text-black py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Social Links */}
        <div className="flex flex-col items-start md:pl-10">
          <div className="text-3xl font-bold text-[rgb(5,12,156)]">DevQuery</div>
          <div className="mt-4 flex space-x-4">
            {/* Social media icons */}
            <a href="#" aria-label="Facebook" className="hover:text-[rgb(53,114,239)] transition duration-300">
              <FaFacebook className="w-6 h-6" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-[rgb(53,114,239)] transition duration-300">
              <FaInstagram className="w-6 h-6" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-[rgb(53,114,239)] transition duration-300">
              <FaTwitter className="w-6 h-6" />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-[rgb(53,114,239)] transition duration-300">
              <FaYoutube className="w-6 h-6" />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-[rgb(53,114,239)] transition duration-300">
              <FaLinkedin className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Company Section */}
        <div>
          <h3 className="text-lg font-bold text-[rgb(5,12,156)]">Company</h3>
          <ul className="mt-4 space-y-2">
            <li><a href="#" className="hover:underline text-black">DevQuery, Inc.</a></li>
            <li><a href="#" className="hover:underline text-black">DevQuery for Business</a></li>
            <li><a href="#" className="hover:underline text-black">Careers</a></li>
            <li><a href="#" className="hover:underline text-black">Investors</a></li>
            <li><a href="#" className="hover:underline text-black">Press Contact</a></li>
            <li><a href="#" className="hover:underline text-black">Blog</a></li>
          </ul>
        </div>

        {/* Community Section */}
        <div>
          <h3 className="text-lg font-bold text-[rgb(5,12,156)]">Community</h3>
          <ul className="mt-4 space-y-2">
            <li><a href="#" className="hover:underline text-black">DevQuery.com</a></li>
            <li><a href="#" className="hover:underline text-black">DevQuery for Community</a></li>
            <li><a href="#" className="hover:underline text-black">Content Policy</a></li>
            <li><a href="#" className="hover:underline text-black">Help Center</a></li>
          </ul>
        </div>

        {/* Privacy & Safety Section */}
        <div>
          <h3 className="text-lg font-bold text-[rgb(5,12,156)]">Privacy & Safety</h3>
          <ul className="mt-4 space-y-2">
            <li><a href="#" className="hover:underline text-black">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline text-black">User Agreement</a></li>
            <li><a href="#" className="hover:underline text-black">Transparency Report</a></li>
            <li><a href="#" className="hover:underline text-black">Other Terms and Policies</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-8 text-center text-sm text-gray-700">
        © 2024 DevQuery, Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
