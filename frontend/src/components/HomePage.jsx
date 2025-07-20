import Sidebar from "./Sidebar.jsx";
import DefaultChatBox from "./DefaultChatBox.jsx";
import UserChatBox from "./UserChatBox.jsx";
import useChatStore from "../store/useChatStore.js";
import { useEffect } from "react";

function HomePage() {
  const { selectedUser, setSelectedUser, setMessages } = useChatStore();

  useEffect(() => {
    setSelectedUser(null);
    setMessages([]);
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
