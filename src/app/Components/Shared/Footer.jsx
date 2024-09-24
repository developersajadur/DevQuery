import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Social Links */}
        <div className="flex flex-col items-start">
          <div className="text-3xl font-bold text-orange-500">DevQuery</div>
          <div className="mt-4 flex space-x-4">
            {/* Social media icons */}
            <a href="#" aria-label="Facebook" className="hover:text-gray-400">
              <FaFacebook className="w-6 h-6" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-gray-400">
              <FaInstagram className="w-6 h-6" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-gray-400">
              <FaTwitter className="w-6 h-6" />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-gray-400">
              <FaYoutube className="w-6 h-6" />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-gray-400">
              <FaLinkedin className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Company Section */}
        <div>
          <h3 className="text-lg font-bold text-orange-500">Company</h3>
          <ul className="mt-4 space-y-2">
            <li><a href="#" className="hover:underline">DevQuery, Inc.</a></li>
            <li><a href="#" className="hover:underline">DevQuery for Business</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Investors</a></li>
            <li><a href="#" className="hover:underline">Press Contact</a></li>
            <li><a href="#" className="hover:underline">Blog</a></li>
          </ul>
        </div>

        {/* Community Section */}
        <div>
          <h3 className="text-lg font-bold text-orange-500">Community</h3>
          <ul className="mt-4 space-y-2">
            <li><a href="#" className="hover:underline">DevQuery.com</a></li>
            <li><a href="#" className="hover:underline">DevQuery for Community</a></li>
            <li><a href="#" className="hover:underline">Content Policy</a></li>
            <li><a href="#" className="hover:underline">Help Center</a></li>
          </ul>
        </div>

        {/* Privacy & Safety Section */}
        <div>
          <h3 className="text-lg font-bold text-orange-500">Privacy & Safety</h3>
          <ul className="mt-4 space-y-2">
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">User Agreement</a></li>
            <li><a href="#" className="hover:underline">Transparency Report</a></li>
            <li><a href="#" className="hover:underline">Other Terms and Policies</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-8 text-center text-sm text-gray-400">
        © 2024 DevQuery, Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
