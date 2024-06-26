import axios from "axios";
import { useState } from "react";
import { Input } from "../ui/input"; 
import { IoCloseSharp } from "react-icons/io5";
import { FiUser } from "react-icons/fi"; 
import { AiOutlineRobot } from "react-icons/ai"; 
import { Button } from "../ui/button";

const Bot = ({ setOpen }: { setOpen: (value: boolean) => void }) => {
  const [messages, setMessages] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");

  const sendMessage = async (message: any) => {
    if (!message.trim()) return;
    const newMessage = { message, isBot: false };
    setLoading(true);
    try {
      setMessages((currentMessages: any) => [...currentMessages, newMessage]);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URI}/bot`,
        { prompt: message }
      );
      const botMessage = { message: response.data.message, isBot: true };
      setMessages((currentMessages: any) => [...currentMessages, botMessage]);
      setInputMessage("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-[23%] left-[33%] w-[400px] bg-white pt-6 rounded-xl shadow-lg z-50">
      <div
        onClick={() => setOpen(false)}
        className="absolute top-0 right-0 p-2 cursor-pointer"
      >
        <IoCloseSharp className="text-2xl" />
      </div>
      <div className="text-center p-4">
        <h1 className="text-xl font-semibold mb-2">Chat with Us!</h1>
        <p className="text-gray-500">How can we assist you today?</p>
      </div>
      <div className="overflow-y-auto h-64 mb-4 p-4">
        {messages.map((item: any, index: number) => (
          <div key={index} className="flex items-end justify-end mb-2">
            <div
              className={`flex items-center ${
                item.isBot ? "justify-start" : "justify-end"
              } w-full`}
            >
              <div>
                {item.isBot ? (
                  <AiOutlineRobot className="text-lg mr-2" />
                ) : (
                  <FiUser className="text-lg mr-2" />
                )}
              </div>

              <div
                className={`${
                  item.isBot ? "bg-blue-100" : "bg-green-200"
                } rounded-lg p-2`}
              >
                <p>{item.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex p-4">
        <Input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 p-2 border-2 border-gray-300 rounded-l-lg focus:outline-none mr-2"
        />
        <Button
          onClick={() => sendMessage(inputMessage)}
          disabled={loading || !inputMessage.trim()}
      >
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default Bot;
