import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

// Another way -- codesistency
// router.get("/signup", (req, res) => {
//   res.send("sign up page 111");
// });

router.route("/signup").post(signup);

router.route("/login").post(login);

router.route("/logout").post(logout);

export default router;
