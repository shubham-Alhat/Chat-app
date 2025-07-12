import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// function for generating token
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const signup = async (req, res) => {
  const { username, fullName, email, password } = req.body;
  try {
    if (!username || !email || !password || !fullName) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be atleast 6 characters",
        success: false,
      });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    // create new user
    const newUser = await User.create({
      username,
      fullName,
      password: hashedPassword,
      email,
    });

    const createdUser = await User.findById(newUser._id).select("-password");

    if (!createdUser) {
      return res
        .status(500)
        .json({ message: "Error while registering new User", success: false });
    }

    // generate access token here
    const token = createToken(createdUser._id);

    const options = {
      httpOnly: true, // can't be accessed by JS
      secure: process.env.NODE_ENV !== "development", // only HTTPS in production
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    return res.status(201).cookie("accessToken", token, options).json({
      message: "User created successfully",
      success: true,
      data: createdUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error occured", success: false });
  }
};

export const login = (req, res) => {
  try {
    const { username, email, password } = req.body;
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const logout = (req, res) => {
  res.send("logout page");
};
