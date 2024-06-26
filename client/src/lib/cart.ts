import axios from "axios";

export const addToCart = async (cartItem: any) => {
  const res = await axios.post(`${import.meta.env.VITE_BASE_URI}/cart`, cartItem, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  return res.data;
};

export const deleteCartItem = async (cartItemId: string) => {
  const res = await axios.delete(`${import.meta.env.VITE_BASE_URI}/cart/${cartItemId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  return res.data;
};