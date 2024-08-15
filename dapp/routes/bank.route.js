import express from "express";
import {
  validateDepositInput,
  validateGetTxInput,
} from "../middlewares/bank.middleware.js";
import {
  handleDeposit,
  handleTxHistory,
  handleWithdraw,
  handleGetBalance
} from "../controller/bank.controller.js";

const bankRouter = express.Router();

// Deposit Route
bankRouter.post("/deposit", validateDepositInput, handleDeposit);
// Withdraw Route
bankRouter.post("/withdraw", validateDepositInput, handleWithdraw);
// Transaction History Route
bankRouter.get("/tx", validateGetTxInput, handleTxHistory);
bankRouter.get("/balance", validateGetTxInput, handleGetBalance);

export default bankRouter;
