import { ItemType } from "@/types";
import useAuthStore from "@/store/authStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import HomeItem from "@/components/HomeItem";

const Wishlist = () => {
  const { user } = useAuthStore();
  const [items, setItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const checkIfInWishlist = (id: string) => {
    if (!user) return false;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const isWishlisted = user.wishlist.includes(id);
    return isWishlisted;
  };

  const appendToWishlist = (id: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    user.wishlist.push(id);
  };

  const removeFromWishlist = (id: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    user.wishlist = user.wishlist.filter((item) => item !== id);
  };

  const handleWishlist = async (id: string) => {
    setUpdating(true);
    if (!user?._id) return;
    try {
      if (checkIfInWishlist(id)) {
        removeFromWishlist(id);
        await axios.post(
          `${import.meta.env.VITE_BASE_URI}/auth/wishlist/remove/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUpdating(false);
      } else {
        appendToWishlist(id);
        await axios.post(
          `${import.meta.env.VITE_BASE_URI}/auth/wishlist/append/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUpdating(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URI}/auth/wishlist`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setItems(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex justify-center items-center h-96">
        <h1>No items in wishlist</h1>
      </div>
    );
  }

  return (
    <>
      <div className="text-3xl font-medium px-10 md:px-20 pt-8">
        <h1>Wishlist</h1>
      </div>

      <div className="flex md:flex-row px-10 w-fit md:px-20 mt-5 mb-20 flex-wrap flex-col gap-6">
        {items.map((item) => (
          <HomeItem
            key={item._id}
            item={item}
          />
        ))}
      </div>
    </>
  );
};

export default Wishlist;
