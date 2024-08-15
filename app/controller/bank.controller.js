import { UserSchema } from "../models/user.schema.js";
import { deposit, getTxHistory, withdraw } from "../services/bank.service.js";

// Handle Deposit
const handleDeposit = async (req, res) => {
  try {
    console.log("In handleDeposit");

    const { amount, accountNumber } = req.body;

    // Validate if user exists
    const user = await UserSchema.findOne({ accountNumber });
    if (!user) {
      return res.status(400).json({ error: "Account not found" });
    }

    // Perform deposit operation
    await deposit({ amount, accountNumber });
    return res.status(201).json({ message: "Deposit successful" });
  } catch (error) {
    console.error("Error in handleDeposit:", error);
    return res.status(500).json({ error: "Unable to deposit money" });
  }
};

// Handle Withdraw
const handleWithdraw = async (req, res) => {
  try {
    console.log("In handleWithdraw");

    const { amount, accountNumber } = req.body;

    // Validate if user exists
    const user = await UserSchema.findOne({ accountNumber });
    if (!user) {
      return res.status(400).json({ error: "Account not found" });
    }

    // Perform withdraw operation
    const result = await withdraw({ amount, accountNumber });
    return res.status(201).json({ message: "Withdrawal successful", result });
  } catch (error) {
    console.error("Error in handleWithdraw:", error);
    return res
      .status(500)
      .json({ error: error.message || "Unable to withdraw money" });
  }
};

// Handle Transaction History
const handleTxHistory = async (req, res) => {
  try {
    console.log("In handleTxHistory");

    const { accountNumber } = req.body;

    // Fetch transaction history
    const result = await getTxHistory({ accountNumber });

    if (!result) {
      return res.status(404).json({ error: "Transaction history not found" });
    }

    const txDetails = {
      accountNumber: result.accountNumber,
      balance: result.balance,
      txHistory: result.txDetails.map((data) => ({
        txId: data.txId,
        txType: data.txType,
        amount: data.amount,
        previousBalance: data.previousBalance,
        currentBalance: data.currentBalance,
        timestamp: data.timestamp,
      })),
    };

    return res.status(200).json(txDetails);
  } catch (error) {
    console.error("Error in handleTxHistory:", error);
    return res
      .status(500)
      .json({ error: "Unable to fetch transaction history" });
  }
};

export { handleDeposit, handleWithdraw, handleTxHistory };
