import { Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import useChatStore from "../store/useChatStore.js";
import api from "../lib/axios.js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useSocketStore from "../store/useSocketStore.js";

function Sidebar() {
  const { setUsersForChat, usersForChat, setSelectedUser, selectedUser } =
    useChatStore();
  const { onlineUsers } = useSocketStore();

  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await api.get("/message/users");
        setUsersForChat(res.data.filteredUsers);
        // toast.success(res.data.message);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message, {
          description: error.message,
        });
        setUsersForChat([]);
      }
    };

    getUsers();
  }, []); // empty dependency array → runs only once

  return (
    <>
      <aside className="w-full lg:w-80 h-full border-r border-base-300 overflow-y-auto">
        {usersForChat.map((user) => (
          <div
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              navigate("/chat");
            }}
            // onClick={handleChatClick}
            className={`
              w-full p-3 flex items-center gap-3 cursor-pointer
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            {/* Avatar */}
            <div className="avatar relative">
              <div className="w-12 rounded-full">
                <img src={user.avatar || "/avatar.jpg"} alt={user.fullName} />
              </div>
              {/* green dot o online users */}
              <div>
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="font-medium truncate">{user.fullName}</span>
                <span className="text-xs text-zinc-400">
                  {user?.time || "Yesterday"}
                </span>
              </div>
              <div className="text-sm text-zinc-500 truncate">
                {user?.lastMessage || "Sent a message..."}
              </div>
            </div>

            {/* Unread Badge */}
            {/* {user.unreadCount > 0 && (
              <div className="badge badge-success text-white text-xs">
                {user.unreadCount}
              </div>
            )} */}
          </div>
        ))}
      </aside>
    </>
  );
}

export default Sidebar;
