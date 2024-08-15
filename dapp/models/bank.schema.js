import mongoose from "mongoose";

const bankSchema = mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  txDetails: [
    {
      txHash: {
        type: String,
        required: true,
      },
      blockNumber: {
        type: String,
        required: true,
      },
      txType: {
        type: String,
        required: true,
        enum: ["deposit", "withdraw"],
      },
      amount: {
        type: Number,
        required: true,
      },
      previousBalance: {
        type: Number,
        required: true,
      },
      currentBalance: {
        type: Number,
        required: true,
      },
      timestamp: {
        type: Date,
        required: true,
      },
    },
  ],
});

const BankSchema = mongoose.model("bank", bankSchema);

export { BankSchema };
