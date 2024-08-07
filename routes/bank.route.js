import express from "express";
const bankRouter = express.Router();
import {
  validateDepositInput,
  validateGetTxInput,
} from "../middlewares/bank.middleware.js";

import {
  handleDeposit,
  handleTxHistory,
  handleWithdraw,
} from "../controller/bank.controller.js";

bankRouter.post("/deposit", validateDepositInput, handleDeposit);
bankRouter.post("/withdraw",validateDepositInput, handleWithdraw);
bankRouter.get("/tx", validateGetTxInput, handleTxHistory);

export default bankRouter;
