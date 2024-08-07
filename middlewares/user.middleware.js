const validateUserInput = (req, res, next) => {
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({ message: "Invalid Inputs" });
  }
  return next();
};

export { validateUserInput };
