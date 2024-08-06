import { createUser } from "../services/user.service.js";
import { customAlphabet } from "nanoid";
import { UserSchema } from "../models/user.schema.js";

// Create a custom alphabet generator with digits only
const generateRandomNumber = customAlphabet("0123456789", 14);

const handleCreateUser = async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await UserSchema.findOne({ email: userEmail });

    if (user) return res.status(400).json({ error: "User already exists" });
    const payload = req.body;
    const userDetails = {
      name: payload.name,
      email: payload.email,
      accountNumber: generateRandomNumber(),
    };
    const result = await createUser(userDetails);

    const response = {
      message: "User Created Successfully",
      userDetails: {
        name: result.name,
        email: result.email,
        accountNumber: result.accountNumber,
      },
    };
    return res.status(201).send(response);
  } catch (error) {
    console.log("Error in handleCreateUser", error);

    res.status(500).json({ error: "Internal Server Error" });
  }
};
const handleGetUser = async (req, res) => {
  try {
    const userEmail = req.body.email || null;
    const accountNumber = req.body.accountNumber || null;
    const user = await UserSchema.findOne({
      $or: [{ email: userEmail }, { accountNumber: accountNumber }],
    });

    if (!user) return res.status(400).json({ error: "User Details not Found" });

    const userDetails = {
      name: user.name,
      email: user.email,
      accountNumber: user.accountNumber,
    };
    const response = {
      message: "User Details",
      userDetails,
    };
    return res.status(200).send(response);
  } catch (error) {
    console.log("Error in handle get user", error);

    res.status(500).json({ error: "Internal Server Error" });
  }
};
export { handleCreateUser, handleGetUser };
