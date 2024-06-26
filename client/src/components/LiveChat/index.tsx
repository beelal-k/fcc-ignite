import useSocketStore from "@/store/socketStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import axios from "axios";
import useAuthStore from "@/store/authStore";

const LiveChat = ({ item }: { item: any }) => {
  const { socket } = useSocketStore();
  const [onlineUsers, setOnlineUsers] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("onlineUsers", (users: any) => {
      setOnlineUsers(users);
    });
    socket.emit("getOnlineUsers");
    return () => {
      socket.off("onlineUsers");
    };
  }, []);

  const handleCreateConversation = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URI}/conversation`,
        {
          receiverId: item.sellerId,
          senderId: user?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate(`/chat`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (
    onlineUsers.find((user: any) => user.userId === item.sellerId) &&
    user?._id !== item.sellerId
  ) {
    return (
      <div className="relative">
        <Button onClick={handleCreateConversation} className="w-full">
          {loading ? "Loading..." : "Start Live Chat"}
        </Button>
        <div className="absolute top-[-2px] right-[-3px] bg-green-500 w-3 h-3 rounded-full" />
      </div>
    );
  }
};

export default LiveChat;
