import express from "express";
const bankRouter = express.Router();

import {
  handleDeposit,
  handleTxHistory,
  handleWithdraw,
} from "../controller/bank.controller.js";

bankRouter.post("/deposit", handleDeposit);
bankRouter.post("/withdraw", handleWithdraw);
bankRouter.get("/tx", handleTxHistory);

export default bankRouter;
