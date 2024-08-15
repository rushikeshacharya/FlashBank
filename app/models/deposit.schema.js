import mongoose from "mongoose";

const depositSchema = mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
  },
  txDetails: [
    {
      amount: {
        type: Number,
        required: true,
      },
      timestamp: {
        type: Date,
        required: true,
      },
      fullyWithdrawn: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const DepositSchema = mongoose.model("deposit", depositSchema);

export { DepositSchema };
