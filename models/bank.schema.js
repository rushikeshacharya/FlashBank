import mongoose from "mongoose";

const bankSchema = mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  txDetails: [
    {
      txType: {
        type: String,
        required: true,
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
        type: String,
        required: true,
      },
    },
  ],
});

const BankSchema = mongoose.model("bank", bankSchema);

export { BankSchema };
