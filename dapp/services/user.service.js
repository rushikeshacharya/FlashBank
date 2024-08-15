import { UserSchema } from "../models/user.schema.js";
import { BankSchema } from "../models/bank.schema.js";

const createUser = async (userDetails) => {
  try {
    const result = await UserSchema.create(userDetails);
    const Bank = new BankSchema({ accountNumber: userDetails.accountNumber });
    await Bank.save();

    return result;
  } catch (error) {
    throw new Error("Failed to create new user", error);
  }
};

export { createUser };
