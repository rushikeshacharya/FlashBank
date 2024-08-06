import express from "express";
const userRouter = express.Router();

import {
  handleCreateUser,
  handleGetUser,
} from "../controller/user.controller.js";
import { validateUserInput } from "../middlewares/user.middleware.js";

userRouter.post("/create", validateUserInput, handleCreateUser);
userRouter.get("/", handleGetUser);

export default userRouter;
