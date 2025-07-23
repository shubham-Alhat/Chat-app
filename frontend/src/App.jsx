import HomePage from "./components/HomePage.jsx";
import Navbar from "./components/Navbar.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./components/SignUpPage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import SettingPage from "./components/SettingPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import useAuthStore from "./store/useAuthStore.js";
import { useEffect, useState } from "react";
import Loader from "./components/Loader.jsx";
import { toast, Toaster } from "sonner";
import api from "./lib/axios.js";
import { User } from "lucide-react";
import { useThemeStore } from "./store/useThemeStore.js";
import useChatStore from "./store/useChatStore.js";
import UserChatBox from "./components/UserChatBox.jsx";

function App() {
  const { setAuthUser, authUser } = useAuthStore();
  const { selectedUser, setSelectedUser } = useChatStore();
  const [isLoading, setLoading] = useState(true);
  const { theme } = useThemeStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/check");
        setAuthUser(res.data.user);
      } catch (error) {
        console.log("Error in checkAuth: ", error);
        setAuthUser(null);
        toast.error(error.response.data.message, {
          description: error.message,
          duration: 5000,
          icon: <User size={18} color="black" />,
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setAuthUser]);

  if (isLoading) {
    return (
      <>
        <div className="w-full h-screen flex justify-center items-center">
          <Loader className="text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <div data-theme={theme || "luxury"}>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/chat"
            element={selectedUser ? <UserChatBox /> : <Navigate to={"/"} />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
          />
          <Route path="/settings" element={<SettingPage />} />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
          />
        </Routes>
        <Toaster position="top-center" richColors={true} />
      </div>
    </>
  );
}

export default App;
