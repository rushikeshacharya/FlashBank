import { BankSchema } from "../models/bank.schema.js";
import { customAlphabet } from "nanoid";

// Create a custom alphabet generator with digits only
const generateRandomNumber = customAlphabet("0123456789", 10);

const deposit = async (payload) => {
  try {
    console.log("Payload", payload);
    const { amount, accountNumber } = payload;

    const result = await BankSchema.findOne({ accountNumber });
    console.log("result ", result);
    const previousBalance = result?.balance || 0;
    // if(!result)
    const transaction = {
      txId: generateRandomNumber(),
      txType: "deposit",
      amount,
      previousBalance, // This should be fetched from the existing document
      currentBalance: previousBalance + amount, // This will be the new balance after addition
      timestamp: new Date().toISOString(),
    };
    const response = await BankSchema.findOneAndUpdate(
      { accountNumber },
      {
        $inc: { balance: amount },
        $push: { txDetails: transaction },
      },
      { new: true, upsert: true }
    );

    console.log("Update result:", response);
    // return result;
  } catch (error) {
    console.log("Error from Deposit", error);

    throw new Error("Failed to deposit money");
  }
};

const withdraw = async (payload) => {
  try {
    console.log("Payload", payload);
    const { amount, accountNumber } = payload;

    const result = await BankSchema.findOne({ accountNumber });
    console.log("result ", result);
    if (!result || result?.balance < amount)
      throw new Error("Insufficient Balance");
    const previousBalance = result.balance;

    const transaction = {
      txId: generateRandomNumber(),
      txType: "withdraw",
      amount,
      previousBalance, // This should be fetched from the existing document
      currentBalance: previousBalance - amount, // This will be the new balance after addition
      timestamp: new Date().toISOString(),
    };

    await BankSchema.findOneAndUpdate(
      { accountNumber },
      {
        $inc: { balance: -amount },
        $push: { txDetails: transaction },
      },
      { new: true, upsert: true }
    );
    const response = {
      txId: transaction.txId,
      balance: transaction.currentBalance,
    };
    // console.log("Update result:", response);
    return response;
  } catch (error) {
    throw new Error("Failed to Withdraw money");
  }
};

const getTxHistory = async (payload) => {
  try {
    console.log("Payload", payload);
    const { accountNumber } = payload;

    const result = await BankSchema.findOne(accountNumber);

    if (!result) throw new Error("Unable to get tx History");

    return result;
  } catch (error) {
    console.log("Error from Deposit", error);

    throw new Error("Failed to deposit money");
  }
};
export { deposit, getTxHistory, withdraw };
