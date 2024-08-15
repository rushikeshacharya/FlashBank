import express from "express";
import bankRouter from "./bank.route.js";
import userRouter from "./user.route.js";

const router = express.Router();

// Default Route
router.get("/", (req, res) => {
  return res.status(200).send("Default Route");
});

// User and Bank Routes
router.use("/user", userRouter);
router.use("/bank", bankRouter);

export default router;
