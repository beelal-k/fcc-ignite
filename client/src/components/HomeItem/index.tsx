"use client";
import { useNavigate } from "react-router-dom";
import Wishlist_Icon from "./Wishlist_Icon";
import useAuthStore from "@/store/authStore";
import axios from "axios";

const HomeItem = ({ item }: { item: any }) => {
  const { user , setUser} = useAuthStore();
  const navigate = useNavigate();

  const handleWishlist = async (adId: any) => {
    if (!user) {
      navigate("/login");
      return;
    }

    //     router.post("/wishlist/append/:itemId", verifyToken, appendToWishlist);
    // router.post("/wishlist/remove/:itemId", verifyToken, removeFromWishlist);

    if (isLiked(adId)) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URI}/auth/wishlist/remove/${adId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        let userNew = { ...user, wishlist: user.wishlist.filter((id) => id !== adId) };
        //@ts-ignore
        setUser(userNew);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
       await axios.post(
          `${import.meta.env.VITE_BASE_URI}/auth/wishlist/append/${adId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        let userNew = { ...user, wishlist: [...user.wishlist, adId] };
        //@ts-ignore
        setUser(userNew);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const isLiked = (itemId: any) => {
    //@ts-ignore
    return user?.wishlist?.includes(itemId);
  };

  return (
    <div className="relative min-w-[270px] ">
      <div
        className="absolute top-3 z-20 cursor-pointer right-9"
        onClick={(e) => {
          e.stopPropagation();
          handleWishlist(item._id);
        }}
      >
        {" "}
        <Wishlist_Icon isLiked={isLiked(item._id)} size={26} />
      </div>
      <div
        className="cursor-pointer  w-[270px]"
        onClick={() => {
          navigate(`/item/${item._id}`);
        }}
        key={item._id}
      >
        <div className="bg-white mb-2 rounded-2xl flex relative overflow-hidden">
          {item.images?.[0] && (
            <img
              className="rounded-2xl  object-cover aspect-square transition-transform duration-200 ease-in-out transform hover:scale-110"
              src={`${item.images?.[0]}`}
              alt=""
            />
          )}
        </div>
        <div className="flex items-center">
          <div className="mt-1">
            <span className="font-medium">{item.title}</span>
          </div>
        </div>
        <h3 className="text-sm font-light text-gray-500">
          Hosted by{" "}
          {item.businessId ? item.businessId?.name : item.business?.name}
        </h3>
      </div>
    </div>
  );
};

export default HomeItem;
