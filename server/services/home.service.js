import { login as authLogin } from "./auth.service.js";
import { register as authRegister } from "./auth.service.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const login = async (data) => {
  const result = await authLogin(data);

  return result;
};

const register = async (data) => {
  const result = await authRegister(data);

  return result;
};

const getUserByToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ _id: decoded.id });

  return user;
};


export { login, register, getUserByToken };