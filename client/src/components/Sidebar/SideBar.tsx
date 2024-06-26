import { MdSpaceDashboard } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import { BiDetail } from "react-icons/bi";
import { logout } from "@/hooks/auth";
import "./sidebar.css";
import { Button } from "../ui/button";

const SideBar = () => {
  const links = [
    {
      title: "Dashboard",
      slug: "/",
      icon: <MdSpaceDashboard />,
    },
    {
      title: "IB Requests",
      slug: "/ib-requests",
      icon: <FaUserFriends />,
    },
    {
      title: "Copy Trade",
      slug: "/copy-trade",
      icon: <RxDashboard />,
    },
    {
      title: "Copy Request",
      slug: "/copy-request",
      icon: <BiDetail size={20} />,
    },
    {
      title: "Unsub Copy Request",
      slug: "/unsub-copy-request",
      icon: <BiDetail size={20} />,
    },
  ];

  const pathname = useLocation().pathname;

  return (
    <div
      className="pb-20 h-screen w-full p-4 overflow-auto flex flex-col shadow-xl shadow-[#ffe5bb] bg-white dark:bg-secondary "
      id="sidebar"
    >
      {links.map((link, index) => (
        <div
          key={index}
          className={`bg-primary bg-opacity-0 rounded-lg md:p-4 p-2 cursor-pointer hover:bg-primary hover:bg-opacity-20 dark:hover:bg-[#2d2d2d]  transition
          ${pathname === link.slug && "bg-gray-100"}
          `}
        >
          <Link to={link.slug} className="block w-full h-full">
            <div className="flex items-center space-x-4">
              <div className="text-white bg-primary p-2 text-xl rounded-xl font-semibold">
                {link.icon}
              </div>
              <div className="text-black dark:text-white md:block hidden ">
                {link.title}
              </div>
            </div>
          </Link>
        </div>
      ))}

      <Button
        onClick={() => logout()}
        className="w-full bg-primary hover:bg-hover dark:bg-primary dark:hover:bg-hover h-10 mt-auto mb-6 flex md:gap-2 items-center justify-center"
      >
        <p className="md:block hidden text-white font-semibold">Logout</p>
        <IoLogOut className="text-white text-xl" />
      </Button>
    </div>
  );
};

export default SideBar;
