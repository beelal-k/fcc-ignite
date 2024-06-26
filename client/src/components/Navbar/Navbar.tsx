import useAuthStore from "@/store/authStore";
import { navLinks } from "@/constants";
import { BiSun, BiMoon, BiUser } from "react-icons/bi";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { logout } from "@/hooks/auth";
import { FiShoppingBag } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import Notification from "../notifications";
import { RiMessage3Line } from "react-icons/ri";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import useLanguageStore from "@/store/languageStore";

const Navbar = () => {
  const { user, theme, setTheme } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();

  return (
    <>
      <div
        style={{
          zIndex: 1000,
        }}
        className="w-full top-0  shadow fixed flex flex-row items-center justify-between p-2 xl:px-16 lg:px-16 md:px-16 px-5 bg-white dark:bg-dark transition-all py-3"
      >
        <div className="flex flex-row items-center justify-between w-full">
          <Link to={"/"}>
            <img src={logo} className="xl:w-[65px] lg:w-[65px] md:w-[65px]  w-[45px]" />
          </Link>
          <div className=" flex-row gap-6 text-lg w-full justify-center text-black dark:text-white xl:flex lg:flex md:flex sm:hidden hidden">
            {navLinks.map((link) => (
              <Link className="text-sm" to={link.slug}>
                {link.title}
              </Link>
            ))}
          </div>
          <Link
            to={"/chat"}
            className="relative md:block lg:block xl:block hidden w-fit p-2"
          >
            <RiMessage3Line className="text-3xl text-black dark:text-white" />
          </Link>
          <Link
            to={"/cart"}
            className="relative md:block xl:block lg:block hidden w-fit p-2"
          >
            <span className="absolute right-0 top-[-2px] bg-red-500 w-[20px] h-[20px] text-center font-light flex justify-center items-center text-[10px] text-white rounded-full">
              {user?.cart ? user.cart.length : 0}
            </span>
            <FiShoppingBag className="text-2xl text-black dark:text-white" />
          </Link>
          <Link
            to={"/wishlist"}
            className="relative md:block lg:block xl:block hidden w-fit p-2"
          >
            <span className="absolute right-0 top-[-2px] bg-red-500 w-[20px] h-[20px] text-center font-light flex justify-center items-center text-[10px] text-white rounded-full">
              {user?.wishlist ? user.wishlist.length : 0}
            </span>
            <FaRegHeart className="text-2xl text-black dark:text-white" />
          </Link>

          <div>
            <Notification />
          </div>
          <div className="flex flex-row gap-5 w-fit">
            <DropdownMenu>
              <DropdownMenuTrigger>
                {user?.picture ? (
                  <>
                    <img
                      src={user.picture}
                      className="xl:w-[60px] lg:w-[70px] md:w-[80px] w-[45px]  object-cover rounded-full"
                      alt=""
                    />
                  </>
                ) : (
                  <BiUser size={25} className="dark:text-white" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                style={{
                  right: 0,
                  top: "50px",
                  width: "200px",
                  zIndex: 1000,
                }}
              >
                <Link to={"/profile"}>
                  <DropdownMenuItem>
                    Profile
                  </DropdownMenuItem>
                </Link>
                {user?.businessId == null ? (
                  <Link to={"/business-form"}>
                    <DropdownMenuItem>Become a travel agent</DropdownMenuItem>
                  </Link>
                ) : (
                  <Link to={"/panel"}>
                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuItem>
                  <Link to={"/video-call"}>Video Call</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="xl:hidden lg:hidden md:hidden block" onClick={(e) => e.preventDefault()}>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1" className="border-0 p-0">
                      <AccordionTrigger className="border-0 p-0 no-underline font-normal">Categories</AccordionTrigger>
                      <Link to={"/category/historical-sites"} className="xl:hidden lg:hidden md:hidden block">
                        <AccordionContent className="pt-3">
                          Historical Sites
                        </AccordionContent>
                      </Link>
                      <Link to={"/category/natural-wonders"} className="xl:hidden lg:hidden md:hidden block">
                        <AccordionContent>
                          Natural Wonders
                        </AccordionContent>
                      </Link>
                      <Link to={"/category/cultural-attractions"} className="xl:hidden lg:hidden md:hidden block">
                        <AccordionContent>
                          Cultural Attractions
                        </AccordionContent>
                      </Link>
                      <Link to={"/category/adventure-spots"} className="xl:hidden lg:hidden md:hidden block">
                        <AccordionContent className="p-0 pb-1">
                          Adventure Spots
                        </AccordionContent>
                      </Link>
                    </AccordionItem>
                  </Accordion>
                </DropdownMenuItem>
                <Link to={"/forums"} className="xl:hidden lg:hidden md:hidden block">
                  <DropdownMenuItem>Forums</DropdownMenuItem>
                </Link>
                <Link to={"/wishlist"} className="xl:hidden lg:hidden md:hidden block">
                  <DropdownMenuItem>Wishlist</DropdownMenuItem>
                </Link>
                <Link to={"/cart"} className="xl:hidden lg:hidden md:hidden block">
                  <DropdownMenuItem>Cart</DropdownMenuItem>
                </Link>
                <Link to={"/notifications"} className="xl:hidden lg:hidden md:hidden block">
                  <DropdownMenuItem>Notifications</DropdownMenuItem>
                </Link>
                <Link to={"/surprise-me"}>
                  <DropdownMenuItem>Surprise me</DropdownMenuItem>
                </Link>
                {
                  language == 'en' ?
                    <DropdownMenuItem onClick={() => setLanguage("urdu")}>Switch to Urdu</DropdownMenuItem>
                    :
                    <DropdownMenuItem onClick={() => setLanguage("en")}>Switch to English</DropdownMenuItem>
                }
                {
                  user &&
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                }
              </DropdownMenuContent>
            </DropdownMenu>
            <div></div>
            <span className="cursor-pointer items-center xl:flex lg:flex md:flex hidden">
              {theme == "dark" ? (
                <BiMoon
                  size={25}
                  className="text-black dark:text-white"
                  onClick={() => setTheme("light")}
                />
              ) : (
                <BiSun
                  size={25}
                  onClick={() => setTheme("dark")}
                  className={"text-black dark:text-black"}
                />
              )}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
