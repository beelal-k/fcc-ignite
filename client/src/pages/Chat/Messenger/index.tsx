import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";
import useSocketStore from "@/store/socketStore";
import { useRef } from "react";

const Messenger = ({ object }: { object: any }) => {
  const { socket } = useSocketStore();
  useEffect(() => {
    socket.on("message", (data: any) => {
      if (data.conversationId === object.conversationId) {
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            text: data.text,
            sender: data.sender,
          },
        ]);
      }
    });
    return () => {
      socket.off("message");
    };
  }, [socket, object.conversationId]);

  useEffect(() => {
    handleGetMessages();
  }, []);

  const messagesContainerRef = useRef(null);
  const { user } = useAuthStore();
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [sending, setSending] = useState(false);

  const handleGetMessages = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/message/${object.conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessages(res.data);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const handleSendMessage = async (message: string) => {
    setSending(true);
    try {
      socket.emit("sendMessage", {
        sender: user?._id,
        text: message,
        receiverId: object.user._id,
        conversationId: object.conversationId,
      });
      setMessages([...messages, { text: message, sender: user?._id }]);
      await axios.post(
        `${import.meta.env.VITE_BASE_URI}/message/${object.conversationId}`,
        {
          text: message,
          sender: user?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // setMessages([...messages, res.data]);
      setMsg("");
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      //@ts-ignore
      messagesContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth', 
      });
    }
  }, [messages]);
  
  return (
    <div className="w-3/4 flex flex-col px-16 ">
      <div 
      ref={messagesContainerRef}
      className="h-[400px] overflow-y-auto">
        {messages.map((message: any, ind: number) => (
          <div
            key={ind}
            className={`flex transition-all duration-200 items-center p-4 border-b border-gray-200 ${
              message.sender !== user?._id ? "justify-start" : "justify-end"
            }`}
          >
            {message.sender !== user?._id ? (
              object.user.picture ? (
                <img
                  src={object.user.picture ? object.user.picture : ""}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div>
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                    <p className="text-2xl text-white text-center font-semibold">
                      {object.user?.name[0].toUpperCase()}
                    </p>
                  </div>
                </div>
              )
            ) : user?.picture ? (
              <img src={user?.picture} className="w-12 h-12 rounded-full" />
            ) : (
              <div>
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <p className="text-2xl text-white text-center font-semibold">
                    {user?.name[0].toUpperCase()}
                  </p>
                </div>
              </div>
            )}

            <p className="ml-4 text-black font-semibold">{message.text}</p>
          </div>
        ))}
      </div>
      <Input
        className="w-full mt-4 h-12"
        placeholder="Type a message"
        value={msg}
        disabled={sending}
        onChange={(e) => setMsg(e.target.value)}
      />
      <Button
        className="w-full mt-4"
        disabled={sending}
        onClick={() => handleSendMessage(msg)}
      >
        Send
      </Button>
    </div>
  );
};

export default Messenger;
