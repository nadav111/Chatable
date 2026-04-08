import User from "../models/user.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const register = async ({ username, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    username,
    email,
    password
  });

  const token = generateToken(user._id);

  return { token };
};

const login = async ({ username, password }) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id);

  return { token };
};

export { register, login };