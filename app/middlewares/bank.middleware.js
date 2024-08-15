const validateDepositInput = (req, res, next) => {
  const { accountNumber, amount } = req.body;

  if (!accountNumber || typeof amount !== "number") {
    return res.status(400).json({ message: "Invalid input: account number and amount are required" });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: "Invalid amount: must be greater than zero" });
  }

  return next();
};

const validateGetTxInput = (req, res, next) => {
  const { accountNumber } = req.body;

  if (!accountNumber) {
    return res.status(400).json({ message: "Invalid input: account number is required" });
  }

  return next();
};

export { validateDepositInput, validateGetTxInput };
