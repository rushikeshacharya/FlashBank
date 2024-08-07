const validateDepositInput = (req, res, next) => {
  if (!req.body.accountNumber || !req.body.amount) {
    return res.status(400).json({ message: "Invalid Inputs" });
  }
  return next();
};

const validateGetTxInput = (req, res, next) => {
  if (!req.body.accountNumber) {
    return res.status(400).json({ message: "Invalid Inputs" });
  }
  return next();
};
export { validateDepositInput, validateGetTxInput };
