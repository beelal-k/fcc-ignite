import { ItemType } from "@/types";
import useAuthStore from "@/store/authStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";

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
      <div className="mt-20 text-3xl font-medium mx-20 pt-8">
        <h1>Wishlist</h1>
      </div>

      <div className="flex md:flex-row mx-20 mt-10 mb-20 flex-wrap flex-col gap-6">
        {items.map((item) => (
          <Link
            to={`/item/${item._id}`}
            key={item._id?.toString()}
            className="bg-gradient-to-br w-full md:w-[300px] cursor-pointer relative from-gray-50 h-[330px] to-white rounded-xl overflow-hidden border flex flex-col items-center"
          >
            <div className="h-[200px] overflow-hidden w-full">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover transition-all duration-200 shadow-sm hover:scale-110"
              />
              <div
                className="absolute right-4 top-4 z-10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (updating) {
                    // can add a return here;
                  }
                  handleWishlist(item._id);
                }}
              >
                <FaRegHeart
                  className={`${"block"}  text-white/80 text-lg
                }`}
                />
              </div>
              <div className="absolute right-4 top-4">
                {item?._id && (
                  <FaHeart
                    className={`${checkIfInWishlist(item._id?.toString())
                        ? "text-red-500"
                        : "text-black opacity-50"
                      } text-lg`}
                  />
                )}
              </div>
            </div>
            <div className="w-full h-full max-h-[130px] px-4 pt-2">
              <h3 className="text-lg mb-1 mt-2 font-medium">
                {item.title.length > 18
                  ? item.title.slice(0, 18) + "..."
                  : item.title}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-yellow-600 font-medium">PKR {item.price}</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, index) => (
                    <FaStar
                      key={index}
                      className={`text-[#FF5A5F] text-xs ${index < Math.round(4.5)
                          ? "text-[#FF5A5F]"
                          : "text-gray-300"
                        }`}
                    />
                  ))}
                  <p className="text-xs text-gray-600 ml-2">
                    ({item.reviews?.length})
                  </p>
                </div>
              </div>
              <p className="bg-[#FF5A5F] absolute left-4 bottom-4 text-white text-xs w-fit px-2 py-1 rounded-xl">
                {item.category}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Wishlist;
