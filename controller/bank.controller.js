import { UserSchema } from "../models/user.schema.js";
import { deposit, getTxHistory } from "../services/bank.service.js";

import { customAlphabet } from "nanoid";

// Create a custom alphabet generator with digits only
const generateRandomNumber = customAlphabet("0123456789", 10);

const handleDeposit = async (req, res) => {
  try {
    console.log("in handle Deposit");
    const amount = req.body.amount || null;
    const accountNumber = req.body.accountNumber || null;
    const user = await UserSchema.findOne({
      accountNumber: accountNumber,
    });
    if (!user) return res.status(400).json({ error: "Account not Found" });
    const response = await deposit({
      amount: amount,
      accountNumber: accountNumber,
    });
    return res.status(201).send("Deposited");
  } catch (error) {
    console.log("Error ", error);

    throw new Error("Unable to deposit money");
  }
};
const handleWithdraw = (req, res) => {
  console.log("in handle Withdraw");
  return res.status(201).send("Withdrawn");
};
const handleTxHistory = async (req, res) => {
  console.log("in handle Tx History");
  const accountNumber = req?.body?.accountNumber || null;
  await getTxHistory(accountNumber)
  return res.status(200).send("Tx Details");
};

export { handleDeposit, handleWithdraw, handleTxHistory };
