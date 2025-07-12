import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

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

    const newUser = await User.create({
      username,
      fullName,
      password: hashedPassword,
      email,
    });
  } catch (error) {}
};

export const login = (req, res) => {
  res.send("login page");
};

export const logout = (req, res) => {
  res.send("logout page");
};
