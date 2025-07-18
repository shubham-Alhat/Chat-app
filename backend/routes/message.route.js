import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/users").get(verifyJwt, getUsersForSidebar);

router.route("/:id").get(verifyJwt, getMessages);

router.route("/send/:id").post(verifyJwt, upload.single("file"), sendMessage);

export default router;
