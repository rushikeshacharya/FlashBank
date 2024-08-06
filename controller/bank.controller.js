const handleDeposit = (req, res) => {
  console.log("in handle Deposit");
  return res.status(201).send("Deposited");
};
const handleWithdraw = (req, res) => {
  console.log("in handle Withdraw");
  return res.status(201).send("Withdrawn");
};
const handleTxHistory = (req, res) => {
  console.log("in handle Tx History");
  return res.status(200).send("Tx Details");
};

export { handleDeposit, handleWithdraw, handleTxHistory };
