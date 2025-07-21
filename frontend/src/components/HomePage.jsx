import Sidebar from "./Sidebar.jsx";
import DefaultChatBox from "./DefaultChatBox.jsx";
import useChatStore from "../store/useChatStore.js";
import { useEffect } from "react";
import useSocketStore from "../store/useSocketStore.js";
import socket from "../lib/socket.js";
import useAuthStore from "../store/useAuthStore.js";

function HomePage() {
  const { selectedUser, setSelectedUser, setMessages } = useChatStore();
  const { socketState, setSocketState, onlineUsers, setOnlineUsers } =
    useSocketStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    setSelectedUser(null);
    setMessages([]);
    // connect socket
    socket.connect();
    setSocketState(socket);
    // add user by emitting
    socket.emit("user-connected", authUser._id);

    // get online users
    socket.on("online-users", (userIds) => {
      setOnlineUsers(userIds);
    });

    // clear socket if page is unmount
    // Error : disconnect and userId get remove from onlineusers List. result in offline mode for other pages. but when come to home page - back to online
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  return (
    <>
      <div className="h-screen bg-base-200">
        <div className="flex items-center justify-center pt-20 px-4">
          <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
            <div className="flex h-full w-full rounded-lg overflow-hidden">
              <Sidebar />

              {/* On large screen: show DefaultChatBox when no user is selected */}
              {!selectedUser && (
                <div className="hidden lg:block flex-1">
                  <DefaultChatBox />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
