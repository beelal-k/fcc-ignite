import Messenger from "./Messenger";
import { useEffect, useState } from "react";
import axios from "axios";

const ChatPage = () => {
  const [conversations, setConversation] = useState<any>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  useEffect(() => {
    handleGetMyConversations();
  }, []);

  const handleGetMyConversations = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/conversation`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setConversation(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen  relative">
      <div className="pl-12 flex flex-col w-1/4 border-r border-gray-200 pt-24">
        {conversations?.conversations?.map((item: any, ind: number) => (
          <div
            onClick={() =>
              setSelectedConversation({
                user: conversations.user,
                conversationId: item._id,
              })
            }
            key={ind}
            className="flex hover:bg-gray-200 transition-all duration-200 cursor-pointer items-center p-4 border-b border-gray-200"
          >
            {conversations.user.picture ? ( <img
              src={conversations.user.picture ? conversations.user.picture : ""}
              className="w-12 h-12 rounded-full"
            />) : (
              <div>
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <p
                  className="text-2xl text-white text-center font-semibold"
                  >
                    {conversations.user.name[0].toUpperCase()}
                  </p>
                </div>
              </div>
            )}
           
            <p className="ml-4 font-semibold">{conversations.user.name}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col w-3/4 pt-28">
        {!selectedConversation && (
          <div className="flex items-center justify-center h-full">
            <p className="text-2xl font-semibold">Select a conversation</p>
          </div>
        )}
        {selectedConversation && <Messenger object={selectedConversation} />}
      </div>
    </div>
  );
};

export default ChatPage;
