import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader.jsx";
import { formatMessageTime } from "../lib/utils.js";
import useChatStore from "../store/useChatStore.js";
import useAuthStore from "../store/useAuthStore.js";
import { toast } from "sonner";
import api from "../lib/axios.js";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "../skeletons/MessageSkeleton.jsx";
import { Trash2 } from "lucide-react";
import Loader from "./Loader.jsx";
import useSocketStore from "../store/useSocketStore.js";

function UserChatBox() {
  const messageEndRef = useRef(null);
  const { messages, setMessages, selectedUser, deleteMessage, addNewMessage } =
    useChatStore();
  const { authUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const { socketState } = useSocketStore();

  useEffect(() => {
    const chatId = [authUser._id, selectedUser._id].sort().join("_");
    if (socketState) {
      socketState.emit("join-chat", chatId);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    // console.log(messages); // Array of message
  }, [messages]);

  useEffect(() => {
    setIsLoading(true);
    const getMessages = async () => {
      try {
        const res = await api.get(`/message/${selectedUser._id}`);
        setMessages(res.data.messages);
        // toast.success(res.data.message);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message, {
          description: error.message,
        });

        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    getMessages();
  }, []);

  // leaving all rooms and joining new room
  useEffect(() => {
    const chatId = [authUser._id, selectedUser._id].sort().join("_");
    if (socketState) {
      // Leave all rooms before joining new one
      socketState.emit("leave-all-chats");
      socketState.emit("join-chat", chatId);
    }
  }, [selectedUser]);

  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      addNewMessage(newMessage);
    };
    if (socketState) {
      socketState.on("recieve-message", handleReceiveMessage);
    }

    return () => socketState.off("recieve-message", handleReceiveMessage);
  }, []);

  const handleDeleteMessage = async (messageId) => {
    try {
      const res = await api.delete(`/message/delete/${messageId}`);
      deleteMessage(messageId);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        description: error.message,
      });
    } finally {
    }
  };

  if (isLoading || !selectedUser || !authUser || !messages) {
    return <MessageSkeleton />;
  }

  return (
    <>
      <div className="flex-1 flex flex-col overflow-auto mt-20">
        <ChatHeader />

        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* my new try */}
            {messages.map((message, index) => (
              <div
                key={message._id || index}
                className={`chat ${
                  message.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
                ref={messageEndRef}
              >
                {message.senderId === authUser._id ? (
                  <>
                    {/* delete button */}
                    <button
                      key={message._id}
                      className="btn btn-sm hover:text-accent"
                      disabled={isLoading}
                      // onClick={() =>
                      //   document
                      //     .getElementById("confirmation_model")
                      //     .showModal()
                      // }
                      onClick={() => handleDeleteMessage(message._id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                ) : (
                  <div></div>
                )}

                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="avatar"
                      src={
                        message.senderId === authUser._id
                          ? authUser.avatar || "/avatar.jpg"
                          : selectedUser.avatar || "/avatar.jpg"
                      }
                    />
                  </div>
                </div>
                <div className="chat-header flex gap-2 text-xs">
                  {message.senderId === authUser._id
                    ? "you"
                    : selectedUser.fullName}
                  <time className="text-xs opacity-60">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
                <div className="chat-bubble">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
                <div className="chat-footer opacity-50">Delivered</div>
              </div>
            ))}
          </div>
        )}

        <MessageInput />
      </div>
    </>
  );
}

export default UserChatBox;
