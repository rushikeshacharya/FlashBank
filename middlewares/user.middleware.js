const validateUserInput = (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res
      .status(400)
      .json({ message: "Invalid input: name and email are required" });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  return next();
};

export { validateUserInput };
