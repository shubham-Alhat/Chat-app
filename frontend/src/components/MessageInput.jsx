import { Image, Send, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import api from "../lib/axios.js";
import useChatStore from "../store/useChatStore.js";
import Loader from "./Loader.jsx";

function MessageInput() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const { selectedUser } = useChatStore();
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  // send message to db
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    if (text.trim === "" && !imagePreview) {
      return toast.error("Any message or file is must!");
    }

    const formData = new FormData();

    if (text) formData.append("text", text);
    if (file) formData.append("file", file);
    try {
      const res = await api.post(`/message/send/${selectedUser._id}`, formData);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        description: error.message,
      });
    } finally {
      setFile(null);
      setImagePreview(null);
      setText("");
      setIsLoading(false);
    }
  };

  // handle on change on input field
  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  // remove the image
  const removeImage = () => {
    setImagePreview(null);
    setFile(null);
  };

  return (
    <>
      <div className="px-1.5 py-2 w-full">
        {imagePreview && (
          <div className="mb-3 flex items-center gap-2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
                type="button"
              >
                <X className="size-3 cursor-pointer" />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="flex-1 flex gap-2 items-center">
            <input
              type="text"
              className="w-full input input-bordered flex-1 text-sm h-10"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />

            <button
              type="button"
              disabled={imagePreview}
              className={` sm:flex btn btn-primary h-10 min-h-0
                     ${imagePreview ? "text-accent" : ""}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Image size={20} />
            </button>
          </div>
          <button
            type="submit"
            className="btn btn-primary h-10 min-h-0 cursor-pointer"
            disabled={!text.trim() && !imagePreview}
          >
            {isLoading ? (
              <Loader className="text-primary-content" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
      </div>
    </>
  );
}

export default MessageInput;
