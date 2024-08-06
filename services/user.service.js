import { UserSchema } from "../models/user.schema.js";

const createUser = async (userDetails) => {
  try {
    const result = await UserSchema.create(userDetails);
    return result;
  } catch (error) {
    throw new Error("Failed to create new user", error);
  }
};

export { createUser };
