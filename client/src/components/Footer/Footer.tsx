import { FaGlobe } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="fixed bg-white text-sm font-light bottom-0 w-full h-16 border-t flex items-center justify-between px-4 md:px-16">
      <div className="flex flex-wrap space-x-2 items-center">
        <span>© 2024 Airbnb, Inc.</span>
        <a href="#" className="hover:underline">
          Terms
        </a>
        <span className="hidden md:inline">·</span>
        <a href="#" className="hover:underline">
          Sitemap
        </a>
        <span className="hidden md:inline">·</span>
        <a href="#" className="hover:underline">
          Privacy
        </a>
        <span className="hidden md:inline">·</span>
        <a href="#" className="hover:underline">
          Your Privacy Choices
        </a>
      </div>
      <div className="flex items-center space-x-2">
        <FaGlobe />
        <span>English (US)</span>
      </div>
    </div>
  );
};

export default Footer;