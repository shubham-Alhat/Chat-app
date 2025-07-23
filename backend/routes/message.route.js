import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  deleteMessage,
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/users").get(verifyJwt, getUsersForSidebar);

router.route("/:id").get(verifyJwt, getMessages);
// router.get("/:id", verifyJwt, getMessages);
// router.post("/send/:id", verifyJwt, upload.single("file"), sendMessage);
// router.delete("/delete/:messageId", verifyJwt, deleteMessage);

// router.get("/users", protectRoute, getUsersForSidebar); // <----

router.route("/send/:id").post(verifyJwt, upload.single("file"), sendMessage);
router.route("/delete/:messageId").delete(verifyJwt, deleteMessage);

export default router;
