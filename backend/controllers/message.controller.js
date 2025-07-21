import { uploadOnCloudinary } from "../lib/cloudinary.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password -accessToken");

    if (!filteredUsers) {
      return res
        .status(500)
        .json({ message: "Error while fetching all users", success: false });
    }

    return res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      filteredUsers,
    });
  } catch (error) {
    console.log("Error in getting all users", error);
    return res
      .status(500)
      .json({ message: "Error while getting all users", success: false });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: chatWithUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, recieverId: chatWithUserId },
        { senderId: chatWithUserId, recieverId: myId },
      ],
    });

    return res.status(200).json({
      message: "All messages fetched successfully",
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id: recieverId } = req.params;
    const senderId = req.user._id;

    const fileLocalPath = req.file?.path;
    const { text } = req.body;

    if (!text && !fileLocalPath) {
      return res.status(400).json({
        success: false,
        message: "Message must contain text or a file.",
      });
    }

    let imageUrl;

    if (fileLocalPath) {
      const response = await uploadOnCloudinary(fileLocalPath);
      if (!response || !response.secure_url) {
        return res
          .status(500)
          .json({ message: "Error while uploading file", success: false });
      }

      imageUrl = response.secure_url;
    }

    const newMessage = await Message.create({
      text,
      image: imageUrl,
      senderId,
      recieverId,
    });

    // after database operation
    // implement real time functionality using `socket.io`

    return res.status(201).json({
      message: "Message data stored in db successfully",
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId: id } = req.params;

    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res
        .status(404)
        .json({ message: "Message not found", success: false });
    }

    return res.status(200).json({
      message: "Message deleted successfully",
      success: true,
      deleteMessage: deleteMessage,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};
