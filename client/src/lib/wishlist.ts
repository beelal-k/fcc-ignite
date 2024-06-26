import axios from "axios";

export const toggleWishlist = async (productId: string) => {
  const res = await axios.post(
    `${import.meta.env.VITE_BASE_URI}/auth/wishlist/${productId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (res.status === 200) {
    return true;
  } else {
    return false;
  }
};
