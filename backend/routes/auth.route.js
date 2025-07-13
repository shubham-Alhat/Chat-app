import express from "express";
import {
  login,
  logout,
  signup,
  updateAvatar,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Another way -- codesistency
// router.get("/signup", (req, res) => {
//   res.send("sign up page 111");
// });

router.route("/signup").post(signup);

router.route("/login").post(login);

router.route("/logout").post(verifyJwt, logout);
router
  .route("/update-avatar")
  .put(verifyJwt, upload.single("avatar"), updateAvatar);

router.route("/check").get(verifyJwt, getCurrentUser);

export default router;
