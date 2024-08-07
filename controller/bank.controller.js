import { UserSchema } from "../models/user.schema.js";
import { deposit, getTxHistory, withdraw } from "../services/bank.service.js";

const handleDeposit = async (req, res) => {
  try {
    console.log("in handle Deposit");
    const amount = req.body.amount;
    const accountNumber = req.body.accountNumber;
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
const handleWithdraw = async (req, res) => {
  console.log("in handle Withdraw");
  const amount = req.body.amount;
  const accountNumber = req.body.accountNumber;
  const user = await UserSchema.findOne({
    accountNumber: accountNumber,
  });
  if (!user) return res.status(400).json({ error: "Account not Found" });
  const result = await withdraw({
    amount: amount,
    accountNumber: accountNumber,
  });
  return res.status(201).send({ Withdrawn: result });
};
const handleTxHistory = async (req, res) => {
  try {
    console.log("in handle Tx History");
    const accountNumber = req?.body?.accountNumber || null;
    const result = await getTxHistory(accountNumber);
    console.log("resjult", result);
    const txDetails = {
      accountNumber: result.accountNumber,
      balance: result.balance,
    };

    txDetails["txHistory"] = result.txDetails.map((data) => {
      return {
        txId: data.txId,
        txType: data.txType,
        amount: data.amount,
        previousBalance: data.previousBalance,
        currentBalance: data.currentBalance,
        timestamp: data.timestamp,
      };
    });

    res.status(200).send(txDetails);
  } catch (error) {}
};

export { handleDeposit, handleWithdraw, handleTxHistory };
