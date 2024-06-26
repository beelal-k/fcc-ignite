import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Layout from "./Layout";
import useAuthStore from "./store/authStore";
import ForgotPass from "./pages/ForgotPass";
import Item from "./pages/ItemPage";
import { useEffect } from "react";
import BusinessLayout from "./pages/Business/BusinessLayout";
import BusinessForm from "./pages/Business/BusinessForm";
import CartPage from "./pages/CartPage";
import Customers from "./pages/Business/Customers";
import Items from "./pages/Business/Items";
import CreateItem from "./pages/Business/CreateItem/CreateItem";
import CheckoutPage from "./pages/Checkout";
import ProfilePage from "./pages/Profile";
import CategoryPage from "./pages/CategoryPage";
import Complaints from "./components/business/complaints/Complaints";
import ChatPage from "./pages/Chat";
import Orders from "./pages/Business/Orders";
import BusinessDashboard from "./pages/Business/BusinessDashboard";
import ResetPass from "./pages/ResetPass";
import Wishlist from "./pages/Wishlist";
import Gallery from "./components/Gallery/Gallery";

const App = () => {
  const { user, theme } = useAuthStore();

  useEffect(() => {
    
  }, [theme]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="reset-password" element={<ResetPass />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="item/:id" element={<Item />} />
        <Route path="item/:id/gallery" element={<Gallery />} />
        <Route path="forgot-password" element={<ForgotPass />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="panel" element={<BusinessLayout />}>
          <Route index element={<BusinessDashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="items" element={<Items />} />
          <Route path="orders" element={<Orders />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="create-item" element={<CreateItem />} />
        </Route>
        <Route path="business-form" element={<BusinessForm />} />

        <Route path="*" element={<h1>Not Found</h1>} />
      </Route>
    </Routes>
  );
};

export default App;
