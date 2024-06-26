import { Outlet } from "react-router-dom";
import useAuthStore from "./store/authStore";
import useSocketStore from "./store/socketStore";
import { useEffect, useState } from "react";
import { loginBack } from "./hooks/auth";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./components/ui/use-toast";
import "./layout.css";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import ItemsMap from "./components/maps/itemsMaps";
import Bot from "./components/Bot";
import { IoMdClose } from "react-icons/io";
import { FaRegMap } from "react-icons/fa";
import { SiRobotframework } from "react-icons/si";
import { io } from "socket.io-client";
// Supports weights 100-900
import "@fontsource-variable/dm-sans";
import Header from "./components/Header/Header";
import { useLocation } from "react-router-dom";

const socketConnect = io("http://localhost:4000");

const Layout = () => {
  const { user, loading, setLoading } = useAuthStore();
  const { setSocket, socket } = useSocketStore();
  const { setUser, setToken } = useAuthStore();
  const { toast } = useToast();
  useEffect(() => {
    setSocket(socketConnect);
  }, [socketConnect]);
  useEffect(() => {
    handleLoginBack();
  }, []);

  const handleLoginBack = async () => {
    try {
      setLoading(true);
      const res = await loginBack();
      if (!res) {
        setToken("");
        setUser(null);
        localStorage.removeItem("token");
        return;
      }
      setUser(res?.user);
      if (res?.token) {
        setToken(res.token);
      }
    } catch (error: any) {
      setToken("");
      setUser(null);
      localStorage.removeItem("token");
      toast({
        title: error.message,
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && socket) {
      socket.emit("addUser", user._id);
    }
  }, [user, socket]);

  const [showMap, setShowMap] = useState(false);
  const [showBot, setShowBot] = useState(false);
  const location = useLocation();

  return (
    <div>
      {!location.pathname.includes("/panel") && (
        <div style={{ position: "sticky", top: "0", zIndex: "999" }}>
          <Header />
        </div>
      )}
      <div
        style={{
          zIndex: 10000,
        }}
      >
        <Toaster />
      </div>
      <div>
        {showMap && <ItemsMap />}
        {!showMap && !location.pathname.includes("/panel") && (
          <div>
            <button
              style={{
                zIndex: 1000,
              }}
              onClick={() => setShowMap(true)}
              className="fixed bottom-3 right-[47%] bg-white p-3 rounded-full shadow-md"
            >
              <FaRegMap className="text-4xl text-[#FF5A5F]" />
            </button>
          </div>
        )}
        {showMap && (
          <button
            style={{
              zIndex: 1000,
            }}
            onClick={() => setShowMap(false)}
            className="fixed bottom-10 right-10 bg-white p-3 rounded-full shadow-md"
          >
            <IoMdClose className="text-4xl text-[#FF5A5F]" />
          </button>
        )}

        <Outlet />
      </div>
      {user && !location.pathname.includes("/panel") && <Footer />}
    </div>
  );
};

export default Layout;
