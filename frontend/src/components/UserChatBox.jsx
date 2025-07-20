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

function UserChatBox() {
  const messageEndRef = useRef(null);
  const { messages, setMessages, selectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    setIsLoading(true);
    const getMessages = async () => {
      try {
        const res = await api.get(`/message/${selectedUser._id}`);
        setMessages(res.data.messages);
        toast.success(res.data.message);
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

  const handleDeleteMessage = async (messageId) => {
    try {
      setIsLoading(true);
      const res = await api.delete(`/message/delete/${messageId}`);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
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
            {messages.map((message) => (
              <div
                key={message._id}
                className={`chat ${
                  message.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
                ref={messageEndRef}
              >
                {message.senderId === authUser._id ? (
                  <>
                    {/* delete button */}
                    <button
                      className="btn btn-sm hover:text-accent"
                      onClick={() =>
                        document
                          .getElementById("confirmation_model")
                          .showModal()
                      }
                    >
                      <Trash2 size={18} />
                    </button>
                    {/* dialog toggle */}
                    <dialog id="confirmation_model" className="modal">
                      <div className="modal-box">
                        <h3 className="font-bold text-lg">Confirm delete</h3>
                        <p className="py-4">
                          Are you sure you want to delete this message?
                        </p>
                        <div className="modal-action">
                          <form method="dialog" className="space-x-2">
                            {/* Close Button */}
                            <button className="btn">Cancel</button>

                            {/* delete Button */}
                            <button
                              type="button"
                              className="btn btn-error font-bold"
                              onClick={() => handleDeleteMessage(message._id)}
                            >
                              {isLoading ? (
                                <Loader className="text-base-content" />
                              ) : (
                                "delete"
                              )}
                            </button>
                          </form>
                        </div>
                      </div>
                    </dialog>
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
