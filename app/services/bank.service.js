import { BankSchema } from "../models/bank.schema.js";
import { DepositSchema } from "../models/deposit.schema.js";
import { customAlphabet } from "nanoid";

// Create a custom alphabet generator with digits only
const generateRandomNumber = customAlphabet("0123456789", 10);

// Deposit function
const deposit = async (payload) => {
  try {
    const { amount, accountNumber } = payload;
    const account = await BankSchema.findOne({ accountNumber });

    // if (!account) {
    //   throw new Error("Account not found");
    // }

    const previousBalance = account?.balance || 0;
    const newBalance = previousBalance + amount;

    const transaction = createTransaction({
      txType: "deposit",
      amount,
      previousBalance,
      currentBalance: newBalance,
    });

    // Update both BankSchema and DepositSchema in parallel
    await Promise.all([
      DepositSchema.findOneAndUpdate(
        { accountNumber },
        { $push: { txDetails: transaction } },
        { new: true, upsert: true }
      ),
      BankSchema.findOneAndUpdate(
        { accountNumber },
        { $inc: { balance: amount }, $push: { txDetails: transaction } },
        { new: true, upsert: true }
      ),
    ]);

    return { status: "Success", newBalance };
  } catch (error) {
    console.error("Error during deposit:", error);
    throw new Error("Failed to deposit money");
  }
};

// Deposit function
const getBalance = async (accountNumber) => {
  try {
    const account = await BankSchema.findOne({ accountNumber });
    if (!account) {
      throw new Error("Account not found");
    }
    return { status: "Success", balance: account.balance };
  } catch (error) {
    console.error("Error during deposit:", error);
    throw new Error("Failed to deposit money");
  }
};

// Withdraw function
const withdraw = async (payload) => {
  try {
    const { amount, accountNumber } = payload;
    const account = await BankSchema.findOne({ accountNumber });

    if (!account || account.balance < amount) {
      throw new Error("Insufficient Balance");
    }

    const depositDetails = await DepositSchema.findOne({ accountNumber });

    const { availableWithdrawalAmount, updatedTxDetails } =
      calculateAvailableWithdrawal(depositDetails.txDetails, amount);

    if (availableWithdrawalAmount < amount) {
      throw new Error("Not enough funds available for withdrawal");
    }

    const transaction = createTransaction({
      txType: "withdraw",
      amount,
      previousBalance: account.balance,
      currentBalance: account.balance - amount,
    });

    // Update the transaction details in both schemas
    await Promise.all([
      DepositSchema.findOneAndUpdate(
        { accountNumber },
        { txDetails: updatedTxDetails },
        { new: true }
      ),
      BankSchema.findOneAndUpdate(
        { accountNumber },
        { $inc: { balance: -amount }, $push: { txDetails: transaction } },
        { new: true, upsert: true }
      ),
    ]);

    return { txId: transaction.txId, balance: transaction.currentBalance };
  } catch (error) {
    console.error("Error during withdrawal:", error);
    throw new Error(error.message);
  }
};

// Get transaction history function
const getTxHistory = async (payload) => {
  try {
    const { accountNumber } = payload;

    const result = await BankSchema.findOne({ accountNumber }).lean();

    if (!result) {
      throw new Error("Transaction history not found");
    }

    return result.txDetails;
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    throw new Error("Failed to retrieve transaction history");
  }
};

// Helper function to create transaction objects
const createTransaction = ({
  txType,
  amount,
  previousBalance,
  currentBalance,
}) => ({
  txId: generateRandomNumber(),
  txType,
  amount,
  previousBalance,
  currentBalance,
  timestamp: new Date().toISOString(),
});

// Helper function to calculate available withdrawal amount
const calculateAvailableWithdrawal = (txDetails, withdrawalAmount) => {
  let availableWithdrawalAmount = 0;
  let updatedTxDetails = txDetails.map((transaction) => {
    const timeDiffInMinutes =
      (new Date() - new Date(transaction.timestamp)) / (1000 * 60);

    if (transaction.amount > 0 && timeDiffInMinutes >= 1) {
      const amountToWithdraw = Math.min(withdrawalAmount, transaction.amount);
      transaction.amount -= amountToWithdraw;
      availableWithdrawalAmount += amountToWithdraw;
      withdrawalAmount -= amountToWithdraw;
    }

    return transaction;
  });

  return { availableWithdrawalAmount, updatedTxDetails };
};

export { deposit, getTxHistory, withdraw, getBalance };
