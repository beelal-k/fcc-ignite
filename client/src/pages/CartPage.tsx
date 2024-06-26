import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BookingDetails from "@/components/Cart/BookingDetails";
import CartItem from "@/components/Cart/CartItem";
import { deleteCartItem } from "@/lib/cart";

const CartPage = () => {
  const handleRemoveFromPage = async (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
    await deleteCartItem(id);
    window.location.reload();
  };

  const [cartItems, setCartItems] = useState<any[]>([]);
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URI}/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setCartItems(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div
      className={`min-h-screen w-[100vw] overflow-hidden md:flex-row mt-24 flex-col px-8 md:px-16 flex ${cartItems.length > 0 ? "" : "justify-center items-center"
        } gap-6 md:gap-16`}
    >
      <div>
        {cartItems.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-3xl font-medium">Your cart is empty</h1>
            <button
              className="px-4 py-2 mt-4 text-sm font-medium text-white bg-gray-800 rounded-md"
              onClick={() => navigate("/")}
            >
              Go to Home
            </button>
          </div>
        )}
        {cartItems.length > 0 && (
          <h1 className="md:text-3xl text-xl font-medium">Review your cart</h1>
        )}

        {loading && <p>Loading...</p>}
        <br />
        <div className="flex flex-col gap-2">
          {cartItems.map((item) => (
            <div key={item._id} className="md:min-w-[550px]">
              <CartItem
                cartItem={item}
                handleRemoveFromPage={handleRemoveFromPage}
              />
            </div>
          ))}
        </div>
      </div>
      {cartItems.length > 0 && (
        <div className="md:mt-[60px]">
          <BookingDetails cart={cartItems} />
        </div>
      )}
    </div>
  );
};

export default CartPage;
