import { Camera, Mail, User } from "lucide-react";
import React, { useState } from "react";
import useAuthStore from "../store/useAuthStore.js";
import Loader from "./Loader.jsx";
import { toast } from "sonner";
import api from "../lib/axios.js";

function ProfilePage() {
  const { authUser, setAuthUser } = useAuthStore();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e) => {
    setFile(e.target.files[0]); // store the file object
    document.getElementById("upload-confirm").showModal();
  };

  const handleUpadteAvatar = async () => {
    if (!file) {
      return toast.error("File not found?", {
        description: "Please try to upload again.",
      });
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await api.put("/auth/update-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setAuthUser(res.data.user);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
      document.getElementById("upload-confirm").close();
    }
  };

  const handleCancelUpload = () => {
    setFile(null);
  };

  console.log("authuser profile", authUser.avatar);

  return (
    <>
      <div className="h-screen pt-20">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-base-300 rounded-xl p-6 space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold ">Profile</h1>
              <p className="mt-2">Your profile information</p>
            </div>

            {/* avatar upload section */}

            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={authUser.avatar || "/avatar.jpg"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 "
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  
                `}
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    name="avatar"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>

                {/* popUP dialog for upload file */}
                <dialog id="upload-confirm" className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">Avatar Update</h3>
                    <p className="py-4">
                      Are you sure you want to update your avatar?
                    </p>
                    <div className="modal-action">
                      <form method="dialog" className="space-x-2">
                        {/* Close Button */}
                        <button
                          className="btn"
                          disabled={isLoading}
                          onClick={handleCancelUpload}
                        >
                          Cancel
                        </button>

                        {/* yes Button */}
                        <button
                          type="button"
                          disabled={isLoading}
                          className="btn btn-info font-semibold"
                          onClick={handleUpadteAvatar}
                        >
                          {isLoading ? (
                            <Loader className="text-base-content" />
                          ) : (
                            "Yes"
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </dialog>
              </div>
              <p className="text-sm text-zinc-400">
                Click the camera icon to update your photo
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser?.fullName}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser?.email}
                </p>
              </div>
            </div>

            <div className="mt-6 bg-base-300 rounded-xl p-6">
              <h2 className="text-lg font-medium  mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span>Member Since</span>
                  {/* <span>{authUser.createdAt?.split("T")[0]}</span> */}
                  <span>
                    {new Date(authUser.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Account Status</span>
                  <span className="text-green-500 font-semibold">
                    <div
                      aria-label="success"
                      className="status status-success mr-2 mb-1 bg-green-500 rounded-full"
                    ></div>
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
