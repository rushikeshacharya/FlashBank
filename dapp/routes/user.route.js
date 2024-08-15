import express from "express";
import {
  handleCreateUser,
  handleGetUser,
} from "../controller/user.controller.js";
import { validateUserInput } from "../middlewares/user.middleware.js";

const userRouter = express.Router();

// Route to create a new user
userRouter.post("/create", validateUserInput, handleCreateUser);

// Route to get user details
userRouter.get("/", handleGetUser);

export default userRouter;
