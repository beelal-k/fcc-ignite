import Link from "next/link.js";
import SearchBar from "./SearchBar";
import { CgGlobeAlt } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu/Menu";
import AccountDrawer from "./AccountDrawer/AccountDrawer";
import useAuthStore from "@/store/authStore";
import logo from "@/assets/logo.png";
import useLanguageStore from "@/store/languageStore";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Notification from "../notifications";

export default function Header() {
  const { user } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const router = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);

  return (
    <div>
      <div className="bg-white pt-2 flex flex-col ">
        <header className="flex sm:pb-0 pb-3 px-10 md:px-20  justify-between items-center gap-3  ">
          <Link href={"/"} className="flex gap-1 md:mb-2 sm:mb-0">
            <span className="font-semibold block mt-auto text-xl">
              <img src={logo} className="w-32" alt="" />
            </span>
          </Link>
          {!isMobile && (
            <Link
              className="whitespace-nowrap ml-auto text-black rounded-full px-4 py-2 hover:bg-gray-100 transition font-medium text-sm duration-300 ease-in-out"
              href={
                user
                  ? user?.businessId
                    ? "/panel"
                    : "/business-form"
                  : "/login"
              }
            >
              Airbnb your home
            </Link>
          )}

          <div className="flex items-center gap-3">
            {/* <button
              onClick={() => {
                if (language === "urdu") {
                  setLanguage("en");
                } else {
                  setLanguage("urdu");
                }
              }}
            >
              <CgGlobeAlt size={25} className="text-gray-600 font-medium" />
            </button> */}
            <Notification />
            {user ? (
              <div className="flex">
                <AccountDrawer />
              </div>
            ) : (
              <div
                onClick={() => router("/login")}
                className="md:flex hidden items-center gap-2 border border-gray-300 rounded-full py-2 my-2.5 px-4 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
                <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 relative top-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </header>

        {location.pathname === "/" && !isMobile && <SearchBar />}

        <hr />
        <div className="md:block hidden md:px-20">
          <Menu />
        </div>
      </div>
    </div>
  );
}
