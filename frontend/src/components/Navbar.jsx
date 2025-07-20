import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";
import { toast } from "sonner";
import Loader from "./Loader.jsx";
import api from "../lib/axios.js";

function Navbar() {
  const { authUser, setAuthUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/logout");
      setAuthUser(null);
      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        description: error.message,
      });

      setAuthUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header
        className=" border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100 bg-base-100/80"
      >
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="flex items-center gap-2.5 hover:opacity-80 transition-all"
              >
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-lg font-bold">Chattie</h1>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={"/settings"}
                className={`
              btn btn-sm gap-2 transition-colors
              
              `}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>

              {authUser && (
                <>
                  <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                    <User className="size-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>

                  {/* <button className="flex gap-2 items-center cursor-pointer hover:opacity-80">
                    <LogOut className="size-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button> */}
                  <button
                    className="btn"
                    onClick={() =>
                      document.getElementById("logout_modal").showModal()
                    }
                  >
                    Logout
                  </button>

                  <dialog id="logout_modal" className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">Confirm Logout</h3>
                      <p className="py-4">Are you sure you want to log out?</p>
                      <div className="modal-action">
                        <form method="dialog" className="space-x-2">
                          {/* Close Button */}
                          <button className="btn">Cancel</button>

                          {/* Logout Button */}
                          <button
                            type="button"
                            className="btn btn-error font-bold"
                            onClick={handleLogOut}
                          >
                            {isLoading ? (
                              <Loader className="text-base-content" />
                            ) : (
                              "Logout"
                            )}
                          </button>
                        </form>
                      </div>
                    </div>
                  </dialog>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
