"use client";

import { format } from "timeago.js";
import { useNavigate } from "react-router-dom";
import Wishlist_Icon from "./Wishlist_Icon";
import useAuthStore from "@/store/authStore";

const HomeItem = ({ item }: { item: any }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleWishlist = async (adId: any) => {
    if (!user) {
      navigate("/login");
      return;
    }
    // await addToWishlist(adId, user, token);
  };

  const isLiked = (itemId: any) => {
    return false;
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
          Hosted by {item.businessId ? item.businessId?.name : item.business?.name}
        </h3>
      </div>
    </div>
  );
};

export default HomeItem;
