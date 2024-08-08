import { BankSchema } from "../models/bank.schema.js";
import { DepositSchema } from "../models/deposit.schema.js";
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
    await DepositSchema.findOneAndUpdate(
      { accountNumber },
      {
        $push: { txDetails: transaction },
      },
      { new: true, upsert: true }
    );

    await BankSchema.findOneAndUpdate(
      { accountNumber },
      {
        $inc: { balance: amount },
        $push: { txDetails: transaction },
      },
      { new: true, upsert: true }
    );

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

    const account = await BankSchema.findOne({ accountNumber });
    const depositDetails = await DepositSchema.findOne({ accountNumber });
    let withdrawalAmount = amount;
    let availableWithrawalAmount = 0;
    let currentTime = new Date();

    if (!account || account?.balance < amount)
      throw new Error("Insufficient Balance");


    for (const transaction of depositDetails.txDetails) {
      const timeDiffInMinutes =
        (currentTime - transaction.timestamp) / (1000 * 60);
        console.log("timeDiffInMinutes", timeDiffInMinutes);
        

      if (transaction.amount >= withdrawalAmount && timeDiffInMinutes >= (60*3)) {
        const amountToWithdraw = Math.min(withdrawalAmount, transaction.amount);

        transaction.amount -= amountToWithdraw;
        availableWithrawalAmount += amountToWithdraw;

        if (transaction.amount === 0) {
          transaction.fullyWithdrawn = true;
        }

        withdrawalAmount -= amountToWithdraw;

        if (withdrawalAmount === 0) {
          break;
        }
      }
    }

    if (availableWithrawalAmount < withdrawalAmount) {
      console.log("Not enough funds available for withdrawal");
    } else {
      console.log("Withdrawal processed successfully");
    }
    // depositDetails.txDetails.forEach(element => {
    //   console.log("Elemtn", element);
    //   if(element.amount >= withdrawalAmount && (currentTime - element.timestamp)/(1000*60) >= 1 ){
    //     element.amount -= withdrawalAmount;
    //     availableWithrawalAmount += withdrawalAmount;

    //     if(element.amount ===0 ){
    //       element.fullyWithdrawn = true;
    //     }
    //   }
    //   if(availableWithrawalAmount === withdrawalAmount){
    //     return;
    //   }
    // });

    // await deposit.save();

    // const transaction = {
    //   txId: generateRandomNumber(),
    //   txType: "withdraw",
    //   amount,
    //   previousBalance, // This should be fetched from the existing document
    //   currentBalance: previousBalance - amount, // This will be the new balance after addition
    //   timestamp: new Date(),
    // };

    // await BankSchema.findOneAndUpdate(
    //   { accountNumber },
    //   {
    //     $inc: { balance: -amount },
    //     $push: { txDetails: transaction },
    //   },
    //   { new: true, upsert: true }
    // );
    // const response = {
    //   txId: transaction.txId,
    //   balance: transaction.currentBalance,
    // };
    // console.log("Update result:", response);
    // return response;
  } catch (error) {
    console.log("Error ", error);
    
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
