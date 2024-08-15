import { BankSchema } from "../models/bank.schema.js";
import {
  getContractInstance,
  getWeb3Instance,
} from "../utils/getWeb3Instance.utils.js";
const gas = process.env.GAS;
const senderAddress = process.env.SENDER_ACCOUNT;
const bankContractAddress = process.env.BANK_CONTRACT_ADDRESS;
const privateKey = process.env.ACCOUNT_PRIVATE_KEY;
const gasPrice = process.env.GAS_PRICE;

import fs from "fs/promises";

// Deposit function
const deposit = async (payload) => {
  try {
    const { amount, accountNumber } = payload;
    const account = await BankSchema.findOne({ accountNumber });

    // if (!account) {
    //   throw new Error("Account not found");
    // }
    const contractInstance = await getContractInstance();
    const txObj = {
      from: senderAddress,
      gas: gas,
      gasPrice: gasPrice,
    };

    const tx = await contractInstance.methods.deposit(amount).send(txObj);
    // console.log("tx", tx);
    if (!tx.events?.AmountDeposited) {
      throw new Error("Unable to deposit money");
    }

    const previousBalance = account?.balance || 0;
    const newBalance = previousBalance + amount;

    const transaction = createTransaction({
      txHash: tx.transactionHash,
      blockNumber: tx.blockNumber.toString(),
      txType: "deposit",
      amount,
      previousBalance,
      currentBalance: newBalance,
    });

    await BankSchema.findOneAndUpdate(
      { accountNumber },
      { $inc: { balance: amount }, $push: { txDetails: transaction } },
      { new: true, upsert: true }
    );

    return { status: "Success", newBalance };
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

    const contractInstance = await getContractInstance();
    const txObj = {
      from: senderAddress,
      gas: gas,
      gasPrice: gasPrice,
    };
    const tx = await contractInstance.methods.withdraw(amount).send(txObj);
    console.log("tx", tx);
    if (tx.events?.AmountWithdrawn) {
      // throw new Error("Unable to Withdraw money");
      const transaction = createTransaction({
        txHash: tx.transactionHash,
        blockNumber: tx.blockNumber,
        txType: "withdraw",
        amount,
        previousBalance: account?.balance,
        currentBalance: account?.balance - amount,
      });

      // Update the transaction details in both schemas
      await BankSchema.findOneAndUpdate(
        { accountNumber },
        { $inc: { balance: -amount }, $push: { txDetails: transaction } },
        { new: true, upsert: true }
      );

      return {
        txHash: transaction.txHash,
        balance: transaction.currentBalance,
      };
    }
  } catch (error) {
    console.error("Error during withdrawal:", error);
    throw new Error("Failed to withdraw money");
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

// Withdraw function
const getBalance = async (payload) => {
  try {
    const { accountNumber } = payload;
    const contractInstance = await getContractInstance();

    const balance = await contractInstance.methods
      .getBalance(accountNumber)
      .call();

    return balance;
  } catch (error) {
    console.error("Error during withdrawal:", error);
    throw new Error("Failed to withdraw money");
  }
};

// Helper function to create transaction objects
const createTransaction = ({
  txHash,
  blockNumber,
  txType,
  amount,
  previousBalance,
  currentBalance,
}) => ({
  txHash,
  blockNumber,
  txType,
  amount,
  previousBalance,
  currentBalance,
  timestamp: new Date().toISOString(),
});

export { deposit, getTxHistory, withdraw, getBalance };
